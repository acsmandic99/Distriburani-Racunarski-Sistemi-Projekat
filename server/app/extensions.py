from flask_pymongo import PyMongo
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO
import redis

mongo: PyMongo = PyMongo()
cors: CORS = CORS()
jwt = JWTManager()
socketio: SocketIO = SocketIO()
redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)