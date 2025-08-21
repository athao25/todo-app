import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { todoApi } from '@/services/api'
import type { Todo, CreateTodoData, UpdateTodoData, TodoFilters } from '@/types'

export const useTodoStore = defineStore('todos', () => {
  // State
  const todos = ref<Todo[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<TodoFilters>({})

  // Getters
  const filteredTodos = computed(() => {
    let filtered = todos.value

    if (filters.value.completed !== undefined) {
      filtered = filtered.filter(todo => todo.completed === filters.value.completed)
    }

    if (filters.value.priority) {
      filtered = filtered.filter(todo => todo.priority === filters.value.priority)
    }

    return filtered
  })

  const completedCount = computed(() => 
    todos.value.filter(todo => todo.completed).length
  )

  const pendingCount = computed(() => 
    todos.value.filter(todo => !todo.completed).length
  )

  const totalCount = computed(() => todos.value.length)

  const todosByPriority = computed(() => {
    const grouped = {
      high: todos.value.filter(todo => todo.priority === 'high'),
      medium: todos.value.filter(todo => todo.priority === 'medium'),
      low: todos.value.filter(todo => todo.priority === 'low')
    }
    return grouped
  })

  // Actions
  async function fetchTodos(newFilters?: TodoFilters) {
    loading.value = true
    error.value = null
    
    try {
      if (newFilters) {
        filters.value = { ...newFilters }
      }
      
      const data = await todoApi.getTodos(filters.value)
      todos.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch todos'
      console.error('Error fetching todos:', err)
    } finally {
      loading.value = false
    }
  }

  async function createTodo(data: CreateTodoData) {
    loading.value = true
    error.value = null
    
    try {
      const newTodo = await todoApi.createTodo(data)
      todos.value.unshift(newTodo) // Add to beginning of list
      return newTodo
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create todo'
      console.error('Error creating todo:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateTodo(id: number, data: UpdateTodoData) {
    error.value = null
    
    try {
      const updatedTodo = await todoApi.updateTodo(id, data)
      const index = todos.value.findIndex(todo => todo.id === id)
      
      if (index !== -1) {
        todos.value[index] = updatedTodo
      }
      
      return updatedTodo
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update todo'
      console.error('Error updating todo:', err)
      throw err
    }
  }

  async function deleteTodo(id: number) {
    error.value = null
    
    try {
      await todoApi.deleteTodo(id)
      todos.value = todos.value.filter(todo => todo.id !== id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete todo'
      console.error('Error deleting todo:', err)
      throw err
    }
  }

  async function toggleTodo(id: number) {
    const todo = todos.value.find(t => t.id === id)
    if (!todo) return
    
    return updateTodo(id, { completed: !todo.completed })
  }

  async function bulkUpdateTodos(todoIds: number[], updates: UpdateTodoData) {
    error.value = null
    
    try {
      await todoApi.bulkUpdateTodos(todoIds, updates)
      
      // Update local state
      todos.value = todos.value.map(todo => {
        if (todoIds.includes(todo.id)) {
          return { ...todo, ...updates, updated_at: new Date().toISOString() }
        }
        return todo
      })
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to bulk update todos'
      console.error('Error bulk updating todos:', err)
      throw err
    }
  }

  async function markAllCompleted() {
    const pendingTodoIds = todos.value
      .filter(todo => !todo.completed)
      .map(todo => todo.id)
    
    if (pendingTodoIds.length > 0) {
      return bulkUpdateTodos(pendingTodoIds, { completed: true })
    }
  }

  async function clearCompleted() {
    const completedTodos = todos.value.filter(todo => todo.completed)
    
    try {
      await Promise.all(
        completedTodos.map(todo => deleteTodo(todo.id))
      )
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to clear completed todos'
      console.error('Error clearing completed todos:', err)
      throw err
    }
  }

  function setFilters(newFilters: TodoFilters) {
    filters.value = { ...newFilters }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    todos,
    loading,
    error,
    filters,
    
    // Getters
    filteredTodos,
    completedCount,
    pendingCount,
    totalCount,
    todosByPriority,
    
    // Actions
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    bulkUpdateTodos,
    markAllCompleted,
    clearCompleted,
    setFilters,
    clearError
  }
})

