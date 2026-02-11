from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from .services import ReviewService
from ..shared.constants import messages
from ..shared.utils import api_response
from pydantic import ValidationError
from . import reviews_bp


@reviews_bp.route("/recipe/<recipe_id>/review", methods=["POST"])
@jwt_required()
def add_review(recipe_id):
    try:
        user_id = get_jwt_identity()
        raw_data = request.form.to_dict()
        image = request.files.get("image")
                
        review_id = ReviewService.add_review(user_id, recipe_id, raw_data, image)
        
        return api_response.success(messages.REVIEW_ADDED, {"review_id": review_id}, 201)

    except ValueError as e:
        return api_response.error(str(e), 400)
    except Exception as e:
        print(f"Review Error: {e}")
        return api_response.error(messages.INTERNAL_ERROR, 500)
    
@reviews_bp.route("/review/<review_id>", methods=["DELETE"])
@jwt_required()
def delete_review(review_id):
    try:
        user_id = get_jwt_identity()
        ReviewService.delete_review(user_id, review_id)
        return api_response.success(messages.REVIEW_DELETED, None, 200)
    except ValueError as e:
        return api_response.error(str(e), 404)
    except Exception as e:
        print(f"DELETE_REVIEW_ERROR: {e}")
        return api_response.error(messages.INTERNAL_ERROR, 500)
        

@reviews_bp.route("/review/<review_id>", methods=["PATCH"])
@jwt_required()
def update_review(review_id):
    try:
        user_id = get_jwt_identity()
        raw_data = request.form.to_dict()
        image = request.files.get("image")
         
        ReviewService.update_review(user_id, review_id, raw_data, image)
        
        return api_response.success(messages.REWVIEW_EDIT_SUCCESSFULLY, None, 200)
    except ValidationError as e:
        return api_response.error(messages.INVALID_DATA_FORMAT, 400, e.errors())
    except ValueError as e:
        return api_response.error(str(e), 404)
    except Exception as e:
        print(f"PATCH_REVIEW_ERROR: {e}")
        return api_response.error(messages.INTERNAL_ERROR, 500)