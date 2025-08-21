#!/usr/bin/env python3
"""
Migration script to simplify the Todo model by removing priority, description, and due_date columns.
This makes the todo app more minimal like the TodoMVC style.
"""

import sys
from app import create_app
from models import db

def migrate_simplify_todos():
    """Remove unnecessary columns from todos table"""
    app = create_app()
    
    with app.app_context():
        try:
            # Check if columns exist before trying to drop them
            from sqlalchemy import inspect, text
            inspector = inspect(db.engine)
            columns = [col['name'] for col in inspector.get_columns('todos')]
            
            print(f"Current columns: {columns}")
            
            # Drop columns if they exist
            columns_to_drop = ['priority', 'description', 'due_date']
            
            for column in columns_to_drop:
                if column in columns:
                    print(f"Dropping column: {column}")
                    with db.engine.connect() as connection:
                        connection.execute(text(f'ALTER TABLE todos DROP COLUMN {column}'))
                        connection.commit()
                else:
                    print(f"Column {column} does not exist, skipping")
            
            print("✅ Migration completed successfully!")
            print("Remaining columns:", [col['name'] for col in inspector.get_columns('todos')])
            
        except Exception as e:
            print(f"❌ Migration failed: {e}")
            sys.exit(1)

if __name__ == "__main__":
    migrate_simplify_todos()