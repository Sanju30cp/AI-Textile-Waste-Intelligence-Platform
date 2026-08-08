from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import Base, engine
from app.routes.inventory import router as inventory_router
from app.routes.user import router as user_router
from app.api.prediction import router as prediction_router

from app.models import user, inventory, prediction_history

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Textile Waste Intelligence Platform API",
    version="1.0.0"
)

# Enable CORS for React frontend integration - must be added before routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(user_router)
app.include_router(inventory_router)
app.include_router(prediction_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to Textile Waste Intelligence Platform API"
    }
