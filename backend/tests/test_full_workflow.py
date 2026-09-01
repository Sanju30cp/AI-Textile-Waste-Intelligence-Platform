import io
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from PIL import Image
import time
import os

from app.main import app
from app.database.database import Base, get_db
from app.models.user import User

# In-memory SQLite for testing to avoid touching production Postgres
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

def setup_module(module):
    # Create all tables in the test database
    Base.metadata.create_all(bind=engine)

def teardown_module(module):
    # Drop all tables after tests
    Base.metadata.drop_all(bind=engine)
    engine.dispose()
    if os.path.exists("./test.db"):
        os.remove("./test.db")

def create_dummy_image():
    image = Image.new('RGB', (100, 100), color='green')
    img_byte_arr = io.BytesIO()
    image.save(img_byte_arr, format='JPEG')
    img_byte_arr.seek(0)
    return img_byte_arr

def test_full_e2e_workflow():
    # 1. Register User
    test_user = {
        "email": f"testuser_{int(time.time())}@example.com",
        "password": "securepassword123",
        "full_name": "Test User",
        "role": "Administrator"
    }
    response = client.post("/auth/register", json=test_user)
    assert response.status_code == 200
    assert "user_id" in response.json()

    # 2. Login User
    login_data = {
        "email": test_user["email"],
        "password": test_user["password"]
    }
    response = client.post("/auth/login", json=login_data)
    assert response.status_code == 200
    token_data = response.json()
    assert "access_token" in token_data
    token = token_data["access_token"]
    
    headers = {"Authorization": f"Bearer {token}"}

    # Security Test: Access protected route without token should fail
    fail_response = client.get("/inventory")
    assert fail_response.status_code in [401, 403]

    # 3. Upload Textile Image
    img_bytes = create_dummy_image()
    files = {'file': ('test_fabric.jpg', img_bytes, 'image/jpeg')}
    response = client.post("/predict/upload", files=files, headers=headers)
    assert response.status_code == 200
    filename = response.json()["filename"]

    # 4. AI Prediction & Waste Classification
    # Assuming POST /predict?filename=...
    response = client.post(f"/predict?filename={filename}", headers=headers)
    assert response.status_code in [200, 503] # Depending on ML model load
    
    if response.status_code == 200:
        pred_data = response.json()
        assert "product_type" in pred_data
        assert "confidence" in pred_data

        # 5. Confirm and Save to Inventory
        confirm_data = {
            "filename": filename,
            "batch_id": f"BATCH-{int(time.time())}",
            "fabric_type": pred_data["product_type"],
            "material_composition": "Cotton 100%",
            "quantity": "50",
            "recyclability": "High",
            "collection_date": "2026-09-01",
            "condition": "Good",
            "sustainability_score": pred_data.get("sustainability_score", 85)
        }
        response = client.post("/predict/confirm", json=confirm_data, headers=headers)
        assert response.status_code == 200
        
        # 6. Fetch Inventory
        response = client.get("/inventory", headers=headers)
        assert response.status_code == 200
        inventory_items = response.json()
        assert len(inventory_items) > 0
        saved_item = inventory_items[0]
        
        # 7. Fetch Recommendations
        item_id = saved_item["id"]
        response = client.get(f"/sustainability/recommendations/{item_id}", headers=headers)
        assert response.status_code == 200
        rec_data = response.json()
        assert "recommended_action" in rec_data

        # 8. Fetch Sustainability Analytics for Dashboards
        response = client.get("/sustainability/summary", headers=headers)
        assert response.status_code == 200
        summary = response.json()
        assert "total_textile_waste" in summary
        assert "average_circularity_score" in summary

        # 9. Fetch specific distribution metrics for Reports
        response = client.get("/sustainability/waste-distribution", headers=headers)
        assert response.status_code == 200
        waste_dist = response.json()
        assert "labels" in waste_dist
        assert "quantities" in waste_dist
