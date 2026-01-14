from ..users.services import UserService
from ..users.utils.password_utils import verify_password
from flask_jwt_extended import create_access_token
from datetime import timedelta
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