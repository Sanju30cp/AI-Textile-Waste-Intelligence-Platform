from sqlalchemy import create_engine, text
from app.config.config import DATABASE_URL

engine = create_engine(DATABASE_URL)

with engine.begin() as con:
    con.execute(text("ALTER TABLE prediction_history ADD COLUMN IF NOT EXISTS ip_address VARCHAR(50);"))
    con.execute(text("ALTER TABLE prediction_history ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Success';"))
    print("Ensured prediction_history columns exist.")

    inventory_columns = {
        "condition": "VARCHAR(100) DEFAULT 'Unknown'",
        "reuse_potential": "VARCHAR(100) DEFAULT 'Unknown'",
        "processing_feasibility": "VARCHAR(100) DEFAULT 'Unknown'",
        "environmental_benefit": "VARCHAR(100) DEFAULT 'Unknown'",
        "material_recyclability_score": "FLOAT DEFAULT 0",
        "circularity_score": "FLOAT DEFAULT 0",
        "sustainability_score": "FLOAT DEFAULT 0",
        "waste_category": "VARCHAR(100) DEFAULT 'Unknown'",
        "recommended_action": "VARCHAR(255) DEFAULT 'Pending'",
        "estimated_co2_savings": "FLOAT DEFAULT 0",
        "estimated_water_savings": "FLOAT DEFAULT 0",
        "landfill_diversion": "FLOAT DEFAULT 0",
    }
    for column, definition in inventory_columns.items():
        con.execute(text(
            f"ALTER TABLE inventory ADD COLUMN IF NOT EXISTS {column} {definition};"
        ))
        print(f"Ensured inventory.{column} exists.")

    con.execute(text("""
        UPDATE inventory SET
            condition = COALESCE(condition, 'Unknown'),
            reuse_potential = COALESCE(reuse_potential, 'Unknown'),
            processing_feasibility = COALESCE(processing_feasibility, 'Unknown'),
            environmental_benefit = COALESCE(environmental_benefit, 'Unknown'),
            material_recyclability_score = COALESCE(material_recyclability_score, 0),
            circularity_score = COALESCE(circularity_score, 0),
            sustainability_score = COALESCE(sustainability_score, 0),
            waste_category = COALESCE(waste_category, 'Unknown'),
            recommended_action = COALESCE(recommended_action, 'Pending'),
            estimated_co2_savings = COALESCE(estimated_co2_savings, 0),
            estimated_water_savings = COALESCE(estimated_water_savings, 0),
            landfill_diversion = COALESCE(landfill_diversion, 0);
    """))

print("Migration complete!")
