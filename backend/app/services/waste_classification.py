WASTE_RULES = {
    "Cotton": {"waste_category": "Recyclable", "recyclability": "High", "recommendation": "Mechanical shredding for cotton fiber recovery."},
    "Denim": {"waste_category": "Recyclable", "recyclability": "High", "recommendation": "Shred and spin back into recycled denim yarns."},
    "Wool": {"waste_category": "Recyclable", "recyclability": "High", "recommendation": "Shred to recover yarn fibers. Suitable for insulation or re-spinning."},
    "Linen": {"waste_category": "Recyclable", "recyclability": "High", "recommendation": "Mechanical shredding for natural fiber recovery."},
    "Silk": {"waste_category": "Reusable", "recyclability": "Medium", "recommendation": "High value item. Route to premium resale or professional repair."},
    "Polyester": {"waste_category": "Recyclable", "recyclability": "High", "recommendation": "Chemical depolymerization to recover pure PET."},
    "Nylon": {"waste_category": "Recyclable", "recyclability": "High", "recommendation": "Chemical depolymerization or mechanical melting."},
    "Acrylic": {"waste_category": "Recyclable", "recyclability": "Medium", "recommendation": "Mechanical shredding, often blended with other fibers."},
    "Fleece": {"waste_category": "Upcyclable", "recyclability": "Low", "recommendation": "Difficult to recycle. Upcycle into insulation or padding."},
    "Viscose": {"waste_category": "Recyclable", "recyclability": "Medium", "recommendation": "Chemical processing for cellulosic fiber recovery."},
    "Corduroy": {"waste_category": "Recyclable", "recyclability": "Medium", "recommendation": "Mechanical shredding for cotton/blend fiber recovery."},
    "Terrycloth": {"waste_category": "Upcyclable", "recyclability": "Medium", "recommendation": "Upcycle into industrial rags or cleaning cloths."},
    "Felt": {"waste_category": "Upcyclable", "recyclability": "Low", "recommendation": "Upcycle into padding or acoustic insulation."},
    "Crepe": {"waste_category": "Upcyclable", "recyclability": "Low", "recommendation": "Difficult to process due to twist. Route to downcycling."},
    "Velvet": {"waste_category": "Upcyclable", "recyclability": "Low", "recommendation": "Difficult to mechanically recycle. Downcycle into upholstery filling."},
    "Satin": {"waste_category": "Upcyclable", "recyclability": "Low", "recommendation": "Complex weave. Upcycle or route to chemical processing if synthetic."},
    "Chenille": {"waste_category": "Upcyclable", "recyclability": "Low", "recommendation": "Complex tufted yarn. Downcycle into industrial filling."}
}

def get_waste_info(product_type: str):
    return WASTE_RULES.get(product_type, {
        "waste_category": "Unknown",
        "recyclability": "Unknown",
        "recommendation": "No recommendation available"
    })
