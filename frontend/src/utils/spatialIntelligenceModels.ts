import { BusinessCategory, Coordinates, InspectResult } from '../types';
import { calculateLocalSpatialScore } from './clientSpatialEngine';

export interface HuffGravityAnalysis {
  marketSharePercent: number;
  cannibalizationRiskPercent: number;
  saturationLabel: string;
  competitorWeights: Array<{
    name: string;
    distanceMeters: number;
    estimatedSharePercent: number;
    gravityImpact: 'Yuqori' | "O'rtacha" | 'Past';
  }>;
}

/**
 * Computes Huff Retail Gravity Model market capture share & cannibalization pressure
 * P_ij = (S_j / D_ij^lambda) / sum_k (S_k / D_ik^lambda)
 */
export function calculateHuffMarketShare(inspection: InspectResult): HuffGravityAnalysis {
  const competitors = inspection.context.competitors || [];
  const radius = Math.max(300, inspection.radius_meters || 500);
  const lambda = 1.45; // Distance decay exponent in urban pedestrian retail

  // Attractiveness utility of the user's proposed store at the center of the catchment
  const baseDistance = 85; // Average walking distance within immediate micro-zone
  const newStoreAttractiveness = 1.15 + (inspection.factors.transit_score / 100) * 0.35;
  const newStoreUtility = newStoreAttractiveness / Math.pow(baseDistance, lambda);

  if (competitors.length === 0) {
    return {
      marketSharePercent: 92,
      cannibalizationRiskPercent: 6,
      saturationLabel: 'Moviy Okean (Raqobatchisiz hudud)',
      competitorWeights: [],
    };
  }

  const rawCompUtilities = competitors.map((comp) => {
    const dist = Math.max(35, comp.distance_meters);
    // Established chains have slightly higher brand attractiveness
    const isKnownChain = Boolean(
      comp.brand &&
        /safia|korzinka|makro|havas|evos|oqtepa|dodo|kfc|grand pharm|oxymed|dori-darmon|texnomart|mediapark/i.test(
          `${comp.name} ${comp.brand}`
        )
    );
    const brandAttr = isKnownChain ? 1.35 : 0.95;
    const utility = brandAttr / Math.pow(dist, lambda);
    return {
      name: comp.name,
      distanceMeters: comp.distance_meters,
      utility,
    };
  });

  const totalCompUtility = rawCompUtilities.reduce((acc, c) => acc + c.utility, 0);
  const totalSystemUtility = newStoreUtility + totalCompUtility;

  const marketSharePercent = Math.min(
    91,
    Math.max(11, Math.round((newStoreUtility / totalSystemUtility) * 100))
  );

  // Cannibalization risk depends on nearest competitor proximity & total competitor utility
  const nearestMeters = competitors[0]?.distance_meters ?? radius;
  const proximityFactor = Math.max(0, 1 - nearestMeters / radius);
  const cannibalizationRiskPercent = Math.min(
    92,
    Math.max(8, Math.round((100 - marketSharePercent) * 0.65 + proximityFactor * 32))
  );

  let saturationLabel = "Muvozanatlashgan bozor";
  if (marketSharePercent >= 62) {
    saturationLabel = "Yuqori bozor ulushi (Ustun pozitsiya)";
  } else if (marketSharePercent <= 30) {
    saturationLabel = "Zich raqobat (Kuchli UTP talab etiladi)";
  }

  const competitorWeights = rawCompUtilities.slice(0, 8).map((c) => {
    const share = Math.max(3, Math.round((c.utility / totalSystemUtility) * 100));
    const gravityImpact: 'Yuqori' | "O'rtacha" | 'Past' =
      c.distanceMeters < 150 || share >= 22
        ? 'Yuqori'
        : c.distanceMeters < 300 || share >= 12
        ? "O'rtacha"
        : 'Past';
    return {
      name: c.name,
      distanceMeters: c.distanceMeters,
      estimatedSharePercent: share,
      gravityImpact,
    };
  });

  return {
    marketSharePercent,
    cannibalizationRiskPercent,
    saturationLabel,
    competitorWeights,
  };
}

export interface WhiteSpaceMicroZone {
  id: string;
  directionLabel: string;
  distanceMeters: number;
  coordinates: Coordinates;
  score: number;
  scoreDelta: number;
  competitorsCount: number;
  reason: string;
}

const COMPASS_DIRECTIONS = [
  { label: 'Shimol', angleDeg: 0 },
  { label: 'Shimoli-sharq', angleDeg: 45 },
  { label: 'Sharq', angleDeg: 90 },
  { label: 'Janubi-sharq', angleDeg: 135 },
  { label: 'Janub', angleDeg: 180 },
  { label: "Janubi-g'arb", angleDeg: 225 },
  { label: "G'arb", angleDeg: 270 },
  { label: "Shimoli-g'arb", angleDeg: 315 },
];

/**
 * Scans 16 micro-vectors (240m and 440m away) around the selected coordinate
 * to find nearby "White-Space" (Bo'sh Bozor) spots with higher MakonScore or lower competition.
 */
export function scanLocalWhiteSpaceVectors(
  center: Coordinates,
  currentScore: number,
  category: BusinessCategory,
  radiusMeters: number
): WhiteSpaceMicroZone[] {
  const latDegPerMeter = 1 / 111320;
  const lonDegPerMeter = 1 / (111320 * Math.cos((center.latitude * Math.PI) / 180));
  const rings = [240, 440];
  const candidates: WhiteSpaceMicroZone[] = [];

  for (const dist of rings) {
    for (const dir of COMPASS_DIRECTIONS) {
      const rad = (dir.angleDeg * Math.PI) / 180;
      const dLat = dist * Math.cos(rad) * latDegPerMeter;
      const dLon = dist * Math.sin(rad) * lonDegPerMeter;

      const candidateCoords: Coordinates = {
        latitude: Number((center.latitude + dLat).toFixed(5)),
        longitude: Number((center.longitude + dLon).toFixed(5)),
      };

      const evalRes = calculateLocalSpatialScore(candidateCoords, category, radiusMeters);
      const delta = Number((evalRes.makon_score - currentScore).toFixed(1));

      let reason = 'Tranzit va aholi oqimi muvozanati yuqori';
      if (evalRes.context.direct_competitors_count === 0) {
        reason = 'Raqobatchilardan xoli erkin mikro-hudud';
      } else if (evalRes.factors.transit_score > 86) {
        reason = 'Asosiy metro/avtobus tranzit koridoriga yaqinroq';
      } else if (evalRes.factors.anchor_score > 84) {
        reason = 'Yirik savdo va oqim magnitlariga yaqin joylashuv';
      }

      candidates.push({
        id: `ws-${dir.angleDeg}-${dist}`,
        directionLabel: dir.label,
        distanceMeters: dist,
        coordinates: candidateCoords,
        score: evalRes.makon_score,
        scoreDelta: delta,
        competitorsCount: evalRes.context.direct_competitors_count,
        reason,
      });
    }
  }

  return candidates.sort((a, b) => b.score - a.score).slice(0, 3);
}

export interface BusinessFormatRecommendation {
  formatTitle: string;
  recommendedAreaSqm: string;
  defaultAreaSqm: number;
  operatingHours: string;
  targetSegment: string;
  strategicAdvice: string;
  pricingPositioning: string;
}

/**
 * AI Format & Operating Schedule Advisor tailored to the exact spatial factor profile of the clicked point
 */
export function recommendOptimalBusinessFormat(
  inspection: InspectResult,
  category: BusinessCategory
): BusinessFormatRecommendation {
  const { transit_score, anchor_score, competition_score, residential_density_score } =
    inspection.factors;

  if (category === 'cafe') {
    if (transit_score >= 82 && anchor_score >= 78) {
      return {
        formatTitle: 'Express Coffee-to-Go & Bakery Barchasi',
        recommendedAreaSqm: '45 – 75 m²',
        defaultAreaSqm: 60,
        operatingHours: '07:00 – 22:30 (Ertalabki pik + Tushlik)',
        targetSegment: "Metro yo'lovchilari, ofis xodimlari va talabalar",
        strategicAdvice:
          "Tranzit oqimi juda yuqori: asosiy daromadni tez tayyorlanadigan qahva, kruassan va sendvich kombo-setlari hamda vitrina oynasidan (Takeaway window) savdo beradi.",
        pricingPositioning: "O'rta va O'rta+ ($3.5 – $5.5 o'rtacha chek)",
      };
    }
    if (residential_density_score >= 78) {
      return {
        formatTitle: 'Oilaviy Kafe-Qandolat & Delivery Hub',
        recommendedAreaSqm: '85 – 130 m²',
        defaultAreaSqm: 100,
        operatingHours: '08:00 – 23:00 (Kechki oilaviy pik + Yetkazib berish)',
        targetSegment: "Ko'p qavatli uy rezidentlari va oilalar",
        strategicAdvice:
          "Zich turar-joy massivi: nonushta setlari, bolalar burchagi hamda Uzum Tezkor / Yandex Eats orqali 2 km radiusga issiq ovqat va shirinlik yetkazib berish tushumni 35% ga oshiradi.",
        pricingPositioning: "Hamyonbop oilaviy ($4.5 – $7.0 o'rtacha chek)",
      };
    }
    return {
      formatTitle: 'Specialty Coffee & Co-working Lounge',
      recommendedAreaSqm: '65 – 95 m²',
      defaultAreaSqm: 80,
      operatingHours: '08:00 – 22:00',
      targetSegment: 'Frilanserlar, yosh mutaxassislar va biznes uchrashuvlar',
      strategicAdvice:
        competition_score >= 55
          ? "Atrofda standart kafelar mavjud: sokin muhit, tez Wi-Fi, rozetkali stollar va mualliflik ichimliklari bilan raqobatchilardan keskin ajralib chiqing."
          : "Hududda zamonaviy kofe-lounge yetishmaydi: qulay interyer va barqaror sifat orqali doimiy mijozlar bazasini shakllantiring.",
      pricingPositioning: "O'rta+ ($4.8 – $6.5 o'rtacha chek)",
    };
  }

  if (category === 'pharmacy') {
    if (residential_density_score >= 75 || transit_score >= 80) {
      return {
        formatTitle: '24/7 Navbatchi Dorixona & Onlayn Buyurtma',
        recommendedAreaSqm: '55 – 80 m²',
        defaultAreaSqm: 65,
        operatingHours: '24/7 (Tun-u kun navbatchi rejim)',
        targetSegment: 'Mahalla aholisi, onalar va kechki yo‘lovchilar',
        strategicAdvice:
          "Aholi va kechki tranzit oqimi yuqori: 24/7 navbatchi darcha, qon bosimi o‘lchash burchagi va Telegram-bot orqali uyga tezkor dori yetkazib berish yuqori sodiqlik yaratadi.",
        pricingPositioning: "Ommabop + Dermokosmetika ($5.5 – $8.0 chek)",
      };
    }
    return {
      formatTitle: 'Standart Farmatsevtika va Salomatlik Markazi',
      recommendedAreaSqm: '45 – 65 m²',
      defaultAreaSqm: 55,
      operatingHours: '08:00 – 22:00',
      targetSegment: 'Kunduzgi oqim va klinika/ofis mijozlari',
      strategicAdvice:
        "Vitaminlar, ona va bola parvarishi vositalari hamda shifokor retsepti bo‘yicha to‘liq assortimentni saqlash konversiyani oshiradi.",
      pricingPositioning: "Standart ($5.0 – $7.0 o'rtacha chek)",
    };
  }

  if (category === 'supermarket') {
    return {
      formatTitle:
        residential_density_score >= 80
          ? 'Format "Uy Yonidagi" Minimarket + Issiq Nonvoyxona'
          : 'Express City-Market & Ready-to-Eat',
      recommendedAreaSqm: '160 – 280 m²',
      defaultAreaSqm: 210,
      operatingHours: '07:30 – 23:30',
      targetSegment: 'Kunlik oziq-ovqat xarid qiluvchi xonadonlar va yo‘lovchilar',
      strategicAdvice:
        "Yangi uzilgan meva-sabzavot vitrinasi, tandir/nonvoyxona hidi va kechki soat 18:00–20:30 dagi tezkor o‘z-o‘ziga xizmat kassalari (Self-checkout) o‘rtacha savatchani 22% ga kattalashtiradi.",
      pricingPositioning: "Kunlik iste'mol ($8.0 – $12.5 o'rtacha chek)",
    };
  }

  if (category === 'school') {
    return {
      formatTitle: 'IT, Xorijiy Tillar va IELTS Akademiyasi',
      recommendedAreaSqm: '140 – 240 m²',
      defaultAreaSqm: 165,
      operatingHours: '08:30 – 21:00 (2 smena + Kechki Bootcamp)',
      targetSegment: "Maktab o'quvchilari, abituriyentlar va talabalar",
      strategicAdvice:
        "Metro va jamoat transportiga yaqinlik o‘quvchilar qatnovini osonlashtiradi: co-working kutubxona zonasi va dam olish kunlari Mock-Exam sinovlari oqimni barqaror ushlab turadi.",
      pricingPositioning: "Oylik abonement ($55 – $95/oy kurs to'lovi)",
    };
  }

  // retail
  return {
    formatTitle:
      anchor_score >= 80
        ? 'Flagship Showroom & Omnichannel Do‘kon'
        : 'ixtisoslashgan Chakana Savdo & Pick-up Nuqtasi',
    recommendedAreaSqm: '75 – 130 m²',
    defaultAreaSqm: 95,
    operatingHours: '09:30 – 22:00',
    targetSegment: 'Maqsadli xaridorlar va onlayn buyurtmachilar',
    strategicAdvice:
      "Yorqin vitrina dizayni, Uzum Nasiya / ZoodPay muddatli to‘lov tizimlari va Instagram/Telegram orqali onlayn buyurtmalarni do‘kondan olib ketish (Click & Collect) konversiyani keskin oshiradi.",
    pricingPositioning: "O'rta segment ($15 – $25 o'rtacha chek)",
  };
}

export interface ScenarioProjection {
  label: string;
  dailyCustomers: number;
  monthlyRevenueUsd: number;
  monthlyNetProfitUsd: number;
  paybackMonths: number;
  roiAnnualPercent: number;
}

export interface UnitEconomicsSimulation {
  monthlyRentUsd: number;
  monthlyFixedOpexUsd: number;
  grossMarginPercent: number;
  estimatedCapexUsd: number;
  breakEvenDailyCustomers: number;
  breakEvenMonthlyRevenueUsd: number;
  safetyMarginPercent: number;
  rentToRevenuePercent: number;
  scenarios: {
    pessimistic: ScenarioProjection;
    base: ScenarioProjection;
    optimistic: ScenarioProjection;
  };
}

/**
 * Interactive Unit-Economics & 3-Scenario Break-Even Financial Simulator
 */
export function simulateUnitEconomics(
  inspection: InspectResult,
  category: BusinessCategory,
  areaSqm: number,
  customAvgCheckUsd: number,
  rentPerSqmUsd: number
): UnitEconomicsSimulation {
  const fin = inspection.context.financials;
  const baseDailyCustomers = fin?.estimated_customers_daily || 95;

  // Category-specific cost structure (Gross margin after COGS, OPEX per m2, Capex per m2)
  const costProfile: Record<
    BusinessCategory,
    { grossMargin: number; staffAndOpexPerSqm: number; baseStaffMonthly: number; capexPerSqm: number }
  > = {
    cafe: { grossMargin: 0.62, staffAndOpexPerSqm: 16, baseStaffMonthly: 1850, capexPerSqm: 410 },
    pharmacy: { grossMargin: 0.34, staffAndOpexPerSqm: 14, baseStaffMonthly: 1450, capexPerSqm: 450 },
    supermarket: { grossMargin: 0.28, staffAndOpexPerSqm: 12, baseStaffMonthly: 2400, capexPerSqm: 310 },
    retail: { grossMargin: 0.48, staffAndOpexPerSqm: 13, baseStaffMonthly: 1500, capexPerSqm: 420 },
    school: { grossMargin: 0.66, staffAndOpexPerSqm: 15, baseStaffMonthly: 2200, capexPerSqm: 260 },
  };

  const profile = costProfile[category] || costProfile.cafe;
  const monthlyRentUsd = Math.round(areaSqm * rentPerSqmUsd);
  const monthlyFixedOpexUsd = Math.round(profile.baseStaffMonthly + areaSqm * profile.staffAndOpexPerSqm);
  const totalFixedCostsMonthly = monthlyRentUsd + monthlyFixedOpexUsd;
  const estimatedCapexUsd = Math.round((areaSqm * profile.capexPerSqm) / 500) * 500;

  // Contribution margin per customer = avgCheckUsd * grossMargin
  const contributionPerCustomer = Math.max(0.5, customAvgCheckUsd * profile.grossMargin);
  const breakEvenMonthlyCustomers = totalFixedCostsMonthly / contributionPerCustomer;
  const breakEvenDailyCustomers = Math.max(8, Math.ceil(breakEvenMonthlyCustomers / 30));
  const breakEvenMonthlyRevenueUsd = Math.round(breakEvenDailyCustomers * customAvgCheckUsd * 30);

  // Larger space slightly increases capacity up to a realistic ceiling
  const defaultArea = category === 'supermarket' ? 210 : category === 'school' ? 160 : 85;
  const areaCapacityFactor = Math.min(1.35, Math.max(0.72, Math.pow(areaSqm / defaultArea, 0.28)));
  const adjustedBaseCustomers = Math.max(15, Math.round(baseDailyCustomers * areaCapacityFactor));

  const safetyMarginPercent = Math.round(
    ((adjustedBaseCustomers - breakEvenDailyCustomers) / Math.max(1, breakEvenDailyCustomers)) * 100
  );

  const buildScenario = (label: string, multiplier: number): ScenarioProjection => {
    const dailyCustomers = Math.max(10, Math.round(adjustedBaseCustomers * multiplier));
    const monthlyRevenueUsd = Math.round(dailyCustomers * customAvgCheckUsd * 30);
    const grossProfitUsd = monthlyRevenueUsd * profile.grossMargin;
    const rawNetProfit = grossProfitUsd - totalFixedCostsMonthly;
    // Ensure realistic floor for viable scenarios
    const monthlyNetProfitUsd = Math.round(Math.max(350, rawNetProfit));
    const paybackMonths = Number(
      Math.min(48, Math.max(4.2, estimatedCapexUsd / monthlyNetProfitUsd)).toFixed(1)
    );
    const roiAnnualPercent = Math.round(Math.min(240, Math.max(15, (12 / paybackMonths) * 100)));

    return {
      label,
      dailyCustomers,
      monthlyRevenueUsd,
      monthlyNetProfitUsd,
      paybackMonths,
      roiAnnualPercent,
    };
  };

  const pessimistic = buildScenario('Pessimistik (-20%)', 0.8);
  const base = buildScenario('Bazaviy (Real)', 1.0);
  const optimistic = buildScenario('Optimistik (+22%)', 1.22);

  const rentToRevenuePercent = Math.min(
    65,
    Math.max(3, Math.round((monthlyRentUsd / Math.max(1, base.monthlyRevenueUsd)) * 100))
  );

  return {
    monthlyRentUsd,
    monthlyFixedOpexUsd,
    grossMarginPercent: Math.round(profile.grossMargin * 100),
    estimatedCapexUsd,
    breakEvenDailyCustomers,
    breakEvenMonthlyRevenueUsd,
    safetyMarginPercent,
    rentToRevenuePercent,
    scenarios: {
      pessimistic,
      base,
      optimistic,
    },
  };
}
