from ..users.services import UserService
from ..users.utils.password_utils import verify_password
from flask_jwt_extended import create_access_token
from ...extensions import mongo, redis_client 

class AuthService:
    @staticmethod
    def login(email, password):
        if redis_client.get(f"blocked:{email}"):
            return "BLOCKED"

        user = UserService.get_user_by_email(email)
        
        if not user or not verify_password(password, user['password']):
            attempts = redis_client.incr(f"attempts:{email}")
            if attempts == 1:
                redis_client.expire(f"attempts:{email}", 1800) 

            if attempts >= 3:
                redis_client.setex(f"blocked:{email}", 900, "true")
                redis_client.delete(f"attempts:{email}")
                return "BLOCKED"
            
            return None

        redis_client.delete(f"attempts:{email}")
        
        access_token = create_access_token(identity=str(user['_id']))
        return access_token
    
    @staticmethod
    def logout(jti):
        try:
            redis_client.setex(f"blacklist:{jti}", 3600, "truee")
            return True
        except Exception as e:
            print(f"Redis logout error: {e}")
            return False