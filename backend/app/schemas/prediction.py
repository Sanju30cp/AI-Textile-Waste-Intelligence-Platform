from pydantic import BaseModel
from typing import Optional

class PredictionResponse(BaseModel):
    product_type: str
    confidence: float
    waste_category: str
    recyclability: str
    recommendation: str
    sustainability_score: int
