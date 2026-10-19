import {
  InspectResult,
  Coordinates,
  BusinessCategory,
  HexFeature,
  FinancialForecast,
  HourlyTrafficSlot,
  HotspotCandidate,
} from '../types';

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

export const CLIENT_TRANSIT = [
  { id: 1, name: "Amir Temur Xiyoboni", transit_type: "metro_station", line_name: "Chilonzor yo'nalishi", passenger_flow_score: 96, lat: 41.3123, lon: 69.2797 },
  { id: 2, name: "Yunus Rajabiy", transit_type: "metro_station", line_name: "Yunusobod yo'nalishi", passenger_flow_score: 93, lat: 41.3129, lon: 69.2810 },
  { id: 3, name: "Mustaqillik Maydoni", transit_type: "metro_station", line_name: "Chilonzor yo'nalishi", passenger_flow_score: 89, lat: 41.3167, lon: 69.2687 },
  { id: 4, name: "Paxtakor", transit_type: "metro_station", line_name: "Chilonzor yo'nalishi", passenger_flow_score: 94, lat: 41.3134, lon: 69.2536 },
  { id: 5, name: "Alisher Navoiy", transit_type: "metro_station", line_name: "O'zbekiston yo'nalishi", passenger_flow_score: 93, lat: 41.3142, lon: 69.2528 },
  { id: 6, name: "Oybek", transit_type: "metro_station", line_name: "O'zbekiston yo'nalishi", passenger_flow_score: 94, lat: 41.2981, lon: 69.2783 },
  { id: 7, name: "Ming O'rik", transit_type: "metro_station", line_name: "Yunusobod yo'nalishi", passenger_flow_score: 90, lat: 41.2974, lon: 69.2792 },
  { id: 8, name: "Chilonzor", transit_type: "metro_station", line_name: "Chilonzor yo'nalishi", passenger_flow_score: 95, lat: 41.2728, lon: 69.2062 },
  { id: 9, name: "Novza", transit_type: "metro_station", line_name: "Chilonzor yo'nalishi", passenger_flow_score: 88, lat: 41.2917, lon: 69.2273 },
  { id: 10, name: "Mirzo Ulug'bek", transit_type: "metro_station", line_name: "Chilonzor yo'nalishi", passenger_flow_score: 86, lat: 41.2829, lon: 69.2155 },
  { id: 11, name: "Buyuk Ipak Yo'li", transit_type: "metro_station", line_name: "Chilonzor yo'nalishi", passenger_flow_score: 94, lat: 41.3262, lon: 69.3347 },
  { id: 12, name: "Chorsu", transit_type: "metro_station", line_name: "O'zbekiston yo'nalishi", passenger_flow_score: 98, lat: 41.3275, lon: 69.2359 },
  { id: 13, name: "Bodomzor", transit_type: "metro_station", line_name: "Yunusobod yo'nalishi", passenger_flow_score: 85, lat: 41.3364, lon: 69.2842 },
  { id: 14, name: "Shahriston", transit_type: "metro_station", line_name: "Yunusobod yo'nalishi", passenger_flow_score: 89, lat: 41.3541, lon: 69.2883 },
  { id: 15, name: "Yunusobod", transit_type: "metro_station", line_name: "Yunusobod yo'nalishi", passenger_flow_score: 87, lat: 41.3654, lon: 69.2907 },
  { id: 16, name: "Beruniy", transit_type: "metro_station", line_name: "O'zbekiston yo'nalishi", passenger_flow_score: 91, lat: 41.3448, lon: 69.2065 },
  { id: 17, name: "Tinchlik", transit_type: "metro_station", line_name: "O'zbekiston yo'nalishi", passenger_flow_score: 82, lat: 41.3318, lon: 69.2182 },
  { id: 18, name: "G'afur G'ulom", transit_type: "metro_station", line_name: "O'zbekiston yo'nalishi", passenger_flow_score: 84, lat: 41.3277, lon: 69.2471 },
  { id: 19, name: "Kosmonavtlar", transit_type: "metro_station", line_name: "O'zbekiston yo'nalishi", passenger_flow_score: 86, lat: 41.3055, lon: 69.2651 },
  { id: 20, name: "Toshkent (Shimoliy Vokzal)", transit_type: "metro_station", line_name: "O'zbekiston yo'nalishi", passenger_flow_score: 93, lat: 41.2923, lon: 69.2869 },
  { id: 21, name: "Do'stlik", transit_type: "metro_station", line_name: "O'zbekiston yo'nalishi", passenger_flow_score: 88, lat: 41.2943, lon: 69.3228 },
  { id: 22, name: "Pushkin", transit_type: "metro_station", line_name: "Chilonzor yo'nalishi", passenger_flow_score: 84, lat: 41.3212, lon: 69.3125 },
  { id: 23, name: "Hamid Olimjon", transit_type: "metro_station", line_name: "Chilonzor yo'nalishi", passenger_flow_score: 87, lat: 41.3182, lon: 69.2952 },
  { id: 24, name: "Xalqlar Do'stligi", transit_type: "metro_station", line_name: "Chilonzor yo'nalishi", passenger_flow_score: 91, lat: 41.3081, lon: 69.2429 },
  { id: 25, name: "Milliy Bog'", transit_type: "metro_station", line_name: "Chilonzor yo'nalishi", passenger_flow_score: 83, lat: 41.3036, lon: 69.2351 },
  { id: 26, name: "Olmazor", transit_type: "metro_station", line_name: "Chilonzor yo'nalishi", passenger_flow_score: 88, lat: 41.2564, lon: 69.1965 },
  { id: 27, name: "Sergeli", transit_type: "metro_station", line_name: "Sergeli yo'nalishi", passenger_flow_score: 86, lat: 41.2248, lon: 69.2185 },
  { id: 28, name: "Qo'yliq", transit_type: "metro_station", line_name: "Yer usti halqa yo'li", passenger_flow_score: 92, lat: 41.2389, lon: 69.3274 },
  // Regional Hubs
  { id: 29, name: "Registon Markaziy Hab", transit_type: "transit_hub", line_name: "Samarqand Tranzit", passenger_flow_score: 92, lat: 39.6542, lon: 66.9758 },
  { id: 30, name: "Labi Hovuz Tranzit", transit_type: "transit_hub", line_name: "Buxoro Markaz", passenger_flow_score: 89, lat: 39.7732, lon: 64.4215 },
  { id: 31, name: "Farg'ona Markaziy Bekati", transit_type: "transit_hub", line_name: "Farg'ona Markaz", passenger_flow_score: 88, lat: 40.3842, lon: 71.7843 },
  { id: 32, name: "Andijon Yangi Bozor Hab", transit_type: "transit_hub", line_name: "Andijon Tranzit", passenger_flow_score: 90, lat: 40.7821, lon: 72.3442 },
  { id: 33, name: "Namangan Chorsu Hab", transit_type: "transit_hub", line_name: "Namangan Tranzit", passenger_flow_score: 89, lat: 41.0011, lon: 71.6683 },
];

export const CLIENT_POIS = [
  // Anchors (Malls, Bazaars, Universities)
  { id: 101, name: "O'zbekiston Milliy Universiteti (NUUz)", category: "university", brand: "NUUz", lat: 41.3501, lon: 69.2069 },
  { id: 102, name: "Toshkent Davlat Iqtisodiyot Universiteti (TDIU)", category: "university", brand: "TDIU", lat: 41.3094, lon: 69.2554 },
  { id: 103, name: "Westminster Xalqaro Universiteti (WIUT)", category: "university", brand: "WIUT", lat: 41.3079, lon: 69.2828 },
  { id: 104, name: "Toshkent Axborot Texnologiyalari Universiteti (TATU)", category: "university", brand: "TATU", lat: 41.3418, lon: 69.2858 },
  { id: 105, name: "Toshkent Moliya Instituti", category: "university", brand: "TMI", lat: 41.3219, lon: 69.2869 },
  { id: 106, name: "INHA Universiteti Toshkent", category: "university", brand: "INHA", lat: 41.3385, lon: 69.3345 },
  { id: 201, name: "Tashkent City Mall", category: "mall", brand: "Tashkent City Mall", lat: 41.3142, lon: 69.2483 },
  { id: 202, name: "Next Mall", category: "mall", brand: "Next", lat: 41.2989, lon: 69.2536 },
  { id: 203, name: "Samarqand Darvoza Mall", category: "mall", brand: "Samarqand Darvoza", lat: 41.3168, lon: 69.2274 },
  { id: 204, name: "Riviera Mall", category: "mall", brand: "Riviera", lat: 41.3396, lon: 69.2534 },
  { id: 205, name: "Chorsu Bozori", category: "bazaar", brand: "Chorsu", lat: 41.3271, lon: 69.2346 },
  { id: 206, name: "Oloy Bozori", category: "bazaar", brand: "Oloy", lat: 41.3204, lon: 69.2847 },
  { id: 207, name: "Mirobod Bozori", category: "bazaar", brand: "Mirobod", lat: 41.2952, lon: 69.2741 },
  { id: 208, name: "Mega Planet Mall", category: "mall", brand: "Mega Planet", lat: 41.3669, lon: 69.2912 },
  { id: 209, name: "Magic City Park & Mall", category: "mall", brand: "Magic City", lat: 41.3041, lon: 69.2458 },
  { id: 210, name: "Compass Mall", category: "mall", brand: "Compass", lat: 41.2394, lon: 69.3282 },
  { id: 211, name: "EcoBozor Chimgan", category: "bazaar", brand: "EcoBozor", lat: 41.3472, lon: 69.3451 },

  // Cafes & Restaurants
  { id: 301, name: "Safia Cafe & Bakery - Amir Temur", category: "cafe", brand: "Safia", lat: 41.3115, lon: 69.2812 },
  { id: 302, name: "Safia Cafe & Bakery - Oybek", category: "cafe", brand: "Safia", lat: 41.2995, lon: 69.2775 },
  { id: 303, name: "Safia Cafe & Bakery - Chilonzor", category: "cafe", brand: "Safia", lat: 41.2736, lon: 69.2075 },
  { id: 304, name: "Bon! Cafe - Taras Shevchenko", category: "cafe", brand: "Bon!", lat: 41.3031, lon: 69.2762 },
  { id: 305, name: "Breadly Boulangerie - Mirabad", category: "cafe", brand: "Breadly", lat: 41.2965, lon: 69.2721 },
  { id: 306, name: "Paul Bakery & Restaurant - Tashkent City", category: "cafe", brand: "Paul", lat: 41.3148, lon: 69.2491 },
  { id: 307, name: "Dodo Pizza - Markaz", category: "cafe", brand: "Dodo Pizza", lat: 41.3138, lon: 69.2731 },
  { id: 308, name: "Dodo Pizza - Novza", category: "cafe", brand: "Dodo Pizza", lat: 41.2925, lon: 69.2281 },
  { id: 309, name: "Costa Coffee - Tashkent City", category: "cafe", brand: "Costa Coffee", lat: 41.3139, lon: 69.2478 },
  { id: 310, name: "Evos Fast Food - Amir Temur", category: "cafe", brand: "Evos", lat: 41.3145, lon: 69.2789 },
  { id: 311, name: "Oqtepa Lavash - Chilonzor", category: "cafe", brand: "Oqtepa Lavash", lat: 41.2748, lon: 69.2089 },
  { id: 312, name: "B&B Coffee House - Buyuk Ipak Yo'li", category: "cafe", brand: "B&B Coffee", lat: 41.3258, lon: 69.3339 },
  { id: 313, name: "KFC - Yunusobod", category: "cafe", brand: "KFC", lat: 41.3661, lon: 69.2905 },
  { id: 314, name: "Giotto Gelateria - Beruniy", category: "cafe", brand: "Giotto", lat: 41.3452, lon: 69.2072 },

  // Pharmacies
  { id: 401, name: "Grand Pharm - Markaziy", category: "pharmacy", brand: "Grand Pharm", lat: 41.3128, lon: 69.2805 },
  { id: 402, name: "Grand Pharm - Oybek", category: "pharmacy", brand: "Grand Pharm", lat: 41.2969, lon: 69.2798 },
  { id: 403, name: "OXYmed Dorixona - Chilonzor", category: "pharmacy", brand: "OXYmed", lat: 41.2718, lon: 69.2051 },
  { id: 404, name: "999 Dorixona - Novza", category: "pharmacy", brand: "999 Pharm", lat: 41.2908, lon: 69.2265 },
  { id: 405, name: "Dori-Darmon Markaziy - Chorsu", category: "pharmacy", brand: "Dori-Darmon", lat: 41.3268, lon: 69.2364 },
  { id: 406, name: "ArzonApteka - Yunusobod", category: "pharmacy", brand: "ArzonApteka", lat: 41.3649, lon: 69.2898 },
  { id: 407, name: "Best Pharm - Buyuk Ipak Yo'li", category: "pharmacy", brand: "Best Pharm", lat: 41.3269, lon: 69.3352 },
  { id: 408, name: "Grand Pharm - Tashkent City", category: "pharmacy", brand: "Grand Pharm", lat: 41.3152, lon: 69.2495 },

  // Supermarkets
  { id: 501, name: "Korzinka - Turkkurgan", category: "supermarket", brand: "Korzinka", lat: 41.3218, lon: 69.2831 },
  { id: 502, name: "Korzinka - Abay", category: "supermarket", brand: "Korzinka", lat: 41.3198, lon: 69.2559 },
  { id: 503, name: "Korzinka - Next", category: "supermarket", brand: "Korzinka", lat: 41.2991, lon: 69.2539 },
  { id: 504, name: "Korzinka - Chilonzor", category: "supermarket", brand: "Korzinka", lat: 41.2721, lon: 69.2081 },
  { id: 505, name: "Makro Supermarket - Mirobod", category: "supermarket", brand: "Makro", lat: 41.2941, lon: 69.2758 },
  { id: 506, name: "Havas Discounter - Sergeli", category: "supermarket", brand: "Havas", lat: 41.2254, lon: 69.2192 },
  { id: 507, name: "Carrefour / Magnum - Samarqand Darvoza", category: "supermarket", brand: "Magnum", lat: 41.3164, lon: 69.2279 },
  { id: 508, name: "Bi1 Supermarket - Oybek", category: "supermarket", brand: "Bi1", lat: 41.2979, lon: 69.2768 },
  { id: 509, name: "Korzinka - Shahriston", category: "supermarket", brand: "Korzinka", lat: 41.3536, lon: 69.2879 },

  // Education & Schools
  { id: 601, name: "Cambridge International School", category: "school", brand: "CIS", lat: 41.3162, lon: 69.2471 },
  { id: 602, name: "Prezident Maktabi - Toshkent", category: "school", brand: "PIIMA", lat: 41.3289, lon: 69.3245 },
  { id: 603, name: "110-sonli Ixtisoslashtirilgan Maktab", category: "school", brand: "Davlat Maktabi", lat: 41.3005, lon: 69.2735 },
  { id: 604, name: "Najot Ta'lim - Chilonzor", category: "school", brand: "Najot Ta'lim", lat: 41.2852, lon: 69.2041 },
  { id: 605, name: "Thompson International School", category: "school", brand: "Thompson", lat: 41.2932, lon: 69.2294 },
  { id: 606, name: "Inter Nation English School - Amir Temur", category: "school", brand: "Inter Nation", lat: 41.3119, lon: 69.2784 },

  // Retail & Fashion / Electronics Stores
  { id: 701, name: "Texnomart - Amir Temur", category: "retail", brand: "Texnomart", lat: 41.3131, lon: 69.2809 },
  { id: 702, name: "Mediapark - Qoratosh", category: "retail", brand: "Mediapark", lat: 41.3159, lon: 69.2381 },
  { id: 703, name: "Zara Flagship - Tashkent City Mall", category: "retail", brand: "Inditex", lat: 41.3144, lon: 69.2486 },
  { id: 704, name: "LC Waikiki - Chilonzor", category: "retail", brand: "LC Waikiki", lat: 41.2732, lon: 69.2068 },
  { id: 705, name: "iSpace Apple Premium Reseller", category: "retail", brand: "iSpace", lat: 41.3140, lon: 69.2481 },
  { id: 706, name: "Ishonch Savdo Markazi - Qo'yliq", category: "retail", brand: "Ishonch", lat: 41.2392, lon: 69.3269 },
  { id: 707, name: "Terra Pro - Mirabad Avenue", category: "retail", brand: "Terra Pro", lat: 41.2962, lon: 69.2735 },
  { id: 708, name: "Bloom Beauty Shop - Oybek", category: "retail", brand: "Bloom", lat: 41.2984, lon: 69.2789 },
  { id: 709, name: "redTAG Fashion - Mega Planet", category: "retail", brand: "redTAG", lat: 41.3665, lon: 69.2915 },
];

export const CLIENT_RESIDENTIAL = [
  { id: 1, name: "Tashkent City - Boulevard & Gardens", units_count: 3400, lat: 41.3150, lon: 69.2485 },
  { id: 2, name: "Mirabad Avenue Premium Residence", units_count: 1850, lat: 41.2960, lon: 69.2730 },
  { id: 3, name: "Novza Residence", units_count: 1150, lat: 41.2910, lon: 69.2280 },
  { id: 4, name: "Greenwich Turar-joy Majmuasi", units_count: 2200, lat: 41.2905, lon: 69.3085 },
  { id: 5, name: "Infinity Premium Residence", units_count: 1250, lat: 41.3110, lon: 69.2875 },
  { id: 6, name: "NRG Oybek", units_count: 980, lat: 41.2985, lon: 69.2775 },
  { id: 7, name: "Chilonzor 1-9 Kvartal Massivlari", units_count: 3800, lat: 41.2740, lon: 69.2070 },
  { id: 8, name: "Yunusobod 4-19 Dahalar", units_count: 3600, lat: 41.3650, lon: 69.2910 },
  { id: 9, name: "Maksim Gorkiy / Buyuk Ipak Yo'li Massivi", units_count: 2900, lat: 41.3260, lon: 69.3340 },
  { id: 10, name: "Eski Shahar & Chorsu Mahallalari", units_count: 3100, lat: 41.3280, lon: 69.2350 },
  { id: 11, name: "Sergeli Yangi Hayot Massivi", units_count: 3500, lat: 41.2250, lon: 69.2180 },
  { id: 12, name: "Beruniy & Talabalar Shaharchasi", units_count: 2600, lat: 41.3455, lon: 69.2068 },
  { id: 13, name: "Samarqand Darvoza & Qoratosh Massivi", units_count: 2800, lat: 41.3165, lon: 69.2290 },
];

export const KNOWN_DISTRICTS = [
  { name: "Amir Temur Xiyoboni", district: "Mirobod / Yunusobod tumani", region: "Toshkent sh.", lat: 41.3120, lon: 69.2800 },
  { name: "Tashkent City IBC", district: "Shayxontohur tumani", region: "Toshkent sh.", lat: 41.3145, lon: 69.2485 },
  { name: "Chorsu & Eski Shahar", district: "Olmazor / Shayxontohur", region: "Toshkent sh.", lat: 41.3271, lon: 69.2346 },
  { name: "Oybek & Mirabad Avenue", district: "Mirobod tumani", region: "Toshkent sh.", lat: 41.2981, lon: 69.2783 },
  { name: "Chilonzor Savdo Markazi", district: "Chilonzor tumani", region: "Toshkent sh.", lat: 41.2728, lon: 69.2062 },
  { name: "Novza & Bunyodkor Shoh Ko'chasi", district: "Chilonzor tumani", region: "Toshkent sh.", lat: 41.2917, lon: 69.2273 },
  { name: "Buyuk Ipak Yo'li (Maksim Gorkiy)", district: "Mirzo Ulug'bek tumani", region: "Toshkent sh.", lat: 41.3262, lon: 69.3347 },
  { name: "Yunusobod Mega Planet Hududi", district: "Yunusobod tumani", region: "Toshkent sh.", lat: 41.3654, lon: 69.2907 },
  { name: "Bodomzor & IT Park Yo'nalishi", district: "Yunusobod tumani", region: "Toshkent sh.", lat: 41.3364, lon: 69.2842 },
  { name: "Samarqand Darvoza Hududi", district: "Shayxontohur tumani", region: "Toshkent sh.", lat: 41.3168, lon: 69.2274 },
  { name: "Beruniy & O'zMU Talabalar Hududi", district: "Olmazor tumani", region: "Toshkent sh.", lat: 41.3448, lon: 69.2065 },
  { name: "Sergeli Markaziy Yo'nalishi", district: "Sergeli tumani", region: "Toshkent sh.", lat: 41.2248, lon: 69.2185 },
  { name: "Qo'yliq & Compass Savdo Hab", district: "Bektemir tumani", region: "Toshkent sh.", lat: 41.2389, lon: 69.3274 },
  { name: "Magic City & Milliy Bog'", district: "Chilonzor / Shayxontohur", region: "Toshkent sh.", lat: 41.3041, lon: 69.2458 },
  { name: "Samarqand — Registon Markazi", district: "Samarqand shahri", region: "Samarqand vil.", lat: 39.6542, lon: 66.9758 },
  { name: "Buxoro — Labi Hovuz Markazi", district: "Buxoro shahri", region: "Buxoro vil.", lat: 39.7732, lon: 64.4215 },
  { name: "Farg'ona — Al-Farg'oniy Markazi", district: "Farg'ona shahri", region: "Farg'ona vil.", lat: 40.3842, lon: 71.7843 },
  { name: "Andijon — Bobur Shoh Ko'chasi", district: "Andijon shahri", region: "Andijon vil.", lat: 40.7821, lon: 72.3442 },
  { name: "Namangan — Chorsu Markazi", district: "Namangan shahri", region: "Namangan vil.", lat: 41.0011, lon: 71.6683 },
];

export function resolveLocationIdentity(lat: number, lon: number): {
  location_label: string;
  district_name: string;
  region_name: string;
} {
  let nearest = KNOWN_DISTRICTS[0];
  let minDist = Infinity;

  for (const d of KNOWN_DISTRICTS) {
    const dist = haversineDistance(lat, lon, d.lat, d.lon);
    if (dist < minDist) {
      minDist = dist;
      nearest = d;
    }
  }

  if (minDist <= 650) {
    return {
      location_label: nearest.name,
      district_name: nearest.district,
      region_name: nearest.region,
    };
  }

  if (minDist <= 3500) {
    return {
      location_label: `${nearest.name} yaqinida (~${(minDist / 1000).toFixed(1)} km)`,
      district_name: nearest.district,
      region_name: nearest.region,
    };
  }

  return {
    location_label: `Koordinata [${lat.toFixed(4)}, ${lon.toFixed(4)}]`,
    district_name: nearest.district,
    region_name: nearest.region,
  };
}

function buildCategoryHourlyTraffic(
  category: BusinessCategory,
  dailyTraffic: number
): HourlyTrafficSlot[] {
  const baseScale = Math.max(0.35, dailyTraffic / 14000);

  const templates: Record<
    BusinessCategory,
    Array<{ hour: string; wd: number; we: number; conv: number; label: string }>
  > = {
    cafe: [
      { hour: '08:00', wd: 1450, we: 920, conv: 4.8, label: 'Ertalabki kofe va nonushta' },
      { hour: '10:00', wd: 1180, we: 1350, conv: 3.9, label: 'Kunduzgi uchrashuvlar' },
      { hour: '13:00', wd: 2680, we: 2420, conv: 6.4, label: 'Tushlik pik soati (Lunch Peak)' },
      { hour: '16:00', wd: 1620, we: 2150, conv: 4.5, label: 'Kunning ikkinchi yarmi' },
      { hour: '19:00', wd: 3150, we: 3680, conv: 7.2, label: 'Kechki gavjum oqim (Dinner Peak)' },
      { hour: '22:00', wd: 1380, we: 1940, conv: 5.1, label: 'Tungi dam olish oqimi' },
    ],
    pharmacy: [
      { hour: '08:00', wd: 1650, we: 1120, conv: 8.5, label: 'Ertalabki retsept va poliklinika oqimi' },
      { hour: '10:00', wd: 2140, we: 1680, conv: 9.2, label: 'Shifokor ko‘rigidan chiqish vaqti' },
      { hour: '13:00', wd: 1820, we: 1540, conv: 7.4, label: 'Tushlik vaqtidagi xaridlar' },
      { hour: '16:00', wd: 1590, we: 1420, conv: 7.1, label: 'Barqaror kunduzgi oqim' },
      { hour: '19:00', wd: 2890, we: 2380, conv: 9.8, label: 'Uyga qaytishdagi eng yuqori talab' },
      { hour: '22:00', wd: 940, we: 1050, conv: 11.2, label: 'Navbatchi 24/7 shoshilinch talab' },
    ],
    supermarket: [
      { hour: '08:00', wd: 980, we: 840, conv: 6.2, label: 'Ertalabki kunlik mahsulotlar' },
      { hour: '10:00', wd: 1420, we: 2180, conv: 7.8, label: 'Oilaviy xaridlar boshlanishi' },
      { hour: '13:00', wd: 1950, we: 2640, conv: 6.9, label: 'Kunduzgi oziq-ovqat oqimi' },
      { hour: '16:00', wd: 2120, we: 2890, conv: 8.1, label: 'Kechki tayyorgarlik xaridlari' },
      { hour: '19:00', wd: 3640, we: 3420, conv: 10.4, label: 'Ishdan keyingi oilaviy savatcha pik' },
      { hour: '22:00', wd: 1480, we: 1620, conv: 7.5, label: 'Kechki ekspress xaridlar' },
    ],
    retail: [
      { hour: '08:00', wd: 520, we: 480, conv: 1.8, label: 'Ochilish oldi past tranzit' },
      { hour: '10:00', wd: 1280, we: 1950, conv: 2.9, label: 'Do‘konlar ochilishi va ko‘rik' },
      { hour: '13:00', wd: 2150, we: 2980, conv: 3.6, label: 'Tushlik va dam olish shopping oqimi' },
      { hour: '16:00', wd: 2340, we: 3450, conv: 4.1, label: 'Asosiy xarid va tanlov vaqti' },
      { hour: '19:00', wd: 2980, we: 3820, conv: 4.8, label: 'Kechki savdo markazi pik soati' },
      { hour: '22:00', wd: 890, we: 1340, conv: 2.7, label: 'Yopilish oldi yakuniy xaridlar' },
    ],
    school: [
      { hour: '08:00', wd: 2950, we: 1680, conv: 3.2, label: '1-smena va ertalabki darslar boshlanishi' },
      { hour: '10:00', wd: 1840, we: 2240, conv: 3.8, label: 'O‘quv kurslari va intensiv guruhlar' },
      { hour: '13:00', wd: 2620, we: 1950, conv: 3.5, label: 'Smena almashinuvi va tushlik' },
      { hour: '16:00', wd: 2780, we: 2120, conv: 4.4, label: 'Maktabdan keyingi qo‘shimcha ta’lim pik' },
      { hour: '19:00', wd: 2450, we: 1420, conv: 4.1, label: 'Kechki IT va til kurslari (Bootcamp)' },
      { hour: '22:00', wd: 420, we: 310, conv: 1.5, label: 'O‘quv markazi yopilish vaqti' },
    ],
  };

  return (templates[category] || templates.cafe).map((slot) => ({
    hour: slot.hour,
    weekday_flow: Math.round(slot.wd * baseScale),
    weekend_flow: Math.round(slot.we * baseScale),
    conversion_rate: slot.conv,
    label: slot.label,
  }));
}

function buildFinancialForecast(
  makonScore: number,
  category: BusinessCategory,
  transitScore: number,
  estimatedHouseholds: number
): FinancialForecast {
  const scoreNorm = Math.max(0.22, makonScore / 100);
  const transitNorm = Math.max(0.25, transitScore / 100);

  // Daily foot traffic passing within catchment
  const daily_foot_traffic = Math.round(
    3200 + scoreNorm * 11800 + transitNorm * 4900 + Math.min(3500, estimatedHouseholds * 0.45)
  );
  const monthly_visitors = daily_foot_traffic * 30;

  const categoryEconomics: Record<
    BusinessCategory,
    { captureRate: number; avgCheckUsd: number; areaSqm: number; capexUsd: number }
  > = {
    cafe: { captureRate: 0.024, avgCheckUsd: 4.8, areaSqm: 85, capexUsd: 38000 },
    pharmacy: { captureRate: 0.031, avgCheckUsd: 6.2, areaSqm: 60, capexUsd: 29000 },
    supermarket: { captureRate: 0.042, avgCheckUsd: 9.5, areaSqm: 220, capexUsd: 68000 },
    retail: { captureRate: 0.014, avgCheckUsd: 18.5, areaSqm: 95, capexUsd: 44000 },
    school: { captureRate: 0.0085, avgCheckUsd: 24.0, areaSqm: 160, capexUsd: 42000 },
  };

  const econ = categoryEconomics[category] || categoryEconomics.cafe;
  const estimated_customers_daily = Math.max(
    25,
    Math.round(daily_foot_traffic * econ.captureRate * (0.75 + scoreNorm * 0.45))
  );

  const grossMonthlyUsd = estimated_customers_daily * econ.avgCheckUsd * 30;
  const monthly_revenue_min_usd = Math.round((grossMonthlyUsd * 0.86) / 100) * 100;
  const monthly_revenue_max_usd = Math.round((grossMonthlyUsd * 1.16) / 100) * 100;

  // Commercial rent per m2 scales with transit & makonScore ($14 to $38 / m2)
  const estimated_rent_sqm_usd = Math.round(13 + scoreNorm * 16 + transitNorm * 8);
  const estimated_monthly_rent_usd = Math.round((estimated_rent_sqm_usd * econ.areaSqm) / 50) * 50;

  // Net margin ~22-28% after COGS, staff & rent
  const estimatedNetProfitMonthly = Math.max(
    900,
    grossMonthlyUsd * 0.27 - estimated_monthly_rent_usd * 0.45
  );
  const payback_months = Number(
    Math.min(36, Math.max(5.5, econ.capexUsd / estimatedNetProfitMonthly)).toFixed(1)
  );
  const roi_annual_percent = Math.round(Math.min(185, Math.max(18, (12 / payback_months) * 100)));

  return {
    daily_foot_traffic,
    monthly_visitors,
    estimated_customers_daily,
    avg_check_usd: econ.avgCheckUsd,
    monthly_revenue_min_usd,
    monthly_revenue_max_usd,
    estimated_rent_sqm_usd,
    estimated_monthly_rent_usd,
    payback_months,
    roi_annual_percent,
  };
}

export function calculateLocalSpatialScore(
  coords: Coordinates,
  category: BusinessCategory,
  radiusMeters: number
): InspectResult {
  const lat = coords.latitude;
  const lon = coords.longitude;

  // Subtle deterministic spatial wave so arbitrary street clicks outside presets still reflect road density
  const microWave =
    Math.abs(Math.sin(lat * 180.0) * Math.cos(lon * 180.0)) * 22.0 +
    Math.abs(Math.sin((lat + lon) * 95.0)) * 14.0;

  // 1. Transit factor (within max(800m, radiusMeters * 1.4))
  const transitCatchment = Math.max(850, radiusMeters * 1.4);
  const nearbyTransit = CLIENT_TRANSIT.map((s) => ({
    ...s,
    distance_meters: haversineDistance(lat, lon, s.lat, s.lon),
  }))
    .filter((s) => s.distance_meters <= transitCatchment)
    .sort((a, b) => a.distance_meters - b.distance_meters);

  let rawTransitSum = 0.0;
  for (const t of nearbyTransit) {
    const dist = Math.max(15, t.distance_meters);
    rawTransitSum += t.passenger_flow_score / dist;
  }
  const tScore = Number(
    (
      nearbyTransit.length === 0
        ? Math.min(58, 22.0 + microWave * 0.85)
        : Math.min(99.2, 100.0 * (1.0 - Math.exp(-1.85 * rawTransitSum)))
    ).toFixed(1)
  );

  // 2. Anchor factor (within max(800m, radiusMeters * 1.3))
  const anchorCatchment = Math.max(800, radiusMeters * 1.3);
  const nearbyAnchors = CLIENT_POIS.filter((p) =>
    ['mall', 'bazaar', 'university', 'school'].includes(p.category)
  )
    .map((a) => ({
      ...a,
      distance_meters: haversineDistance(lat, lon, a.lat, a.lon),
    }))
    .filter((a) => a.distance_meters <= anchorCatchment)
    .sort((a, b) => a.distance_meters - b.distance_meters);

  let anchorAccum = 0.0;
  for (const a of nearbyAnchors) {
    let weight = 22.0;
    if (a.category === 'mall') weight = 42.0;
    else if (a.category === 'bazaar') weight = 39.0;
    else if (a.category === 'university') weight = 36.0;

    const prox = Math.max(0, 1.0 - a.distance_meters / anchorCatchment);
    anchorAccum += weight * prox;
  }
  const aScore = Number(
    (
      nearbyAnchors.length === 0
        ? Math.min(62, 26.0 + microWave * 0.9)
        : Math.min(98.5, 100.0 * (1.0 - Math.exp(-anchorAccum / 34.0)))
    ).toFixed(1)
  );

  // 3. Competitors factor (within radiusMeters)
  const compCatchment = Math.max(350, radiusMeters);
  const directCompetitors = CLIENT_POIS.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  )
    .map((c) => ({
      ...c,
      distance_meters: haversineDistance(lat, lon, c.lat, c.lon),
    }))
    .filter((c) => c.distance_meters <= compCatchment)
    .sort((a, b) => a.distance_meters - b.distance_meters);

  let cScore = 0.0;
  if (directCompetitors.length > 0) {
    const nearestDist = directCompetitors[0].distance_meters;
    const proxUrgency = Math.max(0, 1.0 - nearestDist / compCatchment);
    const countFactor = Math.min(1.0, directCompetitors.length / 5.0);
    cScore = Number((countFactor * 60.0 + proxUrgency * 40.0).toFixed(1));
  } else {
    cScore = Number(Math.min(35.0, (microWave % 18) + 6.0).toFixed(1));
  }

  // 4. Residential factor (within max(650m, radiusMeters * 1.2))
  const resCatchment = Math.max(650, radiusMeters * 1.2);
  const nearbyRes = CLIENT_RESIDENTIAL.map((r) => ({
    ...r,
    distance_meters: haversineDistance(lat, lon, r.lat, r.lon),
  }))
    .filter((r) => r.distance_meters <= resCatchment)
    .sort((a, b) => a.distance_meters - b.distance_meters);

  const totalUnits = nearbyRes.reduce((acc, r) => acc + r.units_count, 0);
  const rScore = Number(
    (
      totalUnits === 0
        ? Math.min(74, 38.0 + microWave * 0.8)
        : 32.0 + Math.min(1.0, totalUnits / 3200.0) * 66.0
    ).toFixed(1)
  );

  // Category-specific weight tuning
  const categoryWeights: Record<BusinessCategory, { wt: number; wa: number; wc: number; wr: number }> = {
    cafe: { wt: 0.32, wa: 0.28, wc: 0.22, wr: 0.18 },
    pharmacy: { wt: 0.24, wa: 0.20, wc: 0.24, wr: 0.32 },
    supermarket: { wt: 0.22, wa: 0.22, wc: 0.22, wr: 0.34 },
    retail: { wt: 0.30, wa: 0.34, wc: 0.20, wr: 0.16 },
    school: { wt: 0.26, wa: 0.24, wc: 0.18, wr: 0.32 },
  };

  const { wt, wa, wc, wr } = categoryWeights[category] || categoryWeights.cafe;
  const posWeightSum = wt + wa + wr;
  const posScore = (wt * tScore + wa * aScore + wr * rScore) / posWeightSum;
  const compPenalty = (cScore / 100.0) * (wc * 18.5);
  const makonScore = Number(Math.min(99.0, Math.max(12.0, posScore - compPenalty)).toFixed(1));

  let status: 'YUQORI SALOHIYAT' | "O'RTACHA SALOHIYAT" | 'PAST SALOHIYAT' = 'PAST SALOHIYAT';
  if (makonScore >= 80.0) status = 'YUQORI SALOHIYAT';
  else if (makonScore >= 55.0) status = "O'RTACHA SALOHIYAT";

  const nearestMetro = nearbyTransit[0]
    ? {
        name: nearbyTransit[0].name,
        distance_meters: Math.round(nearbyTransit[0].distance_meters),
        line_name: nearbyTransit[0].line_name,
        passenger_flow_score: nearbyTransit[0].passenger_flow_score,
        lat: nearbyTransit[0].lat,
        lon: nearbyTransit[0].lon,
      }
    : null;

  const estimatedHouseholds = Math.max(
    420,
    Math.round(totalUnits * 1.15 + (radiusMeters / 500.0) * 620 + microWave * 18)
  );

  const identity = resolveLocationIdentity(lat, lon);
  const financials = buildFinancialForecast(makonScore, category, tScore, estimatedHouseholds);
  const hourly_traffic = buildCategoryHourlyTraffic(category, financials.daily_foot_traffic);

  return {
    coordinates: coords,
    business_category: category,
    radius_meters: radiusMeters,
    makon_score: makonScore,
    status,
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
        lat: c.lat,
        lon: c.lon,
      })),
      nearest_metro: nearestMetro,
      major_anchors: nearbyAnchors.map((a) => ({
        name: a.name,
        category: a.category,
        distance_meters: Math.round(a.distance_meters),
        lat: a.lat,
        lon: a.lon,
      })),
      estimated_households: estimatedHouseholds,
      commercial_density_label:
        directCompetitors.length >= 3
          ? 'Yuqori'
          : directCompetitors.length >= 1
          ? "O'rtacha"
          : 'Erkin bozor (Past raqobat)',
      location_label: identity.location_label,
      district_name: identity.district_name,
      region_name: identity.region_name,
      financials,
      hourly_traffic,
    },
  };
}

/**
 * Generates an H3-style hexagonal polygon around a [lon, lat] center
 */
function buildHexPolygon(centerLon: number, centerLat: number, radiusMeters = 280): number[][] {
  const ring: number[][] = [];
  const latDegPerMeter = 1 / 111320;
  const lonDegPerMeter = 1 / (111320 * Math.cos((centerLat * Math.PI) / 180));

  for (let i = 0; i < 6; i++) {
    // Pointy-top hexagon orientation (30 deg offset)
    const angle = ((60 * i + 30) * Math.PI) / 180;
    const dx = radiusMeters * Math.cos(angle) * lonDegPerMeter;
    const dy = radiusMeters * Math.sin(angle) * latDegPerMeter;
    ring.push([centerLon + dx, centerLat + dy]);
  }
  ring.push(ring[0]);
  return ring;
}

/**
 * Generates live H3-style hexagonal spatial grid around the active inspection area + key hubs
 */
export function generateLocalHexagons(
  centerCoords: Coordinates,
  category: BusinessCategory,
  radiusMeters = 500
): HexFeature[] {
  const hexes: HexFeature[] = [];
  const hexRadiusM = 245;
  const latDegPerM = 1 / 111320;
  const lonDegPerM = 1 / (111320 * Math.cos((centerCoords.latitude * Math.PI) / 180));

  // Axial hex grid coordinates (q, r) for 3 rings around active point (37 hexagons)
  const rings = 3;
  const size = hexRadiusM * 1.04;

  let idx = 0;
  for (let q = -rings; q <= rings; q++) {
    const r1 = Math.max(-rings, -q - rings);
    const r2 = Math.min(rings, -q + rings);
    for (let r = r1; r <= r2; r++) {
      const xMeters = size * Math.sqrt(3) * (q + r / 2);
      const yMeters = size * (3 / 2) * r;

      const lat = centerCoords.latitude + yMeters * latDegPerM;
      const lon = centerCoords.longitude + xMeters * lonDegPerM;

      const evalRes = calculateLocalSpatialScore(
        { latitude: lat, longitude: lon },
        category,
        radiusMeters
      );

      const score = evalRes.makon_score;
      const tier: 'high' | 'medium' | 'low' =
        score >= 80 ? 'high' : score >= 58 ? 'medium' : 'low';

      hexes.push({
        id: `hex-local-${idx++}`,
        center: [lon, lat],
        coordinates: [buildHexPolygon(lon, lat, hexRadiusM * 0.96)],
        score,
        tier,
        label: evalRes.context.location_label,
      });
    }
  }

  return hexes;
}

export function getClientPoisGeoJSON() {
  return CLIENT_POIS.map((p) => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [p.lon, p.lat],
    },
    properties: {
      id: p.id,
      name: p.name,
      category: p.category,
      brand: p.brand,
    },
  }));
}

export function getClientTransitGeoJSON() {
  return CLIENT_TRANSIT.map((t) => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [t.lon, t.lat],
    },
    properties: {
      id: t.id,
      name: t.name,
      transit_type: t.transit_type,
      line_name: t.line_name,
      passenger_flow_score: t.passenger_flow_score,
    },
  }));
}

/**
 * Scans strategic candidate locations across Tashkent & regions to recommend the highest-scoring spots for the active category
 */
export function scanTopHotspots(
  category: BusinessCategory,
  radiusMeters: number
): HotspotCandidate[] {
  const candidates = KNOWN_DISTRICTS.map((zone, idx) => {
    const res = calculateLocalSpatialScore(
      { latitude: zone.lat, longitude: zone.lon },
      category,
      radiusMeters
    );
    const fin = res.context.financials!;
    const revMinK = Math.round(fin.monthly_revenue_min_usd / 1000);
    const revMaxK = Math.round(fin.monthly_revenue_max_usd / 1000);

    let highlightReason = "Muvozanatlashgan tranzit va aholi zichligi";
    if (res.factors.transit_score >= 90 && res.context.direct_competitors_count <= 1) {
      highlightReason = "Maksimal metro tranziti + bo'sh bozor nisbati";
    } else if (res.factors.anchor_score >= 88) {
      highlightReason = "Yirik savdo/universitet magnitlari markazi";
    } else if (res.factors.residential_density_score >= 88) {
      highlightReason = "Yuqori xarid qobiliyatli zich turar-joy massivi";
    }

    return {
      id: `hotspot-${idx}`,
      name: zone.name,
      district: zone.district,
      region: zone.region,
      coordinates: { latitude: zone.lat, longitude: zone.lon },
      score: res.makon_score,
      status: res.status,
      dailyTraffic: fin.daily_foot_traffic,
      monthlyRevenueRange: `$${revMinK}k – $${revMaxK}k`,
      competitorsCount: res.context.direct_competitors_count,
      nearestMetroName: res.context.nearest_metro?.name || null,
      highlightReason,
    };
  });

  return candidates.sort((a, b) => b.score - a.score);
}
