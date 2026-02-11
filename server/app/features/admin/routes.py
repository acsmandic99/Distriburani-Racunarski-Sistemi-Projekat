from flask import make_response,request
from ..shared.utils import api_response
from .services import AdminService
from . import admin_bp
from ..shared.constants import messages 
from flask_jwt_extended import get_jwt_identity,jwt_required
from ..shared.utils.decorators.admin_decorator import admin_required
from bson import ObjectId

@admin_bp.route("/users", methods=["GET"])
@jwt_required()
@admin_required
def get_all_users():
    try:
        """Vraca listu svih registrovanih korisnika."""
        base_url = request.host_url.rstrip('/')
        users = AdminService.get_users(base_url)
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
    
@admin_bp.route("/approve-request/<request_id>", methods=["POST"])
@jwt_required()
@admin_required
def approve_request(request_id):
    try:
        AdminService.aprove_author_request(request_id)
        return api_response.success(messages.REQUEST_SUCCESSFULLY_APROVED,200)
    except ValueError as e:
            if str(e) == messages.REQUEST_NOT_FOUND:
                return api_response.error(messages.REQUEST_NOT_FOUND,404)
            if str(e) == messages.REQUEST_ALREDY_REVIEWED:
                return api_response.error(messages.REQUEST_ALREDY_REVIEWED,400)
            return api_response.error(messages.INTERNAL_ERROR,500)
    
@admin_bp.route("/reject-request/<request_id>", methods=["POST"])
@jwt_required()
@admin_required
def reject_request(request_id):
    try:
        AdminService.reject_author_request(request_id)
        return api_response.success(messages.AUTHOR_REQUEST_REJECTED, 200)
    except ValueError as e:
        error_msg = str(e)
        if error_msg == messages.REQUEST_NOT_FOUND:
            return api_response.error(messages.REQUEST_NOT_FOUND, 404)
        if error_msg == messages.REQUEST_ALREDY_REVIEWED:
            return api_response.error(messages.REQUEST_ALREDY_REVIEWED, 400)
        return api_response.error(messages.INTERNAL_ERROR, 500)
    
@admin_bp.route("/delete-user/<user_id>", methods=["DELETE"])
@jwt_required()
@admin_required
def delete_user(user_id):
    try:
        AdminService.delete_user_account(user_id)
        return api_response.success(messages.USER_DELETED, 200)
    except ValueError as e:
        if str(e) == messages.USER_NOT_FOUND:
            return api_response.error(messages.USER_NOT_FOUND, 404)
        return api_response.error(messages.INTERNAL_ERROR, 500)
    

@admin_bp.route("/stats", methods=["GET"])
@jwt_required()
@admin_required
def get_stats():
    stats = AdminService.get_platform_stats()
    return api_response.success("Statistika ucitana", stats)

@admin_bp.route("/report/pdf", methods=["GET"])
@jwt_required()
@admin_required
def download_report():
    pdf_content = AdminService.generate_top_authors_pdf()
    
    response = make_response(pdf_content)
    response.headers['Content-Type'] = 'application/pdf'
    response.headers['Content-Disposition'] = 'attachment; filename=izvestaj_top_autori.pdf'
    
    return response