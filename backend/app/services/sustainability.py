import re

from app.config.config import (
    CO2_SAVINGS_PER_KG, LANDFILL_DIVERSION_PER_KG,
    RESOURCE_RECOVERY_PER_KG, WATER_SAVINGS_PER_KG,
)

MATERIAL_RECYCLABILITY = {
    "cotton": 90, "denim": 88, "linen": 86, "wool": 82, "polyester": 78,
    "nylon": 76, "viscose": 70, "acrylic": 55, "silk": 48,
    "corduroy": 70, "terrycloth": 65, "felt": 45, "fleece": 42,
    "crepe": 42, "velvet": 38, "satin": 35, "chenille": 35,
}
LEVEL_SCORES = {"high": 90, "good": 85, "medium": 65, "moderate": 60,
                "low": 35, "poor": 25, "unknown": 50}
CONDITION_SCORES = {"new": 95, "excellent": 95, "good": 80, "fair": 60,
                    "damaged": 35, "poor": 25, "unknown": 50}


def quantity_kg(quantity):
    """Parse the existing quantity string; numeric values are assumed kg."""
    if quantity is None:
        return 0.0
    match = re.search(r"[-+]?\d+(?:\.\d+)?", str(quantity).replace(",", ""))
    return max(float(match.group()), 0.0) if match else 0.0


def _level(value):
    return LEVEL_SCORES.get(str(value or "unknown").strip().lower(), 50)


def calculate_score(product_type: str):
    """Backward-compatible material-only score used by prediction responses."""
    return round(MATERIAL_RECYCLABILITY.get(str(product_type).lower(), 50))


def circularity_analysis(material, condition="Unknown", reuse_potential="Unknown",
                        environmental_benefit="Unknown", processing_feasibility="Unknown",
                        recyclability="Unknown"):
    factors = {
        "material_recyclability": MATERIAL_RECYCLABILITY.get(str(material).lower(), _level(recyclability)),
        "material_condition": CONDITION_SCORES.get(str(condition).lower(), 50),
        "reuse_potential": _level(reuse_potential),
        "environmental_benefit": _level(environmental_benefit),
        "processing_feasibility": _level(processing_feasibility),
    }
    weights = {"material_recyclability": .35, "material_condition": .20,
               "reuse_potential": .20, "environmental_benefit": .15,
               "processing_feasibility": .10}
    score = round(sum(factors[name] * weight for name, weight in weights.items()), 2)
    if score >= 85:
        category = "Excellent Recovery Potential"
    elif score >= 70:
        category = "High Recovery Potential"
    elif score >= 50:
        category = "Moderate Recovery Potential"
    elif score >= 30:
        category = "Limited Recovery Potential"
    else:
        category = "Disposal Recommended"
    return {"score": score, "category": category, "factors": factors, "weights": weights}


def environmental_impact(quantity, recovered_quantity=None):
    recovered = quantity_kg(quantity) if recovered_quantity is None else max(float(recovered_quantity), 0.0)
    return {
        "estimated_co2_savings": round(recovered * CO2_SAVINGS_PER_KG, 2),
        "estimated_water_savings": round(recovered * WATER_SAVINGS_PER_KG, 2),
        "landfill_diversion": round(recovered * LANDFILL_DIVERSION_PER_KG, 2),
        "resource_recovery": round(recovered * RESOURCE_RECOVERY_PER_KG, 2),
        "assumptions": {"quantity_unit": "kg", "co2_kg_per_kg_recovered": CO2_SAVINGS_PER_KG,
                        "water_litres_per_kg_recovered": WATER_SAVINGS_PER_KG,
                        "landfill_kg_per_kg_recovered": LANDFILL_DIVERSION_PER_KG,
                        "resource_kg_per_kg_recovered": RESOURCE_RECOVERY_PER_KG},
    }


def sustainability_analysis(item):
    material = item.fabric_type or item.material_composition or "Unknown"
    circularity = circularity_analysis(material, item.condition, item.reuse_potential,
                                       item.environmental_benefit, item.processing_feasibility,
                                       item.recyclability)
    recovered = quantity_kg(item.quantity) if item.status in {"Recycled", "Reused", "Processed"} else 0
    impact = environmental_impact(item.quantity, recovered)
    return {"circularity": circularity, "impact": impact,
            "recyclable": circularity["factors"]["material_recyclability"] >= 60,
            "reusable": circularity["factors"]["reuse_potential"] >= 60,
            "quantity_kg": quantity_kg(item.quantity)}
