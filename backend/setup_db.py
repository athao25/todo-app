#!/usr/bin/env python3
"""
Database setup script for the Todo application.
Run this script to create the database tables and populate with test data.
"""

import sys
import random
from datetime import datetime, timedelta, timezone
from app import create_app
from models import db, Todo

def create_test_data():
    """Create sample todos for testing"""
    
    # Sample todos with various states
    test_todos = [
        {
            'title': 'Complete project proposal',
            'completed': False
        },
        {
            'title': 'Buy groceries',
            'completed': False
        },
        {
            'title': 'Call dentist appointment',
            'completed': False
        },
        {
            'title': 'Review code changes',
            'completed': False
        },
        {
            'title': 'Update website content',
            'completed': False
        },
        {
            'title': 'Organize desk workspace',
            'completed': True
        },
        {
            'title': 'Send birthday card',
            'completed': True
        },
        {
            'title': 'Learn new programming framework',
            'completed': False
        },
        {
            'title': 'Plan team meeting agenda',
            'completed': False
        },
        {
            'title': 'Fix bug in login system',
            'completed': False
        },
        {
            'title': 'Water plants',
            'completed': True
        },
        {
            'title': 'Backup important files',
            'completed': False
        }
    ]
    
    return test_todos

def setup_database():
    """Create all database tables and populate with test data"""
    app = create_app()
    
    with app.app_context():
        try:
            # Create all tables
            db.create_all()
            print("✅ Database tables created successfully!")
            
            # Check if tables exist
            from sqlalchemy import inspect
            inspector = inspect(db.engine)
            tables = inspector.get_table_names()
            print(f"📋 Created tables: {', '.join(tables)}")
            
            # Check if todos already exist
            existing_todos = Todo.query.count()
            if existing_todos > 0:
                print(f"📋 Database already contains {existing_todos} todos. Skipping test data creation.")
                return
            
            # Create test todos
            test_todos = create_test_data()
            print(f"📝 Creating {len(test_todos)} test todos...")
            
            for todo_data in test_todos:
                # Create datetime objects with wider variation in creation times (up to 2-3 months)
                days_ago = random.randint(1, 90)  # Random day within last 2-3 months
                hours_variation = random.randint(0, 23)  # Random hour of day
                minutes_variation = random.randint(0, 59)  # Random minute
                
                created_time = datetime.now(timezone.utc) - timedelta(
                    days=days_ago,
                    hours=hours_variation, 
                    minutes=minutes_variation
                )
                
                todo = Todo(
                    title=todo_data['title'],
                    completed=todo_data['completed']
                )
                
                db.session.add(todo)
            
            db.session.commit()
            
            # Print summary
            total_todos = Todo.query.count()
            completed_todos = Todo.query.filter_by(completed=True).count()
            pending_todos = total_todos - completed_todos
            
            print("✅ Test data created successfully!")
            print(f"📊 Summary:")
            print(f"   Total todos: {total_todos}")
            print(f"   Completed: {completed_todos}")
            print(f"   Pending: {pending_todos}")
            
        except Exception as e:
            print(f"❌ Error setting up database: {e}")
            db.session.rollback()
            sys.exit(1)

if __name__ == "__main__":
    setup_database()

