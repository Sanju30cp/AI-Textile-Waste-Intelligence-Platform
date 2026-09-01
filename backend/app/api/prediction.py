from fastapi import APIRouter, File, UploadFile, Request, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
import os

from app.schemas.prediction import PredictionResponse, PredictionHistoryResponse
from app.services.prediction_service import prediction_service
from app.database.database import get_db
from app.models.prediction_history import PredictionHistory
from app.models.inventory import Inventory

router = APIRouter(tags=["prediction"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

MAX_FILE_SIZE = 5 * 1024 * 1024 # 5MB
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    """
    Upload an image to the server with validation.
    """
    # Validate format
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Unsupported format. Only JPG, PNG, WEBP are allowed.")
    
    # Validate size
    file_content = await file.read()
    if len(file_content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="Image too large. Maximum size is 5MB.")
    
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        buffer.write(file_content)
    
    return {"message": "File uploaded successfully", "filename": file.filename, "file_path": file_path}

@router.post("/predict/upload")
async def upload_image_compat(file: UploadFile = File(...)):
    return await upload_image(file)

@router.post("/predict", response_model=PredictionResponse)
async def predict(request: Request, filename: str, db: Session = Depends(get_db)):
    """
    Classify the uploaded image and log the request to the database.
    """
    if not filename:
        raise HTTPException(status_code=400, detail="No filename provided.")
        
    image_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail="Image not found.")

    try:
        # Get AI Prediction
        result = prediction_service.predict(image_path)
        
        # Determine status
        status = "Success"
        if result.get("product_type") == "Model not loaded" or result.get("error"):
            status = "No prediction"
            
        ip_address = request.client.host if request.client else "Unknown"

        # Log to Database
        log_entry = PredictionHistory(
            image_name=filename,
            product_type=result.get("product_type", "Unknown"),
            confidence=result.get("confidence", 0.0),
            waste_category=result.get("waste_category", "Unknown"),
            recyclability=result.get("recyclability", "Unknown"),
            recommendation=result.get("recommendation", "None"),
            ip_address=ip_address,
            status=status
        )
        db.add(log_entry)
        db.commit()

        if status == "No prediction":
            raise HTTPException(status_code=422, detail="No prediction could be made. AI Model failed.")

        return PredictionResponse(
            product_type=result["product_type"],
            confidence=result["confidence"],
            waste_category=result["waste_category"],
            recyclability=result["recyclability"],
            recommendation=result["recommendation"],
            sustainability_score=result["sustainability_score"]
        )
    except HTTPException:
        # Re-raise known HTTP exceptions
        raise
    except Exception as e:
        print(f"Server Error during prediction: {e}")
        raise HTTPException(status_code=503, detail="Database unavailable or server down.")

@router.post("/predict/confirm")
def confirm_prediction(payload: dict, db: Session = Depends(get_db)):
    required_fields = ["filename", "batch_id", "fabric_type", "material_composition", "quantity", "recyclability", "collection_date"]
    missing = [field for field in required_fields if not payload.get(field)]
    if missing:
        raise HTTPException(status_code=400, detail=f"Missing required fields: {', '.join(missing)}")

    inventory_item = Inventory(
        batch_id=str(payload["batch_id"]),
        fabric_type=str(payload["fabric_type"]),
        material_composition=str(payload["material_composition"]),
        quantity=str(payload["quantity"]),
        recyclability=str(payload["recyclability"]),
        status=str(payload.get("status", "Pending Review")),
        condition=str(payload.get("condition", "Unknown")),
        collection_date=datetime.strptime(str(payload["collection_date"]), "%Y-%m-%d").date(),
        sustainability_score=float(payload.get("sustainability_score", 0.0)),
        waste_category=str(payload.get("waste_category", "Unknown")),
    )
    db.add(inventory_item)
    db.commit()
    db.refresh(inventory_item)
    return {"message": "Prediction confirmed and saved to inventory", "inventory_id": inventory_item.id, "item": inventory_item}


@router.get("/history", response_model=list[PredictionHistoryResponse])
async def get_prediction_history(db: Session = Depends(get_db)):
    """
    Retrieve the history of predictions from the database.
    """
    history = db.query(PredictionHistory).order_by(PredictionHistory.created_at.desc()).all()
    return history

