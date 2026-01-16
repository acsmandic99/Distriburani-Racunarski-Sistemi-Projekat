from app.extensions import mongo
from bson import ObjectId
from ..users.services import UserService
from ..recipes.services import RecipeService
from ..author_managment.services import AuthorManagmentService

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
    