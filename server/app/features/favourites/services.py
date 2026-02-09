from ..users.services import UserService
from ..recipes.services import RecipeService
from ..shared.constants import messages
class FavoriteService:
    @staticmethod
    def toggle_favorite(user_id, recipe_id):
        from ..recipes.services import RecipeService
        if not RecipeService.recipe_exists(recipe_id):
            raise ValueError(messages.RECIPE_ID_NOT_FOUND)
            
        action = UserService.toggle_favorite_recipe(user_id, recipe_id)
        return {"action": action}

    @staticmethod
    def get_favorites_detailed(user_id):
        fav_ids = UserService.get_favorite_ids(user_id)
        return RecipeService.get_recipes_by_ids(fav_ids)