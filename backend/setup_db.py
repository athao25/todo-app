#!/usr/bin/env python3
"""
Database setup script for the Todo application.
Run this script to create the database tables and populate with test data.
"""

import sys
from datetime import datetime, timedelta, timezone
from app import create_app
from models import db, Todo

def create_test_data():
    """Create sample todos for testing with specific time ranges"""
    
    # Get current time for calculating specific time ranges
    now = datetime.now(timezone.utc)
    
    # Test todos with specific time ranges to test all formatter functions
    test_todos = [
        # Test "just now" (under 1 minute)
        {
            'title': 'Just created task',
            'completed': False,
            'created_at': now - timedelta(seconds=30)
        },
        # Test under 5 minutes
        {
            'title': 'Very recent task',
            'completed': False,
            'created_at': now - timedelta(minutes=2)
        },
        # Test 5-minute intervals (5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55 mins)
        {
            'title': '5 minutes ago task',
            'completed': False,
            'created_at': now - timedelta(minutes=5)
        },
        {
            'title': '15 minutes ago task',
            'completed': True,
            'created_at': now - timedelta(minutes=15)
        },
        {
            'title': '30 minutes ago task',
            'completed': False,
            'created_at': now - timedelta(minutes=30)
        },
        {
            'title': '45 minutes ago task',
            'completed': True,
            'created_at': now - timedelta(minutes=45)
        },
        # Test exactly 1 hour
        {
            'title': 'Exactly 1 hour ago task',
            'completed': False,
            'created_at': now - timedelta(hours=1)
        },
        # Test multiple hours (under 24)
        {
            'title': '2 hours ago task',
            'completed': True,
            'created_at': now - timedelta(hours=2)
        },
        {
            'title': '6 hours ago task',
            'completed': False,
            'created_at': now - timedelta(hours=6)
        },
        {
            'title': '12 hours ago task',
            'completed': False,
            'created_at': now - timedelta(hours=12)
        },
        {
            'title': '23 hours ago task',
            'completed': True,
            'created_at': now - timedelta(hours=23)
        },
        # Test exactly 24 hours (1 day)
        {
            'title': 'Exactly 1 day ago task',
            'completed': False,
            'created_at': now - timedelta(days=1)
        },
        # Test multiple days
        {
            'title': '3 days ago task',
            'completed': True,
            'created_at': now - timedelta(days=3)
        },
        {
            'title': '1 week ago task',
            'completed': False,
            'created_at': now - timedelta(days=7)
        },
        {
            'title': '2 weeks ago task',
            'completed': False,
            'created_at': now - timedelta(days=14)
        },
        {
            'title': '1 month ago task',
            'completed': True,
            'created_at': now - timedelta(days=30)
        },
        {
            'title': '2 months ago task',
            'completed': False,
            'created_at': now - timedelta(days=60)
        },
        {
            'title': '3 months ago task',
            'completed': True,
            'created_at': now - timedelta(days=90)
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
                todo = Todo(
                    title=todo_data['title'],
                    completed=todo_data['completed'],
                    created_at=todo_data['created_at']
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


