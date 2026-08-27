from sqlalchemy import Column, Integer, String, Float, Date, DateTime
from sqlalchemy.sql import func

from app.database.database import Base


class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    batch_id = Column(String(100), unique=True, index=True, nullable=False)
    fabric_type = Column(String(100), nullable=False)
    material_composition = Column(String(100), nullable=False)
    quantity = Column(String(50), nullable=False)
    recyclability = Column(String(50), nullable=False)
    status = Column(String(50), nullable=False, default="Pending Review")
    collection_date = Column(Date, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
