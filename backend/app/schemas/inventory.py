from datetime import date, datetime

from pydantic import BaseModel


class InventoryBase(BaseModel):
    batch_id: str
    fabric_type: str
    source: str
    quantity: float
    color: str
    condition: str
    collection_date: date


class InventoryCreate(InventoryBase):
    pass


class InventoryUpdate(InventoryBase):
    pass


class InventoryResponse(InventoryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
