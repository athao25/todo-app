from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from datetime import datetime
import os

from config import Config
from models import db, ma, Todo, todo_schema, todos_schema

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    ma.init_app(app)
    CORS(app, origins=[
        'http://localhost:3000', 
        'http://localhost:3001',
        'https://todo-app-frontend-fcip.onrender.com'
    ], supports_credentials=True)
    migrate = Migrate(app, db)
    
    # API Routes
    @app.route('/api/todos', methods=['GET'])
    def get_todos():
        """Get all todos with optional filtering"""
        try:
            # Query parameters for filtering
            completed = request.args.get('completed')
            
            query = Todo.query
            
            if completed is not None:
                completed_bool = completed.lower() in ['true', '1', 'yes']
                query = query.filter(Todo.completed == completed_bool)
            
            # Order by creation date (newest first)
            todos = query.order_by(Todo.created_at.desc()).all()
            return jsonify(todos_schema.dump(todos))
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/todos', methods=['POST'])
    def create_todo():
        """Create a new todo"""
        try:
            data = request.get_json()
            
            # Validate required fields
            if not data or not data.get('title'):
                return jsonify({'error': 'Title is required'}), 400
            
            # Create new todo
            todo = Todo(
                title=data['title']
            )
            
            db.session.add(todo)
            db.session.commit()
            
            return jsonify(todo_schema.dump(todo)), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/todos/<int:todo_id>', methods=['GET'])
    def get_todo(todo_id):
        """Get a specific todo by ID"""
        try:
            todo = Todo.query.get_or_404(todo_id)
            return jsonify(todo_schema.dump(todo))
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/todos/<int:todo_id>', methods=['PUT'])
    def update_todo(todo_id):
        """Update a specific todo"""
        try:
            todo = Todo.query.get_or_404(todo_id)
            data = request.get_json()
            
            if not data:
                return jsonify({'error': 'No data provided'}), 400
            
            # Update fields if provided
            if 'title' in data:
                todo.title = data['title']
            if 'completed' in data:
                todo.completed = data['completed']
            
            todo.updated_at = datetime.utcnow()
            db.session.commit()
            
            return jsonify(todo_schema.dump(todo))
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/todos/<int:todo_id>', methods=['DELETE'])
    def delete_todo(todo_id):
        """Delete a specific todo"""
        try:
            todo = Todo.query.get_or_404(todo_id)
            db.session.delete(todo)
            db.session.commit()
            return jsonify({'message': 'Todo deleted successfully'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/todos/bulk', methods=['PUT'])
    def bulk_update_todos():
        """Bulk update multiple todos"""
        try:
            data = request.get_json()
            
            if not data or 'todo_ids' not in data or 'updates' not in data:
                return jsonify({'error': 'todo_ids and updates are required'}), 400
            
            todo_ids = data['todo_ids']
            updates = data['updates']
            
            todos = Todo.query.filter(Todo.id.in_(todo_ids)).all()
            
            for todo in todos:
                if 'completed' in updates:
                    todo.completed = updates['completed']
                todo.updated_at = datetime.utcnow()
            
            db.session.commit()
            
            return jsonify({
                'message': f'Updated {len(todos)} todos successfully',
                'updated_count': len(todos)
            })
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    
    @app.route('/', methods=['GET'])
    def home():
        """Home page with health check"""
        return jsonify({
            'message': 'Todo App API',
            'status': 'healthy',
            'version': '1.0.0',
            'timestamp': datetime.utcnow().isoformat(),
            'endpoints': {
                'health': '/api/health',
                'todos': '/api/todos',
                'documentation': 'Visit /api/todos for todo operations'
            }
        })
    
    @app.route('/api/health', methods=['GET'])
    def health_check():
        """Health check endpoint"""
        return jsonify({
            'status': 'healthy',
            'timestamp': datetime.utcnow().isoformat()
        })
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Resource not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500
    
    return app

if __name__ == '__main__':
    app = create_app()
    
    with app.app_context():
        # Create tables if they don't exist
        db.create_all()
    
    # Run the application (port 5001 to avoid macOS AirPlay conflict)
    app.run(debug=True, host='0.0.0.0', port=5001)
