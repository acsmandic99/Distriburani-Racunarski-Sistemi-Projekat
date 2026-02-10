from bson import ObjectId
from datetime import datetime, timezone
from app.extensions import mongo
from ..shared.constants import messages
from ..shared.utils.image_service.service import ImageService
from ..recipes.services import RecipeService
from ..users.services import UserService
from .schemas import ReviewCreateSchema 

class ReviewService:
    @staticmethod
    def add_review(user_id, recipe_id, raw_data, image_file):
        validated_data = ReviewCreateSchema(**raw_data)
        
        u_id = ObjectId(user_id)
        if not recipe_id:
            raise ValueError(messages.RECIPE_ID_MISSING)
        r_id = ObjectId(recipe_id)
        
        if not RecipeService.recipe_exists(r_id):
            raise ValueError(messages.RECIPE_ID_NOT_FOUND)

        recipe = RecipeService.get_recipe_by_id(r_id)
        author_id = recipe["author"].get("author_id") or recipe["author"].get("id")
        if str(u_id) == str(author_id):
            raise ValueError(messages.CANT_REVIEW_SELF)

        existing_review = mongo.db.reviews.find_one({"user_id": u_id, "recipe_id": r_id})
        if existing_review:
            raise ValueError(messages.ALREADY_REVIEWED)

        image_url = None
        if image_file:
            image_url = ImageService.upload_image(image_file, "reviews")

        new_review = {
            "user_id": u_id,
            "recipe_id": r_id,
            "rating": validated_data.rating,
            "body": validated_data.body,
            "image_url": image_url,
            "created_at": datetime.now(timezone.utc)
        }
        
        result = mongo.db.reviews.insert_one(new_review)
        new_review["_id"] = result.inserted_id

        RecipeService._update_recipe_stats_and_subset(r_id, new_review)
        UserService._update_author_average_rating(author_id, new_review["rating"])

        return str(result.inserted_id)

    @staticmethod
    def delete_review(user_id, review_id):
        r_id = ObjectId(review_id)
        u_id = ObjectId(user_id)
        

        review = mongo.db.reviews.find_one({"_id": r_id, "user_id": u_id})
        
        if not review:
            raise ValueError(messages.REVIEW_NOT_FOUND)

        recipe = RecipeService.get_recipe_by_id(review["recipe_id"])
        
        RecipeService._update_recipe_on_review_delete(review["recipe_id"], r_id, review["rating"])
        
        if recipe and "author" in recipe:
            author_id = recipe["author"].get("author_id") or recipe["author"].get("id")
            if author_id:
                UserService._update_author_on_review_delete(author_id, review["rating"])

        if review.get("image_url"):
            ImageService.delete_image(review["image_url"])

        mongo.db.reviews.delete_one({"_id": r_id})
        
        return True

    @staticmethod
    def update_review(user_id, review_id, raw_data, image_file):
        validated_data = ReviewCreateSchema(**raw_data)
        
        r_id = ObjectId(review_id)
        review = mongo.db.reviews.find_one({"_id": r_id, "user_id": ObjectId(user_id)})
        
        if not review:
            raise ValueError(messages.REVIEW_NOT_FOUND)
        
        old_rating = review["rating"]
        new_rating = validated_data.rating
        new_body = validated_data.body

        if old_rating != new_rating or review["body"] != new_body:
            RecipeService._update_recipe_on_review_patch(
                review["recipe_id"], r_id, old_rating, new_rating, new_body
            )
            
            recipe_doc = RecipeService.get_recipe_by_id(review["recipe_id"])
            if recipe_doc and "author" in recipe_doc:
                author_id = recipe_doc["author"].get("author_id") or recipe_doc["author"].get("id")
                UserService._update_author_on_review_patch(author_id, old_rating, new_rating)

        image_url = review.get("image_url")
        if image_file:
            if image_url:
                ImageService.delete_image(image_url)
            image_url = ImageService.upload_image(image_file, "reviews")

        mongo.db.reviews.update_one(
            {"_id": r_id},
            {
                "$set": {
                    "rating": new_rating,
                    "body": new_body,
                    "image_url": image_url,
                    "updated_at": datetime.now(timezone.utc)
                }
            }
        )
        return True
    
    @staticmethod
    def get_all_reviews_count():
        return mongo.db.reviews.count_documents({})