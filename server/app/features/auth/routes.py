from . import auth_bp
from flask import request
from .schemas import LoginSchema
from .services import AuthService
from pydantic import ValidationError
from ..shared.utils import api_response
from ..shared.constants import messages
from flask_jwt_extended import jwt_required,get_jwt_identity,get_jwt
from ..users.services import UserService


@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        login_data = LoginSchema(**request.get_json())
        token = AuthService.login(login_data.email, login_data.password)
        
        if not token:
            return api_response.error(messages.INVALID_PASSWORD_OR_EMAIL, 401)

        return api_response.success(
            messages.LOGIN_SUCCSESS,
            data={"access_token": token},
            status=200
        )
    except ValidationError as e:
        custom_errors = []
        for error in e.errors():
            custom_errors.append({
                "field": error["loc"][-1], 
                "message": error["msg"]      
            })
        return api_response.error(messages.INVALID_DATA_FORMAT, 400, custom_errors)
    except Exception as e:
        print(f"Login error: {e}")
        return api_response.error(messages.INTERNAL_ERROR, 500)
    
@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():
    try:
        current_user_id = get_jwt_identity()
        user = UserService.get_user(current_user_id)

        if not user:
            return api_response.error(messages.USER_NOT_FOUND,None,404)
        return api_response.success(
                message="Profile fetched successfully",
                data=user,
                status=200
            )
    except Exception as e:
        return api_response.error(str(e), 500)

@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    success = AuthService.logout(jti)

    if success:
        return api_response.success(messages.LOGOUT_SUCCESS,None,200)
    else:
        return api_response.error(message = "Failed to block token",
                                  data = None,
                                  status = 500)


