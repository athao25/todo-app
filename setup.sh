#!/bin/bash

# Professional Todo App Setup Script
# This script sets up both frontend and backend components

set -e

echo "🚀 Setting up Professional Todo Application..."
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check for required tools
check_requirements() {
    print_status "Checking system requirements..."
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is required but not installed."
        exit 1
    fi
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is required but not installed."
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is required but not installed."
        exit 1
    fi
    
    # Check PostgreSQL (optional with Docker)
    if ! command -v psql &> /dev/null; then
        print_warning "PostgreSQL not found. You'll need Docker or a PostgreSQL server."
    fi
    
    print_success "System requirements check completed!"
}

# Setup backend
setup_backend() {
    print_status "Setting up Flask backend..."
    
    cd backend
    
    # Create virtual environment
    print_status "Creating Python virtual environment..."
    python3 -m venv venv
    
    # Activate virtual environment
    print_status "Activating virtual environment..."
    source venv/bin/activate
    
    # Install dependencies
    print_status "Installing Python dependencies..."
    pip install --upgrade pip
    pip install -r requirements.txt
    
    # Copy environment file
    if [ ! -f ".env.local" ]; then
        print_status "Creating environment configuration..."
        cp env.example .env.local
        print_warning "Please update .env.local with your database credentials!"
    fi
    
    cd ..
    print_success "Backend setup completed!"
}

# Setup frontend
setup_frontend() {
    print_status "Setting up Vue.js frontend..."
    
    cd frontend
    
    # Install dependencies
    print_status "Installing Node.js dependencies..."
    npm install
    
    cd ..
    print_success "Frontend setup completed!"
}

# Setup database (if PostgreSQL is available)
setup_database() {
    print_status "Setting up database..."
    
    if command -v psql &> /dev/null; then
        print_status "Creating PostgreSQL database..."
        
        # Try to create database (ignore if exists)
        createdb todo_app 2>/dev/null || true
        
        # Setup database tables
        cd backend
        source venv/bin/activate
        python setup_db.py
        cd ..
        
        print_success "Database setup completed!"
    else
        print_warning "PostgreSQL not found. Use Docker or install PostgreSQL manually."
    fi
}

# Main setup function
main() {
    echo "Starting setup process..."
    
    check_requirements
    setup_backend
    setup_frontend
    setup_database
    
    echo ""
    echo "🎉 Setup completed successfully!"
    echo "================================"
    echo ""
    print_status "Next steps:"
    echo "1. Update backend/.env.local with your database credentials"
    echo "2. Start the backend: cd backend && source venv/bin/activate && python app.py"
    echo "3. Start the frontend: cd frontend && npm run dev"
    echo "4. Open http://localhost:3000 in your browser"
    echo ""
    print_status "Alternative: Use Docker Compose"
    echo "docker-compose up -d"
    echo ""
    print_success "Happy coding! 🚀"
}

# Run main function
main

