from flask_pymongo import PyMongo
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO

mongo: PyMongo = PyMongo()
cors: CORS = CORS()
jwt = JWTManager()
socketio: SocketIO = SocketIO()