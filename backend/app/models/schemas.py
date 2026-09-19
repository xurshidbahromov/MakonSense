from typing import List, Optional
from pydantic import BaseModel, Field


class Coordinates(BaseModel):
    latitude: float = Field(..., ge=-90.0, le=90.0, description="Latitude coordinate")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="Longitude coordinate")


class InspectRequest(BaseModel):
    latitude: float = Field(default=41.311081, ge=-90.0, le=90.0, description="Target Latitude")
    longitude: float = Field(default=69.240562, ge=-180.0, le=180.0, description="Target Longitude")
    radius_meters: int = Field(default=500, ge=100, le=5000, description="Inspection buffer radius in meters")
    business_category: str = Field(default="cafe", description="Category: cafe, pharmacy, supermarket, school, retail")


class FactorsBreakdown(BaseModel):
    transit_score: float = Field(..., description="Transit & Foot-traffic Score (0-100)")
    anchor_score: float = Field(..., description="Anchor Magnets Score (0-100)")
    competition_score: float = Field(..., description="Competition Density Factor (0-100)")
    residential_density_score: float = Field(..., description="Residential Foot-traffic Density (0-100)")


class NearestMetroInfo(BaseModel):
    name: str
    distance_meters: float
    line_name: Optional[str] = None
    passenger_flow_score: int = 50


class AnchorInfo(BaseModel):
    name: str
    category: str
    distance_meters: float


class CompetitorDetail(BaseModel):
    name: str
    brand: Optional[str] = None
    category: str
    distance_meters: float


class AnalysisContext(BaseModel):
    direct_competitors_count: int
    nearest_competitor_meters: Optional[float] = None
    competitors: List[CompetitorDetail] = Field(default_factory=list)
    nearest_metro: Optional[NearestMetroInfo] = None
    major_anchors: List[AnchorInfo] = Field(default_factory=list)
    estimated_households: int = 0
    commercial_density_label: str = "O'rtacha"


class InspectResponse(BaseModel):
    coordinates: Coordinates
    business_category: str
    radius_meters: int
    makon_score: float = Field(..., ge=0.0, le=100.0, description="MakonScore Commercial Rating (0 - 100)")
    status: str = Field(..., description="Evaluation: YUQORI SALOHIYAT, O'RTACHA SALOHIYAT, or PAST SALOHIYAT")
    factors: FactorsBreakdown
    context: AnalysisContext


class POIItem(BaseModel):
    id: int
    name: str
    category: str
    sub_category: Optional[str] = None
    brand: Optional[str] = None
    address: Optional[str] = None
    latitude: float
    longitude: float


class HexagonFeature(BaseModel):
    id: str
    coordinates: List[List[float]]
    center: List[float]
    score: float
    tier: str  # 'high', 'medium', 'low'


class ReportRequest(BaseModel):
    latitude: float
    longitude: float
    business_category: str
    business_name: Optional[str] = "Yangi Tijoriy Nuqta"
    radius_meters: int = 500
    requested_by: Optional[str] = "Tijoriy Mijoz"


class ReportResponse(BaseModel):
    report_id: str
    generated_at: str
    target_location: Coordinates
    business_name: str
    business_category: str
    makon_score: float
    status: str
    recommendation: str
    risk_level: str
    factors: FactorsBreakdown
    context: AnalysisContext
    executive_summary: str
    swot_analysis: dict
