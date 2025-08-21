export interface Todo {
  id: number
  title: string
  description?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  due_date?: string
  created_at: string
  updated_at: string
}

export interface CreateTodoData {
  title: string
  description?: string
  priority?: 'low' | 'medium' | 'high'
  due_date?: string
}

export interface UpdateTodoData {
  title?: string
  description?: string
  completed?: boolean
  priority?: 'low' | 'medium' | 'high'
  due_date?: string
}

export interface TodoFilters {
  completed?: boolean
  priority?: 'low' | 'medium' | 'high'
}

