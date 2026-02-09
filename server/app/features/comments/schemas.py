from datetime import datetime
from pydantic import BaseModel,Field
from typing import Optional,List

class CommentAuthorSchema(BaseModel):
    """Polja koja cuvam unutar komentara o autoru komentara"""
    author_id: str
    first_name: str
    last_name: str

class CommentSchema(BaseModel):
    """Sema za komentar"""
    recipe_id: str
    body: str
    created_at: datetime
    image_url: Optional[str]
    comment_author: CommentAuthorSchema


