from sqlalchemy import Column, Integer, String, Float, Date, DateTime
from sqlalchemy.sql import func

from app.database.database import Base


class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    batch_id = Column(String(100), unique=True, index=True, nullable=False)
    fabric_type = Column(String(100), nullable=False)
    source = Column(String(100), nullable=False)
    quantity = Column(Float, nullable=False)
    color = Column(String(50), nullable=False)
    condition = Column(String(50), nullable=False)
    collection_date = Column(Date, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
