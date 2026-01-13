from flask import Flask
from .features.users import users_bp
from .extensions import mongo, cors
from .test_db import test_connection

def create_app() -> Flask:
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object('config.Config')

    # Initialize extensions
    mongo.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})
    test_connection()

    # Register blueprints
    app.register_blueprint(users_bp)
    
    return app