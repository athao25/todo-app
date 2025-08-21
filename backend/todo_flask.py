#!/usr/bin/env python3
"""
WSGI entry point for Todo Flask application.
Used by WSGI servers like Gunicorn to serve the Flask application.
"""

from app import create_app

# Create the Flask application instance
app = create_app()

if __name__ == "__main__":
    app.run()