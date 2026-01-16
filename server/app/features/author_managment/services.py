from ...extensions import mongo
from bson import ObjectId
from ..shared.constants import messages
from ..shared.constants.author_request_status import AUTHOR_REQUEST_PENDING
from datetime import datetime,timezone



class AuthorManagmentService:
    @staticmethod
    def request_author_role(user_id):
        """Pravljenja zahteva za promenu role u author"""
        if mongo.db is None:
            raise Exception("Database connection is not initialized.")
        oid = ObjectId(user_id)
        existing_request = mongo.db.author_requests.find_one({"user_id" : oid,
                                                        "status" : AUTHOR_REQUEST_PENDING})
        if existing_request:
            raise ValueError(messages.ROLE_ALREADY_REQUESTED)
        
        new_request = {
            "user_id" : oid,
            "status" : AUTHOR_REQUEST_PENDING,
            "created_at" : datetime.now(timezone.utc)
        }
        result = mongo.db.author_requests.insert_one(new_request)
        return True

        