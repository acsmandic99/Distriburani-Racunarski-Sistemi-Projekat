from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from .services import FavoriteService
from ..shared.utils import api_response
from ..shared.constants import messages



from . import favourites_bp

@favourites_bp.route("/toggle/<recipe_id>", methods=["POST"])
@jwt_required()
def toggle_favorite(recipe_id):
    try:
        user_id = get_jwt_identity()
        result = FavoriteService.toggle_favorite(user_id, recipe_id)
        
        if result["action"] == "added":
            msg = messages.ADDED_TO_FAVORITES 
        else:
            msg = messages.REMOVED_FROM_FAVORUTIES
        
        return api_response.success(msg, data=result, status=200)
    
    except ValueError as e:
        return api_response.error(str(e), 400)
    except Exception as e:
        print(f"Greska u toggle_favorite: {e}")
        return api_response.error(messages.INTERNAL_ERROR, 500)

@favourites_bp.route("/", methods=["GET"])
@jwt_required()
def get_my_favorites():
    try:
        user_id = get_jwt_identity()
        favorites = FavoriteService.get_favorites_detailed(user_id)
        
        return api_response.success(messages.FAVOURITES_FETCHED_SUCCESSFULLY, data=favorites, status=200)
    
    except Exception as e:
        print(f"Greska u get_my_favorites: {e}")
        return api_response.error(messages.INTERNAL_ERROR, 500)