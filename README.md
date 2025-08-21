# Todo Application

A modern, sleek todo application built with Vue.js frontend and Flask backend, using PostgreSQL database. Features a professional UI/UX design with comprehensive task management capabilities.

## ✨ Features

- **Modern UI/UX**: Clean, professional design with smooth animations
- **Full CRUD Operations**: Create, read, update, and delete todos
- **Priority Management**: Set and filter by priority levels (Low, Medium, High)
- **Due Date Support**: Set due dates with visual indicators for overdue tasks
- **Real-time Filtering**: Filter by completion status and priority
- **Bulk Operations**: Mark all complete or clear completed tasks
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Professional Dashboard**: Statistics and quick actions overview

## 🚀 Tech Stack

- **Frontend**: Vue.js 3 + TypeScript + Tailwind CSS + Pinia
- **Backend**: Flask + SQLAlchemy + PostgreSQL
- **Infrastructure**: Docker Compose for easy deployment
- **UI Components**: Headless UI + Heroicons for professional components

## 📁 Project Structure

```
todo-app/
├── frontend/              # Vue.js application
│   ├── src/
│   │   ├── components/    # Reusable Vue components
│   │   ├── views/         # Page-level components
│   │   ├── stores/        # Pinia state management
│   │   ├── services/      # API service layer
│   │   └── types/         # TypeScript type definitions
├── backend/               # Flask API server
│   ├── app.py            # Main Flask application
│   ├── models.py         # Database models
│   ├── config.py         # Configuration management
│   └── requirements.txt  # Python dependencies
├── docker-compose.yml    # Development environment
├── setup.sh             # Automated setup script
└── README.md
```

## 🛠️ Quick Setup (Recommended)

### Option 1: Automated Setup Script

```bash
# Clone and navigate to the project
git clone <repository-url>
cd todo-app

# Run the automated setup script
chmod +x setup.sh
./setup.sh
```

### Option 2: Docker Compose (Easiest)

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
- `GET /api/todos` - Get all todos (with filtering)
- `POST /api/todos` - Create a new todo
- `GET /api/todos/{id}` - Get specific todo
- `PUT /api/todos/{id}` - Update todo
- `DELETE /api/todos/{id}` - Delete todo
- `PUT /api/todos/bulk` - Bulk update todos

### Health Check
- `GET /api/health` - API health status

## 🎨 Features Showcase

### Dashboard Overview
- Task statistics (total, pending, completed, completion percentage)
- Quick action buttons for bulk operations
- Clean, card-based layout

### Task Management
- Create tasks with title, description, priority, and due date
- Edit tasks inline with a professional form interface
- Mark tasks as complete/incomplete with smooth animations
- Delete tasks with confirmation

### Filtering & Organization
- Filter by completion status (All, Pending, Completed)
- Filter by priority level (High, Medium, Low)
- Visual priority indicators with color-coded badges
- Due date indicators with overdue warnings

### Professional UI/UX
- Smooth hover animations and transitions
- Professional color scheme with accessibility in mind
- Responsive design for all screen sizes
- Loading states and error handling
- Toast notifications for user feedback

## 🚀 Development

### Running in Development Mode

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

### Building for Production

```bash
# Frontend
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
- [ ] Email notifications for due dates
- [ ] Dark mode toggle
- [ ] Task categories and tags
- [ ] File attachments
- [ ] Search functionality
- [ ] Export tasks to various formats

---

**Built with ❤️ using Vue.js, Flask, and PostgreSQL**
# todo-app
