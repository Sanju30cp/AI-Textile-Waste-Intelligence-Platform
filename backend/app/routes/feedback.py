from fastapi import APIRouter, UploadFile, File, Form, HTTPException
import os
import uuid

router = APIRouter(prefix="/feedback", tags=["Feedback & Continuous Learning"])

# Base directory for the verified dataset
DATASET_DIR = os.path.join("dataset", "verified")

@router.post("")
async def submit_feedback(
    file: UploadFile = File(...), 
    corrected_fabric_type: str = Form(...)
):
    try:
        # Sanitize folder name
        safe_type = "".join([c if c.isalnum() else "_" for c in corrected_fabric_type]).lower()
        target_dir = os.path.join(DATASET_DIR, safe_type)
        
        # Create directory if it doesn't exist
        os.makedirs(target_dir, exist_ok=True)
        
        # Generate a unique filename
        ext = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
        filename = f"{uuid.uuid4().hex}.{ext}"
        filepath = os.path.join(target_dir, filename)
        
        # Save the verified image
        with open(filepath, "wb") as f:
            content = await file.read()
            f.write(content)
            
        return {
            "success": True, 
            "message": f"Verified image saved successfully to {safe_type} dataset.",
            "path": filepath
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save feedback: {str(e)}")
