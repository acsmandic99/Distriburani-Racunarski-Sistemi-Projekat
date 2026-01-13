import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MONGO_URI = f"{os.getenv('MONGO_URI')}/{os.getenv('MONGO_DB_NAME')}"
    
    JWT_SECRET = os.getenv("JWT_SECRET")
