from ..comments.schemas import CommentSchema
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
        
        author_info = AuthorInfoSchema(
            author_id=str(oid),
            first_name=raw_author['first_name'],
            last_name=raw_author['last_name']
        )

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
    
    @staticmethod
    def add_comment(recipe_id, new_comment_data): 
        mongo.db.recipes.update_one(
            {"_id": ObjectId(recipe_id)},
            {
                "$push": {
                    "latest_comments": {
                        "$each": [new_comment_data], 
                        "$position": 0,
                        "$slice": 10
                    }
                },
                "$inc": {"comment_count": 1}
            }
        )

    @staticmethod
    def recipe_exists(recipe_id):
        try:
            recipe = mongo.db.recipes.find_one({"_id": ObjectId(recipe_id)}, {"_id": 1})
            return recipe is not None
        except Exception:
            return False
        

    @staticmethod
    def remove_comment(recipe_id, comment_id):
        mongo.db.recipes.update_one(
            {"_id": ObjectId(recipe_id)},
            {
                "$pull": {"latest_comments": {"_id": comment_id}},
                "$inc": {"comment_count": -1}
            }
        )

    @staticmethod
    def get_recipes_by_ids(recipe_ids):
        if not recipe_ids:
            return []

        oids = [ObjectId(rid) for rid in recipe_ids]
        
        cursor = mongo.db.recipes.find({"_id": {"$in": oids}})
        
        recipes = []
        for r in cursor:
            r["_id"] = str(r["_id"])
            recipes.append(r)
            
        return recipes
    
    @staticmethod
    def get_recipe_by_id(recipe_id):
        r_id = ObjectId(recipe_id)
        recipe = mongo.db.recipes.find_one({"_id": r_id})
        return recipe

    @staticmethod
    def _update_recipe_stats_and_subset(recipe_id, review_doc):
        """Azurira prosek recepta i dodaje review u listu poslednjih 10."""
        recipe = mongo.db.recipes.find_one({"_id": recipe_id})
        
        old_count = recipe.get("total_recipe_ratings", 0)
        old_avg = recipe.get("average_rating", 0.0)
        new_rating = review_doc["rating"]

        new_count = old_count + 1
        new_avg = ((old_avg * old_count) + new_rating) / new_count

        subset_review = {
            "review_id": str(review_doc["_id"]),
            "user_id": str(review_doc["user_id"]),
            "rating": new_rating,
            "body": review_doc["body"],
            "created_at": review_doc["created_at"]
        }

        mongo.db.recipes.update_one(
            {"_id": recipe_id},
            {
                "$set": {
                    "average_rating": round(new_avg, 2),
                    "total_recipe_ratings": new_count
                    },
                "$push": {
                    "latest_reviews": {
                        "$each": [subset_review],
                        "$position": 0, 
                        "$slice": 10   
                    }
                }
            }
        )

    @staticmethod
    def _update_recipe_on_review_delete(recipe_id, review_id, removed_rating):
        recipe = mongo.db.recipes.find_one({"_id": recipe_id}, {"average_rating": 1, "total_recipe_ratings": 1})
        
        if not recipe:
            return

        old_avg = recipe.get("average_rating", 0.0)
        old_count = recipe.get("total_recipe_ratings", 0)

        if old_count <= 1:
            new_avg = 0.0
            new_count = 0
        else:
            new_count = old_count - 1
            new_avg = ((old_avg * old_count) - removed_rating) / new_count

        mongo.db.recipes.update_one(
            {"_id": recipe_id},
            {
                "$set": {
                    "average_rating": round(new_avg, 2),
                    "total_recipe_ratings": new_count
                },
                "$pull": {"latest_reviews": {"review_id": str(review_id)}}
            }
        )


    @staticmethod
    def _update_recipe_on_review_patch(recipe_id, review_id, old_rating, new_rating, new_body):
        recipe = mongo.db.recipes.find_one({"_id": recipe_id}, {"average_rating": 1, "total_recipe_ratings": 1})
        if not recipe:
            return

        old_avg = recipe.get("average_rating", 0.0)
        count = recipe.get("total_recipe_ratings", 0)

        new_avg = ((old_avg * count) - old_rating + new_rating) / count

        mongo.db.recipes.update_one(
            {"_id": recipe_id},
            {
                "$set": {
                    "average_rating": round(new_avg, 2),
                    "latest_reviews.$[elem].rating": new_rating,
                    "latest_reviews.$[elem].body": new_body
                }
            },
            array_filters=[{"elem.review_id": str(review_id)}]
        )