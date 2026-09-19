# MakonSense: Master Project Blueprint & Technical Specification
**Version:** 1.0.0-MVP  
**Domain:** Spatial Intelligence & Location Analytics Platform  
**Target Market:** Tashkent, Uzbekistan  
**Architecture:** Monorepo (FastAPI + React 19 + MapLibre/Deck.gl + PostGIS + Martin)

---

## 1. Executive Summary & Problem Statement

MakonSense — bu Toshkent shahrida tijoriy ko‘chmas mulk, chakana savdo tarmoqlari (retail) va shaharsozlik loyihalari uchun fazoviy tahlillarni (Spatial Intelligence) amalga oshiruvchi platforma.

* **Muammo:** Toshkentda yangi savdo va xizmat ko‘rsatish nuqtalarining (kafe, dorixona, do‘kon, o‘quv markazi) salmoqli qismi 6–12 oy ichida noto‘g‘ri lokatsiya sababli yopiladi. Joy tanlash hozirda subyektiv taxminlarga asoslangan bo‘lib, biznesga har bir xato nuqta uchun $20,000 dan $100,000 gacha zarar keltiradi.
* **Yechim:** PostGIS fazoviy tahlili, Uber H3 geksagonal to‘ri va mashinaviy hisob-kitoblar orqali istalgan nuqtaning tijoriy salohiyatini 0 dan 100 gacha bo‘lgan **MakonScore** reytingi orqali soniyalarda baholab beruvchi tizim.
* **Brend Shiori:** 
  * Global: *"Spatial Intelligence for Urban Decisions"*
  * Mahalliy: *"Shahar ma’lumotlari va joylashuv tahlili platformasi"*

---

## 2. Biznes Model va Monetizatsiya

| Mijoz Guruhi | Mahsulot Formati | Qiymat Taklifi | Narxlash Modeli |
|---|---|---|---|
| **Kichik va o‘rta biznes (B2B)** | Pay-per-Report (Avtomatik PDF Audit) | Tanlangan bitta nuqta bo‘yicha 5 sahifalik to‘liq xavf va potensial auditi | 350 000 – 600 000 UZS / 1 ta hisobot |
| **Yirik retail tarmoqlar (B2B)** | SaaS Web Platform (Interaktiv Xarita) | Doimiy monitoring, issiqlik xaritalari (heatmaps), to‘liq POI bazasi va cheksiz qidiruv | $300 – $1,200 / oyiga (Litsenziya) |
| **Developerlar va Davlat (B2G)** | Enterprise Maxsus Yechim | Infratuzilma yuklamasi, master-plan modellashtirish, yopiq server integratsiyasi | $10,000 – $50,000 / shartnoma |

---

## 3. Algoritmik Yadro: MakonScore Spetsifikatsiyasi

Har qanday berilgan koordinata $(lat, lon)$ va biznes toifasi uchun tijoriy salohiyat reytingi ($0 \le MakonScore \le 100$):

$$MakonScore = \min\left(100, \max\left(0, w_t \cdot T + w_a \cdot A - w_c \cdot C + w_r \cdot R\right)\right)$$

### Omillar va Hisoblash Qoidalari:
1. **$T$ (Transit & Foot-traffic Factor, vazni $w_t = 0.30$):** 500 metr radiusdagi metro bekatlari va yirik transport tugunlarigacha bo‘lgan masofaga qarab hisoblanadi:
   $$T = \sum_{i=1}^{n} \frac{Flow_i}{\max(1, Dist(p, t_i))}$$
2. **$A$ (Anchor Magnets Factor, vazni $w_a = 0.25$):** 800 metr radiusdagi odam oqimini jalb qiluvchi yirik obyektlar (oliygohlar, maktablar, bozorlar, savdo markazlari).
3. **$C$ (Competition Density Factor, vazni $w_c = 0.25$):** 400 metr radiusdagi aynan bir xil toifadagi raqobatchilar soni va yaqinligi (yakuniy balldan ayiruvchi omil).
4. **$R$ (Residential Density Factor, vazni $w_r = 0.20$):** 600 metr radiusdagi xonadonlar soni va yangi massivlar sig‘imi.
