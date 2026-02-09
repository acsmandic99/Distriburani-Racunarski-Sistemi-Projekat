from flask import Blueprint
from ..shared.utils.url_prefixes import join_url_prefixes
from ..shared.constants.api import COMMENT_PREFIX,API_PREFIX

comment_bp: Blueprint = Blueprint('comment', __name__, url_prefix=join_url_prefixes(API_PREFIX, COMMENT_PREFIX))

from . import routes