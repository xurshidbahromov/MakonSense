CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- 1. POI va Raqobatchilar bazasi
CREATE TABLE IF NOT EXISTS pois (
    id BIGSERIAL PRIMARY KEY,
    osm_id BIGINT UNIQUE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'cafe', 'pharmacy', 'supermarket', 'school', 'university', 'bazaar', 'mall', 'retail'
    sub_category VARCHAR(100),
    brand VARCHAR(100),
    address TEXT,
    geom GEOMETRY(Point, 4326) NOT NULL,
    h3_index_res9 VARCHAR(15),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pois_geom ON pois USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_pois_category ON pois (category);
CREATE INDEX IF NOT EXISTS idx_pois_h3 ON pois (h3_index_res9);

-- 2. Jamoat transporti va tranzit tugunlari
CREATE TABLE IF NOT EXISTS transit_stops (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    transit_type VARCHAR(50) NOT NULL, -- 'metro_station', 'bus_terminal', 'major_hub'
    line_name VARCHAR(100),
    passenger_flow_score INT DEFAULT 50, -- 1 dan 100 gacha shartli trafik
    geom GEOMETRY(Point, 4326) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_transit_geom ON transit_stops USING GIST (geom);

-- 3. Yangi turar-joy massivlari (2022-2026)
CREATE TABLE IF NOT EXISTS residential_complexes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    developer VARCHAR(150),
    units_count INT DEFAULT 0,
    completion_year INT,
    status VARCHAR(50) DEFAULT 'completed', -- 'completed', 'under_construction'
    geom GEOMETRY(MultiPolygon, 4326) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_res_geom ON residential_complexes USING GIST (geom);

-- 4. Martin Tile Server uchun MVT funksiyasi
CREATE OR REPLACE FUNCTION public.pois_mvt(z integer, x integer, y integer)
RETURNS bytea AS $$
DECLARE
    result bytea;
BEGIN
    WITH bbox AS (
        SELECT ST_TileEnvelope(z, x, y) AS geom
    ),
    mvtdata AS (
        SELECT 
            p.id,
            p.name,
            p.category,
            p.brand,
            ST_AsMVTGeom(ST_Transform(p.geom, 3857), bbox.geom) AS geom
        FROM pois p, bbox
        WHERE ST_Intersects(ST_Transform(p.geom, 3857), bbox.geom)
    )
    SELECT ST_AsMVT(mvtdata.*, 'default') INTO result FROM mvtdata;
    RETURN result;
END;
$$ LANGUAGE plpgsql STABLE PARALLEL SAFE;

-- ============================================================================
-- SEED DATA: Toshkent Shahri Real Fazoviy Obyektlari (Transit, POI, Anchors)
-- ============================================================================

-- Transit Stops: Metro Stations (Toshkent Metropoliteni)
INSERT INTO transit_stops (name, transit_type, line_name, passenger_flow_score, geom) VALUES
('Amir Temur Xiyoboni', 'metro_station', 'Chilonzor yo''nalishi', 95, ST_SetSRID(ST_MakePoint(69.2797, 41.3123), 4326)),
('Yunus Rajabiy', 'metro_station', 'Yunusobod yo''nalishi', 92, ST_SetSRID(ST_MakePoint(69.2810, 41.3129), 4326)),
('Mustaqillik Maydoni', 'metro_station', 'Chilonzor yo''nalishi', 88, ST_SetSRID(ST_MakePoint(69.2687, 41.3167), 4326)),
('Paxtakor', 'metro_station', 'Chilonzor yo''nalishi', 90, ST_SetSRID(ST_MakePoint(69.2536, 41.3134), 4326)),
('Alisher Navoiy', 'metro_station', 'O''zbekiston yo''nalishi', 90, ST_SetSRID(ST_MakePoint(69.2528, 41.3142), 4326)),
('Oybek', 'metro_station', 'O''zbekiston yo''nalishi', 94, ST_SetSRID(ST_MakePoint(69.2783, 41.2981), 4326)),
('Ming O''rik', 'metro_station', 'Yunusobod yo''nalishi', 90, ST_SetSRID(ST_MakePoint(69.2792, 41.2974), 4326)),
('Chilonzor', 'metro_station', 'Chilonzor yo''nalishi', 95, ST_SetSRID(ST_MakePoint(69.2062, 41.2728), 4326)),
('Novza', 'metro_station', 'Chilonzor yo''nalishi', 87, ST_SetSRID(ST_MakePoint(69.2273, 41.2917), 4326)),
('Mirzo Ulug''bek', 'metro_station', 'Chilonzor yo''nalishi', 85, ST_SetSRID(ST_MakePoint(69.2155, 41.2829), 4326)),
('Buyuk Ipak Yo''li', 'metro_station', 'Chilonzor yo''nalishi', 93, ST_SetSRID(ST_MakePoint(69.3347, 41.3262), 4326)),
('Pushkin', 'metro_station', 'Chilonzor yo''nalishi', 78, ST_SetSRID(ST_MakePoint(69.3195, 41.3228), 4326)),
('Beruniy', 'metro_station', 'O''zbekiston yo''nalishi', 89, ST_SetSRID(ST_MakePoint(69.2058, 41.3444), 4326)),
('Chorsu', 'metro_station', 'O''zbekiston yo''nalishi', 96, ST_SetSRID(ST_MakePoint(69.2359, 41.3275), 4326)),
('Bodomzor', 'metro_station', 'Yunusobod yo''nalishi', 82, ST_SetSRID(ST_MakePoint(69.2842, 41.3364), 4326)),
('Shahriston', 'metro_station', 'Yunusobod yo''nalishi', 88, ST_SetSRID(ST_MakePoint(69.2883, 41.3541), 4326)),
('Yunusobod', 'metro_station', 'Yunusobod yo''nalishi', 86, ST_SetSRID(ST_MakePoint(69.2907, 41.3654), 4326)),
('Turkiston', 'metro_station', 'Yunusobod yo''nalishi', 80, ST_SetSRID(ST_MakePoint(69.2929, 41.3789), 4326)),
('Kosmonavtlar', 'metro_station', 'O''zbekiston yo''nalishi', 84, ST_SetSRID(ST_MakePoint(69.2662, 41.3061), 4326)),
('Toshkent Shimoliy Vokzal', 'major_hub', 'Temiryo''l vokzali', 92, ST_SetSRID(ST_MakePoint(69.2841, 41.2917), 4326))
ON CONFLICT DO NOTHING;

-- POIs: Malls, Bazaars, Universities (Anchors) + Cafes, Supermarkets, Pharmacies
INSERT INTO pois (osm_id, name, category, sub_category, brand, address, geom) VALUES
-- Anchors (Universities)
(101, 'O''zbekiston Milliy Universiteti (NUUz)', 'university', 'higher_education', NULL, 'Talabalar shaharchasi, Universitet ko''chasi', ST_SetSRID(ST_MakePoint(69.2069, 41.3501), 4326)),
(102, 'Toshkent Davlat Iqtisodiyot Universiteti (TDIU)', 'university', 'higher_education', NULL, 'Islom Karimov ko''chasi, 49', ST_SetSRID(ST_MakePoint(69.2554, 41.3094), 4326)),
(103, 'Westminster Xalqaro Universiteti (WIUT)', 'university', 'higher_education', NULL, 'Istiqbol ko''chasi, 12', ST_SetSRID(ST_MakePoint(69.2828, 41.3079), 4326)),
(104, 'Toshkent Axborot Texnologiyalari Universiteti (TATU)', 'university', 'higher_education', NULL, 'Amir Temur shoh ko''chasi, 108', ST_SetSRID(ST_MakePoint(69.2858, 41.3418), 4326)),
(105, 'Inha Universiteti', 'university', 'higher_education', NULL, 'Ziyolilar ko''chasi, 9', ST_SetSRID(ST_MakePoint(69.3338, 41.3385), 4326)),

-- Anchors (Malls & Bazaars)
(201, 'Tashkent City Mall', 'mall', 'shopping_center', 'Tashkent City Mall', 'Botir Zokirov ko''chasi', ST_SetSRID(ST_MakePoint(69.2483, 41.3142), 4326)),
(202, 'Next Mall', 'mall', 'shopping_center', 'Next', 'Bobur ko''chasi, 6', ST_SetSRID(ST_MakePoint(69.2536, 41.2989), 4326)),
(203, 'Samarqand Darvoza Mall', 'mall', 'shopping_center', 'Samarqand Darvoza', 'Qoratosh ko''chasi, 5A', ST_SetSRID(ST_MakePoint(69.2274, 41.3168), 4326)),
(204, 'Compass Mall', 'mall', 'shopping_center', 'Compass', 'Toshkent halqa yo''li', ST_SetSRID(ST_MakePoint(69.3371, 41.2427), 4326)),
(205, 'Chorsu Bozori', 'bazaar', 'public_market', NULL, 'Navoiy ko''chasi', ST_SetSRID(ST_MakePoint(69.2346, 41.3271), 4326)),
(206, 'Oloy Bozori', 'bazaar', 'public_market', NULL, 'Amir Temur shoh ko''chasi', ST_SetSRID(ST_MakePoint(69.2847, 41.3204), 4326)),
(207, 'Mirobod Bozori', 'bazaar', 'public_market', NULL, 'Nukus ko''chasi', ST_SetSRID(ST_MakePoint(69.2741, 41.2952), 4326)),
(208, 'Magic City Park & Retail', 'mall', 'entertainment_retail', 'Magic City', 'Bobur ko''chasi, 174', ST_SetSRID(ST_MakePoint(69.2458, 41.3033), 4326)),

-- Commercial POIs: Cafes & Restaurants
(301, 'Safia Cafe & Bakery - Amir Temur', 'cafe', 'bakery_cafe', 'Safia', 'Amir Temur xiyoboni', ST_SetSRID(ST_MakePoint(69.2812, 41.3115), 4326)),
(302, 'Safia Cafe & Bakery - Oybek', 'cafe', 'bakery_cafe', 'Safia', 'Oybek ko''chasi, 24', ST_SetSRID(ST_MakePoint(69.2775, 41.2995), 4326)),
(303, 'Safia Cafe & Bakery - Chilonzor', 'cafe', 'bakery_cafe', 'Safia', 'Chilonzor metro bekati yonida', ST_SetSRID(ST_MakePoint(69.2075, 41.2736), 4326)),
(304, 'Bon! Cafe - Chekhov', 'cafe', 'french_cafe', 'Bon!', 'Chekhov ko''chasi, 21', ST_SetSRID(ST_MakePoint(69.2762, 41.3031), 4326)),
(305, 'Breadly Boulangerie', 'cafe', 'bakery_cafe', 'Breadly', 'Mirabad Avenue', ST_SetSRID(ST_MakePoint(69.2721, 41.2965), 4326)),
(306, 'B&B Coffee House', 'cafe', 'specialty_coffee', 'B&B', 'Shota Rustaveli, 38', ST_SetSRID(ST_MakePoint(69.2612, 41.2934), 4326)),
(307, 'Dodo Pizza - Markaz', 'cafe', 'pizzeria', 'Dodo Pizza', 'Sayilgoh (Broadway)', ST_SetSRID(ST_MakePoint(69.2731, 41.3138), 4326)),
(308, 'Dodo Pizza - Novza', 'cafe', 'pizzeria', 'Dodo Pizza', 'Muqimiy ko''chasi', ST_SetSRID(ST_MakePoint(69.2281, 41.2925), 4326)),
(309, 'Bellissimo Pizza - C-1', 'cafe', 'pizzeria', 'Bellissimo', 'Mustaqillik shoh ko''chasi', ST_SetSRID(ST_MakePoint(69.2872, 41.3175), 4326)),
(310, 'Evos Fast Food - Amir Temur', 'cafe', 'fast_food', 'Evos', 'Amir Temur ko''chasi', ST_SetSRID(ST_MakePoint(69.2789, 41.3145), 4326)),
(311, 'Oqtepa Lavash - Chilonzor', 'cafe', 'fast_food', 'Oqtepa Lavash', 'Katta Chilonzor ko''chasi', ST_SetSRID(ST_MakePoint(69.2089, 41.2748), 4326)),

-- Commercial POIs: Pharmacies (Dorixonalar)
(401, 'Grand Pharm - Markaziy', 'pharmacy', 'chain_pharmacy', 'Grand Pharm', 'Amir Temur xiyoboni', ST_SetSRID(ST_MakePoint(69.2805, 41.3128), 4326)),
(402, 'Grand Pharm - Oybek', 'pharmacy', 'chain_pharmacy', 'Grand Pharm', 'Nukus ko''chasi, 42', ST_SetSRID(ST_MakePoint(69.2798, 41.2969), 4326)),
(403, 'OXYmed Dorixona - Chilonzor', 'pharmacy', 'chain_pharmacy', 'OXYmed', 'Chilonzor 9-mavze', ST_SetSRID(ST_MakePoint(69.2051, 41.2718), 4326)),
(404, '999 Dorixona - Novza', 'pharmacy', 'independent_pharmacy', '999 Pharm', 'Bunyodkor shoh ko''chasi', ST_SetSRID(ST_MakePoint(69.2265, 41.2908), 4326)),
(405, 'Tabletka Dorixona - Mirobod', 'pharmacy', 'chain_pharmacy', 'Tabletka', 'Mirobod ko''chasi', ST_SetSRID(ST_MakePoint(69.2715, 41.2980), 4326)),
(406, 'Grand Pharm - Yunusobod 4', 'pharmacy', 'chain_pharmacy', 'Grand Pharm', 'Ahmad Donish ko''chasi', ST_SetSRID(ST_MakePoint(69.2891, 41.3562), 4326)),

-- Commercial POIs: Supermarkets
(501, 'Korzinka - Turkkurgan', 'supermarket', 'grocery_chain', 'Korzinka', 'Amir Temur shoh ko''chasi, 60', ST_SetSRID(ST_MakePoint(69.2831, 41.3218), 4326)),
(502, 'Korzinka - Abay', 'supermarket', 'grocery_chain', 'Korzinka', 'Abay ko''chasi', ST_SetSRID(ST_MakePoint(69.2559, 41.3198), 4326)),
(503, 'Korzinka - Next', 'supermarket', 'grocery_chain', 'Korzinka', 'Next Mall ichida', ST_SetSRID(ST_MakePoint(69.2539, 41.2991), 4326)),
(504, 'Korzinka - Chilonzor', 'supermarket', 'grocery_chain', 'Korzinka', 'Chilonzor metro bekati', ST_SetSRID(ST_MakePoint(69.2081, 41.2721), 4326)),
(505, 'Makro Supermarket - Mirobod', 'supermarket', 'grocery_chain', 'Makro', 'Nukus ko''chasi', ST_SetSRID(ST_MakePoint(69.2758, 41.2941), 4326)),
(506, 'Havas Discounter - Novza', 'supermarket', 'discount_retail', 'Havas', 'Muqimiy ko''chasi', ST_SetSRID(ST_MakePoint(69.2295, 41.2912), 4326)),
(507, 'Havas Discounter - Yunusobod', 'supermarket', 'discount_retail', 'Havas', 'Yunusobod 11-mavze', ST_SetSRID(ST_MakePoint(69.2941, 41.3725), 4326)),

-- Education & Schools
(601, 'Cambridge International School', 'school', 'international_school', 'CIS', 'Tashkent City, Shayxontohur', ST_SetSRID(ST_MakePoint(69.2471, 41.3162), 4326)),
(602, 'Prezident Maktabi', 'school', 'specialized_school', NULL, 'Mustaqillik shoh ko''chasi', ST_SetSRID(ST_MakePoint(69.3245, 41.3289), 4326)),
(603, '110-sonli Ixtisoslashtirilgan Maktab', 'school', 'state_school', NULL, 'Mirobod tumani', ST_SetSRID(ST_MakePoint(69.2735, 41.3005), 4326)),
(604, 'British School of Tashkent', 'school', 'international_school', 'BST', 'Mirzo Ulug''bek tumani', ST_SetSRID(ST_MakePoint(69.3142, 41.3321), 4326))
ON CONFLICT (osm_id) DO NOTHING;

-- Turar-joy massivlari (Residential Complexes)
INSERT INTO residential_complexes (name, developer, units_count, completion_year, status, geom) VALUES
(
    'Tashkent City - Boulevard & Gardens',
    'Dream City Development',
    3200,
    2022,
    'completed',
    ST_Multi(ST_GeomFromText('POLYGON((69.2450 41.3120, 69.2520 41.3120, 69.2520 41.3180, 69.2450 41.3180, 69.2450 41.3120))', 4326))
),
(
    'Mirabad Avenue',
    'Golden House / First Development Group',
    1600,
    2023,
    'completed',
    ST_Multi(ST_GeomFromText('POLYGON((69.2700 41.2940, 69.2760 41.2940, 69.2760 41.2980, 69.2700 41.2980, 69.2700 41.2940))', 4326))
),
(
    'Novza Residence',
    'Golden House',
    950,
    2021,
    'completed',
    ST_Multi(ST_GeomFromText('POLYGON((69.2250 41.2890, 69.2310 41.2890, 69.2310 41.2930, 69.2250 41.2930, 69.2250 41.2890))', 4326))
),
(
    'Greenwich Turar-joy Majmuasi',
    'Golden House',
    2100,
    2023,
    'completed',
    ST_Multi(ST_GeomFromText('POLYGON((69.3050 41.2880, 69.3120 41.2880, 69.3120 41.2930, 69.3050 41.2930, 69.3050 41.2880))', 4326))
),
(
    'Infinity Premium Residence',
    'Golden House',
    820,
    2024,
    'completed',
    ST_Multi(ST_GeomFromText('POLYGON((69.2850 41.3090, 69.2900 41.3090, 69.2900 41.3130, 69.2850 41.3130, 69.2850 41.3090))', 4326))
),
(
    'NRG Oybek',
    'NRG Uzbekistan',
    640,
    2022,
    'completed',
    ST_Multi(ST_GeomFromText('POLYGON((69.2750 41.2970, 69.2800 41.2970, 69.2800 41.3000, 69.2750 41.3000, 69.2750 41.2970))', 4326))
)
ON CONFLICT DO NOTHING;
