from pydantic import BaseModel, Field, field_validator, ConfigDict
from typing import Optional
from datetime import datetime

class ReviewCreateSchema(BaseModel):
    rating: int = Field(..., ge=1, le=5)  
    body: Optional[str] = Field(None, max_length=1000)

    @field_validator('rating', mode='before')
    @classmethod
    def convert_string_to_int(cls, v):
        if isinstance(v, str) and v.isdigit():
            return int(v)
        return v

    @field_validator('body')
    @classmethod
    def clean_body(cls, v):
        if v:
            return v.strip()
        return v

class ReviewResponseSchema(BaseModel):
    id: str = Field(alias="_id")
    user_id: str
    recipe_id: str
    rating: int
    body: Optional[str] = None
    image_url: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True, 
        json_encoders={datetime: lambda v: v.isoformat()}
    )