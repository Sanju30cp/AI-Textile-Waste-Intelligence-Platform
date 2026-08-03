from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_inventory_requires_authentication():
    response = client.get('/inventory')
    assert response.status_code == 401
