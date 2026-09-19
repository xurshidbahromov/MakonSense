import uuid
from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.schemas import ReportRequest, ReportResponse, Coordinates
from app.services.spatial_query import SpatialQueryService
from app.services.score_engine import MakonScoreEngine

router = APIRouter()


@router.post("/audit", response_model=ReportResponse)
async def generate_audit_report(
    request: ReportRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Generates a comprehensive 5-section Commercial Feasibility Audit (Pay-per-Report).
    """
    lat = request.latitude
    lon = request.longitude
    radius = request.radius_meters
    category = request.business_category.lower()

    # Spatial query data
    transit_items = await SpatialQueryService.get_nearby_transit(db, lat, lon, radius_meters=min(800.0, radius * 1.2))
    anchor_items = await SpatialQueryService.get_nearby_anchors(db, lat, lon, radius_meters=800.0)
    competitors = await SpatialQueryService.get_nearby_competitors(db, lat, lon, category=category, radius_meters=400.0)
    residential_items = await SpatialQueryService.get_nearby_residential(db, lat, lon, radius_meters=600.0)

    # Calculate score
    makon_score, status, factors = MakonScoreEngine.compute_makon_score(
        transit_items=transit_items,
        anchor_items=anchor_items,
        competitor_items=competitors,
        residential_items=residential_items,
    )

    # Risk level & recommendation logic
    if makon_score >= 80.0:
        risk_level = "PAST XAVF / YUQORI RENTABELLIK"
        recommendation = "Loyiha uchun tavsiya etiladi. Joylashuv yuqori tranzit va barqaror iste'molchi oqimiga ega."
    elif makon_score >= 50.0:
        risk_level = "O'RTACHA XAVF"
        recommendation = "Shartli tavsiya etiladi. Raqobatchilar bilan to'g'ridan-to'g'ri narx yoki assortiment bo'yicha differentsiatsiya talab etiladi."
    else:
        risk_level = "YUQORI XAVF"
        recommendation = "Tavsiya etilmaydi. Piyodalar oqimi yetarli emas yoki hudud toifadagi raqobatchilar bilan to'yingan."

    # Context assembly
    nearest_metro = None
    if transit_items:
        first_metro = transit_items[0]
        nearest_metro = {
            "name": first_metro["name"],
            "distance_meters": round(first_metro.get("distance_meters", 0.0), 1),
            "line_name": first_metro.get("line_name"),
            "passenger_flow_score": first_metro.get("passenger_flow_score", 50),
        }

    units = sum([int(r.get("units_count", 0)) for r in residential_items])
    estimated_households = max(350, int(units * 1.2) + int((radius / 500.0) * 450))

    swot = {
        "strengths": [
            f"Tranzit qulayligi indeksi: {factors.transit_score}/100",
            f"Asosiy tortish markazlari (Anchors): {len(anchor_items)} ta obyekt 800m masofada",
            f"Hududiy iste'molchilar qamrovi: ~{estimated_households} xonadon"
        ],
        "weaknesses": [
            f"To'g'ridan-to'g'ri raqobatchilar: {len(competitors)} ta nuqta 400m radiusda" if competitors else "Yaqin atrofda toifadosh kuchli brendlar yo'qligi sababli bozor odati sust bo'lishi mumkin"
        ],
        "opportunities": [
            "Zamonaviy turar-joy massivlaridan yangi aholi oqimi",
            "Tranzit yo'nalishlaridan har kungi doimiy o'tuvchi mijozlar oqimi"
        ],
        "threats": [
            "Tijoriy ijara stavkalarining o'sishi",
            "400m radiusda yangi yirik tarmoqli o'yinchilarning kirib kelish xavfi"
        ]
    }

    summary = (
        f"Tanlangan {request.business_name} ({category.capitalize()}) loyihasi uchun Toshkent shahri koordinatalari "
        f"[{lat:.4f}, {lon:.4f}] bo'yicha MakonScore indeksi {makon_score}/100 ('{status}') deb baholandi. "
        f"{recommendation}"
    )

    from app.models.schemas import AnalysisContext, AnchorInfo, CompetitorDetail, NearestMetroInfo
    
    return ReportResponse(
        report_id=f"MKN-{uuid.uuid4().hex[:8].upper()}",
        generated_at=datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"),
        target_location=Coordinates(latitude=lat, longitude=lon),
        business_name=request.business_name,
        business_category=category,
        makon_score=makon_score,
        status=status,
        recommendation=recommendation,
        risk_level=risk_level,
        factors=factors,
        context=AnalysisContext(
            direct_competitors_count=len(competitors),
            nearest_competitor_meters=competitors[0]["distance_meters"] if competitors else None,
            competitors=[CompetitorDetail(name=c["name"], brand=c.get("brand"), category=c["category"], distance_meters=c["distance_meters"]) for c in competitors[:5]],
            nearest_metro=NearestMetroInfo(**nearest_metro) if nearest_metro else None,
            major_anchors=[AnchorInfo(name=a["name"], category=a["category"], distance_meters=a["distance_meters"]) for a in anchor_items[:5]],
            estimated_households=estimated_households,
            commercial_density_label="Yuqori" if len(competitors) >= 3 else "O'rtacha"
        ),
        executive_summary=summary,
        swot_analysis=swot
    )
