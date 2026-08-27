from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class PredictionResponse(BaseModel):
    product_type: str
    confidence: float
    waste_category: str
    recyclability: str
    recommendation: str
    sustainability_score: int

class PredictionHistoryResponse(BaseModel):
    id: int
    image_name: str
    product_type: str
    confidence: float
    waste_category: str
    recyclability: str
    recommendation: str
    ip_address: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

