from sqlalchemy import Column, Integer, String, Float, Date, DateTime
from sqlalchemy.sql import func

from app.database.database import Base


class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    batch_id = Column(String(100), unique=True, index=True, nullable=False)
    fabric_type = Column(String(100), nullable=False, index=True)
    material_composition = Column(String(100), nullable=False)
    quantity = Column(String(50), nullable=False)
    recyclability = Column(String(50), nullable=False)
    status = Column(String(50), nullable=False, default="Pending Review", index=True)
    origin = Column(String(255), nullable=True)
    destination = Column(String(255), nullable=True)
    collection_date = Column(Date, nullable=False, index=True)
    
    # Milestone 3 fields
    condition = Column(String(100), default="Unknown")
    reuse_potential = Column(String(100), default="Unknown")
    processing_feasibility = Column(String(100), default="Unknown")
    environmental_benefit = Column(String(100), default="Unknown")
    
    material_recyclability_score = Column(Float, default=0.0)
    circularity_score = Column(Float, default=0.0)
    sustainability_score = Column(Float, default=0.0)
    
    waste_category = Column(String(100), default="Unknown", index=True)
    recommended_action = Column(String(255), default="Pending")
    
    estimated_co2_savings = Column(Float, default=0.0)
    estimated_water_savings = Column(Float, default=0.0)
    landfill_diversion = Column(Float, default=0.0)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
