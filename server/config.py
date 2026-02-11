import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    default_mongo = f"{os.getenv('MONGO_URI')}/{os.getenv('MONGO_DB_NAME')}"
    MONGO_URI = os.getenv("MONGO_URI_FULL", default_mongo)
    
    JWT_SECRET_KEY = os.getenv("JWT_SECRET")

    TOKEN = os.getenv("MAILTRAP_TOKEN")
    INBOX_ID = os.getenv("MAILTRAP_INBOX_ID")
    