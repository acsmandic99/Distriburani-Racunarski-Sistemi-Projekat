from flask import Flask
from .features.users import users_bp
from .features.auth import auth_bp
from .extensions import mongo, cors,jwt
from .test_db import test_connection
from datetime import timedelta
from .features.shared.utils.jwt.blocklist import check_if_token_is_revoked
def create_app() -> Flask:
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object('config.Config')

    # Initialize extensions
    mongo.init_app(app)
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
    jwt.init_app(app)

    jwt.token_in_blocklist_loader(check_if_token_is_revoked)

    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})
    test_connection()
  
    # Register blueprints
    app.register_blueprint(users_bp)
    app.register_blueprint(auth_bp)
    
    return app