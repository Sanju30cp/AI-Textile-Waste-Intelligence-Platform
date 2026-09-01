from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.auth_handler import get_current_user
from app.auth.roles import require_role, RoleNames
from app.database.database import get_db
from app.models.inventory import Inventory
from app.schemas.inventory import InventoryCreate, InventoryResponse, InventoryUpdate
from app.services.recommendations import recommend
from app.services.sustainability import sustainability_analysis
from app.services.waste_classification import get_waste_info

router = APIRouter(prefix="/inventory", tags=["Inventory"])


def apply_sustainability(item):
    if not item.waste_category or item.waste_category == "Unknown":
        item.waste_category = get_waste_info(item.fabric_type).get("waste_category", "Unknown")
    analysis = sustainability_analysis(item)
    recommendation = recommend(item)
    item.material_recyclability_score = analysis["circularity"]["factors"]["material_recyclability"]
    item.circularity_score = analysis["circularity"]["score"]
    item.sustainability_score = round((item.circularity_score + item.material_recyclability_score) / 2, 2)
    item.recommended_action = recommendation["recommended_action"]
    impact = analysis["impact"]
    item.estimated_co2_savings = impact["estimated_co2_savings"]
    item.estimated_water_savings = impact["estimated_water_savings"]
    item.landfill_diversion = impact["landfill_diversion"]


@router.post("", response_model=InventoryResponse, dependencies=[Depends(require_role(RoleNames.ADMINISTRATOR, RoleNames.TEXTILE_MANUFACTURER, RoleNames.RECYCLING_FACILITY_OPERATOR, RoleNames.SUSTAINABILITY_MANAGER))])
def create_inventory(item: InventoryCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    inventory_item = Inventory(**item.model_dump())
    apply_sustainability(inventory_item)
    db.add(inventory_item)
    db.commit()
    db.refresh(inventory_item)
    return inventory_item


@router.get("", response_model=list[InventoryResponse], dependencies=[Depends(get_current_user)])
def list_inventory(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return db.query(Inventory).all()


@router.get("/{inventory_id}", response_model=InventoryResponse, dependencies=[Depends(get_current_user)])
def get_inventory(inventory_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    item = db.query(Inventory).filter(Inventory.id == inventory_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return item


@router.put("/{inventory_id}", response_model=InventoryResponse, dependencies=[Depends(require_role(RoleNames.ADMINISTRATOR, RoleNames.SUSTAINABILITY_MANAGER))])
def update_inventory(inventory_id: int, item: InventoryUpdate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    inventory_item = db.query(Inventory).filter(Inventory.id == inventory_id).first()
    if not inventory_item:
        raise HTTPException(status_code=404, detail="Inventory item not found")

    for field, value in item.model_dump(exclude_unset=True).items():
        setattr(inventory_item, field, value)

    apply_sustainability(inventory_item)
    db.commit()
    db.refresh(inventory_item)
    return inventory_item


@router.delete("/{inventory_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_role(RoleNames.ADMINISTRATOR))])
def delete_inventory(inventory_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    inventory_item = db.query(Inventory).filter(Inventory.id == inventory_id).first()
    if not inventory_item:
        raise HTTPException(status_code=404, detail="Inventory item not found")

    db.delete(inventory_item)
    db.commit()
    return None
