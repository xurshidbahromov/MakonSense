# MakonScore Engine Unit Tests
import unittest
from app.services.score_engine import MakonScoreEngine
from app.services.spatial_query import haversine_distance


def test_haversine_distance():
    # Distance between Amir Temur Square (41.311081, 69.240562) and Oybek Metro (41.2981, 69.2783)
    # is approximately 3.4 km
    d = haversine_distance(41.311081, 69.240562, 41.2981, 69.2783)
    assert 3000 < d < 4000
    # Distance to same point is 0
    assert haversine_distance(41.31, 69.24, 41.31, 69.24) == 0.0


def test_transit_score_calculation():
    # Single high flow station close by
    items = [{"distance_meters": 60, "passenger_flow_score": 95}]
    score_close = MakonScoreEngine.calculate_transit_score(items)
    assert score_close > 85.0

    # Station far away
    items_far = [{"distance_meters": 490, "passenger_flow_score": 50}]
    score_far = MakonScoreEngine.calculate_transit_score(items_far)
    assert score_far < score_close


def test_anchor_score_calculation():
    anchors = [
        {"category": "mall", "distance_meters": 120},
        {"category": "university", "distance_meters": 250},
    ]
    score = MakonScoreEngine.calculate_anchor_score(anchors)
    assert score > 60.0
    assert score <= 100.0


def test_competition_score_calculation():
    # 0 competitors -> 0 score
    assert MakonScoreEngine.calculate_competition_score([]) == 0.0

    # 4 competitors with one 50 meters away -> high penalty
    dense_competitors = [
        {"distance_meters": 50},
        {"distance_meters": 120},
        {"distance_meters": 200},
        {"distance_meters": 350},
    ]
    dense_score = MakonScoreEngine.calculate_competition_score(dense_competitors)
    assert dense_score > 70.0


def test_makon_score_bounds_and_status():
    # Ideal conditions: strong transit, anchors, high residential, 0 competitors
    score, status, factors = MakonScoreEngine.compute_makon_score(
        transit_items=[{"distance_meters": 80, "passenger_flow_score": 95}],
        anchor_items=[
            {"category": "mall", "distance_meters": 150},
            {"category": "university", "distance_meters": 250},
        ],
        competitor_items=[],
        residential_items=[{"units_count": 2500}],
    )
    assert 80.0 <= score <= 100.0
    assert status == "YUQORI SALOHIYAT"

    # Saturated conditions: many competitors, weak transit
    score_low, status_low, factors_low = MakonScoreEngine.compute_makon_score(
        transit_items=[],
        anchor_items=[],
        competitor_items=[{"distance_meters": 40} for _ in range(6)],
        residential_items=[],
    )
    assert score_low < 50.0
    assert status_low == "PAST SALOHIYAT"
