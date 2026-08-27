from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel


class InventoryBase(BaseModel):
    batch_id: str
    fabric_type: str
    material_composition: str
    quantity: str
    recyclability: str
    status: str
    collection_date: date


class InventoryCreate(InventoryBase):
    pass


class InventoryUpdate(BaseModel):
    batch_id: Optional[str] = None
    fabric_type: Optional[str] = None
    material_composition: Optional[str] = None
    quantity: Optional[str] = None
    recyclability: Optional[str] = None
    status: Optional[str] = None
    collection_date: Optional[date] = None


class InventoryResponse(InventoryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
