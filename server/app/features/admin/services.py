from app.extensions import mongo
from bson import ObjectId
from ..users.services import UserService
from ..recipes.services import RecipeService
from ..author_managment.services import AuthorManagmentService
from ..shared.constants import messages

class AdminService:
    @staticmethod
    def get_users():
        users = UserService.get_users()
        return users

    @staticmethod
    def get_recipes():
        recipes = RecipeService.get_all_recipes(1,50)
        return recipes

    @staticmethod
    def get_all_author_requests():
        requests = AuthorManagmentService.get_all_author_requests()
        return requests
    
    @staticmethod
    def aprove_author_request(request_id):
        try:
            oid = ObjectId(request_id)
        except Exception:
            raise ValueError(messages.REQUEST_NOT_FOUND)
        AuthorManagmentService.approve_request(oid)
        
    @staticmethod
    def reject_author_request(request_id):
        try:
            oid = ObjectId(request_id)
        except Exception as e:
            print(f"Reject author ID error: {str(e)}")
            raise ValueError(messages.REQUEST_NOT_FOUND)
            
        AuthorManagmentService.reject_request(oid)


    @staticmethod
    def delete_user_account(user_id):
        try:
            oid = ObjectId(user_id)
        except Exception:
            raise ValueError(messages.USER_NOT_FOUND)
            
        UserService.delete_user_completely(oid)