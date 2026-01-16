from app.extensions import mongo
from .schemas import UserCreateSchema,UserResponseSchema,UserUpdateSchema,ChangePasswordSchema,AuthorRequestSchema
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
                print(f"DEBUG: Stara slika {current_image} poslata na brisanje.")
            else:
                print("DEBUG: Preskačem brisanje - slika je default ili ne postoji.")

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
            mongo.db.users.find_one_and_update(
                {"_id" : user_id},
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


