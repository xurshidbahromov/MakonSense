import { create } from 'zustand';
import {
  Coordinates,
  InspectResult,
  AuditReport,
  BusinessCategory,
  SavedLocation,
} from '../types';
import { calculateLocalSpatialScore } from '../utils/clientSpatialEngine';

export interface LayerVisibility {
  hexagons: boolean;
  pois: boolean;
  transit: boolean;
  scanRadius: boolean;
}

export type SidebarTabKey = 'factors' | 'competitors' | 'traffic' | 'compare' | 'hotspots';

const DEFAULT_COORDS: Coordinates = {
  latitude: 41.3120,
  longitude: 69.2800,
};

const DEFAULT_COMPARE_COORDS: Coordinates = {
  latitude: 41.3145,
  longitude: 69.2485,
};

const SAVED_LOCATIONS_KEY = 'makonsense_saved_locations_v1';

function loadInitialSavedLocations(): SavedLocation[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(SAVED_LOCATIONS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore storage errors
  }
  const preset1 = calculateLocalSpatialScore({ latitude: 41.3120, longitude: 69.2800 }, 'cafe', 500);
  const preset2 = calculateLocalSpatialScore({ latitude: 41.3145, longitude: 69.2485 }, 'retail', 500);
  return [
    {
      id: 'saved-default-1',
      name: preset1.context.location_label || 'Amir Temur Xiyoboni',
      district: preset1.context.district_name || 'Mirobod / Yunusobod',
      coordinates: { latitude: 41.3120, longitude: 69.2800 },
      category: 'cafe',
      radiusMeters: 500,
      score: preset1.makon_score,
      status: preset1.status,
      savedAt: 'Standart namuna',
    },
    {
      id: 'saved-default-2',
      name: preset2.context.location_label || 'Tashkent City IBC',
      district: preset2.context.district_name || 'Shayxontohur tumani',
      coordinates: { latitude: 41.3145, longitude: 69.2485 },
      category: 'retail',
      radiusMeters: 500,
      score: preset2.makon_score,
      status: preset2.status,
      savedAt: 'Standart namuna',
    },
  ];
}

interface AnalyticsState {
  selectedCoords: Coordinates;
  category: BusinessCategory;
  radiusMeters: number;
  inspection: InspectResult;
  loading: boolean;
  error: string | null;
  activeLayers: LayerVisibility;
  reportModalOpen: boolean;
  auditReport: AuditReport | null;
  auditLoading: boolean;
  basemapMode: 'light' | 'dark' | 'satellite';
  pitchMode: '2d' | '3d';
  currentView: 'landing' | 'app' | 'auth';

  // A/B Compare state
  compareCoords: Coordinates;
  compareInspection: InspectResult;
  isPickingCompareOnMap: boolean;
  showComparePinOnMap: boolean;

  // Sidebar & Bookmarks state
  activeSidebarTab: SidebarTabKey;
  savedLocations: SavedLocation[];
  highlightedPoiCoords: { latitude: number; longitude: number; name: string } | null;
  recentHistory: Coordinates[];

  // Actions
  setSelectedCoords: (coords: Coordinates) => void;
  goBackLocation: () => void;
  setCategory: (cat: BusinessCategory) => void;
  setRadiusMeters: (r: number) => void;
  toggleLayer: (key: keyof LayerVisibility) => void;
  setBasemapMode: (mode: 'light' | 'dark' | 'satellite') => void;
  togglePitchMode: () => void;
  setCurrentView: (view: 'landing' | 'app' | 'auth') => void;
  setReportModalOpen: (open: boolean) => void;
  inspectPoint: (coords?: Coordinates) => Promise<void>;
  generateAuditReport: () => Promise<void>;

  // New Actions
  setCompareCoords: (coords: Coordinates) => void;
  setIsPickingCompareOnMap: (picking: boolean) => void;
  setShowComparePinOnMap: (show: boolean) => void;
  swapCompareLocations: () => void;
  setActiveSidebarTab: (tab: SidebarTabKey) => void;
  saveCurrentLocation: (customName?: string) => void;
  removeSavedLocation: (id: string) => void;
  setHighlightedPoiCoords: (poi: { latitude: number; longitude: number; name: string } | null) => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  selectedCoords: DEFAULT_COORDS,
  category: 'cafe',
  radiusMeters: 500,
  inspection: calculateLocalSpatialScore(DEFAULT_COORDS, 'cafe', 500),
  loading: false,
  error: null,
  activeLayers: {
    hexagons: true,
    pois: true,
    transit: true,
    scanRadius: true,
  },
  reportModalOpen: false,
  auditReport: null,
  auditLoading: false,
  basemapMode:
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light',
  pitchMode: '3d',
  currentView:
    typeof window !== 'undefined' && window.location.hash === '#app' ? 'app' : 'landing',

  compareCoords: DEFAULT_COMPARE_COORDS,
  compareInspection: calculateLocalSpatialScore(DEFAULT_COMPARE_COORDS, 'cafe', 500),
  isPickingCompareOnMap: false,
  showComparePinOnMap: false,

  activeSidebarTab: 'factors',
  savedLocations: loadInitialSavedLocations(),
  highlightedPoiCoords: null,
  recentHistory: [],

  setBasemapMode: (mode: 'light' | 'dark' | 'satellite') => {
    set({ basemapMode: mode });
  },

  togglePitchMode: () => {
    set((state) => ({
      pitchMode: state.pitchMode === '3d' ? '2d' : '3d',
    }));
  },

  setCurrentView: (view: 'landing' | 'app' | 'auth') => {
    if (typeof window !== 'undefined') {
      window.location.hash = view === 'app' ? '#app' : '';
    }
    set({ currentView: view });
  },

  setSelectedCoords: (coords: Coordinates) => {
    const prev = get().selectedCoords;
    const isSame =
      Math.abs(prev.latitude - coords.latitude) < 0.0001 &&
      Math.abs(prev.longitude - coords.longitude) < 0.0001;
    const nextHistory = isSame
      ? get().recentHistory
      : [prev, ...get().recentHistory].slice(0, 10);
    set({ selectedCoords: coords, highlightedPoiCoords: null, recentHistory: nextHistory });
    get().inspectPoint(coords);
  },

  goBackLocation: () => {
    const history = get().recentHistory;
    if (history.length === 0) return;
    const [prev, ...rest] = history;
    set({ selectedCoords: prev, highlightedPoiCoords: null, recentHistory: rest });
    get().inspectPoint(prev);
  },

  setCategory: (cat: BusinessCategory) => {
    const { compareCoords, radiusMeters } = get();
    set({
      category: cat,
      compareInspection: calculateLocalSpatialScore(compareCoords, cat, radiusMeters),
    });
    get().inspectPoint();
  },

  setRadiusMeters: (r: number) => {
    const { compareCoords, category } = get();
    set({
      radiusMeters: r,
      compareInspection: calculateLocalSpatialScore(compareCoords, category, r),
    });
    get().inspectPoint();
  },

  toggleLayer: (key: keyof LayerVisibility) => {
    set((state) => ({
      activeLayers: {
        ...state.activeLayers,
        [key]: !state.activeLayers[key],
      },
    }));
  },

  setReportModalOpen: (open: boolean) => {
    set({ reportModalOpen: open });
  },

  setCompareCoords: (coords: Coordinates) => {
    const { category, radiusMeters } = get();
    const compResult = calculateLocalSpatialScore(coords, category, radiusMeters);
    set({
      compareCoords: coords,
      compareInspection: compResult,
      isPickingCompareOnMap: false,
      showComparePinOnMap: true,
    });
  },

  setIsPickingCompareOnMap: (picking: boolean) => {
    set({
      isPickingCompareOnMap: picking,
      showComparePinOnMap: picking ? true : get().showComparePinOnMap,
    });
  },

  setShowComparePinOnMap: (show: boolean) => {
    set({ showComparePinOnMap: show });
  },

  swapCompareLocations: () => {
    const { selectedCoords, compareCoords, category, radiusMeters } = get();
    const newPrimary = compareCoords;
    const newSecondary = selectedCoords;
    set({
      selectedCoords: newPrimary,
      compareCoords: newSecondary,
      inspection: calculateLocalSpatialScore(newPrimary, category, radiusMeters),
      compareInspection: calculateLocalSpatialScore(newSecondary, category, radiusMeters),
    });
  },

  setActiveSidebarTab: (tab: SidebarTabKey) => {
    set({
      activeSidebarTab: tab,
      showComparePinOnMap: tab === 'compare' ? true : get().showComparePinOnMap,
    });
  },

  saveCurrentLocation: (customName?: string) => {
    const { selectedCoords, category, radiusMeters, inspection, savedLocations } = get();
    const name =
      customName?.trim() ||
      inspection.context.location_label ||
      `Nuqta [${selectedCoords.latitude.toFixed(4)}, ${selectedCoords.longitude.toFixed(4)}]`;
    const district = inspection.context.district_name || 'Toshkent sh.';

    const existsIndex = savedLocations.findIndex(
      (item) =>
        Math.abs(item.coordinates.latitude - selectedCoords.latitude) < 0.0004 &&
        Math.abs(item.coordinates.longitude - selectedCoords.longitude) < 0.0004 &&
        item.category === category
    );

    const newEntry: SavedLocation = {
      id: `loc-${Date.now()}`,
      name,
      district,
      coordinates: { ...selectedCoords },
      category,
      radiusMeters,
      score: inspection.makon_score,
      status: inspection.status,
      savedAt: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
    };

    let updated: SavedLocation[];
    if (existsIndex >= 0) {
      updated = [...savedLocations];
      updated[existsIndex] = newEntry;
    } else {
      updated = [newEntry, ...savedLocations].slice(0, 15);
    }

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(SAVED_LOCATIONS_KEY, JSON.stringify(updated));
      } catch {
        // ignore storage quota errors
      }
    }
    set({ savedLocations: updated });
  },

  removeSavedLocation: (id: string) => {
    const updated = get().savedLocations.filter((item) => item.id !== id);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(SAVED_LOCATIONS_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
    }
    set({ savedLocations: updated });
  },

  setHighlightedPoiCoords: (poi) => {
    set({ highlightedPoiCoords: poi });
  },

  inspectPoint: async (targetCoords?: Coordinates) => {
    const coords = targetCoords || get().selectedCoords;
    const category = get().category;
    const radius = get().radiusMeters;

    // 1. Instant local spatial calculation (0 ms response, ultra-smooth)
    const localData = calculateLocalSpatialScore(coords, category, radius);
    set({ inspection: localData, loading: false });

    // 2. Asynchronously sync with FastAPI backend if running, preserving enriched local context
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1800);

      const response = await fetch('/api/v1/analytics/inspect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: coords.latitude,
          longitude: coords.longitude,
          radius_meters: radius,
          business_category: category,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data: InspectResult = await response.json();
        set({
          inspection: {
            ...data,
            context: {
              ...localData.context,
              ...data.context,
              location_label: localData.context.location_label,
              district_name: localData.context.district_name,
              region_name: localData.context.region_name,
              financials: localData.context.financials,
              hourly_traffic: localData.context.hourly_traffic,
            },
          },
          loading: false,
        });
      }
    } catch {
      // Local calculation is already active and accurate
    }
  },

  generateAuditReport: async () => {
    const coords = get().selectedCoords;
    const category = get().category;
    const radius = get().radiusMeters;
    const currentInspection = get().inspection;
    const locLabel = currentInspection.context.location_label || 'Toshkent Markaziy Nuqtasi';

    set({ auditLoading: true, reportModalOpen: true });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const response = await fetch('/api/v1/reports/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: coords.latitude,
          longitude: coords.longitude,
          business_category: category,
          business_name: `${locLabel} — ${category.toUpperCase()} Loyihasi`,
          radius_meters: radius,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const report: AuditReport = await response.json();
        set({
          auditReport: {
            ...report,
            context: {
              ...currentInspection.context,
              ...report.context,
              location_label: currentInspection.context.location_label,
              district_name: currentInspection.context.district_name,
              financials: currentInspection.context.financials,
              hourly_traffic: currentInspection.context.hourly_traffic,
            },
          },
          auditLoading: false,
        });
        return;
      }
    } catch {
      // Fallback below
    }

    const fin = currentInspection.context.financials;
    const revRange = fin
      ? `$${(fin.monthly_revenue_min_usd / 1000).toFixed(1)}k – $${(fin.monthly_revenue_max_usd / 1000).toFixed(1)}k`
      : '$18k – $26k';

    set({
      auditReport: {
        report_id: `MKN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        generated_at: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
        target_location: coords,
        business_name: `${locLabel} (${category.toUpperCase()})`,
        business_category: category,
        makon_score: currentInspection.makon_score,
        status: currentInspection.status,
        recommendation:
          currentInspection.makon_score >= 80
            ? "Loyiha uchun to'liq tavsiya etiladi. Joylashuv yuqori tranzit, kuchli magnit nuqtalar va barqaror xarid qobiliyatiga ega."
            : currentInspection.makon_score >= 55
            ? "Shartli tavsiya etiladi. Toifadosh raqobatchilardan aniq UTP (unikal savdo taklifi) va marketing orqali ajralib chiqish talab etiladi."
            : "Yuqori ehtiyotkorlik talab etiladi. Piyodalar oqimi nisbatan past yoki yaqin radiusda kuchli tarmoqli raqobatchilar zich joylashgan.",
        risk_level:
          currentInspection.makon_score >= 80
            ? 'PAST XAVF / YUQORI RENTABELLIK'
            : currentInspection.makon_score >= 55
            ? "O'RTACHA XAVF / BARQAROR"
            : 'YUQORI XAVF',
        factors: currentInspection.factors,
        context: currentInspection.context,
        executive_summary: `${locLabel} (${currentInspection.context.district_name || 'Toshkent sh.'}) koordinatalari [${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}] bo'yicha ${radius}m radiusda MakonScore indeksi ${currentInspection.makon_score}/100 ('${currentInspection.status}') deb baholandi. Kutilayotgan oylik aylanma prognozi: ${revRange}.`,
        swot_analysis: {
          strengths: [
            `Tranzit qulayligi indeksi: ${currentInspection.factors.transit_score}/100 (Kunlik ~${(fin?.daily_foot_traffic || 12400).toLocaleString()} piyoda oqimi)`,
            currentInspection.context.nearest_metro
              ? `Metro bekatiga yaqinlik: ${currentInspection.context.nearest_metro.distance_meters}m (${currentInspection.context.nearest_metro.name})`
              : "Asosiy avtomobil va piyoda koridorlari tutashuvida joylashgan",
            `Hududiy iste'molchilar bazasi: ~${currentInspection.context.estimated_households.toLocaleString()} xonadon`,
          ],
          weaknesses: [
            currentInspection.context.direct_competitors_count > 0
              ? `${radius}m radiusda ${currentInspection.context.direct_competitors_count} ta to'g'ridan-to'g'ri raqobatchi mavjud (eng yaqini ${currentInspection.context.nearest_competitor_meters}m)`
              : "Yaqin atrofda shu toifadagi yirik klaster shakllanmagani sababli birlamchi marketing xarajatlari talab etiladi",
            fin
              ? `Tijoriy ijara stavkasi (~$${fin.estimated_rent_sqm_usd}/m²) doimiy operatsion samaradorlikni talab qiladi`
              : "Markaziy hududlarda avtoturargoh sig'imi cheklangan bo'lishi mumkin",
          ],
          opportunities: [
            `Prognoz qilinayotgan oylik daromad salohiyati: ${revRange} (o'zini oqlash muddati ~${fin?.payback_months || 11} oy)`,
            "Zamonaviy turar-joy majmualari va biznes markazlar hisobiga B2C hamda korporativ yetkazib berish (Delivery) ulushini oshirish",
          ],
          threats: [
            "Tijoriy ko'chmas mulk ijara stavkalarining yillik 10–15% indeksatsiyasi",
            "Yirik federal yoki xalqaro tarmoqlarning shu mikro-hududga kirib kelish ehtimoli",
          ],
        },
      },
      auditLoading: false,
    });
  },
}));
