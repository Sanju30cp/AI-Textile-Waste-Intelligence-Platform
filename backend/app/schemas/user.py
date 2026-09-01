from pydantic import BaseModel, EmailStr, ConfigDict
from enum import Enum

class RoleEnum(str, Enum):
    ADMINISTRATOR = "Administrator"
    TEXTILE_MANUFACTURER = "Textile Manufacturer"
    RECYCLING_FACILITY_OPERATOR = "Recycling Facility Operator"
    SUSTAINABILITY_MANAGER = "Sustainability Manager"

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: RoleEnum


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    user_id: int
    full_name: str
    email: EmailStr
    role: str

    model_config = ConfigDict(from_attributes=True)
