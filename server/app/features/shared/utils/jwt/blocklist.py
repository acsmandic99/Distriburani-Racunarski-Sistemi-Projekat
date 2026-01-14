from .....extensions import mongo
def check_if_token_is_revoked(jwt_header, jwt_payload: dict):
    jti = jwt_payload["jti"]
    token = mongo.db.blocklist.find_one({"jti": jti})
    return token is not None