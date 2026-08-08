from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from sqlalchemy.sql import func

from app.database.database import Base

class PredictionHistory(Base):
    __tablename__ = "prediction_history"

    id = Column(Integer, primary_key=True, index=True)
    image_name = Column(String(255))
    product_type = Column(String(100))
    confidence = Column(Float)
    waste_category = Column(String(100))
    recyclability = Column(String(100))
    recommendation = Column(Text)
    ip_address = Column(String(50))
    status = Column(String(50), default="Success")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
