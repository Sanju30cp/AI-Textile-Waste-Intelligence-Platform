from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.database import get_db
from app.models.inventory import Inventory
from app.models.prediction_history import PredictionHistory

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("")
def get_analytics(db: Session = Depends(get_db)):
    # 1. Circularity Stats
    total_inventory = db.query(Inventory).count()
    recycled_inventory = db.query(Inventory).filter(Inventory.status == "Recycled").count()
    
    circularity_rate = (recycled_inventory / total_inventory * 100) if total_inventory > 0 else 0
    co2_saved = recycled_inventory * 5.2 # Extrapolation: 5.2kg CO2 per recycled item
    unrecyclable = db.query(Inventory).filter(Inventory.recyclability == "Low").count()

    stats = [
        {"label": "Circularity Rate", "value": f"{circularity_rate:.1f}%", "description": "Based on items marked 'Recycled'"},
        {"label": "Total Saved CO₂", "value": f"{co2_saved:.1f} kg", "description": "Derived from recycled items"},
        {"label": "Unrecyclable Waste", "value": f"{unrecyclable} Items", "description": "Needs alternative disposal methods"},
        {"label": "Total Logged Items", "value": f"{total_inventory} Items", "description": "Lifetime processing volume"}
    ]

    # 2. Doughnut Data (Distribution of Fabric Types)
    fabric_distribution = db.query(
        Inventory.fabric_type, 
        func.count(Inventory.id)
    ).group_by(Inventory.fabric_type).all()

    doughnut_labels = [row[0] for row in fabric_distribution]
    doughnut_data = [row[1] for row in fabric_distribution]

    if not doughnut_labels:
        doughnut_labels = ['No Data Yet']
        doughnut_data = [1]

    # 3. Bar Data (Recovered/Recycled items by type)
    recovered_distribution = db.query(
        Inventory.fabric_type, 
        func.count(Inventory.id)
    ).filter(Inventory.status == "Recycled").group_by(Inventory.fabric_type).all()

    bar_labels = [row[0] for row in recovered_distribution]
    bar_data = [row[1] for row in recovered_distribution]

    if not bar_labels:
        bar_labels = ['No Data']
        bar_data = [0]

    return {
        "stats": stats,
        "doughnut": {
            "labels": doughnut_labels,
            "data": doughnut_data
        },
        "bar": {
            "labels": bar_labels,
            "data": bar_data
        }
    }
