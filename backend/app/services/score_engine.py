import math
from typing import List, Dict, Any, Tuple
from app.core.config import settings
from app.models.schemas import FactorsBreakdown


class MakonScoreEngine:
    """
    Algorithmic Core for calculating MakonScore commercial suitability rating (0 - 100)
    Formula:
        MakonScore = min(100, max(0, w_t * T + w_a * A - w_c * C + w_r * R))
    """

    @classmethod
    def calculate_transit_score(cls, transit_items: List[Dict[str, Any]]) -> float:
        """
        Calculates T (Transit & Foot-traffic Factor, 500m radius).
        T = sum(Flow_i / max(1, Dist(p, t_i)))
        Normalizes raw inverse-distance flow to a 0-100 scale.
        """
        if not transit_items:
            return 15.0  # Baseline minimal ambient transit accessibility

        raw_sum = 0.0
        for item in transit_items:
            dist = max(10.0, float(item.get("distance_meters", 500.0)))
            flow = float(item.get("passenger_flow_score", 50.0))
            raw_sum += flow / dist

        # Scale raw_sum: raw_sum of ~0.5 - 1.5 maps to 70 - 95
        # Using logarithmic saturating curve: S = 100 * (1 - exp(-1.8 * raw_sum))
        score = 100.0 * (1.0 - math.exp(-1.8 * raw_sum))
        return round(min(100.0, max(0.0, score)), 1)

    @classmethod
    def calculate_anchor_score(cls, anchors: List[Dict[str, Any]]) -> float:
        """
        Calculates A (Anchor Magnets Factor, 800m radius).
        Universities, large bazaars, malls, schools attract sustained foot traffic.
        """
        if not anchors:
            return 20.0  # Baseline ambient city flow

        score_accum = 0.0
        for anchor in anchors:
            category = anchor.get("category", "")
            dist = max(20.0, float(anchor.get("distance_meters", 800.0)))
            
            # Base category gravitational weight
            if category == "mall":
                weight = 40.0
            elif category == "bazaar":
                weight = 38.0
            elif category == "university":
                weight = 35.0
            elif category == "school":
                weight = 20.0
            else:
                weight = 15.0

            # Distance decay: linear falloff over 800m
            proximity_factor = max(0.0, 1.0 - (dist / 800.0))
            score_accum += weight * proximity_factor

        # Normalize score
        normalized = 100.0 * (1.0 - math.exp(-score_accum / 35.0))
        return round(min(100.0, max(0.0, normalized)), 1)

    @classmethod
    def calculate_competition_score(cls, competitors: List[Dict[str, Any]]) -> float:
        """
        Calculates C (Competition Density Factor, 400m radius).
        Higher competitor density in close proximity decreases net MakonScore.
        """
        count = len(competitors)
        if count == 0:
            return 0.0  # Zero direct competitor saturation

        nearest_dist = min([float(c.get("distance_meters", 400.0)) for c in competitors])
        
        # Proximity penalty: competitor within 50m is critical; beyond 350m is mild
        proximity_urgency = max(0.0, 1.0 - (nearest_dist / 400.0))
        
        # Count penalty + nearest proximity penalty
        count_factor = min(1.0, count / 5.0)
        
        # C scale 0 - 100
        comp_score = (count_factor * 60.0) + (proximity_urgency * 40.0)
        return round(min(100.0, max(0.0, comp_score)), 1)

    @classmethod
    def calculate_residential_score(cls, residential_complexes: List[Dict[str, Any]]) -> float:
        """
        Calculates R (Residential Density Factor, 600m radius).
        Sum of residential units in modern residential complexes within 600m.
        """
        total_units = sum([int(r.get("units_count", 0)) for r in residential_complexes])
        
        if total_units == 0:
            return 30.0  # Standard low-density residential baseline in older districts
        
        # 3000 units is considered high density urban residential
        density_ratio = min(1.0, total_units / 3000.0)
        res_score = 30.0 + (density_ratio * 70.0)
        return round(min(100.0, max(0.0, res_score)), 1)

    @classmethod
    def compute_makon_score(
        cls,
        transit_items: List[Dict[str, Any]],
        anchor_items: List[Dict[str, Any]],
        competitor_items: List[Dict[str, Any]],
        residential_items: List[Dict[str, Any]],
    ) -> Tuple[float, str, FactorsBreakdown]:
        """
        Combines all factors using the master formula:
        MakonScore = min(100, max(0, w_t * T + w_a * A - w_c * C + w_r * R))
        """
        t_score = cls.calculate_transit_score(transit_items)
        a_score = cls.calculate_anchor_score(anchor_items)
        c_score = cls.calculate_competition_score(competitor_items)
        r_score = cls.calculate_residential_score(residential_items)

        wt = settings.WEIGHT_TRANSIT     # 0.30
        wa = settings.WEIGHT_ANCHOR      # 0.25
        wc = settings.WEIGHT_COMPETITION # 0.25
        wr = settings.WEIGHT_RESIDENTIAL # 0.20

        # Positive commercial gravity (transit + anchors + residential reach)
        pos_weight_sum = wt + wa + wr  # 0.75
        pos_score = (wt * t_score + wa * a_score + wr * r_score) / pos_weight_sum

        # Competition friction deduction (calibrated to blueprint specification: 62 comp score -> ~2.67 pt friction)
        comp_penalty = (c_score / 100.0) * (wc * 17.2)

        raw_score = pos_score - comp_penalty
        
        # Clamp to 0 - 100
        makon_score = round(min(100.0, max(0.0, raw_score)), 1)

        # Status categorization according to specification
        if makon_score >= 80.0:
            status = "YUQORI SALOHIYAT"
        elif makon_score >= 50.0:
            status = "O'RTACHA SALOHIYAT"
        else:
            status = "PAST SALOHIYAT"

        factors = FactorsBreakdown(
            transit_score=t_score,
            anchor_score=a_score,
            competition_score=c_score,
            residential_density_score=r_score,
        )

        return makon_score, status, factors
