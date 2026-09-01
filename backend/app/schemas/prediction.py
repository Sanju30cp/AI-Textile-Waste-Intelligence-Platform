from pydantic import BaseModel, ConfigDict
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

    model_config = ConfigDict(from_attributes=True)

