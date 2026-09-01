from types import SimpleNamespace

from app.services.recommendations import recommend
from app.services.sustainability import circularity_analysis, environmental_impact, sustainability_analysis


def make_item(**overrides):
    values = {
        "fabric_type": "Cotton", "material_composition": "100% cotton",
        "quantity": "10 kg", "recyclability": "High", "condition": "Good",
        "reuse_potential": "High", "processing_feasibility": "High",
        "environmental_benefit": "High", "waste_category": "Recyclable",
        "status": "Pending Review", "material_recyclability_score": 90,
        "circularity_score": 88, "sustainability_score": 89,
    }
    values.update(overrides)
    return SimpleNamespace(**values)


def test_circularity_uses_required_weights_and_exposes_factors():
    result = circularity_analysis("Cotton", "Good", "High", "High", "High", "High")
    assert result["score"] == 88.0
    assert result["factors"]["material_recyclability"] == 90
    assert sum(result["weights"].values()) == 1


def test_environmental_estimates_are_configured_per_recovered_kg():
    result = environmental_impact("10 kg", 4)
    assert result["estimated_co2_savings"] == 10.0
    assert result["estimated_water_savings"] == 4000.0
    assert result["landfill_diversion"] == 4.0


def test_recommendation_prefers_reuse_for_good_cotton():
    result = recommend(make_item())
    assert result["recommended_action"] == "Fabric Reuse"
    assert result["alternative_action"] == "Donation"


def test_zero_quantity_and_contamination_are_safe():
    item = make_item(quantity="0", material_composition="contaminated cotton")
    assert sustainability_analysis(item)["quantity_kg"] == 0
    assert recommend(item)["recommended_action"] == "Disposal"