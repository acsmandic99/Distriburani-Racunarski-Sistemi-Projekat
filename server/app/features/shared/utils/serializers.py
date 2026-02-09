from bson import ObjectId
from datetime import datetime

def serialize_mongo(data):
    """Pretvara MongoDB objekte u JSON serijabilne tipove."""
    if isinstance(data, list):
        return [serialize_mongo(item) for item in data]
    if isinstance(data, dict):
        new_data = {}
        for k, v in data.items():
            if k == "_id":
                new_data[k] = str(v)
            elif isinstance(v, (ObjectId, datetime)):
                new_data[k] = str(v) if isinstance(v, ObjectId) else v.isoformat()
            elif isinstance(v, dict) or isinstance(v, list):
                new_data[k] = serialize_mongo(v)
            else:
                new_data[k] = v
        return new_data
    return data