from . import recipes_bp
from flask_jwt_extended import jwt_required,get_jwt_identity
from .services import RecipeService
from flask import request
from .parsers import RecipeParser
from ..shared.constants import messages
from ..shared.utils import api_response 
from pydantic import ValidationError


@recipes_bp.route("/add-recipe", methods=["POST"])
@jwt_required()
def add_recipe():
    try:
        user_id = get_jwt_identity()
        raw_data = RecipeParser.parse_create_data(request)
        image_file = request.files.get('image')

        recipe = RecipeService.add_recipe(user_id,image_file,raw_data)

        return api_response.success(messages.RECIPE_CREATED,recipe,201)
    
    except ValidationError as e:
        custom_errors = []
        for error in e.errors():
            custom_errors.append({
                "field": error["loc"][-1], 
                "message": error["msg"]      
            })
        return api_response.error(messages.INVALID_DATA_FORMAT, 400, custom_errors)
    except ValueError as e:
        if str(e) == messages.AUTHOR_NOT_EXIST:
            return api_response.error(messages.AUTHOR_NOT_EXIST,404)
        if str(e) == messages.NOT_AUTHOR:
            return api_response.error(messages.NOT_AUTHOR,403)
        return api_response.error(messages.INVALID_DATA_FORMAT,400,str(e))
    except Exception as e:
        # Logovanje
        print(e)
        return api_response.error(messages.INTERNAL_ERROR, 500)

@recipes_bp.route("",methods = ["GET"])
def get_recipes():
    try:
        page = int(request.args.get('page',1))
        per_page = int(request.args.get('per_page',10))

        dish_type = request.args.get('type')
        difficulty = request.args.get('difficulty')
        base_url = request.host_url.rstrip('/')
        recipes = RecipeService.get_all_recipes(page,
                                                per_page,
                                                None,
                                                base_url
        )
        return api_response.success(
                message="Recipes retrieved successfully",
                data=recipes,
                status=200
            )
    except Exception as e:
        return api_response.error(message=str(e), status=500)
    
@recipes_bp.route("/<recipe_id>",methods= ["GET"])
def get_recipe_by_id(recipe_id):
    try:
        recipe = RecipeService.get_recipe_by_id(recipe_id)
        if recipe is None:
            return api_response.error(messages.RECIPE_ID_NOT_FOUND,404)
        return api_response.success(messages.RECIPE_FETCHED,recipe,200)
    except ValidationError as e:
        custom_errors = []
        for error in e.errors():
            custom_errors.append({
                "field": error["loc"][-1], 
                "message": error["msg"]      
            })
        return api_response.error(messages.INVALID_DATA, 400, custom_errors)
    except ValueError as e:
        return api_response.error(messages.INVALID_DATA,400,str(e))
    except Exception as e:
        print(e)
        return api_response.error(messages.INTERNAL_ERROR, 500)