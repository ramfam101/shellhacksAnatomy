from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_session import Session
from flask_cors import CORS
 # Generates a 64-character hexadecimal string

app = Flask(__name__)
CORS(app)
# Configurations
app.config['SECRET_KEY'] = SECRET_KEY
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_TYPE'] = 'filesystem'

# Initialize extensions
db = SQLAlchemy(app)
Session(app)

# Import and register Blueprints
from quiz_routes import quiz_bp
from user_routes import user_bp
from learn import learn_bp

app.register_blueprint(quiz_bp)
app.register_blueprint(user_bp)
app.register_blueprint(learn_bp)

if __name__ == '__main__':
    app.run(debug=True)