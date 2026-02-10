from datetime import datetime, timezone
from bson import ObjectId
from app.extensions import mongo
from ..shared.constants import messages
from ..shared.utils.image_service.service import ImageService
from ..users.services import UserService 
from .schemas import CommentSchema
from ..shared.utils.email_sender import launch_email_process
class CommentService:
    @staticmethod
    def add_comment(user_id, image_file, raw_data):
        from ..recipes.services import RecipeService
        recipe_id = raw_data.get('recipe_id')
        if not recipe_id:
            raise ValueError(messages.RECIPE_ID_MISSING)
        exists, recipe = RecipeService.recipe_exists(recipe_id)
        if not exists:
            raise ValueError(messages.RECIPE_ID_NOT_FOUND)
        #autor komentara
        author_data = UserService.get_author_data(ObjectId(user_id))
        
        comment_image = None
        if image_file:
            comment_image = ImageService.upload_image(image_file, "comments")

        comment_dict = {
            "recipe_id": recipe_id,
            "body": raw_data.get('body'),
            "created_at": datetime.now(timezone.utc),
            "image_url": comment_image,
            "comment_author": {
                "author_id": str(user_id),
                "first_name": author_data['first_name'],
                "last_name": author_data['last_name']
            }
        }

        new_comment = CommentSchema(**comment_dict)

        inserted_comment = mongo.db.comments.insert_one(new_comment.model_dump())
        
        comment_data_for_recipe = new_comment.model_dump()
        comment_data_for_recipe["_id"] = str(inserted_comment.inserted_id)
        RecipeService.add_comment(recipe_id,comment_data_for_recipe)
        response_comment_data = new_comment.model_dump(mode='json')
        response_comment_data["_id"] = str(inserted_comment.inserted_id)
        print(recipe)
        recipe_author = UserService.get_user_by_id(recipe['author']['author_id'])
        user_email = recipe_author["email"]
        launch_email_process(user_email, f"Novi komentar za vas recept {recipe['title']}",
                              f"Korisnik {author_data['first_name']}{author_data['last_name']} je ostavio komentar:\n{comment_dict['body']}")

        return response_comment_data
    
    @staticmethod
    def get_comments_for_recipe(recipe_id, skip=10, limit=10):
        """
        Ucitavamo narednih 10 komentara,oni koji nisu embedded u recept
        """
        from ..recipes.services import RecipeService
        if RecipeService.recipe_exists(recipe_id) is None:
            raise ValueError(messages.RECIPE_ID_NOT_FOUND)
        
        cursor = mongo.db.comments.find({"recipe_id": recipe_id}) \
                                 .sort("created_at", -1) \
                                 .skip(skip) \
                                 .limit(limit)
        
        comments = []
        for c in cursor:
            c["_id"] = str(c["_id"])
            if isinstance(c["created_at"], datetime):
                c["created_at"] = c["created_at"].isoformat()
            comments.append(c)
            
        return comments
    
    @staticmethod
    def delete_comment(user_id,comment_id):
        from ..recipes.services import RecipeService
        oid = ObjectId(comment_id)
        comment = mongo.db.comments.find_one({"_id": oid})
        
        if not comment:
            raise ValueError(messages.COMMENT_NOT_FOUND)

        if comment['comment_author']['author_id'] != str(user_id):
            raise ValueError(messages.NOT_COMMENT_AUTHOR)
        mongo.db.comments.delete_one({"_id": oid})

        RecipeService.remove_comment(comment['recipe_id'], comment_id)
