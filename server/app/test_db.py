from .extensions import mongo

def test_connection() -> None:
    """Test MongoDB connection."""
    try:
        if mongo.db is None:
            raise Exception("MongoDB is not initialized.")
        
        mongo.db.command("ping")
        print("Successfully connected to MongoDB!")
    except Exception as e:
        print("Failed to connect to MongoDB.", e)
    