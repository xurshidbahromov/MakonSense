import { InspectResult, Coordinates, BusinessCategory } from '../types';

const EARTH_RADIUS = 6371000.0; // meters

export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS * c;
}

const CLIENT_TRANSIT = [
  { id: 1, name: "Amir Temur Xiyoboni", transit_type: "metro_station", line_name: "Chilonzor yo'nalishi", passenger_flow_score: 95, lat: 41.3123, lon: 69.2797 },
  { id: 2, name: "Yunus Rajabiy", transit_type: "metro_station", line_name: "Yunusobod yo'nalishi", passenger_flow_score: 92, lat: 41.3129, lon: 69.2810 },
  { id: 3, name: "Mustaqillik Maydoni", transit_type: "metro_station", line_name: "Chilonzor yo'nalishi", passenger_flow_score: 88, lat: 41.3167, lon: 69.2687 },
  { id: 4, name: "Paxtakor", transit_type: "metro_station", line_name: "Chilonzor yo'nalishi", passenger_flow_score: 90, lat: 41.3134, lon: 69.2536 },
  { id: 5, name: "Alisher Navoiy", transit_type: "metro_station", line_name: "O'zbekiston yo'nalishi", passenger_flow_score: 90, lat: 41.3142, lon: 69.2528 },
  { id: 6, name: "Oybek", transit_type: "metro_station", line_name: "O'zbekiston yo'nalishi", passenger_flow_score: 94, lat: 41.2981, lon: 69.2783 },
  { id: 7, name: "Ming O'rik", transit_type: "metro_station", line_name: "Yunusobod yo'nalishi", passenger_flow_score: 90, lat: 41.2974, lon: 69.2792 },
  { id: 8, name: "Chilonzor", transit_type: "metro_station", line_name: "Chilonzor yo'nalishi", passenger_flow_score: 95, lat: 41.2728, lon: 69.2062 },
  { id: 9, name: "Novza", transit_type: "metro_station", line_name: "Chilonzor yo'nalishi", passenger_flow_score: 87, lat: 41.2917, lon: 69.2273 },
  { id: 10, name: "Mirzo Ulug'bek", transit_type: "metro_station", line_name: "Chilonzor yo'nalishi", passenger_flow_score: 85, lat: 41.2829, lon: 69.2155 },
  { id: 11, name: "Buyuk Ipak Yo'li", transit_type: "metro_station", line_name: "Chilonzor yo'nalishi", passenger_flow_score: 93, lat: 41.3262, lon: 69.3347 },
  { id: 12, name: "Chorsu", transit_type: "metro_station", line_name: "O'zbekiston yo'nalishi", passenger_flow_score: 96, lat: 41.3275, lon: 69.2359 },
  { id: 13, name: "Bodomzor", transit_type: "metro_station", line_name: "Yunusobod yo'nalishi", passenger_flow_score: 82, lat: 41.3364, lon: 69.2842 },
  { id: 14, name: "Shahriston", transit_type: "metro_station", line_name: "Yunusobod yo'nalishi", passenger_flow_score: 88, lat: 41.3541, lon: 69.2883 },
  { id: 15, name: "Yunusobod", transit_type: "metro_station", line_name: "Yunusobod yo'nalishi", passenger_flow_score: 86, lat: 41.3654, lon: 69.2907 },
];

const CLIENT_POIS = [
  // Anchors
  { id: 101, name: "O'zbekiston Milliy Universiteti (NUUz)", category: "university", lat: 41.3501, lon: 69.2069 },
  { id: 102, name: "Toshkent Davlat Iqtisodiyot Universiteti (TDIU)", category: "university", lat: 41.3094, lon: 69.2554 },
  { id: 103, name: "Westminster Xalqaro Universiteti (WIUT)", category: "university", lat: 41.3079, lon: 69.2828 },
  { id: 104, name: "Toshkent Axborot Texnologiyalari Universiteti (TATU)", category: "university", lat: 41.3418, lon: 69.2858 },
  { id: 201, name: "Tashkent City Mall", category: "mall", brand: "Tashkent City Mall", lat: 41.3142, lon: 69.2483 },
  { id: 202, name: "Next Mall", category: "mall", brand: "Next", lat: 41.2989, lon: 69.2536 },
  { id: 203, name: "Samarqand Darvoza Mall", category: "mall", brand: "Samarqand Darvoza", lat: 41.3168, lon: 69.2274 },
  { id: 205, name: "Chorsu Bozori", category: "bazaar", lat: 41.3271, lon: 69.2346 },
  { id: 206, name: "Oloy Bozori", category: "bazaar", lat: 41.3204, lon: 69.2847 },
  { id: 207, name: "Mirobod Bozori", category: "bazaar", lat: 41.2952, lon: 69.2741 },

  // Cafes
  { id: 301, name: "Safia Cafe & Bakery - Amir Temur", category: "cafe", brand: "Safia", lat: 41.3115, lon: 69.2812 },
  { id: 302, name: "Safia Cafe & Bakery - Oybek", category: "cafe", brand: "Safia", lat: 41.2995, lon: 69.2775 },
  { id: 303, name: "Safia Cafe & Bakery - Chilonzor", category: "cafe", brand: "Safia", lat: 41.2736, lon: 69.2075 },
  { id: 304, name: "Bon! Cafe - Chekhov", category: "cafe", brand: "Bon!", lat: 41.3031, lon: 69.2762 },
  { id: 305, name: "Breadly Boulangerie", category: "cafe", brand: "Breadly", lat: 41.2965, lon: 69.2721 },
  { id: 307, name: "Dodo Pizza - Markaz", category: "cafe", brand: "Dodo Pizza", lat: 41.3138, lon: 69.2731 },
  { id: 308, name: "Dodo Pizza - Novza", category: "cafe", brand: "Dodo Pizza", lat: 41.2925, lon: 69.2281 },
  { id: 310, name: "Evos Fast Food - Amir Temur", category: "cafe", brand: "Evos", lat: 41.3145, lon: 69.2789 },
  { id: 311, name: "Oqtepa Lavash - Chilonzor", category: "cafe", brand: "Oqtepa Lavash", lat: 41.2748, lon: 69.2089 },

  // Pharmacies
  { id: 401, name: "Grand Pharm - Markaziy", category: "pharmacy", brand: "Grand Pharm", lat: 41.3128, lon: 69.2805 },
  { id: 402, name: "Grand Pharm - Oybek", category: "pharmacy", brand: "Grand Pharm", lat: 41.2969, lon: 69.2798 },
  { id: 403, name: "OXYmed Dorixona - Chilonzor", category: "pharmacy", brand: "OXYmed", lat: 41.2718, lon: 69.2051 },
  { id: 404, name: "999 Dorixona - Novza", category: "pharmacy", brand: "999 Pharm", lat: 41.2908, lon: 69.2265 },

  // Supermarkets
  { id: 501, name: "Korzinka - Turkkurgan", category: "supermarket", brand: "Korzinka", lat: 41.3218, lon: 69.2831 },
  { id: 502, name: "Korzinka - Abay", category: "supermarket", brand: "Korzinka", lat: 41.3198, lon: 69.2559 },
  { id: 503, name: "Korzinka - Next", category: "supermarket", brand: "Korzinka", lat: 41.2991, lon: 69.2539 },
  { id: 504, name: "Korzinka - Chilonzor", category: "supermarket", brand: "Korzinka", lat: 41.2721, lon: 69.2081 },
  { id: 505, name: "Makro Supermarket - Mirobod", category: "supermarket", brand: "Makro", lat: 41.2941, lon: 69.2758 },

  // Education
  { id: 601, name: "Cambridge International School", category: "school", brand: "CIS", lat: 41.3162, lon: 69.2471 },
  { id: 602, name: "Prezident Maktabi", category: "school", lat: 41.3289, lon: 69.3245 },
  { id: 603, name: "110-sonli Ixtisoslashtirilgan Maktab", category: "school", lat: 41.3005, lon: 69.2735 },
];

const CLIENT_RESIDENTIAL = [
  { id: 1, name: "Tashkent City - Boulevard & Gardens", units_count: 3200, lat: 41.3150, lon: 69.2485 },
  { id: 2, name: "Mirabad Avenue", units_count: 1600, lat: 41.2960, lon: 69.2730 },
  { id: 3, name: "Novza Residence", units_count: 950, lat: 41.2910, lon: 69.2280 },
  { id: 4, name: "Greenwich Turar-joy Majmuasi", units_count: 2100, lat: 41.2905, lon: 69.3085 },
  { id: 5, name: "Infinity Premium Residence", units_count: 820, lat: 41.3110, lon: 69.2875 },
  { id: 6, name: "NRG Oybek", units_count: 640, lat: 41.2985, lon: 69.2775 },
];

export function calculateLocalSpatialScore(
  coords: Coordinates,
  category: BusinessCategory,
  radiusMeters: number
): InspectResult {
  const lat = coords.latitude;
  const lon = coords.longitude;

  // 1. Transit factor (within 800m)
  const nearbyTransit = CLIENT_TRANSIT.map((s) => ({
    ...s,
    distance_meters: haversineDistance(lat, lon, s.lat, s.lon),
  }))
    .filter((s) => s.distance_meters <= 800)
    .sort((a, b) => a.distance_meters - b.distance_meters);

  let rawTransitSum = 0.0;
  for (const t of nearbyTransit) {
    const dist = Math.max(10, t.distance_meters);
    rawTransitSum += t.passenger_flow_score / dist;
  }
  const tScore = Number(
    (nearbyTransit.length === 0 ? 15.0 : 100.0 * (1.0 - Math.exp(-1.8 * rawTransitSum))).toFixed(1)
  );

  // 2. Anchor factor (within 800m)
  const nearbyAnchors = CLIENT_POIS.filter((p) =>
    ['mall', 'bazaar', 'university', 'school'].includes(p.category)
  )
    .map((a) => ({
      ...a,
      distance_meters: haversineDistance(lat, lon, a.lat, a.lon),
    }))
    .filter((a) => a.distance_meters <= 800)
    .sort((a, b) => a.distance_meters - b.distance_meters);

  let anchorAccum = 0.0;
  for (const a of nearbyAnchors) {
    let weight = 20.0;
    if (a.category === 'mall') weight = 40.0;
    else if (a.category === 'bazaar') weight = 38.0;
    else if (a.category === 'university') weight = 35.0;

    const prox = Math.max(0, 1.0 - a.distance_meters / 800.0);
    anchorAccum += weight * prox;
  }
  const aScore = Number(
    (nearbyAnchors.length === 0 ? 20.0 : 100.0 * (1.0 - Math.exp(-anchorAccum / 35.0))).toFixed(1)
  );

  // 3. Competitors factor (within 400m)
  const directCompetitors = CLIENT_POIS.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  )
    .map((c) => ({
      ...c,
      distance_meters: haversineDistance(lat, lon, c.lat, c.lon),
    }))
    .filter((c) => c.distance_meters <= 400)
    .sort((a, b) => a.distance_meters - b.distance_meters);

  let cScore = 0.0;
  if (directCompetitors.length > 0) {
    const nearestDist = directCompetitors[0].distance_meters;
    const proxUrgency = Math.max(0, 1.0 - nearestDist / 400.0);
    const countFactor = Math.min(1.0, directCompetitors.length / 5.0);
    cScore = Number((countFactor * 60.0 + proxUrgency * 40.0).toFixed(1));
  }

  // 4. Residential factor (within 600m)
  const nearbyRes = CLIENT_RESIDENTIAL.map((r) => ({
    ...r,
    distance_meters: haversineDistance(lat, lon, r.lat, r.lon),
  }))
    .filter((r) => r.distance_meters <= 600)
    .sort((a, b) => a.distance_meters - b.distance_meters);

  const totalUnits = nearbyRes.reduce((acc, r) => acc + r.units_count, 0);
  const rScore = Number(
    (totalUnits === 0 ? 30.0 : 30.0 + Math.min(1.0, totalUnits / 3000.0) * 70.0).toFixed(1)
  );

  // Combined Master Formula
  const wt = 0.3;
  const wa = 0.25;
  const wc = 0.25;
  const wr = 0.2;

  const posWeightSum = wt + wa + wr; // 0.75
  const posScore = (wt * tScore + wa * aScore + wr * rScore) / posWeightSum;
  const compPenalty = (cScore / 100.0) * (wc * 17.2);
  const makonScore = Number(Math.min(100.0, Math.max(0.0, posScore - compPenalty)).toFixed(1));

  let status: 'YUQORI SALOHIYAT' | "O'RTACHA SALOHIYAT" | 'PAST SALOHIYAT' = 'PAST SALOHIYAT';
  if (makonScore >= 80.0) status = 'YUQORI SALOHIYAT';
  else if (makonScore >= 50.0) status = "O'RTACHA SALOHIYAT";

  const nearestMetro = nearbyTransit[0]
    ? {
        name: nearbyTransit[0].name,
        distance_meters: Math.round(nearbyTransit[0].distance_meters),
        line_name: nearbyTransit[0].line_name,
        passenger_flow_score: nearbyTransit[0].passenger_flow_score,
      }
    : null;

  const estimatedHouseholds = Math.max(
    350,
    Math.round(totalUnits * 1.2 + (radiusMeters / 500.0) * 450)
  );

  return {
    coordinates: coords,
    business_category: category,
    radius_meters: radiusMeters,
    makon_score: makonScore,
    status: status,
    factors: {
      transit_score: tScore,
      anchor_score: aScore,
      competition_score: cScore,
      residential_density_score: rScore,
    },
    context: {
      direct_competitors_count: directCompetitors.length,
      nearest_competitor_meters: directCompetitors[0]
        ? Math.round(directCompetitors[0].distance_meters)
        : null,
      competitors: directCompetitors.map((c) => ({
        name: c.name,
        brand: c.brand,
        category: c.category,
        distance_meters: Math.round(c.distance_meters),
      })),
      nearest_metro: nearestMetro,
      major_anchors: nearbyAnchors.map((a) => ({
        name: a.name,
        category: a.category,
        distance_meters: Math.round(a.distance_meters),
      })),
      estimated_households: estimatedHouseholds,
      commercial_density_label: directCompetitors.length >= 3 ? 'Yuqori' : 'O\'rtacha',
    },
  };
}
