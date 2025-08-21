export interface Todo {
  id: number
  title: string
  completed: boolean
  created_at: string
  updated_at: string
}

export interface CreateTodoData {
  title: string
}

export interface UpdateTodoData {
  title?: string
  completed?: boolean
}

export interface TodoFilters {
  completed?: boolean
}

