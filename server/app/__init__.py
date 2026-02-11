from flask import Flask
from .features.users import users_bp
from .features.auth import auth_bp
from .features.recipes import recipes_bp
from .features.author_managment import author_managment_bp
from .features.admin import admin_bp
from .features.comments import comment_bp
from .features.favourites import favourites_bp
from .features.reviews import reviews_bp
from .extensions import mongo, cors,jwt,socketio,redis_client
from .test_db import test_connection
from .test_redis import test_redis
from datetime import timedelta
from .features.shared.utils.jwt.blocklist import check_if_token_is_revoked

from flask_socketio import SocketIO


def create_app() -> Flask:
    app = Flask(__name__)
    # Load configuration
    app.config.from_object('config.Config')

    # Initialize extensions
    mongo.init_app(app)
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
    jwt.init_app(app)
    # Initialize SocketIO with CORS support
    socketio.init_app(app, cors_allowed_origins="*")

    @jwt.token_in_blocklist_loader
    def check_if_token_is_revoked(jwt_header, jwt_payload):
        jti = jwt_payload["jti"]
        token_in_redis = redis_client.get(f"blacklist:{jti}")
        return token_in_redis is not None

    cors.init_app(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
            "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })
    test_connection()
    test_redis()
  
    # Register blueprints
    app.register_blueprint(users_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(recipes_bp)
    app.register_blueprint(author_managment_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(comment_bp)
    app.register_blueprint(favourites_bp)
    app.register_blueprint(reviews_bp)

    print("\n=== REGISTERED ROUTES ===")
    for rule in app.url_map.iter_rules():
        print(f"{rule.endpoint}: {rule.rule} [{', '.join(rule.methods)}]")
    print("=========================\n")
   
    return app