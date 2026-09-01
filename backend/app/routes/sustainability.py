from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional

from app.auth.auth_handler import get_current_user
from app.auth.roles import require_role, RoleNames
from app.database.database import get_db
from app.models.inventory import Inventory
from app.services.recommendations import recommend
from app.services.sustainability import environmental_impact, quantity_kg, sustainability_analysis

router = APIRouter(prefix="/sustainability", tags=["Sustainability"])
ALLOWED = (RoleNames.ADMINISTRATOR, RoleNames.TEXTILE_MANUFACTURER,
           RoleNames.RECYCLING_FACILITY_OPERATOR, RoleNames.SUSTAINABILITY_MANAGER)


def _items(db, date_range: Optional[str] = None):
    query = db.query(Inventory)
    if date_range:
        now = datetime.utcnow()
        if date_range == 'today':
            start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
        elif date_range == 'last_7_days':
            start_date = now - timedelta(days=7)
        elif date_range == 'last_30_days':
            start_date = now - timedelta(days=30)
        elif date_range == 'last_6_months':
            start_date = now - timedelta(days=180)
        else:
            start_date = None
            
        if start_date:
            query = query.filter(Inventory.created_at >= start_date)
            
    return query.all()


def _analytics(db, date_range=None):
    items = _items(db, date_range)
    total = sum(quantity_kg(item.quantity) for item in items)
    recyclable = sum(quantity_kg(item.quantity) for item in items if sustainability_analysis(item)["recyclable"])
    reusable = sum(quantity_kg(item.quantity) for item in items if sustainability_analysis(item)["reusable"])
    recycled = sum(quantity_kg(item.quantity) for item in items if item.status == "Recycled")
    reused = sum(quantity_kg(item.quantity) for item in items if item.status == "Reused")
    processed = sum(quantity_kg(item.quantity) for item in items if item.status == "Processed")
    diverted = recycled + reused + processed
    analyses = [sustainability_analysis(item) for item in items]
    scores = [analysis["circularity"]["score"] for analysis in analyses]
    material_recovery = recycled + processed
    impact = environmental_impact(total, diverted)
    categories = {}
    recovery = {}
    for item in items:
        category = sustainability_analysis(item)["circularity"]["category"]
        categories[category] = categories.get(category, 0) + 1
        action = item.recommended_action or "Pending"
        recovery[action] = recovery.get(action, 0) + quantity_kg(item.quantity)
    return {
        "total_textile_waste": round(total, 2), "total_recyclable_waste": round(recyclable, 2),
        "total_reusable_waste": round(reusable, 2), "total_upcyclable_waste": round(sum(quantity_kg(i.quantity) for i in items if i.waste_category == "Upcyclable"), 2),
        "total_recycled_quantity": round(recycled, 2), "total_reused_quantity": round(reused, 2),
        "landfill_diverted_quantity": round(diverted, 2), "material_recovery_quantity": round(material_recovery, 2),
        "recovery_rate": round(diverted / total * 100, 2) if total else 0,
        "waste_diversion_rate": round(diverted / total * 100, 2) if total else 0,
        "recyclable_percentage": round(recyclable / total * 100, 2) if total else 0,
        "reusable_percentage": round(reusable / total * 100, 2) if total else 0,
        "upcyclable_percentage": round(sum(quantity_kg(i.quantity) for i in items if i.waste_category == "Upcyclable") / total * 100, 2) if total else 0,
        "average_recyclability_score": round(sum(i.material_recyclability_score or 0 for i in items) / len(items), 2) if items else 0,
        "average_sustainability_score": round(sum(i.sustainability_score or 0 for i in items) / len(items), 2) if items else 0,
        "average_circularity_score": round(sum(scores) / len(scores), 2) if scores else 0,
        "circularity_distribution": categories,
        "recovery_distribution": recovery,
        "environmental_impact": impact,
    }


@router.get("/summary", dependencies=[Depends(require_role(*ALLOWED))])
def summary(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user), date_range: Optional[str] = Query(None)):
    return _analytics(db, date_range)


@router.get("/metrics", dependencies=[Depends(require_role(*ALLOWED))])
def metrics(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user), date_range: Optional[str] = Query(None)):
    return _analytics(db, date_range)


@router.get("/material-distribution", dependencies=[Depends(require_role(*ALLOWED))])
def material_distribution(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user), date_range: Optional[str] = Query(None)):
    result = {}
    for item in _items(db, date_range):
        result[item.fabric_type] = result.get(item.fabric_type, 0) + quantity_kg(item.quantity)
    return {"labels": list(result), "quantities": list(result.values())}


@router.get("/waste-distribution", dependencies=[Depends(require_role(*ALLOWED))])
def waste_distribution(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user), date_range: Optional[str] = Query(None)):
    items = _items(db, date_range)
    result = {}
    for item in items:
        result[item.waste_category or "Unknown"] = result.get(item.waste_category or "Unknown", 0) + quantity_kg(item.quantity)
    return {"labels": list(result), "quantities": list(result.values())}


@router.get("/environmental-impact", dependencies=[Depends(require_role(*ALLOWED))])
def environmental(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user), date_range: Optional[str] = Query(None)):
    return _analytics(db, date_range)["environmental_impact"]


@router.get("/circularity", dependencies=[Depends(require_role(*ALLOWED))])
def circularity(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user), date_range: Optional[str] = Query(None)):
    items = _items(db, date_range)
    distribution = {}
    for item in items:
        category = sustainability_analysis(item)["circularity"]["category"]
        distribution[category] = distribution.get(category, 0) + 1
    return {"average_score": _analytics(db, date_range)["average_circularity_score"], "distribution": distribution}


@router.get("/recommendations/{inventory_id}", dependencies=[Depends(require_role(*ALLOWED))])
def recommendation(inventory_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    item = db.query(Inventory).filter(Inventory.id == inventory_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return {"inventory_id": inventory_id, **recommend(item), "analysis": sustainability_analysis(item)}


@router.get("/recommendations", dependencies=[Depends(require_role(*ALLOWED))])
def recommendations(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return [{"inventory_id": item.id, **recommend(item)} for item in _items(db)]


recommendations_router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


@recommendations_router.get("", dependencies=[Depends(require_role(*ALLOWED))])
def top_recommendations(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return recommendations(db, current_user)


@recommendations_router.get("/{inventory_id}", dependencies=[Depends(require_role(*ALLOWED))])
def top_recommendation(inventory_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return recommendation(inventory_id, db, current_user)