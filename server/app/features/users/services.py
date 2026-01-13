from app.extensions import mongo
from .schemas import UserCreateSchema,UserResponseSchema
from datetime import datetime,timezone
from .utils.password_utils import hash_password

class UserService:
    @staticmethod
    def create_user(userCreate: UserCreateSchema):
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