# Todo Application

A minimal, elegant todo application built with Vue.js frontend and Flask backend, using PostgreSQL database. Inspired by TodoMVC with modern styling and enhanced user experience.

## ✨ Features

- **Minimal TodoMVC Design**: Clean, focused interface for distraction-free task management
- **Click-to-Select**: Interactive todo selection with visual highlighting
- **Bulk Actions Modal**: Floating action panel for managing multiple todos at once
- **Smart Filtering**: Filter by All, Active, or Completed todos with automatic sorting
- **Auto-Focus Input**: Continuous todo creation without manual clicking
- **Time Tracking**: "Created X time ago" display with smart time formatting
- **Rounded Checkboxes**: Modern circular completion indicators
- **Optimized Performance**: No unnecessary API calls, instant UI updates
- **Confirmation Dialogs**: Safe bulk operations with user confirmation

## 🚀 Tech Stack

- **Frontend**: Vue.js 3 + TypeScript + Tailwind CSS + Pinia
- **Backend**: Flask + SQLAlchemy + PostgreSQL
- **Infrastructure**: Docker Compose for easy deployment
- **UI Components**: Headless UI + Heroicons for professional components

## 📁 Project Structure

```
todo-app/
├── package.json           # Root workspace configuration
├── package-lock.json      # Workspace dependency lock
├── WORKSPACES.md          # Workspace usage guide
├── frontend/              # Vue.js application (workspace)
│   ├── package.json       # Frontend dependencies
│   ├── src/
│   │   ├── components/    # Reusable Vue components
│   │   ├── views/         # Page-level components
│   │   ├── stores/        # Pinia state management
│   │   ├── services/      # API service layer
│   │   └── types/         # TypeScript type definitions
├── backend/               # Flask API server (Python)
│   ├── app.py            # Main Flask application
│   ├── models.py         # Database models
│   ├── config.py         # Configuration management
│   └── requirements.txt  # Python dependencies
├── tests/                 # E2E tests (workspace)
│   ├── package.json      # Test dependencies
│   ├── playwright.config.ts
│   └── e2e/              # Test files
├── docker-compose.yml    # Development environment
├── db_init.sh           # Database initialization script
├── start.sh             # Server startup script
└── README.md
```

## 🛠️ Quick Setup (Recommended)

### Option 1: npm Workspaces (Recommended)

The project now uses npm workspaces for unified script management:

```bash
# Clone and navigate to the project
git clone <repository-url>
cd todo-app

# Install all dependencies (JavaScript + Python)
npm run install:all

# Start both servers simultaneously
npm run dev
```

**Available npm Scripts:**
```bash
# Development
npm run dev          # Start both backend + frontend servers
npm run dev:frontend # Start only frontend (Vue.js)
npm run dev:backend  # Start only backend (Flask)

# Testing
npm run test         # Run all Playwright tests
npm run test:ui      # Run tests in interactive UI mode
npm run test:headed  # Run tests in headed browser mode

# Building & Type Checking
npm run build        # Build frontend for production
npm run type-check   # TypeScript type checking
npm run preview      # Preview production build

# Maintenance
npm run clean        # Clean all build artifacts
npm run lint         # Run linting across workspaces
npm run format       # Format code across workspaces

# Setup & Installation
npm run install:all      # Install all dependencies
npm run install:backend  # Install only Python dependencies
npm run setup           # Run initialization script (./db_init.sh)
npm run start           # Run startup script (./start.sh)
```

### Option 2: Automated Setup Script

```bash
# Run the automated setup script
chmod +x db_init.sh
./db_init.sh
```

### Option 3: Docker Compose

```bash
# Start all services with Docker
docker-compose up -d

# The application will be available at:
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
```

## 📋 Manual Setup Instructions

### Prerequisites
- Node.js 18+
- Python 3.9+
- PostgreSQL 14+ (or use Docker)

### Backend Setup
```bash
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp env.example .env.local
# Edit .env.local with your database credentials

# Create database tables
python setup_db.py

# Start the Flask server
python app.py
```

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Database Setup

#### Option 1: Local PostgreSQL
```bash
# Create database
createdb todo_app

# Update .env.local with your connection string
DATABASE_URL=postgresql://username:password@localhost:5432/todo_app
```

#### Option 2: Docker PostgreSQL
```bash
# Start PostgreSQL with Docker
docker run --name todo-postgres -e POSTGRES_DB=todo_app -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15-alpine
```

## 🌐 API Endpoints

### Todos
- `GET /api/todos` - Get all todos (with optional completion filtering)
- `POST /api/todos` - Create a new todo (requires: title)
- `GET /api/todos/{id}` - Get specific todo
- `PUT /api/todos/{id}` - Update todo (title, completed status)
- `DELETE /api/todos/{id}` - Delete todo
- `PUT /api/todos/bulk` - Bulk update multiple todos

### Health Check
- `GET /` - API information and health status
- `GET /api/health` - Detailed health check endpoint

## 🎨 User Experience

### Streamlined Todo Creation
- Single input field with "What needs to be done?" prompt
- Auto-focus returns to input after creation for continuous adding
- Instant todo addition without page reload

### Interactive Selection System
- Click any todo item to select it (blue highlight with ring)
- Multiple selection support for batch operations
- Visual feedback with immediate color changes

### Floating Bulk Actions Modal
- Appears on the right when todos are selected
- **Select All/Deselect All**: Toggle selection of all visible todos
- **Mark as Completed**: Bulk complete selected todos with green confirmation
- **Mark as Incomplete**: Bulk mark as incomplete with yellow confirmation  
- **Delete Selected**: Bulk delete with red warning confirmation
- **Clear Selection**: Remove all selections instantly

### Smart Todo Management
- **Rounded Checkboxes**: Modern circular completion indicators
- **Inline Editing**: Click pencil icon to edit todo titles
- **Time Display**: Shows "Created X time ago" with smart formatting (5min increments → hours → days)
- **Auto-Sorting**: Completed todos automatically move to bottom of list
- **Filter Buttons**: All, Active, Completed with center alignment

### Performance Optimized
- No full page reloads on todo updates
- Optimistic UI updates for instant feedback
- Efficient API calls only when necessary

## 🚀 Development

### Running in Development Mode

**Recommended (npm workspaces):**
```bash
# Start both servers with one command
npm run dev

# Or start individually
npm run dev:backend   # Flask server only
npm run dev:frontend  # Vue.js server only
```

**Manual (if needed):**
1. **Backend** (Terminal 1):
```bash
cd backend
source venv/bin/activate
python app.py
```

2. **Frontend** (Terminal 2):
```bash
cd frontend
npm run dev
```

### Testing

```bash
# Run all tests
npm run test

# Interactive test mode with UI
npm run test:ui

# Run tests with browser visible
npm run test:headed

# View test reports
npm run test:report --workspace=tests
```

### Building for Production

```bash
# Build frontend (via workspace)
npm run build

# Or manually
cd frontend
npm run build

# Backend (using gunicorn)
cd backend
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## 🐳 Docker Deployment

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🔧 Environment Variables

Create `backend/.env.local`:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/todo_app

# Flask Configuration
FLASK_ENV=development
SECRET_KEY=your-secret-key-change-this-in-production
FLASK_APP=app.py

# CORS Configuration (optional)
CORS_ORIGINS=http://localhost:3000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 Roadmap

- [ ] User authentication and authorization
- [ ] Task sharing and collaboration  
- [ ] Dark mode toggle
- [ ] Task categories and tags
- [ ] Search functionality
- [ ] Export tasks to various formats
- [ ] Keyboard shortcuts for power users
- [ ] Drag and drop reordering

---

**Built with ❤️ using Vue.js, Flask, and PostgreSQL**
# todo-app
