def calculate_score(product_type: str):
    scores = {
        "Blouses_Shirts": 70,
        "Cardigans": 70,
        "Denim": 85,
        "Dresses": 75,
        "Graphic_Tees": 65,
        "Jackets_Coats": 90,
        "Jackets_Vests": 90,
        "Leggings": 50,
        "Pants": 70,
        "Rompers_Jumpsuits": 75,
        "Shirts_Polos": 70,
        "Shorts": 70,
        "Skirts": 75,
        "Suiting": 85,
        "Sweaters": 80,
        "Sweatshirts_Hoodies": 75,
        "Tees_Tanks": 65
    }
    return scores.get(product_type, 60)
