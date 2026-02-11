from functools import wraps
from flask import request
from flask_jwt_extended import get_jwt_identity
from ....users.services import UserService
from ...utils import api_response 
from ...constants.user_roles import ADMIN_ROLE 
from ...constants import messages

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user_id = get_jwt_identity()
        base_url = request.host_url.rstrip('/')
        
        user = UserService.get_user(user_id, base_url)
        
        if not user or user.get('role') != ADMIN_ROLE:
            return api_response.error(messages.ONLY_ADMIN_ALLOWED, 403)
        
        return f(*args, **kwargs)
    return decorated_function