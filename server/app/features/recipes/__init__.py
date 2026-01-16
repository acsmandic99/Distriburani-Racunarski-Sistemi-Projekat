from flask import Blueprint
from ..shared.utils.url_prefixes import join_url_prefixes
from ..shared.constants.api import RECIPES_PREFIX,API_PREFIX

recipes_bp: Blueprint = Blueprint('recipes', __name__, url_prefix=join_url_prefixes(API_PREFIX, RECIPES_PREFIX))

from . import routes