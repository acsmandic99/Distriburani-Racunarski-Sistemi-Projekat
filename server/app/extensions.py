from flask_pymongo import PyMongo
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO
import redis
import os


mongo: PyMongo = PyMongo()
cors: CORS = CORS()
jwt = JWTManager()
socketio: SocketIO = SocketIO()
redis_host = os.getenv("REDIS_HOST", "localhost") 
redis_url = os.getenv("REDIS_URL")
if redis_url:
    redis_client = redis.from_url(redis_url, decode_responses=True)
else:
    redis_host = os.getenv("REDIS_HOST", "localhost")
    redis_client = redis.Redis(host=redis_host, port=6379, db=0, decode_responses=True)