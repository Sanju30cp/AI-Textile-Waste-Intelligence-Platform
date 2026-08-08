from fastapi import APIRouter, File, UploadFile, Request, Depends, HTTPException
from sqlalchemy.orm import Session
import os

from app.schemas.prediction import PredictionResponse
from app.services.prediction_service import prediction_service
from app.database.database import get_db
from app.models.prediction_history import PredictionHistory

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
