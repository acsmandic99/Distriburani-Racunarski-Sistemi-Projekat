from flask import Request
from ..shared.utils import api_response
from .services import AdminService
from . import admin_bp
from ..shared.constants import messages 
from flask_jwt_extended import get_jwt_identity,jwt_required
from ..shared.utils.decorators.admin_decorator import admin_required

@admin_bp.route("/users", methods=["GET"])
@jwt_required()
@admin_required
def get_all_users():
    try:
        """Vraca listu svih registrovanih korisnika."""
        users = AdminService.get_users()
        return api_response.success(messages.USERS_FETCHED,data=users)
    except Exception as e:
        print(e)
        return api_response.error(messages.INTERNAL_ERROR,status=500)

@admin_bp.route("/recipes", methods=["GET"])
@jwt_required()
@admin_required
def get_all_recipes():
    """Vraca sve recepte"""
    try:
    
        recipes = AdminService.get_recipes()
        return api_response.success(messages.RECIPES_FETCHED,data=recipes)
    except Exception as e:
        print(e)
        return api_response.error(messages.INTERNAL_ERROR,status=500)

@admin_bp.route("/author-requests", methods=["GET"])
@jwt_required()
@admin_required
def get_author_requests():
    """Vraca zahteve korisnika koji zele da postanu autori."""
    try:
        requests = AdminService.get_all_author_requests()
        return api_response.success(messages.AUTHOR_REQUESTS_FETCHED,data=requests)
    except Exception as e:
        print(e)
        return api_response.error(messages.INTERNAL_ERROR,status=500)