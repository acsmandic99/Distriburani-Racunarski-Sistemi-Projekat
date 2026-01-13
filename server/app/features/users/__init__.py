from flask import Blueprint
from app.features.shared.constants.api import API_PREFIX, USER_PREFIX
from app.features.shared.utils.url_prefixes import join_url_prefixes

users_bp: Blueprint = Blueprint('users', __name__, url_prefix=join_url_prefixes(API_PREFIX, USER_PREFIX))

from . import routes