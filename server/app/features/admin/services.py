from app.extensions import mongo
from bson import ObjectId



class AdminService:
    @staticmethod
    def get_users():
        users = list(mongo.db.users.find({}, {"password": 0}))
        for u in users:
            u["_id"] = str(u["_id"])
        return users

    @staticmethod
    def get_recipes():
        recipes = list(mongo.db.recipes.find().sort("_id", -1))
        for r in recipes:
            r["_id"] = str(r["_id"])
        return recipes

    @staticmethod
    def get_all_author_requests():
        requests = list(mongo.db.author_requests.find({"status": "pending"}))
        for req in requests:
            req["_id"] = str(req["_id"])
            req["user_id"] = str(req["user_id"])
        return requests