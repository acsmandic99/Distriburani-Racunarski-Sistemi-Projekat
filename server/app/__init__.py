from flask import Flask
from .features.users import users_bp
from .features.auth import auth_bp
from .features.recipes import recipes_bp
from .features.author_managment import author_managment_bp
from .features.admin import admin_bp
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
    app.register_blueprint(recipes_bp)
    app.register_blueprint(author_managment_bp, url_prefix="/api/v1/author_managment")
    app.register_blueprint(admin_bp)
    #with app.app_context():
        #print(f"{'Endpoint':<40} {'Methods':<20} {'Rule'}")
        #print("-" * 80)
        #for rule in app.url_map.iter_rules():
        # Filtriramo samo rute (izbacujemo static fajlove ako smetaju)
        #    methods = ', '.join(rule.methods)
         #   print(f"{rule.endpoint:<40} {methods:<20} {rule}")
    return app