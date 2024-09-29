from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_session import Session
SECRET_KEY = "29fadb0c4a562ecad661b731ba2f344034edfc62b0a43e8c49bcd2c6b47fa336" # Generates a 64-character hexadecimal string

app = Flask(__name__)

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
from send3D import three_d_bp

app.register_blueprint(quiz_bp)
app.register_blueprint(user_bp)
app.register_blueprint(learn_bp)
app.register_blueprint(three_d_bp)

if __name__ == '__main__':
    app.run(debug=True)