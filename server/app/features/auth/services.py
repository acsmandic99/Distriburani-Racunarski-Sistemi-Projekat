from ..users.services import UserService
from ..users.utils.password_utils import verify_password
from flask_jwt_extended import create_access_token
from ...extensions import mongo
from datetime import datetime,timezone
class AuthService:
    @staticmethod
    def login(email,password):
        user = UserService.get_user_by_email(email)
        if not user:
            return None
        if not verify_password(password,user['password']):
            return None
        access_token = create_access_token(identity=str(user['_id']))
        return access_token
    
    @staticmethod
    def logout(jti):
        try:
            result = mongo.db.blocklist.insert_one({
            "jti" : jti,
            "blocked_at": datetime.now(timezone.utc)
        })
            return result.acknowledged
        except Exception as e:
            print(e)
            return False