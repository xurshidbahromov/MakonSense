export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Factors {
  transit_score: number;
  anchor_score: number;
  competition_score: number;
  residential_density_score: number;
}

export interface NearestMetro {
  name: string;
  distance_meters: number;
  line_name?: string;
  passenger_flow_score: number;
  lat?: number;
  lon?: number;
}

export interface AnchorItem {
  name: string;
  category: string;
  distance_meters: number;
  lat?: number;
  lon?: number;
}

export interface CompetitorItem {
  name: string;
  brand?: string;
  category: string;
  distance_meters: number;
  lat?: number;
  lon?: number;
}

export interface FinancialForecast {
  daily_foot_traffic: number;
  monthly_visitors: number;
  estimated_customers_daily: number;
  avg_check_usd: number;
  monthly_revenue_min_usd: number;
  monthly_revenue_max_usd: number;
  estimated_rent_sqm_usd: number;
  estimated_monthly_rent_usd: number;
  payback_months: number;
  roi_annual_percent: number;
}

export interface HourlyTrafficSlot {
  hour: string;
  weekday_flow: number;
  weekend_flow: number;
  conversion_rate: number;
  label: string;
}

export interface AnalysisContext {
  direct_competitors_count: number;
  nearest_competitor_meters: number | null;
  competitors: CompetitorItem[];
  nearest_metro: NearestMetro | null;
  major_anchors: AnchorItem[];
  estimated_households: number;
  commercial_density_label: string;
  location_label?: string;
  district_name?: string;
  region_name?: string;
  street_address?: string;
  mahalla_name?: string;
  bus_stops_count?: number;
  scanned_objects_count?: number;
  is_live_osm?: boolean;
  live_pois_geojson?: any[];
  financials?: FinancialForecast;
  hourly_traffic?: HourlyTrafficSlot[];
}

export interface InspectResult {
  coordinates: Coordinates;
  business_category: string;
  radius_meters: number;
  makon_score: number;
  status: 'YUQORI SALOHIYAT' | "O'RTACHA SALOHIYAT" | 'PAST SALOHIYAT' | string;
  factors: Factors;
  context: AnalysisContext;
}

export interface AuditReport {
  report_id: string;
  generated_at: string;
  target_location: Coordinates;
  business_name: string;
  business_category: string;
  makon_score: number;
  status: string;
  recommendation: string;
  risk_level: string;
  factors: Factors;
  context: AnalysisContext;
  executive_summary: string;
  swot_analysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
}

export interface HexFeature {
  id: string;
  coordinates: number[][][];
  center: [number, number];
  score: number;
  tier: 'high' | 'medium' | 'low';
  label?: string;
}

export type BusinessCategory = 'cafe' | 'pharmacy' | 'supermarket' | 'school' | 'retail';

export interface SavedLocation {
  id: string;
  name: string;
  district: string;
  coordinates: Coordinates;
  category: BusinessCategory;
  radiusMeters: number;
  score: number;
  status: string;
  savedAt: string;
}

export interface HotspotCandidate {
  id: string;
  name: string;
  district: string;
  region: string;
  coordinates: Coordinates;
  score: number;
  status: string;
  dailyTraffic: number;
  monthlyRevenueRange: string;
  competitorsCount: number;
  nearestMetroName: string | null;
  highlightReason: string;
}
