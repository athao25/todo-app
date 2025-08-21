import axios from 'axios'
import type { Todo, CreateTodoData, UpdateTodoData, TodoFilters } from '@/types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message)
    
    // Handle specific error cases
    if (error.response?.status === 404) {
      console.error('Resource not found')
    } else if (error.response?.status >= 500) {
      console.error('Server error')
    }
    
    return Promise.reject(error)
  }
)

export const todoApi = {
  // Get all todos with optional filters
  async getTodos(filters?: TodoFilters): Promise<Todo[]> {
    const params = new URLSearchParams()
    
    if (filters?.completed !== undefined) {
      params.append('completed', filters.completed.toString())
    }
    
    
    const response = await api.get(`/todos?${params.toString()}`)
    return response.data
  },

  // Get a specific todo by ID
  async getTodo(id: number): Promise<Todo> {
    const response = await api.get(`/todos/${id}`)
    return response.data
  },

  // Create a new todo
  async createTodo(data: CreateTodoData): Promise<Todo> {
    const response = await api.post('/todos', data)
    return response.data
  },

  // Update a todo
  async updateTodo(id: number, data: UpdateTodoData): Promise<Todo> {
    const response = await api.put(`/todos/${id}`, data)
    return response.data
  },

  // Delete a todo
  async deleteTodo(id: number): Promise<void> {
    await api.delete(`/todos/${id}`)
  },

  // Bulk update todos
  async bulkUpdateTodos(todoIds: number[], updates: UpdateTodoData): Promise<void> {
    await api.put('/todos/bulk', {
      todo_ids: todoIds,
      updates
    })
  },

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await api.get('/health')
    return response.data
  }
}

export default api

