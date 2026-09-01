from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class InventoryBase(BaseModel):
    batch_id: str
    fabric_type: str
    material_composition: str
    quantity: str
    recyclability: str
    status: str = "Pending Review"
    origin: Optional[str] = None
    destination: Optional[str] = None
    collection_date: date
    condition: str = "Unknown"
    reuse_potential: str = "Unknown"
    processing_feasibility: str = "Unknown"
    environmental_benefit: str = "Unknown"


class InventoryCreate(InventoryBase):
    pass


class InventoryUpdate(BaseModel):
    batch_id: Optional[str] = None
    fabric_type: Optional[str] = None
    material_composition: Optional[str] = None
    quantity: Optional[str] = None
    recyclability: Optional[str] = None
    status: Optional[str] = None
    origin: Optional[str] = None
    destination: Optional[str] = None
    collection_date: Optional[date] = None
    condition: Optional[str] = None
    reuse_potential: Optional[str] = None
    processing_feasibility: Optional[str] = None
    environmental_benefit: Optional[str] = None


class InventoryResponse(InventoryBase):
    id: int
    created_at: datetime
    material_recyclability_score: float = 0.0
    circularity_score: float = 0.0
    sustainability_score: float = 0.0
    waste_category: str = "Unknown"
    recommended_action: str = "Pending"
    estimated_co2_savings: float = 0.0
    estimated_water_savings: float = 0.0
    landfill_diversion: float = 0.0

    model_config = ConfigDict(from_attributes=True)
