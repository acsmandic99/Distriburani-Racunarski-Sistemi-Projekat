from flask import Blueprint
from ..shared.constants.api import API_PREFIX,AUTHOR_MANAGMENT_PREFIX
from ..shared.utils.url_prefixes import join_url_prefixes

author_managment_bp: Blueprint = Blueprint('author_managment',__name__,url_prefix=join_url_prefixes(API_PREFIX,AUTHOR_MANAGMENT_PREFIX))

from . import routes