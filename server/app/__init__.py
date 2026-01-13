from flask import Flask
from .features.users import users_bp
from .extensions import mongo
from .test_db import test_connection
def create_app() -> Flask:
    app = Flask(__name__)
    # Load configuration
    app.config.from_object('config.Config')

    #baza
    mongo.init_app(app)
    test_connection()

    # Register blueprints
    app.register_blueprint(users_bp)
    return app