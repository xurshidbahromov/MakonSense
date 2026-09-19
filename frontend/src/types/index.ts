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
}

export interface AnchorItem {
  name: string;
  category: string;
  distance_meters: number;
}

export interface CompetitorItem {
  name: string;
  brand?: string;
  category: string;
  distance_meters: number;
}

export interface AnalysisContext {
  direct_competitors_count: number;
  nearest_competitor_meters: number | null;
  competitors: CompetitorItem[];
  nearest_metro: NearestMetro | null;
  major_anchors: AnchorItem[];
  estimated_households: number;
  commercial_density_label: string;
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
}

export type BusinessCategory = 'cafe' | 'pharmacy' | 'supermarket' | 'school' | 'retail';
