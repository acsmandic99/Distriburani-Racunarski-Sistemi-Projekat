from flask import jsonify

def success(message: str, data=None, status: int = 200):
    """Generate a standardized success API response."""
    response = {
        "success": True,
        "message": message,
        "data": data
    }
    return jsonify(response), status


def error(message: str, status: int = 400, details=None):
    """Generate a standardized error API response."""
    response = {
        "success": False,
        "message": message,
        "details": details
    }
    return jsonify(response), status