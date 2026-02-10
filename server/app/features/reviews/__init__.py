from flask import Blueprint
from ..shared.utils.url_prefixes import join_url_prefixes
from ..shared.constants.api import REVIEWS_PREFIX,API_PREFIX

reviews_bp: Blueprint = Blueprint('reviews', __name__, url_prefix=join_url_prefixes(API_PREFIX, REVIEWS_PREFIX))

from . import routes