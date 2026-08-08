from sqlalchemy import create_engine, text
from app.config.config import DATABASE_URL

engine = create_engine(DATABASE_URL)

with engine.begin() as con:
    try:
        con.execute(text("ALTER TABLE prediction_history ADD COLUMN ip_address VARCHAR(50);"))
        print("Added ip_address column.")
    except Exception as e:
        print(f"Column ip_address might already exist: {e}")
        
    try:
        con.execute(text("ALTER TABLE prediction_history ADD COLUMN status VARCHAR(50) DEFAULT 'Success';"))
        print("Added status column.")
    except Exception as e:
        print(f"Column status might already exist: {e}")

print("Migration complete!")
