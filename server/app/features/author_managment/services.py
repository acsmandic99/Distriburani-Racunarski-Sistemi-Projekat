from ...extensions import mongo
from bson import ObjectId
from ..shared.constants import messages
from ..shared.constants.author_request_status import AUTHOR_REQUEST_PENDING,AUTHOR_REQUEST_APPROVED,AUTHOR_REQUEST_REJECTED
from datetime import datetime,timezone
from ..users.services import UserService


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

        
    @staticmethod
    def get_all_author_requests():
        requests = list(mongo.db.author_requests.find({"status": "pending"}))
        for req in requests:
            req["_id"] = str(req["_id"])
            req["user_id"] = str(req["user_id"])
        return requests
    
    @staticmethod
    def approve_request(request_id):
        oid = ObjectId(request_id) if isinstance(request_id, str) else request_id
        request = mongo.db.author_requests.find_one({"_id" : oid})
        if not request:
            raise ValueError(messages.REQUEST_NOT_FOUND)
        if request['status'] != AUTHOR_REQUEST_PENDING:
            raise ValueError(messages.REQUEST_ALREDY_REVIEWED)
        request['status'] = AUTHOR_REQUEST_APPROVED
        result = mongo.db.author_requests.update_one(
        {"_id": oid},
        {"$set": {"status": AUTHOR_REQUEST_APPROVED}}
    )
        UserService.promote_user_to_author(request['user_id'])

        return True
        
        
    @staticmethod
    def reject_request(request_id):
        request_doc = mongo.db.author_requests.find_one({"_id": request_id})
        
        if not request_doc:
            raise ValueError(messages.REQUEST_NOT_FOUND)
        
        if request_doc['status'] != AUTHOR_REQUEST_PENDING:
            raise ValueError(messages.REQUEST_ALREDY_REVIEWED)
        
        mongo.db.author_requests.update_one(
            {"_id": request_id},
            {"$set": {"status": AUTHOR_REQUEST_REJECTED}}
        )
        
        return True
