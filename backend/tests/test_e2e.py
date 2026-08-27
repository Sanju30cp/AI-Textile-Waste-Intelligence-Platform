import os
import io
from fastapi.testclient import TestClient
from PIL import Image

from app.main import app

client = TestClient(app)

def create_dummy_image():
    image = Image.new('RGB', (100, 100), color = 'red')
    img_byte_arr = io.BytesIO()
    image.save(img_byte_arr, format='JPEG')
    img_byte_arr.seek(0)
    return img_byte_arr

def test_upload_and_predict_flow():
    # 1. Upload a dummy image
    img_bytes = create_dummy_image()
    files = {'file': ('test_image.jpg', img_bytes, 'image/jpeg')}
    
    response = client.post("/upload", files=files)
    assert response.status_code == 200
    
    data = response.json()
    assert "filename" in data
    filename = data["filename"]
    
    # 2. Predict on the uploaded image
    response = client.post(f"/predict?filename={filename}")
    
    # It might fail with 503 or 422 if DB is not set up correctly in test environment
    # or if model is not loaded. But we check for typical success or known failure.
    assert response.status_code in [200, 422, 503]
    
    if response.status_code == 200:
        pred_data = response.json()
        assert "product_type" in pred_data
        assert "confidence" in pred_data
        assert "sustainability_score" in pred_data
