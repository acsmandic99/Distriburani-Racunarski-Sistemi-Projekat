from .schemas import UserCreateSchema, UserResponseSchema
from pydantic import ValidationError
from .services import UserService
from app.features.shared.utils import api_response
from app.features.shared.constants import messages
from flask import request
from . import users_bp


@users_bp.route("/register", methods=["POST"])
def register_user():
    try:
        user_data = UserCreateSchema(**request.get_json())
        user = UserService.create_user(user_data)
        return api_response.success(messages.USER_CREATED,user,201)
    except ValidationError as e:
        custom_errors = []
        for error in e.errors():
            custom_errors.append({
                "field": error["loc"][-1], 
                "message": error["msg"]      
            })
        return api_response.error(messages.INVALID_DATA, 400, custom_errors)
    except ValueError as e:
        return api_response.error(messages.INVALID_DATA,400,str(e))