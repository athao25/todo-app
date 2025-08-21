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
    
    # Sample todos with various states and priorities
    test_todos = [
        {
            'title': 'Complete project proposal',
            'description': 'Write and review the Q4 project proposal for the new client initiative',
            'priority': 'high',
            'due_date': datetime.now(timezone.utc) + timedelta(days=2),
            'completed': False
        },
        {
            'title': 'Buy groceries',
            'description': 'Milk, bread, eggs, vegetables, and fruits for the week',
            'priority': 'medium',
            'due_date': datetime.now(timezone.utc) + timedelta(days=1),
            'completed': False
        },
        {
            'title': 'Call dentist appointment',
            'description': 'Schedule routine cleaning and checkup for next month',
            'priority': 'medium',
            'due_date': None,
            'completed': False
        },
        {
            'title': 'Review code changes',
            'description': 'Review pull requests from the development team and provide feedback',
            'priority': 'high',
            'due_date': datetime.now(timezone.utc) + timedelta(hours=4),
            'completed': False
        },
        {
            'title': 'Update website content',
            'description': 'Update the about page and add new team member profiles',
            'priority': 'low',
            'due_date': datetime.now(timezone.utc) + timedelta(days=7),
            'completed': False
        },
        {
            'title': 'Organize desk workspace',
            'description': 'Clean and organize desk, file important documents',
            'priority': 'low',
            'due_date': None,
            'completed': True
        },
        {
            'title': 'Send birthday card',
            'description': 'Send birthday card to mom - her birthday is next week',
            'priority': 'medium',
            'due_date': datetime.now(timezone.utc) + timedelta(days=5),
            'completed': True
        },
        {
            'title': 'Learn new programming framework',
            'description': 'Complete online course on Vue.js and build a small project',
            'priority': 'low',
            'due_date': datetime.now(timezone.utc) + timedelta(days=14),
            'completed': False
        },
        {
            'title': 'Plan team meeting agenda',
            'description': 'Prepare agenda items for next week\'s team standup meeting',
            'priority': 'medium',
            'due_date': datetime.now(timezone.utc) + timedelta(days=3),
            'completed': False
        },
        {
            'title': 'Fix bug in login system',
            'description': 'Investigate and fix the authentication timeout issue reported by users',
            'priority': 'high',
            'due_date': datetime.now(timezone.utc) + timedelta(hours=12),
            'completed': False
        },
        {
            'title': 'Water plants',
            'description': 'Water all indoor plants and check for any that need repotting',
            'priority': 'low',
            'due_date': None,
            'completed': True
        },
        {
            'title': 'Backup important files',
            'description': 'Create backup of all project files and personal documents to external drive',
            'priority': 'medium',
            'due_date': datetime.now(timezone.utc) + timedelta(days=1),
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
                    description=todo_data['description'],
                    priority=todo_data['priority'],
                    due_date=todo_data['due_date'],
                    completed=todo_data['completed'],
                    created_at=created_time,
                    updated_at=created_time
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
            print(f"   High priority: {Todo.query.filter_by(priority='high').count()}")
            print(f"   Medium priority: {Todo.query.filter_by(priority='medium').count()}")
            print(f"   Low priority: {Todo.query.filter_by(priority='low').count()}")
            
        except Exception as e:
            print(f"❌ Error setting up database: {e}")
            db.session.rollback()
            sys.exit(1)

if __name__ == "__main__":
    setup_database()

