from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, UserLogin
from app.utils.security import hash_password, verify_password
from app.auth.jwt_handler import create_access_token
from app.auth.auth_handler import get_current_user

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

auth_router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


def _register_user_logic(user: UserCreate, db: Session):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = User(
        full_name=user.full_name,
        email=user.email,
        password=hash_password(user.password),
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def _login_user_logic(user: UserLogin, db: Session):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(user.password, db_user.password):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        {
            "sub": db_user.email,
            "role": db_user.role
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "full_name": db_user.full_name,
            "email": db_user.email,
            "role": db_user.role
        }
    }


@router.post("/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    new_user = _register_user_logic(user, db)
    return {
        "id": new_user.id,
        "user_id": new_user.id,
        "full_name": new_user.full_name,
        "email": new_user.email,
        "role": new_user.role,
    }


@auth_router.post("/register", response_model=UserResponse)
def auth_register_user(user: UserCreate, db: Session = Depends(get_db)):
    new_user = _register_user_logic(user, db)
    return {
        "id": new_user.id,
        "user_id": new_user.id,
        "full_name": new_user.full_name,
        "email": new_user.email,
        "role": new_user.role,
    }


@router.post("/login")
def login_user(user: UserLogin, db: Session = Depends(get_db)):
    return _login_user_logic(user, db)


@auth_router.post("/login")
def auth_login_user(user: UserLogin, db: Session = Depends(get_db)):
    return _login_user_logic(user, db)


@router.get("/me")
def get_logged_in_user(current_user=Depends(get_current_user)):
    return {
        "message": "Authenticated Successfully",
        "user": current_user
    }

