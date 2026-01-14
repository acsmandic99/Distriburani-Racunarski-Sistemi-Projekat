from flask import Blueprint
from app.features.shared.utils.url_prefixes import join_url_prefixes
from app.features.shared.constants.api import API_PREFIX,AUTH_PREFIX

auth_bp = Blueprint('auth',__name__,url_prefix=join_url_prefixes(API_PREFIX,AUTH_PREFIX))

from . import routes