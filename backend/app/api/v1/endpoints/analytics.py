import math
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.schemas import (
    InspectRequest,
    InspectResponse,
    Coordinates,
    NearestMetroInfo,
    AnchorInfo,
    CompetitorDetail,
    AnalysisContext,
    HexagonFeature,
)
from app.services.spatial_query import SpatialQueryService, haversine_distance
from app.services.score_engine import MakonScoreEngine

router = APIRouter()


@router.post("/inspect", response_model=InspectResponse)
async def inspect_location(
    request: InspectRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Scans a given geographic coordinate in Tashkent for commercial viability.
    Calculates MakonScore (0-100) using transit accessibility, anchors, competition, and residential reach.
    """
    lat = request.latitude
    lon = request.longitude
    radius = request.radius_meters
    category = request.business_category.lower()

    # 1. Fetch spatial proximity factors
    transit_items = await SpatialQueryService.get_nearby_transit(db, lat, lon, radius_meters=min(800.0, radius * 1.2))
    anchor_items = await SpatialQueryService.get_nearby_anchors(db, lat, lon, radius_meters=800.0)
    competitors = await SpatialQueryService.get_nearby_competitors(db, lat, lon, category=category, radius_meters=400.0)
    residential_items = await SpatialQueryService.get_nearby_residential(db, lat, lon, radius_meters=600.0)

    # 2. Compute algorithmic MakonScore
    makon_score, status, factors = MakonScoreEngine.compute_makon_score(
        transit_items=transit_items,
        anchor_items=anchor_items,
        competitor_items=competitors,
        residential_items=residential_items,
    )

    # 3. Assemble contextual breakdown
    nearest_metro = None
    if transit_items:
        first_metro = transit_items[0]
        nearest_metro = NearestMetroInfo(
            name=first_metro["name"],
            distance_meters=round(first_metro.get("distance_meters", 0.0), 1),
            line_name=first_metro.get("line_name"),
            passenger_flow_score=first_metro.get("passenger_flow_score", 50),
        )

    major_anchors = [
        AnchorInfo(
            name=a["name"],
            category=a["category"],
            distance_meters=round(a.get("distance_meters", 0.0), 1),
        )
        for a in anchor_items[:5]
    ]

    competitor_details = [
        CompetitorDetail(
            name=c["name"],
            brand=c.get("brand"),
            category=c["category"],
            distance_meters=round(c.get("distance_meters", 0.0), 1),
        )
        for c in competitors[:6]
    ]

    nearest_comp_meters = competitor_details[0].distance_meters if competitor_details else None

    # Total households estimation (units from complexes + estimated district density)
    units = sum([int(r.get("units_count", 0)) for r in residential_items])
    estimated_households = max(350, int(units * 1.2) + int((radius / 500.0) * 450))

    commercial_density = "Yuqori" if len(competitors) >= 3 else ("O'rtacha" if len(competitors) >= 1 else "Past")

    context = AnalysisContext(
        direct_competitors_count=len(competitors),
        nearest_competitor_meters=nearest_comp_meters,
        competitors=competitor_details,
        nearest_metro=nearest_metro,
        major_anchors=major_anchors,
        estimated_households=estimated_households,
        commercial_density_label=commercial_density,
    )

    return InspectResponse(
        coordinates=Coordinates(latitude=lat, longitude=lon),
        business_category=category,
        radius_meters=radius,
        makon_score=makon_score,
        status=status,
        factors=factors,
        context=context,
    )


@router.get("/hexagons", response_model=List[HexagonFeature])
async def get_tashkent_hexagons():
    """
    Returns hexagonal spatial cells covering key districts of Tashkent
    with calculated score intensity for Deck.gl visualization.
    """
    # Key anchor centers in Tashkent to seed representative hexagonal cells
    hotspots = [
        {"name": "Amir Temur Markaz", "lat": 41.3115, "lon": 69.2795, "base_score": 88.5},
        {"name": "Tashkent City", "lat": 41.3142, "lon": 69.2483, "base_score": 92.0},
        {"name": "Oybek / Mirobod", "lat": 41.2981, "lon": 69.2783, "base_score": 84.0},
        {"name": "Chilonzor Markaz", "lat": 41.2728, "lon": 69.2062, "base_score": 79.5},
        {"name": "Chorsu Eski Shahar", "lat": 41.3275, "lon": 69.2359, "base_score": 87.0},
        {"name": "Yunusobod 4-Mavze", "lat": 41.3562, "lon": 69.2891, "base_score": 74.5},
        {"name": "Novza / Bunyodkor", "lat": 41.2917, "lon": 69.2273, "base_score": 76.0},
        {"name": "Buyuk Ipak Yo'li", "lat": 41.3262, "lon": 69.3347, "base_score": 81.0},
        {"name": "Mirabad Avenue", "lat": 41.2965, "lon": 69.2721, "base_score": 89.0},
        {"name": "Bodomzor / TV Tower", "lat": 41.3364, "lon": 69.2842, "base_score": 71.0},
        {"name": "Samarqand Darvoza", "lat": 41.3168, "lon": 69.2274, "base_score": 83.0},
        {"name": "Sergeli Markaz", "lat": 41.2235, "lon": 69.2195, "base_score": 64.0},
    ]

    features: List[HexagonFeature] = []
    
    # Generate hexagonal polygons around each hotspot (diameter ~ 600m)
    hex_radius_deg_lat = 0.0035
    hex_radius_deg_lon = 0.0045

    for i, spot in enumerate(hotspots):
        c_lat = spot["lat"]
        c_lon = spot["lon"]
        score = spot["base_score"]
        tier = "high" if score >= 80 else ("medium" if score >= 60 else "low")

        # 6 vertices of hexagon
        coords = []
        for angle_deg in range(0, 360, 60):
            rad = math.radians(angle_deg)
            vertex_lat = c_lat + (hex_radius_deg_lat * math.sin(rad))
            vertex_lon = c_lon + (hex_radius_deg_lon * math.cos(rad))
            coords.append([round(vertex_lon, 6), round(vertex_lat, 6)])
        coords.append(coords[0])  # Close polygon

        features.append(
            HexagonFeature(
                id=f"hex-{i+1}",
                coordinates=[coords],
                center=[round(c_lon, 6), round(c_lat, 6)],
                score=score,
                tier=tier,
            )
        )

    return features
