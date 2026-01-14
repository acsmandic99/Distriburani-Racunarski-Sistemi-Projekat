from .schemas import UserCreateSchema, UserResponseSchema,UserUpdateSchema,ChangePasswordSchema
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
    except Exception as e:
        # Logovanje
        print(e)
        return api_response.error(messages.INTERNAL_ERROR, 500)
    
@users_bp.route("/<user_id>", methods=["GET"])
def get_user(user_id):
    try:
        user = UserService.get_user(user_id)
        if user is None:
            return api_response.error(messages.USER_NOT_FOUND,404)
        return api_response.success(messages.USER_FETCHED,user,200)
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
    except Exception as e:
        # Logovanje
        print(e)
        return api_response.error(messages.INTERNAL_ERROR, 500)
    
@users_bp.route("/update/<user_id>", methods=["PATCH"])
def update_user(user_id):
    try:
        user_data = UserUpdateSchema(**request.get_json())

        updated_user = UserService.update_user(user_id,user_data)
        if not updated_user:
            return api_response.error(messages.USER_NOT_FOUND, 404)
            
        return api_response.success(messages.USER_UPDATED, updated_user, 200)
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
    except Exception as e:
        # Logovanje
        print(e)
        return api_response.error(messages.INTERNAL_ERROR, 500)
    
@users_bp.route("/change-password/<user_id>", methods=["POST"])
def change_password(user_id):
    try:
        json_data = request.get_json()
        data = ChangePasswordSchema(**json_data)
        
        success = UserService.change_password(user_id, data)
        
        if success:
            return api_response.success(messages.PASSWORD_CHANGED, None, 200)
        
        return api_response.error(messages.INCORRECT_PASSWORD, 400)

    except ValidationError as e:
        custom_errors = []
        for error in e.errors():
            custom_errors.append({
                "field": error["loc"][-1], 
                "message": error["msg"]      
            })
        return api_response.error(messages.INVALID_DATA, 400, custom_errors)
    except ValueError as e:
        return api_response.error(str(e), 400)
    except Exception as e:
        return api_response.error(messages.INTERNAL_ERROR, 500)