import os
import sys
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))

# Load environment variables based on BASE_ENV argument or default to 'local'
base_env = os.environ.get('BASE_ENV', 'local')

# Check for command line argument
if len(sys.argv) > 1:
    # Look for BASE_ENV=value in command line arguments
    for arg in sys.argv[1:]:
        if arg.startswith('BASE_ENV='):
            base_env = arg.split('=')[1]
            break

# Load the appropriate .env file
env_file = os.path.join(basedir, f'.env.{base_env}')
if os.path.exists(env_file):
    load_dotenv(env_file)
    print(f"📁 Loaded environment from: .env.{base_env}")
else:
    # Fallback to .env if specific env file doesn't exist
    fallback_file = os.path.join(basedir, '.env')
    if os.path.exists(fallback_file):
        load_dotenv(fallback_file)
        print(f"📁 Loaded environment from fallback: .env")
    else:
        print(f"⚠️ No environment file found. Tried .env.{base_env} and .env")

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    
    # Database configuration from environment variables
    DATABASE_URL = os.environ.get('DATABASE_URL')
    if DATABASE_URL:
        SQLALCHEMY_DATABASE_URI = DATABASE_URL
    else:
        # Fallback: construct from individual environment variables
        db_host = os.environ.get('DB_HOST', '127.0.0.1')
        db_port = os.environ.get('DB_PORT', '5432')
        db_name = os.environ.get('DB_NAME', 'todo_db')
        db_user = os.environ.get('DB_USER', 'postgres')
        db_password = os.environ.get('DB_PASSWORD', 'postgres')
        
        SQLALCHEMY_DATABASE_URI = f'postgresql+psycopg://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}'
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = os.environ.get('FLASK_ENV') == 'development'
