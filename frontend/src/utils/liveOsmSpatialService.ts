import {
  BusinessCategory,
  Coordinates,
  InspectResult,
  CompetitorItem,
  AnchorItem,
} from '../types';
import {
  calculateLocalSpatialScore,
  haversineDistance,
  CLIENT_TRANSIT,
} from './clientSpatialEngine';

/**
 * Converts Cyrillic (Uzbek/Russian OSM tags) into clean Uzbek Latin script
 * so all real-time OpenStreetMap street names, districts, and POIs read naturally.
 */
export function normalizeToUzbekLatin(input: string): string {
  if (!input) return '';
  // Quick check: if no Cyrillic characters exist, return trimmed input
  if (!/[\u0400-\u04FF]/.test(input)) {
    return input.trim();
  }

  let text = input
    .replace(/\bулица\b/gi, "ko'chasi")
    .replace(/\bул\.\s*/gi, '')
    .replace(/\bпроспект\b/gi, "shoh ko'chasi")
    .replace(/\bпр-т\b/gi, "shoh ko'chasi")
    .replace(/\bтупик\b/gi, 'berk ko‘chasi')
    .replace(/\bпроезд\b/gi, 'tor ko‘chasi')
    .replace(/\bрайон\b/gi, 'tumani')
    .replace(/\bр-н\b/gi, 'tumani')
    .replace(/\bмахалля\b/gi, 'mahallasi')
    .replace(/\bМФЙ\b/gi, 'MFY')
    .replace(/\bобласть\b/gi, 'viloyati')
    .replace(/\bгород\b/gi, 'shahri');

  const map: Record<string, string> = {
    А: 'A', а: 'a',
    Б: 'B', б: 'b',
    В: 'V', в: 'v',
    Г: 'G', г: 'g',
    Ғ: "G'", ғ: "g'",
    Д: 'D', д: 'd',
    Е: 'Ye', е: 'e',
    Ё: 'Yo', ё: 'yo',
    Ж: 'J', ж: 'j',
    З: 'Z', з: 'z',
    И: 'I', и: 'i',
    Й: 'Y', й: 'y',
    К: 'K', к: 'k',
    Қ: 'Q', қ: 'q',
    Л: 'L', л: 'l',
    М: 'M', м: 'm',
    Н: 'N', н: 'n',
    О: 'O', о: 'o',
    П: 'P', п: 'p',
    Р: 'R', р: 'r',
    С: 'S', с: 's',
    Т: 'T', т: 't',
    У: 'U', у: 'u',
    Ў: "O'", ў: "o'",
    Ф: 'F', ф: 'f',
    Х: 'X', х: 'x',
    Ҳ: 'H', ҳ: 'h',
    Ц: 'Ts', ц: 'ts',
    Ч: 'Ch', ч: 'ch',
    Ш: 'Sh', ш: 'sh',
    Щ: 'Sh', щ: 'sh',
    Ъ: "'", ъ: '',
    Ы: 'I', ы: 'i',
    Ь: '', ь: '',
    Э: 'E', э: 'e',
    Ю: 'Yu', ю: 'yu',
    Я: 'Ya', я: 'ya',
  };

  let out = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    out += map[ch] !== undefined ? map[ch] : ch;
  }

  return out.replace(/\s+/g, ' ').trim();
}

interface ReverseGeocodeData {
  location_label: string;
  district_name: string;
  region_name: string;
  street_address?: string;
  mahalla_name?: string;
}

const reverseGeocodeCache = new Map<string, ReverseGeocodeData>();
const overpassInspectionCache = new Map<string, InspectResult>();

/**
 * Live OpenStreetMap Nominatim Reverse Geocoder
 * Resolves exact street name, house number, mahalla, and district for any clicked point.
 */
export async function reverseGeocodeOsm(
  lat: number,
  lon: number,
  fallback: { location_label?: string; district_name?: string; region_name?: string }
): Promise<ReverseGeocodeData> {
  const cacheKey = `${lat.toFixed(4)},${lon.toFixed(4)}`;
  const cached = reverseGeocodeCache.get(cacheKey);
  if (cached) return cached;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat.toFixed(
      6
    )}&lon=${lon.toFixed(6)}&zoom=18&addressdetails=1&accept-language=uz,en,ru`;

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error('Nominatim status ' + res.status);
    const data = await res.json();
    const addr = data.address || {};

    const rawPoiName = data.name ? normalizeToUzbekLatin(data.name) : '';
    const rawRoad = normalizeToUzbekLatin(
      addr.road || addr.pedestrian || addr.footway || addr.street || addr.residential || ''
    );
    const houseNumber = addr.house_number ? normalizeToUzbekLatin(String(addr.house_number)) : '';
    const mahalla = normalizeToUzbekLatin(
      addr.neighbourhood || addr.quarter || addr.suburb || addr.hamlet || addr.village || ''
    );
    const district = normalizeToUzbekLatin(
      addr.city_district || addr.borough || addr.county || addr.municipality || fallback.district_name || 'Toshkent sh.'
    );
    const region = normalizeToUzbekLatin(
      addr.city || addr.town || addr.state || fallback.region_name || 'Toshkent sh.'
    );

    let streetAddress = '';
    if (rawRoad && houseNumber) {
      streetAddress = `${rawRoad}, ${houseNumber}-uy`;
    } else if (rawRoad) {
      streetAddress = rawRoad;
    } else if (mahalla) {
      streetAddress = mahalla;
    }

    let primaryLabel = '';
    if (rawPoiName && rawRoad && rawPoiName.toLowerCase() !== rawRoad.toLowerCase()) {
      primaryLabel = `${rawPoiName} (${rawRoad})`;
    } else if (streetAddress) {
      primaryLabel = streetAddress;
    } else if (rawPoiName) {
      primaryLabel = rawPoiName;
    } else if (mahalla) {
      primaryLabel = mahalla;
    } else {
      primaryLabel = fallback.location_label || `Koordinata [${lat.toFixed(4)}, ${lon.toFixed(4)}]`;
    }

    const result: ReverseGeocodeData = {
      location_label: primaryLabel,
      district_name: mahalla && district && !district.includes(mahalla) ? `${district} · ${mahalla}` : district,
      region_name: region,
      street_address: streetAddress || primaryLabel,
      mahalla_name: mahalla || undefined,
    };

    reverseGeocodeCache.set(cacheKey, result);
    return result;
  } catch {
    return {
      location_label: fallback.location_label || `Koordinata [${lat.toFixed(4)}, ${lon.toFixed(4)}]`,
      district_name: fallback.district_name || 'Toshkent sh.',
      region_name: fallback.region_name || 'Toshkent sh.',
    };
  }
}

/**
 * Classifies an OpenStreetMap element's tags into our business categories or anchor types.
 */
function classifyOsmElement(tags: Record<string, string>): {
  competitorCategories: BusinessCategory[];
  anchorCategory: string | null;
  isBusStop: boolean;
  isSubway: boolean;
  isResidentialBuilding: boolean;
  buildingLevels: number;
} {
  const amenity = (tags.amenity || '').toLowerCase();
  const shop = (tags.shop || '').toLowerCase();
  const healthcare = (tags.healthcare || '').toLowerCase();
  const office = (tags.office || '').toLowerCase();
  const leisure = (tags.leisure || '').toLowerCase();
  const railway = (tags.railway || '').toLowerCase();
  const highway = (tags.highway || '').toLowerCase();
  const publicTransport = (tags.public_transport || '').toLowerCase();
  const building = (tags.building || '').toLowerCase();

  const competitorCategories: BusinessCategory[] = [];

  // 1. Cafe / HoReCa
  if (
    ['cafe', 'restaurant', 'fast_food', 'ice_cream', 'food_court', 'bar', 'pub'].includes(amenity) ||
    ['bakery', 'coffee', 'pastry', 'tea', 'chocolate', 'confectionery'].includes(shop)
  ) {
    competitorCategories.push('cafe');
  }

  // 2. Pharmacy
  if (
    amenity === 'pharmacy' ||
    healthcare === 'pharmacy' ||
    shop === 'chemist' ||
    shop === 'medical_supply'
  ) {
    competitorCategories.push('pharmacy');
  }

  // 3. Supermarket / Grocery
  if (
    ['supermarket', 'convenience', 'grocery', 'greengrocer', 'butcher', 'deli', 'general', 'Wholesale'].includes(shop)
  ) {
    competitorCategories.push('supermarket');
  }

  // 4. School / Education
  if (
    ['school', 'kindergarten', 'college', 'language_school', 'music_school', 'prep_school', 'training', 'driving_school'].includes(
      amenity
    )
  ) {
    competitorCategories.push('school');
  }

  // 5. Retail (Fashion, Electronics, Cosmetics, Home, Bookstore)
  if (
    [
      'clothes',
      'shoes',
      'fashion',
      'boutique',
      'jewelry',
      'electronics',
      'mobile_phone',
      'computer',
      'cosmetics',
      'perfumery',
      'beauty',
      'furniture',
      'hardware',
      'books',
      'Stationery',
      'sports',
      'toys',
      'gift',
      'department_store',
    ].includes(shop)
  ) {
    competitorCategories.push('retail');
  }

  // Anchor detection
  let anchorCategory: string | null = null;
  if (shop === 'mall' || shop === 'department_store') {
    anchorCategory = 'mall';
  } else if (amenity === 'marketplace') {
    anchorCategory = 'bazaar';
  } else if (amenity === 'university' || amenity === 'college') {
    anchorCategory = 'university';
  } else if (amenity === 'hospital' || amenity === 'clinic' || healthcare === 'hospital' || healthcare === 'clinic') {
    anchorCategory = 'hospital';
  } else if (amenity === 'bank' || office !== '') {
    anchorCategory = 'business';
  } else if (leisure === 'park' || leisure === 'stadium') {
    anchorCategory = 'park';
  }

  const isBusStop =
    highway === 'bus_stop' ||
    publicTransport === 'platform' ||
    publicTransport === 'stop_position' ||
    amenity === 'bus_station';

  const isSubway =
    railway === 'station' ||
    railway === 'subway_entrance' ||
    tags.station === 'subway';

  const isResidentialBuilding = ['apartments', 'residential', 'dormitory', 'house', 'terrace'].includes(building);
  const parsedLevels = parseInt(tags['building:levels'] || '0', 10);
  const buildingLevels = !isNaN(parsedLevels) && parsedLevels > 0 ? parsedLevels : isResidentialBuilding ? 5 : 1;

  return {
    competitorCategories,
    anchorCategory,
    isBusStop,
    isSubway,
    isResidentialBuilding,
    buildingLevels,
  };
}

function getDefaultCategoryPlaceName(cat: BusinessCategory, tags: Record<string, string>): string {
  const amenity = (tags.amenity || '').toLowerCase();
  const shop = (tags.shop || '').toLowerCase();
  if (cat === 'cafe') {
    if (amenity === 'restaurant') return 'Restoran (OSM)';
    if (amenity === 'fast_food') return 'Fast-Food nuqtasi';
    if (shop === 'bakery' || shop === 'pastry') return 'Novvoyxona & Qandolat';
    return 'Kafe & Qahvaxona';
  }
  if (cat === 'pharmacy') return 'Dorixona (Apteka)';
  if (cat === 'supermarket') {
    if (shop === 'convenience') return 'Minimarket / Oziq-ovqat';
    return 'Supermarket';
  }
  if (cat === 'school') {
    if (amenity === 'kindergarten') return "Maktabgacha ta'lim (Bog'cha)";
    return "Ta'lim va o'quv markazi";
  }
  return 'Chakana savdo do‘koni';
}

const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://lz4.overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];

async function queryOverpass(query: string): Promise<any> {
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: `data=${encodeURIComponent(query)}`,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Try next mirror
    }
  }
  throw new Error('All Overpass mirrors unreachable');
}

/**
 * Main Real-Time OpenStreetMap Spatial Intelligence Engine:
 * Combines Nominatim Reverse Geocoding + Overpass Live POI/Transit/Building Scanner
 * to enrich and recalculate MakonScore for ANY street/building in Uzbekistan.
 */
export async function fetchLiveOsmSpatialIntelligence(
  coords: Coordinates,
  category: BusinessCategory,
  radiusMeters: number
): Promise<InspectResult> {
  const cacheKey = `${coords.latitude.toFixed(4)}_${coords.longitude.toFixed(4)}_${category}_${radiusMeters}`;
  const cached = overpassInspectionCache.get(cacheKey);
  if (cached) return cached;

  const baseLocal = calculateLocalSpatialScore(coords, category, radiusMeters);
  const lat = coords.latitude;
  const lon = coords.longitude;
  const scanRadius = Math.max(500, radiusMeters);

  // Build compact Overpass QL query for amenities, shops, transit, anchors, and buildings
  const overpassQuery = `
    [out:json][timeout:6];
    (
      nwr["amenity"](around:${scanRadius},${lat.toFixed(5)},${lon.toFixed(5)});
      nwr["shop"](around:${scanRadius},${lat.toFixed(5)},${lon.toFixed(5)});
      nwr["healthcare"](around:${scanRadius},${lat.toFixed(5)},${lon.toFixed(5)});
      nwr["office"](around:${scanRadius},${lat.toFixed(5)},${lon.toFixed(5)});
      nwr["highway"="bus_stop"](around:${scanRadius},${lat.toFixed(5)},${lon.toFixed(5)});
      nwr["public_transport"](around:${scanRadius},${lat.toFixed(5)},${lon.toFixed(5)});
      nwr["railway"~"station|subway_entrance"](around:1000,${lat.toFixed(5)},${lon.toFixed(5)});
      way["building"](around:${Math.min(500, radiusMeters)},${lat.toFixed(5)},${lon.toFixed(5)});
    );
    out center tags qt 240;
  `;

  const [geoIdentity, overpassData] = await Promise.all([
    reverseGeocodeOsm(lat, lon, {
      location_label: baseLocal.context.location_label,
      district_name: baseLocal.context.district_name,
      region_name: baseLocal.context.region_name,
    }),
    queryOverpass(overpassQuery).catch(() => null),
  ]);

  // If Overpass didn't return elements, still return baseLocal enriched with real Nominatim street/district name
  if (!overpassData || !Array.isArray(overpassData.elements) || overpassData.elements.length === 0) {
    const enrichedFallback: InspectResult = {
      ...baseLocal,
      context: {
        ...baseLocal.context,
        location_label: geoIdentity.location_label,
        district_name: geoIdentity.district_name,
        region_name: geoIdentity.region_name,
        street_address: geoIdentity.street_address,
        mahalla_name: geoIdentity.mahalla_name,
        is_live_osm: true,
      },
    };
    overpassInspectionCache.set(cacheKey, enrichedFallback);
    return enrichedFallback;
  }

  const elements: any[] = overpassData.elements;
  const discoveredCompetitors: CompetitorItem[] = [...baseLocal.context.competitors];
  const discoveredAnchors: AnchorItem[] = [...baseLocal.context.major_anchors];
  const liveGeoJsonFeatures: any[] = [];

  let busStopsCount = 0;
  let residentialUnitsFromOsm = 0;
  let commercialBuildingsCount = 0;
  let nearestOsmSubway: { name: string; distance_meters: number; lat: number; lon: number } | null = null;

  for (const el of elements) {
    const tags: Record<string, string> = el.tags || {};
    const elLat: number | undefined = el.lat ?? el.center?.lat;
    const elLon: number | undefined = el.lon ?? el.center?.lon;
    if (elLat === undefined || elLon === undefined) continue;

    const dist = Math.round(haversineDistance(lat, lon, elLat, elLon));
    const classified = classifyOsmElement(tags);

    const rawName =
      tags['name:uz'] ||
      tags.name ||
      tags['name:ru'] ||
      tags['name:en'] ||
      tags.brand ||
      tags.operator ||
      '';
    const cleanName = normalizeToUzbekLatin(rawName);
    const cleanBrand = normalizeToUzbekLatin(tags.brand || tags.operator || '');

    // 1. Check Direct Competitors within selected radiusMeters
    if (dist <= radiusMeters && classified.competitorCategories.includes(category)) {
      const displayName = cleanName || getDefaultCategoryPlaceName(category, tags);
      const isDuplicate = discoveredCompetitors.some(
        (existing) =>
          (existing.lat &&
            existing.lon &&
            haversineDistance(existing.lat, existing.lon, elLat, elLon) < 35) ||
          (cleanName && existing.name.toLowerCase() === cleanName.toLowerCase() && Math.abs(existing.distance_meters - dist) < 80)
      );

      if (!isDuplicate) {
        discoveredCompetitors.push({
          name: displayName,
          brand: cleanBrand || tags.amenity || tags.shop || category,
          category,
          distance_meters: dist,
          lat: elLat,
          lon: elLon,
        });

        liveGeoJsonFeatures.push({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [elLon, elLat] },
          properties: {
            id: `osm-comp-${el.id}`,
            name: displayName,
            category,
            brand: cleanBrand || 'Real OSM',
            isLiveOsm: true,
          },
        });
      }
    }

    // 2. Check Major Anchors
    if (classified.anchorCategory && cleanName && dist <= Math.max(700, radiusMeters * 1.25)) {
      const isDuplicateAnchor = discoveredAnchors.some(
        (existing) =>
          (existing.lat &&
            existing.lon &&
            haversineDistance(existing.lat, existing.lon, elLat, elLon) < 55) ||
          existing.name.toLowerCase() === cleanName.toLowerCase()
      );

      if (!isDuplicateAnchor) {
        discoveredAnchors.push({
          name: cleanName,
          category: classified.anchorCategory,
          distance_meters: dist,
          lat: elLat,
          lon: elLon,
        });

        liveGeoJsonFeatures.push({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [elLon, elLat] },
          properties: {
            id: `osm-anchor-${el.id}`,
            name: cleanName,
            category: classified.anchorCategory,
            brand: classified.anchorCategory.toUpperCase(),
            isLiveOsm: true,
          },
        });
      }
    }

    // 3. Check Transit (Bus stops & Subway)
    if (classified.isBusStop && dist <= scanRadius) {
      busStopsCount++;
    }
    if (classified.isSubway && cleanName) {
      if (!nearestOsmSubway || dist < nearestOsmSubway.distance_meters) {
        nearestOsmSubway = {
          name: cleanName,
          distance_meters: dist,
          lat: elLat,
          lon: elLon,
        };
      }
    }

    // 4. Check Buildings & Residential Density
    if (classified.isResidentialBuilding) {
      const unitsPerLevel = tags.building === 'apartments' || classified.buildingLevels >= 4 ? 12 : 2;
      residentialUnitsFromOsm += classified.buildingLevels * unitsPerLevel;
    } else if (tags.building) {
      commercialBuildingsCount++;
    }
  }

  discoveredCompetitors.sort((a, b) => a.distance_meters - b.distance_meters);
  discoveredAnchors.sort((a, b) => a.distance_meters - b.distance_meters);

  // Recalculate real-world factor scores blending local model + real OSM density
  // 1. Transit Score (Metro proximity + real OSM bus stops)
  let nearestMetro = baseLocal.context.nearest_metro;
  if (
    nearestOsmSubway &&
    (!nearestMetro || nearestOsmSubway.distance_meters < nearestMetro.distance_meters)
  ) {
    // Match against known line if possible
    const matchedMetro = CLIENT_TRANSIT.find(
      (m) => haversineDistance(m.lat, m.lon, nearestOsmSubway!.lat, nearestOsmSubway!.lon) < 350
    );
    nearestMetro = {
      name: matchedMetro?.name || nearestOsmSubway.name,
      distance_meters: nearestOsmSubway.distance_meters,
      line_name: matchedMetro?.line_name || "Toshkent Metro / Tranzit",
      passenger_flow_score: matchedMetro?.passenger_flow_score || 89,
      lat: nearestOsmSubway.lat,
      lon: nearestOsmSubway.lon,
    };
  }

  const busStopBonus = Math.min(28, busStopsCount * 4.2);
  const metroBase = nearestMetro
    ? Math.max(35, 96 - (nearestMetro.distance_meters / 1000) * 42)
    : 36;
  const transit_score = Number(
    Math.min(99.2, Math.max(baseLocal.factors.transit_score * 0.65, metroBase + busStopBonus * 0.6)).toFixed(1)
  );

  // 2. Anchor Score (from real discovered anchors)
  const anchorBoost = Math.min(34, discoveredAnchors.length * 6.5 + commercialBuildingsCount * 1.2);
  const anchor_score = Number(
    Math.min(
      98.8,
      discoveredAnchors.length > 0
        ? Math.max(baseLocal.factors.anchor_score, 54 + anchorBoost)
        : baseLocal.factors.anchor_score
    ).toFixed(1)
  );

  // 3. Competition Score (from real discovered competitors in radius)
  let competition_score = baseLocal.factors.competition_score;
  if (discoveredCompetitors.length > 0) {
    const nearestDist = Math.max(10, discoveredCompetitors[0].distance_meters);
    const proxUrgency = Math.max(0, 1.0 - nearestDist / Math.max(350, radiusMeters));
    const countFactor = Math.min(1.0, discoveredCompetitors.length / 7.0);
    competition_score = Number(Math.min(96.0, countFactor * 64.0 + proxUrgency * 34.0).toFixed(1));
  } else {
    competition_score = 12.5;
  }

  // 4. Residential Density Score
  const estimatedHouseholds = Math.max(
    baseLocal.context.estimated_households,
    Math.round(residentialUnitsFromOsm * 1.35 + commercialBuildingsCount * 18 + 480)
  );
  const residential_density_score = Number(
    Math.min(
      98.5,
      Math.max(baseLocal.factors.residential_density_score, 38 + Math.min(58, (estimatedHouseholds / 3400) * 58))
    ).toFixed(1)
  );

  // Category-weighted final MakonScore
  const categoryWeights: Record<BusinessCategory, { wt: number; wa: number; wc: number; wr: number }> = {
    cafe: { wt: 0.32, wa: 0.28, wc: 0.22, wr: 0.18 },
    pharmacy: { wt: 0.24, wa: 0.20, wc: 0.24, wr: 0.32 },
    supermarket: { wt: 0.22, wa: 0.22, wc: 0.22, wr: 0.34 },
    retail: { wt: 0.30, wa: 0.34, wc: 0.20, wr: 0.16 },
    school: { wt: 0.26, wa: 0.24, wc: 0.18, wr: 0.32 },
  };
  const { wt, wa, wc, wr } = categoryWeights[category] || categoryWeights.cafe;
  const posScore = (wt * transit_score + wa * anchor_score + wr * residential_density_score) / (wt + wa + wr);
  const compPenalty = (competition_score / 100.0) * (wc * 18.0);
  const makon_score = Number(Math.min(99.0, Math.max(14.0, posScore - compPenalty)).toFixed(1));

  let status: 'YUQORI SALOHIYAT' | "O'RTACHA SALOHIYAT" | 'PAST SALOHIYAT' = 'PAST SALOHIYAT';
  if (makon_score >= 80.0) status = 'YUQORI SALOHIYAT';
  else if (makon_score >= 55.0) status = "O'RTACHA SALOHIYAT";

  // Recompute financials with updated score & households
  const reEvaluated = calculateLocalSpatialScore(coords, category, radiusMeters);
  const scoreRatio = makon_score / Math.max(1, reEvaluated.makon_score);
  const baseFin = reEvaluated.context.financials!;
  const daily_foot_traffic = Math.round(
    baseFin.daily_foot_traffic * Math.min(1.35, Math.max(0.75, scoreRatio)) + busStopsCount * 190
  );
  const estimated_customers_daily = Math.max(
    20,
    Math.round(baseFin.estimated_customers_daily * (daily_foot_traffic / Math.max(1, baseFin.daily_foot_traffic)))
  );
  const grossMonthlyUsd = estimated_customers_daily * baseFin.avg_check_usd * 30;
  const monthly_revenue_min_usd = Math.round((grossMonthlyUsd * 0.86) / 100) * 100;
  const monthly_revenue_max_usd = Math.round((grossMonthlyUsd * 1.16) / 100) * 100;

  const finalResult: InspectResult = {
    coordinates: coords,
    business_category: category,
    radius_meters: radiusMeters,
    makon_score,
    status,
    factors: {
      transit_score,
      anchor_score,
      competition_score,
      residential_density_score,
    },
    context: {
      direct_competitors_count: discoveredCompetitors.length,
      nearest_competitor_meters: discoveredCompetitors[0]?.distance_meters ?? null,
      competitors: discoveredCompetitors.slice(0, 18),
      nearest_metro: nearestMetro,
      major_anchors: discoveredAnchors.slice(0, 12),
      estimated_households: estimatedHouseholds,
      commercial_density_label:
        discoveredCompetitors.length >= 4
          ? 'Yuqori (Zich raqobat)'
          : discoveredCompetitors.length >= 1
          ? "O'rtacha (Faol bozor)"
          : 'Erkin bozor (Bo‘sh nisha)',
      location_label: geoIdentity.location_label,
      district_name: geoIdentity.district_name,
      region_name: geoIdentity.region_name,
      street_address: geoIdentity.street_address,
      mahalla_name: geoIdentity.mahalla_name,
      bus_stops_count: busStopsCount,
      scanned_objects_count: elements.length,
      is_live_osm: true,
      live_pois_geojson: liveGeoJsonFeatures,
      financials: {
        ...baseFin,
        daily_foot_traffic,
        monthly_visitors: daily_foot_traffic * 30,
        estimated_customers_daily,
        monthly_revenue_min_usd,
        monthly_revenue_max_usd,
      },
      hourly_traffic: reEvaluated.context.hourly_traffic,
    },
  };

  overpassInspectionCache.set(cacheKey, finalResult);
  return finalResult;
}

export interface LiveOsmSearchPlace {
  id: string;
  name: string;
  description: string;
  lat: number;
  lon: number;
  category: 'district' | 'metro' | 'hub' | 'region';
  isLiveOsm: true;
}

/**
 * Live OpenStreetMap Nominatim Geocoding Search across Uzbekistan (countrycodes=uz)
 */
export async function searchOsmPlacesUzbekistan(query: string): Promise<LiveOsmSearchPlace[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&countrycodes=uz&q=${encodeURIComponent(
      trimmed
    )}&addressdetails=1&limit=6&accept-language=uz,en,ru`;

    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);

    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data
      .map((item: any, idx: number): LiveOsmSearchPlace | null => {
        const lat = parseFloat(item.lat);
        const lon = parseFloat(item.lon);
        if (isNaN(lat) || isNaN(lon)) return null;

        const addr = item.address || {};
        const primaryName = normalizeToUzbekLatin(
          item.name ||
            addr.road ||
            addr.neighbourhood ||
            addr.suburb ||
            addr.city_district ||
            item.display_name?.split(',')[0] ||
            trimmed
        );

        const district = normalizeToUzbekLatin(
          addr.city_district || addr.county || addr.city || addr.town || addr.state || "O'zbekiston"
        );
        const road = normalizeToUzbekLatin(addr.road || addr.neighbourhood || '');

        let category: 'district' | 'metro' | 'hub' | 'region' = 'district';
        const typeStr = `${item.category || ''} ${item.type || ''}`.toLowerCase();
        if (typeStr.includes('subway') || typeStr.includes('station') || typeStr.includes('railway')) {
          category = 'metro';
        } else if (
          typeStr.includes('shop') ||
          typeStr.includes('mall') ||
          typeStr.includes('amenity') ||
          typeStr.includes('commercial')
        ) {
          category = 'hub';
        } else if (typeStr.includes('administrative') || typeStr.includes('city') || typeStr.includes('town')) {
          category = 'region';
        }

        const descParts = [road && road !== primaryName ? road : null, district, 'OpenStreetMap Live'].filter(Boolean);

        return {
          id: `osm-search-${item.place_id || idx}`,
          name: primaryName,
          description: descParts.join(' · '),
          lat,
          lon,
          category,
          isLiveOsm: true,
        };
      })
      .filter((x): x is LiveOsmSearchPlace => x !== null);
  } catch {
    return [];
  }
}
