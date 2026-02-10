from .extensions import redis_client

def test_redis() -> None:
    try:
        redis_client.set("provera", "Uspesno smo povezani")
        print(redis_client.get("provera"))
    except Exception as e:
        print(f"Greška: {e}")