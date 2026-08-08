WASTE_RULES = {
    "Blouses_Shirts": {"waste_category": "Reusable", "recyclability": "Medium", "recommendation": "Sort for second-hand donation or retail."},
    "Cardigans": {"waste_category": "Reusable", "recyclability": "Medium", "recommendation": "Sort for second-hand donation or retail."},
    "Denim": {"waste_category": "Recyclable", "recyclability": "High", "recommendation": "Shred and spin back into recycled denim yarns."},
    "Dresses": {"waste_category": "Reusable", "recyclability": "Medium", "recommendation": "Sort for second-hand donation or retail."},
    "Graphic_Tees": {"waste_category": "Upcyclable", "recyclability": "Low", "recommendation": "Upcycle into industrial rags or cleaning cloths."},
    "Jackets_Coats": {"waste_category": "Repairable", "recyclability": "High", "recommendation": "Repair zippers/buttons and reuse."},
    "Jackets_Vests": {"waste_category": "Repairable", "recyclability": "High", "recommendation": "Repair zippers/buttons and reuse."},
    "Leggings": {"waste_category": "Recyclable", "recyclability": "Low", "recommendation": "Difficult to mechanically recycle. Route to chemical depolymerization."},
    "Pants": {"waste_category": "Reusable", "recyclability": "Medium", "recommendation": "Sort for second-hand donation or retail."},
    "Rompers_Jumpsuits": {"waste_category": "Reusable", "recyclability": "Medium", "recommendation": "Sort for second-hand donation or retail."},
    "Shirts_Polos": {"waste_category": "Reusable", "recyclability": "Medium", "recommendation": "Sort for second-hand donation or retail."},
    "Shorts": {"waste_category": "Reusable", "recyclability": "Medium", "recommendation": "Sort for second-hand donation or retail."},
    "Skirts": {"waste_category": "Reusable", "recyclability": "Medium", "recommendation": "Sort for second-hand donation or retail."},
    "Suiting": {"waste_category": "Reusable", "recyclability": "High", "recommendation": "High value item. Route to premium resale or professional repair."},
    "Sweaters": {"waste_category": "Recyclable", "recyclability": "High", "recommendation": "Shred to recover yarn fibers. Suitable for insulation or re-spinning."},
    "Sweatshirts_Hoodies": {"waste_category": "Reusable", "recyclability": "Medium", "recommendation": "Sort for second-hand donation or retail."},
    "Tees_Tanks": {"waste_category": "Upcyclable", "recyclability": "Low", "recommendation": "Upcycle into industrial rags or cleaning cloths."}
}

def get_waste_info(product_type: str):
    return WASTE_RULES.get(product_type, {
        "waste_category": "Unknown",
        "recyclability": "Unknown",
        "recommendation": "No recommendation available"
    })
