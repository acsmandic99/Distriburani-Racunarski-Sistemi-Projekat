from flask import Blueprint
from ..shared.utils.url_prefixes import join_url_prefixes
from ..shared.constants.api import ADMIN_PREFIX,API_PREFIX

admin_bp: Blueprint = Blueprint('admin', __name__,url_prefix=join_url_prefixes(API_PREFIX,ADMIN_PREFIX))

from . import routes