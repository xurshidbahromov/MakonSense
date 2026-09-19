import math
import logging
from typing import List, Dict, Any, Optional
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import check_db_connection

logger = logging.getLogger("makonsense.spatial")

# Earth radius in meters
EARTH_RADIUS_METERS = 6371000.0


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Computes geodesic distance between two points in meters using Haversine formula."""
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (math.sin(delta_phi / 2.0) ** 2) + (
        math.cos(phi1) * math.cos(phi2) * (math.sin(delta_lambda / 2.0) ** 2)
    )
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return EARTH_RADIUS_METERS * c


# Embedded Tashkent Dataset for Fallback Spatial Engine
TASHKENT_TRANSIT_SEED = [
    {"id": 1, "name": "Amir Temur Xiyoboni", "transit_type": "metro_station", "line_name": "Chilonzor yo'nalishi", "passenger_flow_score": 95, "lat": 41.3123, "lon": 69.2797},
    {"id": 2, "name": "Yunus Rajabiy", "transit_type": "metro_station", "line_name": "Yunusobod yo'nalishi", "passenger_flow_score": 92, "lat": 41.3129, "lon": 69.2810},
    {"id": 3, "name": "Mustaqillik Maydoni", "transit_type": "metro_station", "line_name": "Chilonzor yo'nalishi", "passenger_flow_score": 88, "lat": 41.3167, "lon": 69.2687},
    {"id": 4, "name": "Paxtakor", "transit_type": "metro_station", "line_name": "Chilonzor yo'nalishi", "passenger_flow_score": 90, "lat": 41.3134, "lon": 69.2536},
    {"id": 5, "name": "Alisher Navoiy", "transit_type": "metro_station", "line_name": "O'zbekiston yo'nalishi", "passenger_flow_score": 90, "lat": 41.3142, "lon": 69.2528},
    {"id": 6, "name": "Oybek", "transit_type": "metro_station", "line_name": "O'zbekiston yo'nalishi", "passenger_flow_score": 94, "lat": 41.2981, "lon": 69.2783},
    {"id": 7, "name": "Ming O'rik", "transit_type": "metro_station", "line_name": "Yunusobod yo'nalishi", "passenger_flow_score": 90, "lat": 41.2974, "lon": 69.2792},
    {"id": 8, "name": "Chilonzor", "transit_type": "metro_station", "line_name": "Chilonzor yo'nalishi", "passenger_flow_score": 95, "lat": 41.2728, "lon": 69.2062},
    {"id": 9, "name": "Novza", "transit_type": "metro_station", "line_name": "Chilonzor yo'nalishi", "passenger_flow_score": 87, "lat": 41.2917, "lon": 69.2273},
    {"id": 10, "name": "Mirzo Ulug'bek", "transit_type": "metro_station", "line_name": "Chilonzor yo'nalishi", "passenger_flow_score": 85, "lat": 41.2829, "lon": 69.2155},
    {"id": 11, "name": "Buyuk Ipak Yo'li", "transit_type": "metro_station", "line_name": "Chilonzor yo'nalishi", "passenger_flow_score": 93, "lat": 41.3262, "lon": 69.3347},
    {"id": 12, "name": "Pushkin", "transit_type": "metro_station", "line_name": "Chilonzor yo'nalishi", "passenger_flow_score": 78, "lat": 41.3228, "lon": 69.3195},
    {"id": 13, "name": "Beruniy", "transit_type": "metro_station", "line_name": "O'zbekiston yo'nalishi", "passenger_flow_score": 89, "lat": 41.3444, "lon": 69.2058},
    {"id": 14, "name": "Chorsu", "transit_type": "metro_station", "line_name": "O'zbekiston yo'nalishi", "passenger_flow_score": 96, "lat": 41.3275, "lon": 69.2359},
    {"id": 15, "name": "Bodomzor", "transit_type": "metro_station", "line_name": "Yunusobod yo'nalishi", "passenger_flow_score": 82, "lat": 41.3364, "lon": 69.2842},
    {"id": 16, "name": "Shahriston", "transit_type": "metro_station", "line_name": "Yunusobod yo'nalishi", "passenger_flow_score": 88, "lat": 41.3541, "lon": 69.2883},
    {"id": 17, "name": "Yunusobod", "transit_type": "metro_station", "line_name": "Yunusobod yo'nalishi", "passenger_flow_score": 86, "lat": 41.3654, "lon": 69.2907},
    {"id": 18, "name": "Turkiston", "transit_type": "metro_station", "line_name": "Yunusobod yo'nalishi", "passenger_flow_score": 80, "lat": 41.3789, "lon": 69.2929},
    {"id": 19, "name": "Kosmonavtlar", "transit_type": "metro_station", "line_name": "O'zbekiston yo'nalishi", "passenger_flow_score": 84, "lat": 41.3061, "lon": 69.2662},
    {"id": 20, "name": "Toshkent Shimoliy Vokzal", "transit_type": "major_hub", "line_name": "Temiryo'l vokzali", "passenger_flow_score": 92, "lat": 41.2917, "lon": 69.2841}
]

TASHKENT_POIS_SEED = [
    # Universities
    {"id": 101, "name": "O'zbekiston Milliy Universiteti (NUUz)", "category": "university", "sub_category": "higher_education", "brand": None, "address": "Talabalar shaharchasi", "lat": 41.3501, "lon": 69.2069},
    {"id": 102, "name": "Toshkent Davlat Iqtisodiyot Universiteti (TDIU)", "category": "university", "sub_category": "higher_education", "brand": None, "address": "Islom Karimov ko'chasi, 49", "lat": 41.3094, "lon": 69.2554},
    {"id": 103, "name": "Westminster Xalqaro Universiteti (WIUT)", "category": "university", "sub_category": "higher_education", "brand": None, "address": "Istiqbol ko'chasi, 12", "lat": 41.3079, "lon": 69.2828},
    {"id": 104, "name": "Toshkent Axborot Texnologiyalari Universiteti (TATU)", "category": "university", "sub_category": "higher_education", "brand": None, "address": "Amir Temur shoh ko'chasi, 108", "lat": 41.3418, "lon": 69.2858},
    {"id": 105, "name": "Inha Universiteti", "category": "university", "sub_category": "higher_education", "brand": None, "address": "Ziyolilar ko'chasi, 9", "lat": 41.3385, "lon": 69.3338},

    # Malls & Bazaars
    {"id": 201, "name": "Tashkent City Mall", "category": "mall", "sub_category": "shopping_center", "brand": "Tashkent City Mall", "address": "Botir Zokirov ko'chasi", "lat": 41.3142, "lon": 69.2483},
    {"id": 202, "name": "Next Mall", "category": "mall", "sub_category": "shopping_center", "brand": "Next", "address": "Bobur ko'chasi, 6", "lat": 41.2989, "lon": 69.2536},
    {"id": 203, "name": "Samarqand Darvoza Mall", "category": "mall", "sub_category": "shopping_center", "brand": "Samarqand Darvoza", "address": "Qoratosh ko'chasi, 5A", "lat": 41.3168, "lon": 69.2274},
    {"id": 204, "name": "Compass Mall", "category": "mall", "sub_category": "shopping_center", "brand": "Compass", "address": "Toshkent halqa yo'li", "lat": 41.2427, "lon": 69.3371},
    {"id": 205, "name": "Chorsu Bozori", "category": "bazaar", "sub_category": "public_market", "brand": None, "address": "Navoiy ko'chasi", "lat": 41.3271, "lon": 69.2346},
    {"id": 206, "name": "Oloy Bozori", "category": "bazaar", "sub_category": "public_market", "brand": None, "address": "Amir Temur shoh ko'chasi", "lat": 41.3204, "lon": 69.2847},
    {"id": 207, "name": "Mirobod Bozori", "category": "bazaar", "sub_category": "public_market", "brand": None, "address": "Nukus ko'chasi", "lat": 41.2952, "lon": 69.2741},
    {"id": 208, "name": "Magic City Park & Retail", "category": "mall", "sub_category": "entertainment_retail", "brand": "Magic City", "address": "Bobur ko'chasi, 174", "lat": 41.3033, "lon": 69.2458},

    # Cafes
    {"id": 301, "name": "Safia Cafe & Bakery - Amir Temur", "category": "cafe", "sub_category": "bakery_cafe", "brand": "Safia", "address": "Amir Temur xiyoboni", "lat": 41.3115, "lon": 69.2812},
    {"id": 302, "name": "Safia Cafe & Bakery - Oybek", "category": "cafe", "sub_category": "bakery_cafe", "brand": "Safia", "address": "Oybek ko'chasi, 24", "lat": 41.2995, "lon": 69.2775},
    {"id": 303, "name": "Safia Cafe & Bakery - Chilonzor", "category": "cafe", "sub_category": "bakery_cafe", "brand": "Safia", "address": "Chilonzor metro bekati yonida", "lat": 41.2736, "lon": 69.2075},
    {"id": 304, "name": "Bon! Cafe - Chekhov", "category": "cafe", "sub_category": "french_cafe", "brand": "Bon!", "address": "Chekhov ko'chasi, 21", "lat": 41.3031, "lon": 69.2762},
    {"id": 305, "name": "Breadly Boulangerie", "category": "cafe", "sub_category": "bakery_cafe", "brand": "Breadly", "address": "Mirabad Avenue", "lat": 41.2965, "lon": 69.2721},
    {"id": 306, "name": "B&B Coffee House", "category": "cafe", "sub_category": "specialty_coffee", "brand": "B&B", "address": "Shota Rustaveli, 38", "lat": 41.2934, "lon": 69.2612},
    {"id": 307, "name": "Dodo Pizza - Markaz", "category": "cafe", "sub_category": "pizzeria", "brand": "Dodo Pizza", "address": "Sayilgoh (Broadway)", "lat": 41.3138, "lon": 69.2731},
    {"id": 308, "name": "Dodo Pizza - Novza", "category": "cafe", "sub_category": "pizzeria", "brand": "Dodo Pizza", "address": "Muqimiy ko'chasi", "lat": 41.2925, "lon": 69.2281},
    {"id": 309, "name": "Bellissimo Pizza - C-1", "category": "cafe", "sub_category": "pizzeria", "brand": "Bellissimo", "address": "Mustaqillik shoh ko'chasi", "lat": 41.3175, "lon": 69.2872},
    {"id": 310, "name": "Evos Fast Food - Amir Temur", "category": "cafe", "sub_category": "fast_food", "brand": "Evos", "address": "Amir Temur ko'chasi", "lat": 41.3145, "lon": 69.2789},
    {"id": 311, "name": "Oqtepa Lavash - Chilonzor", "category": "cafe", "sub_category": "fast_food", "brand": "Oqtepa Lavash", "address": "Katta Chilonzor ko'chasi", "lat": 41.2748, "lon": 69.2089},

    # Pharmacies
    {"id": 401, "name": "Grand Pharm - Markaziy", "category": "pharmacy", "sub_category": "chain_pharmacy", "brand": "Grand Pharm", "address": "Amir Temur xiyoboni", "lat": 41.3128, "lon": 69.2805},
    {"id": 402, "name": "Grand Pharm - Oybek", "category": "pharmacy", "sub_category": "chain_pharmacy", "brand": "Grand Pharm", "address": "Nukus ko'chasi, 42", "lat": 41.2969, "lon": 69.2798},
    {"id": 403, "name": "OXYmed Dorixona - Chilonzor", "category": "pharmacy", "sub_category": "chain_pharmacy", "brand": "OXYmed", "address": "Chilonzor 9-mavze", "lat": 41.2718, "lon": 69.2051},
    {"id": 404, "name": "999 Dorixona - Novza", "category": "pharmacy", "sub_category": "independent_pharmacy", "brand": "999 Pharm", "address": "Bunyodkor shoh ko'chasi", "lat": 41.2908, "lon": 69.2265},
    {"id": 405, "name": "Tabletka Dorixona - Mirobod", "category": "pharmacy", "sub_category": "chain_pharmacy", "brand": "Tabletka", "address": "Mirobod ko'chasi", "lat": 41.2980, "lon": 69.2715},
    {"id": 406, "name": "Grand Pharm - Yunusobod 4", "category": "pharmacy", "sub_category": "chain_pharmacy", "brand": "Grand Pharm", "address": "Ahmad Donish ko'chasi", "lat": 41.3562, "lon": 69.2891},

    # Supermarkets
    {"id": 501, "name": "Korzinka - Turkkurgan", "category": "supermarket", "sub_category": "grocery_chain", "brand": "Korzinka", "address": "Amir Temur shoh ko'chasi, 60", "lat": 41.3218, "lon": 69.2831},
    {"id": 502, "name": "Korzinka - Abay", "category": "supermarket", "sub_category": "grocery_chain", "brand": "Korzinka", "address": "Abay ko'chasi", "lat": 41.3198, "lon": 69.2559},
    {"id": 503, "name": "Korzinka - Next", "category": "supermarket", "sub_category": "grocery_chain", "brand": "Korzinka", "address": "Next Mall ichida", "lat": 41.2991, "lon": 69.2539},
    {"id": 504, "name": "Korzinka - Chilonzor", "category": "supermarket", "sub_category": "grocery_chain", "brand": "Korzinka", "address": "Chilonzor metro bekati", "lat": 41.2721, "lon": 69.2081},
    {"id": 505, "name": "Makro Supermarket - Mirobod", "category": "supermarket", "sub_category": "grocery_chain", "brand": "Makro", "address": "Nukus ko'chasi", "lat": 41.2941, "lon": 69.2758},
    {"id": 506, "name": "Havas Discounter - Novza", "category": "supermarket", "sub_category": "discount_retail", "brand": "Havas", "address": "Muqimiy ko'chasi", "lat": 41.2912, "lon": 69.2295},
    {"id": 507, "name": "Havas Discounter - Yunusobod", "category": "supermarket", "sub_category": "discount_retail", "brand": "Havas", "address": "Yunusobod 11-mavze", "lat": 41.3725, "lon": 69.2941},

    # Schools
    {"id": 601, "name": "Cambridge International School", "category": "school", "sub_category": "international_school", "brand": "CIS", "address": "Tashkent City, Shayxontohur", "lat": 41.3162, "lon": 69.2471},
    {"id": 602, "name": "Prezident Maktabi", "category": "school", "sub_category": "specialized_school", "brand": None, "address": "Mustaqillik shoh ko'chasi", "lat": 41.3289, "lon": 69.3245},
    {"id": 603, "name": "110-sonli Ixtisoslashtirilgan Maktab", "category": "school", "sub_category": "state_school", "brand": None, "address": "Mirobod tumani", "lat": 41.3005, "lon": 69.2735},
    {"id": 604, "name": "British School of Tashkent", "category": "school", "sub_category": "international_school", "brand": "BST", "address": "Mirzo Ulug'bek tumani", "lat": 41.3321, "lon": 69.3142}
]

TASHKENT_RESIDENTIAL_SEED = [
    {"id": 1, "name": "Tashkent City - Boulevard & Gardens", "developer": "Dream City", "units_count": 3200, "lat": 41.3150, "lon": 69.2485},
    {"id": 2, "name": "Mirabad Avenue", "developer": "Golden House", "units_count": 1600, "lat": 41.2960, "lon": 69.2730},
    {"id": 3, "name": "Novza Residence", "developer": "Golden House", "units_count": 950, "lat": 41.2910, "lon": 69.2280},
    {"id": 4, "name": "Greenwich Turar-joy Majmuasi", "developer": "Golden House", "units_count": 2100, "lat": 41.2905, "lon": 69.3085},
    {"id": 5, "name": "Infinity Premium Residence", "developer": "Golden House", "units_count": 820, "lat": 41.3110, "lon": 69.2875},
    {"id": 6, "name": "NRG Oybek", "developer": "NRG Uzbekistan", "units_count": 640, "lat": 41.2985, "lon": 69.2775}
]


class SpatialQueryService:
    """Provides spatial queries with automatic PostGIS execution and fast in-memory fallback."""

    @classmethod
    async def get_nearby_transit(
        cls, db: Optional[AsyncSession], lat: float, lon: float, radius_meters: float = 500.0
    ) -> List[Dict[str, Any]]:
        """Finds transit stations within radius_meters."""
        has_pg = await check_db_connection()
        if has_pg and db is not None:
            try:
                query = text("""
                    SELECT id, name, transit_type, line_name, passenger_flow_score,
                           ST_Distance(geom::geography, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography) AS distance_meters
                    FROM transit_stops
                    WHERE ST_DWithin(geom::geography, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography, :radius)
                    ORDER BY distance_meters ASC;
                """)
                result = await db.execute(query, {"lat": lat, "lon": lon, "radius": radius_meters})
                rows = result.mappings().all()
                return [dict(r) for r in rows]
            except Exception as e:
                logger.warning(f"PostGIS transit query error: {e}. Using fallback.")

        # Fallback in-memory spatial search
        results = []
        for stop in TASHKENT_TRANSIT_SEED:
            dist = haversine_distance(lat, lon, stop["lat"], stop["lon"])
            if dist <= radius_meters:
                item = dict(stop)
                item["distance_meters"] = round(dist, 1)
                results.append(item)
        results.sort(key=lambda x: x["distance_meters"])
        return results

    @classmethod
    async def get_nearby_anchors(
        cls, db: Optional[AsyncSession], lat: float, lon: float, radius_meters: float = 800.0
    ) -> List[Dict[str, Any]]:
        """Finds anchor generators (malls, universities, bazaars, schools) within radius."""
        anchor_categories = ("university", "mall", "bazaar", "school")
        has_pg = await check_db_connection()
        if has_pg and db is not None:
            try:
                query = text("""
                    SELECT id, name, category, sub_category, brand, address,
                           ST_Distance(geom::geography, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography) AS distance_meters
                    FROM pois
                    WHERE category IN :categories
                      AND ST_DWithin(geom::geography, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography, :radius)
                    ORDER BY distance_meters ASC;
                """)
                result = await db.execute(
                    query,
                    {"lat": lat, "lon": lon, "radius": radius_meters, "categories": anchor_categories},
                )
                return [dict(r) for r in result.mappings().all()]
            except Exception as e:
                logger.warning(f"PostGIS anchor query error: {e}. Using fallback.")

        # Fallback
        results = []
        for poi in TASHKENT_POIS_SEED:
            if poi["category"] in anchor_categories:
                dist = haversine_distance(lat, lon, poi["lat"], poi["lon"])
                if dist <= radius_meters:
                    item = dict(poi)
                    item["distance_meters"] = round(dist, 1)
                    results.append(item)
        results.sort(key=lambda x: x["distance_meters"])
        return results

    @classmethod
    async def get_nearby_competitors(
        cls, db: Optional[AsyncSession], lat: float, lon: float, category: str, radius_meters: float = 400.0
    ) -> List[Dict[str, Any]]:
        """Finds direct competitors in the same category within radius."""
        has_pg = await check_db_connection()
        if has_pg and db is not None:
            try:
                query = text("""
                    SELECT id, name, category, sub_category, brand, address,
                           ST_Distance(geom::geography, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography) AS distance_meters
                    FROM pois
                    WHERE category = :category
                      AND ST_DWithin(geom::geography, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography, :radius)
                    ORDER BY distance_meters ASC;
                """)
                result = await db.execute(
                    query,
                    {"lat": lat, "lon": lon, "radius": radius_meters, "category": category.lower()},
                )
                return [dict(r) for r in result.mappings().all()]
            except Exception as e:
                logger.warning(f"PostGIS competitor query error: {e}. Using fallback.")

        # Fallback
        results = []
        target_cat = category.lower().strip()
        for poi in TASHKENT_POIS_SEED:
            if poi["category"].lower() == target_cat:
                dist = haversine_distance(lat, lon, poi["lat"], poi["lon"])
                if dist <= radius_meters:
                    item = dict(poi)
                    item["distance_meters"] = round(dist, 1)
                    results.append(item)
        results.sort(key=lambda x: x["distance_meters"])
        return results

    @classmethod
    async def get_nearby_residential(
        cls, db: Optional[AsyncSession], lat: float, lon: float, radius_meters: float = 600.0
    ) -> List[Dict[str, Any]]:
        """Finds residential complexes and estimated unit counts within radius."""
        has_pg = await check_db_connection()
        if has_pg and db is not None:
            try:
                query = text("""
                    SELECT id, name, developer, units_count, completion_year, status,
                           ST_Distance(geom::geography, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography) AS distance_meters
                    FROM residential_complexes
                    WHERE ST_DWithin(geom::geography, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography, :radius)
                    ORDER BY distance_meters ASC;
                """)
                result = await db.execute(query, {"lat": lat, "lon": lon, "radius": radius_meters})
                return [dict(r) for r in result.mappings().all()]
            except Exception as e:
                logger.warning(f"PostGIS residential query error: {e}. Using fallback.")

        # Fallback
        results = []
        for res in TASHKENT_RESIDENTIAL_SEED:
            dist = haversine_distance(lat, lon, res["lat"], res["lon"])
            if dist <= radius_meters:
                item = dict(res)
                item["distance_meters"] = round(dist, 1)
                results.append(item)
        results.sort(key=lambda x: x["distance_meters"])
        return results

    @classmethod
    def get_all_pois(cls) -> List[Dict[str, Any]]:
        """Returns all seeded POIs for map visualization."""
        return list(TASHKENT_POIS_SEED)

    @classmethod
    def get_all_transit(cls) -> List[Dict[str, Any]]:
        """Returns all seeded transit stops for map visualization."""
        return list(TASHKENT_TRANSIT_SEED)
