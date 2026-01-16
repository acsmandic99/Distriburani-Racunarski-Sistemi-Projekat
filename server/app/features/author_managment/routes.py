from . import author_managment_bp
from flask_jwt_extended import get_jwt_identity,jwt_required
from ..shared.utils import api_response
from ..shared.constants import messages
from .services import AuthorManagmentService


@author_managment_bp.route("/request-author-role/", methods=["POST"])
@jwt_required()
def author_request():
    try:
        user_id = get_jwt_identity()
        success = AuthorManagmentService.request_author_role(user_id)
        
        if success:
            return api_response.success(messages.ROLE_REQUESTED_SUCCESSFULLY,None,201)
        return api_response.error(messages.INTERNAL_ERROR, 500)
    except ValueError as e:
            return api_response.error(str(e), 400)
    except Exception as e:
        #logovanje
        print(e)
        return api_response.error(messages.INTERNAL_ERROR, 500)
