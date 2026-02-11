from app import create_app
from app.extensions import socketio

app = create_app()

if __name__ == "__main__":
    print("Backend startuje na portu 5000...")
    socketio.run(app, host="0.0.0.0", port=5000, debug=True,allow_unsafe_werkzeug=True)
    