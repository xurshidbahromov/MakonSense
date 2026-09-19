from typing import List, Dict, Any
from fastapi import APIRouter
from app.services.spatial_query import SpatialQueryService

router = APIRouter()


@router.get("/categories")
async def get_categories():
    """Returns list of searchable business categories and anchors."""
    return {
        "commercial_categories": [
            {"id": "cafe", "name": "Kafe va Restoran", "icon": "coffee", "color": "#F59E0B"},
            {"id": "pharmacy", "name": "Dorixona", "icon": "pill", "color": "#10B981"},
            {"id": "supermarket", "name": "Supermarket / Oziq-ovqat", "icon": "shopping-cart", "color": "#3B82F6"},
            {"id": "school", "name": "O'quv markazi / Maktab", "icon": "graduation-cap", "color": "#8B5CF6"},
            {"id": "retail", "name": "Kiyim va chakana savdo", "icon": "shopping-bag", "color": "#EC4899"}
        ],
        "anchor_categories": [
            {"id": "mall", "name": "Savdo Majmuasi (Mall)", "icon": "building-2"},
            {"id": "bazaar", "name": "Bozor", "icon": "store"},
            {"id": "university", "name": "Oliy Ta'lim Muassasasi", "icon": "landmark"},
            {"id": "transit", "name": "Metro va Tranzit", "icon": "train"}
        ]
    }


@router.get("/geojson")
async def get_poi_geojson(category: str = None) -> Dict[str, Any]:
    """
    Returns POIs formatted as GeoJSON FeatureCollection for MapLibre/Deck.gl.
    """
    pois = SpatialQueryService.get_all_pois()
    if category:
        pois = [p for p in pois if p.get("category", "").lower() == category.lower()]

    features = []
    for p in pois:
        features.append({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [p["lon"], p["lat"]]
            },
            "properties": {
                "id": p["id"],
                "name": p["name"],
                "category": p["category"],
                "sub_category": p.get("sub_category"),
                "brand": p.get("brand"),
                "address": p.get("address"),
            }
        })

    return {
        "type": "FeatureCollection",
        "features": features
    }


@router.get("/transit/geojson")
async def get_transit_geojson() -> Dict[str, Any]:
    """Returns transit stops formatted as GeoJSON FeatureCollection."""
    stops = SpatialQueryService.get_all_transit()
    features = []
    for s in stops:
        features.append({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [s["lon"], s["lat"]]
            },
            "properties": {
                "id": s["id"],
                "name": s["name"],
                "transit_type": s["transit_type"],
                "line_name": s.get("line_name"),
                "passenger_flow_score": s.get("passenger_flow_score", 50)
            }
        })
    return {
        "type": "FeatureCollection",
        "features": features
    }
