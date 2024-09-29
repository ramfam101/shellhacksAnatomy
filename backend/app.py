from flask import Flask
from flask_session import Session
from flask_cors import CORS

SECRET_KEY = '29fadb0c4a562ecad661b731ba2f344034edfc62b0a43e8c49bcd2c6b47fa336' # Generates a 64-character hexadecimal string

# Create the Flask app
def create_app():
    app = Flask(__name__)
    
    # Enable CORS
    CORS(app)
    
    # Configurations
    app.config['SESSION_TYPE'] = 'filesystem'
    
    # Initialize extensions
    Session(app)
    
    # Import and register Blueprints (importing within the function to avoid circular imports)
    from quiz_routes import quiz_bp
    from learn import learn_bp

    app.register_blueprint(quiz_bp)
    app.register_blueprint(learn_bp)

    return app

# Main entry point
if __name__ == "__main__":
    app = create_app()
    app.run(host='0.0.0.0', port=5001)

app = create_app()