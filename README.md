# MakonSense: Spatial Intelligence & Location Analytics Platform
> *"Spatial Intelligence for Urban Decisions"*  
> **Target Market:** Tashkent, Uzbekistan  
> **Version:** 1.0.0-MVP

---

## 📌 Loyiha Haqida

**MakonSense** — bu Toshkent shahrida tijoriy ko‘chmas mulk, chakana savdo (retail), umumiy ovqatlanish tarmoqlari va shaharsozlik loyihalari uchun fazoviy tahlillarni (Spatial Intelligence) amalga oshiruvchi innovatsion platforma.

Platforma berilgan koordinata va biznes toifasi bo‘yicha 0 dan 100 gacha bo‘lgan **MakonScore™** ko‘rsatkichini soniyalarda hisoblab beradi.

---

## 🚀 Texnologik Stek

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS (Dark Minimalist UI System).
- **Xarita va Render Dvigateli:** MapLibre GL JS, Deck.gl (`PolygonLayer`, `ScatterplotLayer`, `GeoJsonLayer`).
- **Backend API:** Python 3.11+, FastAPI (asinxron arxitektura), Pydantic v2, SQLAlchemy.
- **Geofazoviy Tahlil:** PostGIS 3.4, Shapely, Haversine Geodesic Engine, Uber H3 Indexing.
- **Tile Server:** Martin MVT Vector Tile Server (Rust asosida).
- **Infratuzilma:** Docker & Docker Compose.

---

## 📐 Algoritmik Yadro: MakonScore

$$MakonScore = \min\left(100, \max\left(0, \frac{w_t \cdot T + w_a \cdot A + w_r \cdot R}{w_t + w_a + w_r} - \text{Penalty}(C)\right)\right)$$

### 4 Asosiy Omil:
1. **$T$ (Transit & Foot-traffic Factor, vazni $w_t = 0.30$):** 500m radiusdagi metro bekatlari va yirik transport tugunlari.
2. **$A$ (Anchor Magnets Factor, vazni $w_a = 0.25$):** 800m radiusdagi oliygohlar, savdo majmualari (mall) va bozorlar.
3. **$C$ (Competition Density Factor, vazni $w_c = 0.25$):** 400m radiusdagi aynan bir xil toifadagi raqobatchilar soni va yaqinligi (ayiruvchi omil).
4. **$R$ (Residential Density Factor, vazni $w_r = 0.20$):** 600m radiusdagi xonadonlar va yangi massivlar sig‘imi.

---

## 🛠️ Tezkor Ishga Tushirish (Quickstart)

### Variant 1: Docker Compose Orqali (Tavsiya etiladi)

Barcha xizmatlarni (PostGIS, Martin Tile Server, FastAPI Backend, React Frontend) birgalikda ishga tushirish:

```bash
# 1. Repozitoriyani klonlash
git clone <repo-url>
cd MakonSense

# 2. Muhit parametrlarini sozlash
cp .env.example .env

# 3. Docker konteynerlarini ishga tushirish
docker compose up --build
```

- **Frontend Ilova:** `http://localhost:5173`
- **Backend API Docs:** `http://localhost:8000/docs`
- **Martin Tile Server:** `http://localhost:3000`
- **PostGIS Baza:** `localhost:5432`

---

### Variant 2: Lokal Ishga Tushirish (Standalone Local Dev)

Docker mavjud bo‘lmagan sharoitda ham MakonSense o‘rnatilgan *Embedded Spatial Fallback* orqali to‘liq ishlaydi:

#### Backend:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### Frontend:
```bash
cd frontend
npm install
npm run dev
```

---

## 📡 Asosiy API Endpointlar

- `POST /api/v1/analytics/inspect` — Berilgan koordinata va biznes toifasi bo‘yicha MakonScore hisoblash.
- `GET /api/v1/analytics/hexagons` — H3 geksagonal to‘ri va tumanlar reytingi.
- `GET /api/v1/poi/geojson` — Toshkent shahri POI va savdo nuqtalari GeoJSON formati.
- `GET /api/v1/poi/transit/geojson` — Toshkent metropoliteni bekatlari.
- `POST /api/v1/reports/audit` — 5 sahifalik to‘liq tijoriy audit va SWOT hisoboti (Pay-per-Report).
- `GET /api/v1/health` — Tizim holati va PostGIS aloqasi tekshiruvi.

---

## 🧪 Sinovlar (Testing)

```bash
# Backend testlarini yurgizish
python3 -m pytest backend/tests/
```
# MakonSense
