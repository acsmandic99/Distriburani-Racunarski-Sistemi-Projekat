from .services import CommentService
from . import comment_bp
from flask_jwt_extended import jwt_required,get_jwt_identity
from flask import jsonify, request
from ..shared.utils import api_response
from ..shared.constants import messages

@comment_bp.route("/add-comment", methods=["POST"])
@jwt_required()
def add_comment():
    try:
        user_id = get_jwt_identity()
        raw_data = request.form.to_dict()
        image_file = request.files.get('image')

        comment = CommentService.add_comment(user_id, image_file, raw_data)
        
        return api_response.success(messages.COMMENT_ADDED_SUCCESSFULLY,comment,201,)
    except ValueError as e:
        return api_response.error(str(e),400)
    except Exception as e:
        print(e)
        return api_response.error(messages.INTERNAL_ERROR,500)
    
@comment_bp.route("/<recipe_id>", methods=["GET"])
def get_recipe_comments(recipe_id):
    try:
    # Uzimamo iz query parametara npr. ?skip=10
        skip = request.args.get('skip', default=10, type=int)
        limit = request.args.get('limit', default=10, type=int)
        
        comments = CommentService.get_comments_for_recipe(recipe_id, skip, limit)
        return api_response.success(messages.COMMENTS_FETCHED,comments,200)
    except ValueError as e:
        return api_response.error(str(e),400)
    except Exception as e:
        print(e)
        return api_response.error(messages.INTERNAL_ERROR,500)
    
@comment_bp.route("/<comment_id>",methods=["DELETE"])
@jwt_required()
def delete_comment(comment_id):
    try:
        user_id = get_jwt_identity()
        CommentService.delete_comment(user_id,comment_id)
        return api_response.success(messages.COMMENT_DELETED,status=200)
    except ValueError as e:
        return api_response.error(str(e),400)
    except Exception as e:
        print(e)
        return api_response.error(messages.INTERNAL_ERROR,500)
