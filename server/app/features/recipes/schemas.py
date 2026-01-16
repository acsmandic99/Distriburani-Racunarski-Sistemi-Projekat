from pydantic import BaseModel,Field
from datetime import datetime
from typing import Optional,List


class RecipeCreateSchema(BaseModel):
    """
    Sema za kreiranje recepta
    """
    title: str = Field(...,min_length=3,max_length=100)
    type_of_dish: str = Field(...,min_length=3,max_length=20)
    time_for_preperation: str
    difficulty: str= Field(..., pattern="^(Easy|Medium|Hard)$")
    number_of_people: int = Field(..., gt=0)
    ingredients: List[str] = Field(..., min_length=1)
    steps: List[str]
    image_url: Optional[str] = None
    additional_marks: List[str] = []
    
class AuthorInfoSchema(BaseModel):
    """
    Polja koja cuvamo unutar recepta u mongodb
    """
    first_name: str
    last_name: str
    total_recipes:int
    average_rating:float

class FullRecipeSchema(RecipeCreateSchema):
    """
    Puna sema za kreiranje recepta
    """
    author: AuthorInfoSchema
    comments: List[dict] = []
    average_rating: float = 0.0
    total_recipe_ratings: int = 0



