from flask import Blueprint
from ..shared.constants.api import API_PREFIX,FAVORUITES_PREFIX
from ..shared.utils.url_prefixes import join_url_prefixes

favourites_bp : Blueprint = Blueprint('favourites',__name__,url_prefix=join_url_prefixes(API_PREFIX,FAVORUITES_PREFIX))

from . import routes