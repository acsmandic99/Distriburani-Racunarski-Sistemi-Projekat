from app.extensions import mongo
from .schemas import AuthorDataResponse, UserCreateSchema,UserResponseSchema,UserUpdateSchema,ChangePasswordSchema,AuthorRequestSchema
from datetime import datetime,timezone
from .utils.password_utils import hash_password, verify_password
from bson import ObjectId
from ..shared.constants.user_roles import AUTHOR_ROLE,READER_ROLE
from ..shared.constants.author_request_status import AUTHOR_REQUEST_PENDING
from ..shared.constants import messages
from ..shared.utils.image_service.service import ImageService
from ..shared.utils.image_service.folders import PROFILE_IMAGE_FOLDER
class UserService:
    @staticmethod
    def create_user(userCreate: UserCreateSchema):
        if mongo.db is None:
            raise Exception("Database connection is not initialized.")
        userCreate.created_at = datetime.now(timezone.utc)
        userCreate.updated_at = datetime.now(timezone.utc)
        user_dict = userCreate.model_dump()
        exists = mongo.db.users.find_one({"email": user_dict['email']})
        
        if exists:
            raise ValueError("User with this email already exists") 
        user_dict['password'] = hash_password(user_dict['password'])
        result = mongo.db.users.insert_one(user_dict)
        user_dict['id'] = str(result.inserted_id)
        response_obj = UserResponseSchema(**user_dict)
        return response_obj.model_dump(mode='json')
    

    @staticmethod
    def get_user(user_id):
        if mongo.db is None:
            raise Exception("Database connection is not initialized.")
        try:
                
                oid = ObjectId(user_id)
        except Exception:
                return None

        user = mongo.db.users.find_one({"_id": oid})

        if not user:
            return None

        user["id"] = str(user["_id"])
        
        return UserResponseSchema(**user).model_dump(mode='json')
    @staticmethod
    def get_users():
        users = list(mongo.db.users.find({}, {"password": 0}))
        for u in users:
            u["_id"] = str(u["_id"])
        return users

    @staticmethod
    def update_user(user_id,raw_data,avatar_image):
        if mongo.db is None:
            raise Exception("Database connection is not initialized.")
        try:
            oid = ObjectId(user_id)
            update_data = UserUpdateSchema(**raw_data)
            update_dict = update_data.model_dump(exclude_unset=True)
        except Exception as e:
                print(f"Validation/ObjectId error: {e}")
                return None
        user = mongo.db.users.find_one({"_id": oid})
        if not user:
            return None
        if avatar_image:
            current_image = user.get("profile_picture")

        # 2. PROVERA: Brišemo staru sliku SAMO ako postoji i NIJE default
            if current_image != "default-avatar.jpg":
                ImageService.delete_image(current_image)

            profile_image_url = ImageService.upload_image(avatar_image, PROFILE_IMAGE_FOLDER)
            update_dict['profile_picture'] = profile_image_url
        if not update_dict:
            user["id"] = str(user["_id"])
            return UserResponseSchema(**user).model_dump(mode='json')
        update_dict["updated_at"] = datetime.now(timezone.utc)

        result = mongo.db.users.find_one_and_update(
            {"_id": oid},
            {"$set": update_dict},
            return_document=True 
        )

        if not result:
            return None
        
        result["id"] = str(result["_id"])
        return UserResponseSchema(**result).model_dump(mode='json')


    @staticmethod
    def change_password(user_id: str, data: ChangePasswordSchema):
        if mongo.db is None:
            raise Exception("Database connection is not initialized.")
        try:
            oid = ObjectId(user_id)
        except:
            return False

        user = mongo.db.users.find_one({"_id": oid})
        if not user:
            return False

        if not verify_password(data.old_password, user["password"]):
            return False

        hashed_new_password = hash_password(data.new_password)

        mongo.db.users.update_one(
            {"_id": oid},
            {"$set": {"password": hashed_new_password, "updated_at": datetime.now()}}
        )
        return True

    @staticmethod
    def get_user_by_email(email):
        if mongo.db is None:
            raise Exception("Database connection is not initialized.")
        user = mongo.db.users.find_one({"email" : email})
        if not user:
             return None
        return user
         
    @staticmethod
    def get_author_data(user_id):
        if mongo.db is None:
            raise Exception("Database connection is not initialized.")
        try:
            
            author = mongo.db.users.find_one({"_id" : user_id})
            return author
        except:
            return None
        

        
    @staticmethod
    def promote_user_to_author(user_id):
        if mongo.db is None:
            raise Exception("Database connection is not initialized.")

        try:
            oid = ObjectId(user_id)
            result = mongo.db.users.find_one_and_update(
                {"_id" : oid},
                {"$set" : {"role" : AUTHOR_ROLE}}
            )
        except Exception as e:
            #logovanje
            print(f"Greska pri promociji {e}")

    @staticmethod
    def inc_recipe_count(user_id):
        if mongo.db is None:
            raise Exception("Database connection is not initialized.")
    
        try:
            user = mongo.db.users.find_one_and_update(
                {"_id" : user_id},
                {"$inc": {"total_recipes": 1}}
            )
            print(user)
        except Exception as e:
            #logovanje
            print(f"Greska pri inc {e}")


    @staticmethod
    def delete_user_completely(user_id):
        user = mongo.db.users.find_one({"_id": user_id})
        if not user:
            raise ValueError(messages.USER_NOT_FOUND)

        image_name = user.get("profile_picture")
    
        if image_name and image_name != "default-avatar.jpg":
            try:
                ImageService.delete_image(image_name)
            except Exception as e:
                print(f"Log: Slika nije obrisana ili ne postoji na disku: {e}")

        mongo.db.author_requests.delete_many({"user_id": user_id})

        mongo.db.users.delete_one({"_id": user_id})
        
        return True
    @staticmethod
    def toggle_favorite_recipe(user_id, recipe_id):
        u_id = ObjectId(user_id)
        r_id = str(recipe_id)

        result = mongo.db.users.update_one(
            {"_id": u_id},
            {"$pull": {"favorite_recipes": r_id}}
        )

        if result.modified_count == 0:
            mongo.db.users.update_one(
                {"_id": u_id},
                {"$addToSet": {"favorite_recipes": r_id}}
            )
            return "added"
        
        return "removed"

    @staticmethod
    def get_favorite_ids(user_id):
        user = mongo.db.users.find_one({"_id": ObjectId(user_id)}, {"favorite_recipes": 1})
        return user.get("favorite_recipes", []) if user else []
    

    @staticmethod
    def get_author_profile_final(author_id):
        from ..recipes.services import RecipeService
        
        author_raw = mongo.db.users.find_one({"_id": ObjectId(author_id)})
        
        if not author_raw:
            raise ValueError(messages.USER_NOT_FOUND)

        author_raw['id'] = str(author_raw.pop('_id'))

        author_recipes = RecipeService.get_all_recipes(
            filter_query={"author.author_id": str(author_id)}
        )
        author_raw['recipes'] = author_recipes


        validated_data = AuthorDataResponse(**author_raw)
        
        return validated_data.model_dump(mode='json')
    

    @staticmethod
    def _update_author_average_rating(author_id, new_rating):
        """
        Azurira prosek autora
        """
        a_id = ObjectId(author_id)
        
        author = mongo.db.users.find_one(
            {"_id": a_id}, 
            {"average_rating": 1, "total_ratings": 1}
        )
        
        if not author:
            return

        old_avg = author.get("average_rating", 0.0)
        old_count = author.get("total_ratings", 0)

        new_count = old_count + 1
        new_avg = ((old_avg * old_count) + new_rating) / new_count

        mongo.db.users.update_one(
            {"_id": a_id},
            {
                "$set": {
                    "average_rating": round(new_avg, 2),
                    "total_ratings": new_count
                }
            }
        )

    @staticmethod
    def _update_author_on_review_delete(author_id, removed_rating):
        a_id = ObjectId(author_id)
        author = mongo.db.users.find_one({"_id": a_id}, {"average_rating": 1, "total_ratings": 1})
        
        if not author or author.get("total_ratings", 0) <= 0:
            return

        old_avg = author.get("average_rating", 0.0)
        old_count = author.get("total_ratings", 0)

        if old_count == 1:
            new_avg = 0.0
            new_count = 0
        else:
            new_count = old_count - 1
            new_avg = ((old_avg * old_count) - removed_rating) / new_count

        mongo.db.users.update_one(
            {"_id": a_id},
            {"$set": {"average_rating": round(new_avg, 2), "total_ratings": new_count}}
        )


    @staticmethod
    def _update_author_on_review_patch(author_id, old_rating, new_rating):
        a_id = ObjectId(author_id)
        author = mongo.db.users.find_one({"_id": a_id}, {"average_rating": 1, "total_ratings": 1})
        
        if not author or author.get("total_ratings", 0) == 0:
            return

        old_avg = author.get("average_rating", 0.0)
        count = author.get("total_ratings")

        new_avg = ((old_avg * count) - old_rating + new_rating) / count

        mongo.db.users.update_one(
            {"_id": a_id},
            {"$set": {"average_rating": round(new_avg, 2)}}
        )

    @staticmethod
    def get_all_users_count():
        return mongo.db.users.count_documents({})
    
    @staticmethod
    def get_top_n_authors(count):
        return list(mongo.db.users.find(
            {"total_ratings": {"$gt": 0}}, 
            {"first_name": 1,"last_name" : 1,"email": 1, "average_rating": 1, "total_ratings": 1}
        ).sort([("average_rating", -1), ("total_ratings", -1)]).limit(count))