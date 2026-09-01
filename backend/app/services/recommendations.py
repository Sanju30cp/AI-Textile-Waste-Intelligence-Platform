from app.services.sustainability import circularity_analysis


def recommend(item):
    material = str(item.fabric_type or item.material_composition or "unknown").lower()
    condition = str(item.condition or "unknown").lower()
    contamination = " ".join(str(value or "") for value in (
        getattr(item, "environmental_benefit", ""),
        getattr(item, "material_composition", ""),
        getattr(item, "condition", ""),
    )).lower()
    analysis = circularity_analysis(item.fabric_type, item.condition, item.reuse_potential,
                                   item.environmental_benefit, item.processing_feasibility,
                                   item.recyclability)
    score = analysis["score"]
    if "contamin" in contamination or condition in {"hazardous", "heavily contaminated"}:
        action, alternative, reason, recovery = "Disposal", "Industrial Recovery", "Contamination or hazardous condition restricts conventional recovery.", "Restricted recovery"
    elif condition in {"new", "excellent", "good"} and analysis["factors"]["reuse_potential"] >= 60:
        action, alternative, reason, recovery = "Fabric Reuse", "Donation", "Good condition and reuse potential favor direct life extension.", "Reuse"
    elif material in {"cotton", "denim", "linen", "wool", "corduroy", "terrycloth"}:
        action, alternative, reason, recovery = "Fiber Recycling", "Mechanical Recycling", "Natural or cellulose-rich fibers are suited to fiber recovery.", "Material recovery"
    elif material in {"polyester", "nylon"} and analysis["factors"]["processing_feasibility"] >= 60:
        action, alternative, reason, recovery = "Chemical Recycling", "Mechanical Recycling", "The synthetic polymer and feasible processing support polymer recovery.", "Polymer recovery"
    elif analysis["factors"]["reuse_potential"] >= 50:
        action, alternative, reason, recovery = "Upcycling", "Industrial Recovery", "Reuse is limited, but the material can be redirected into another product.", "Upcycling"
    else:
        action, alternative, reason, recovery = "Disposal", "Industrial Recovery", "Available condition and processing signals do not support reliable recovery.", "No conventional recovery"
    return {"recommended_action": action, "alternative_action": alternative,
            "reason": reason, "expected_recovery_type": recovery,
            "suitability_score": score, "circularity_category": analysis["category"]}