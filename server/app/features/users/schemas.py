from pydantic import BaseModel, Field,field_validator, EmailStr
from datetime import datetime
from typing import Optional




class UserCreateSchema(BaseModel):
    #===== CREATE ====="""
    first_name: str
    last_name: str
    email: EmailStr
    password: str = Field(...,min_length=6)
    date_of_birth: datetime
    gender: str
    country: str
    city: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    role: str = "reader"
    total_recipes:int = 0
    average_rating: float = 0.0


    @field_validator("date_of_birth")
    @classmethod
    def validate_date_of_birth(cls, v: datetime):
        if v > datetime.now():
            raise ValueError("Date of birth must be in the past")
        return v


# ===== UPDATE =====

class UserUpdateSchema(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    gender: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    profile_picture: Optional[str] = None


# ===== RESPONSE =====

class UserResponseSchema(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: EmailStr
    date_of_birth: datetime
    gender: str
    country: str
    city: str
    role: str
    created_at: datetime
    updated_at: datetime
    total_recipes: int
    average_rating: float
    profile_picture: Optional[str] = None

    model_config = {
        "from_attributes": True
    }


class ChangePasswordSchema(BaseModel):
    old_password: str
    new_password: str = Field(..., min_length=6)


class AuthorRequestSchema(BaseModel):
    user_id: str
    status: str