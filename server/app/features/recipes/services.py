from .schemas import RecipeCreateSchema,FullRecipeSchema,AuthorInfoSchema
from ..users.services import UserService 
from ..shared.utils.image_service.service import ImageService
from ..shared.utils.image_service.folders import RECIPES_FOLDER
from app.extensions import mongo
from bson import ObjectId
from ..shared.constants.user_roles import READER_ROLE
from ..shared.constants import messages

class RecipeService:
    @staticmethod
    def add_recipe(user_id,image_file,raw_data):
        recipe = RecipeCreateSchema(**raw_data)
        oid = ObjectId(user_id)
        raw_author = UserService.get_author_data(oid)
        
        if not raw_author:
            raise ValueError(messages.AUTHOR_NOT_EXIST)
        if raw_author['role'] == READER_ROLE:
            raise ValueError(messages.NOT_AUTHOR)
        author_info = AuthorInfoSchema(**raw_author)

        if image_file:
            image_url = ImageService.upload_image(image_file,RECIPES_FOLDER)
        else:
            image_url = "/static/uploads/recipes/default-recipe.jpg"
        recipe.image_url = image_url

        full_recipe = (FullRecipeSchema)(
            **recipe.model_dump(),
            author=author_info
        )

        result = mongo.db.recipes.insert_one(full_recipe.model_dump())
        UserService.inc_recipe_count(oid)
        full_recipe.author.total_recipes += 1
        return {**full_recipe.model_dump(), "_id": str(result.inserted_id)}
    
    @staticmethod
    def get_all_recipes(page = 1,per_page=10,filter_query=None):
        skip = (page - 1) * per_page

        query = filter_query if filter_query else {}

        cursor = mongo.db.recipes.find(query).sort("_id", -1).skip(skip).limit(per_page)

        recipes = []

        for r in cursor:
            r["_id"] = str(r["_id"])
            recipes.append(r)

        return recipes