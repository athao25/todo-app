<template>
  <div class="max-w-4xl mx-auto">
    <!-- Create Todo Form -->
    <div class="bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-6 mb-6 border border-white/20">
      <TodoCreateForm @todo-created="handleTodoCreated" />
    </div>

    <!-- Filters & Sort -->
    <div class="bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-6 mb-6 border border-white/20">
      <div class="mb-3">
        <h3 class="text-sm font-medium text-white/90 flex items-center">
          <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 2v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
          Filter & Sort Options
        </h3>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Status Filter -->
        <div class="space-y-2">
          <label class="block text-xs font-medium text-white/70 uppercase tracking-wide">
            📋 Status
          </label>
          <CustomDropdown
            v-model="filters.completed"
            :options="statusOptions"
            placeholder="All Todos"
            @update:model-value="loadTodos"
          />
        </div>

        <!-- Priority Filter -->
        <div class="space-y-2">
          <label class="block text-xs font-medium text-white/70 uppercase tracking-wide">
            ⚡ Priority
          </label>
          <CustomDropdown
            v-model="filters.priority"
            :options="priorityOptions"
            placeholder="All Priorities"
            @update:model-value="loadTodos"
          />
        </div>

        <!-- Sort Options -->
        <div class="space-y-2">
          <label class="block text-xs font-medium text-white/70 uppercase tracking-wide">
            🔄 Sort By
          </label>
          <CustomDropdown
            v-model="sortBy"
            :options="sortOptions"
            placeholder="Sort By"
            @update:model-value="applySorting"
          />
        </div>

        <!-- Actions -->
        <div class="space-y-2">
          <label class="block text-xs font-medium text-white/70 uppercase tracking-wide">
            🧹 Actions
          </label>
          <button
            @click="clearFilters"
            class="w-full px-4 py-2 text-sm font-medium text-white/90 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/30 rounded-lg hover:from-red-500/30 hover:to-pink-500/30 hover:border-red-400/50 focus:outline-none focus:ring-2 focus:ring-red-400/50 transition-all duration-200 shadow-lg"
          >
            ✨ Clear All
          </button>
        </div>
      </div>
    </div>

    <!-- Todo List -->
    <div class="space-y-4">
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white/50 mx-auto"></div>
        <p class="mt-4 text-white/80">Loading todos...</p>
      </div>
      
      <div v-else-if="todos.length === 0" class="text-center py-12">
        <p class="text-white/90 text-lg">No todos found.</p>
        <p class="text-white/70 text-sm mt-2">Create your first todo above!</p>
      </div>
      
      <div v-else>
        <TodoItem
          v-for="todo in todos"
          :key="todo.id"
          :todo="todo"
          @todo-updated="handleTodoUpdated"
          @todo-deleted="handleTodoDeleted"
        />
      </div>
    </div>

    <!-- Stats -->
    <div v-if="todos.length > 0" class="mt-8 bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-4 border border-white/20">
      <div class="flex justify-between items-center text-sm text-white/80">
        <span>Total: {{ todos.length }}</span>
        <span>Completed: {{ completedCount }}</span>
        <span>Active: {{ activeCount }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTodoStore } from '../stores/todos'
import TodoCreateForm from '../components/TodoCreateForm.vue'
import TodoItem from '../components/TodoItem.vue'
import CustomDropdown from '../components/CustomDropdown.vue'
import type { Todo, TodoFilters } from '../types'

const todoStore = useTodoStore()

const loading = ref(false)
const filters = ref({
  completed: '',
  priority: ''
})
const sortBy = ref('created_desc')

// Dropdown options
const statusOptions = [
  { value: '', label: 'All Todos', icon: '📋' },
  { value: 'false', label: 'Active', icon: '📝' },
  { value: 'true', label: 'Completed', icon: '✅' }
]

const priorityOptions = [
  { value: '', label: 'All Priorities', icon: '⚡' },
  { value: 'high', label: 'High', icon: '🔴' },
  { value: 'medium', label: 'Medium', icon: '🟡' },
  { value: 'low', label: 'Low', icon: '🟢' }
]

const sortOptions = [
  { value: 'created_desc', label: 'Most Recent', icon: '🆕' },
  { value: 'created_asc', label: 'Oldest First', icon: '📅' },
  { value: 'priority', label: 'Priority', icon: '⚡' },
  { value: 'due_date', label: 'Due Date', icon: '⏰' },
  { value: 'title', label: 'Title (A-Z)', icon: '🔤' }
]

const sortedTodos = computed(() => {
  const todoList = [...todoStore.todos]
  
  switch (sortBy.value) {
    case 'created_desc':
      return todoList.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    
    case 'created_asc':
      return todoList.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    
    case 'priority':
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return todoList.sort((a, b) => {
        const aPriority = priorityOrder[a.priority] || 0
        const bPriority = priorityOrder[b.priority] || 0
        return bPriority - aPriority
      })
    
    case 'due_date':
      return todoList.sort((a, b) => {
        // Handle todos without due dates (put them at the end)
        if (!a.due_date && !b.due_date) return 0
        if (!a.due_date) return 1
        if (!b.due_date) return -1
        
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
      })
    
    case 'title':
      return todoList.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()))
    
    default:
      return todoList
  }
})

const todos = computed(() => sortedTodos.value)
const completedCount = computed(() => todos.value.filter(todo => todo.completed).length)
const activeCount = computed(() => todos.value.filter(todo => !todo.completed).length)

const apiFilters = computed(() => {
  const result: TodoFilters = {}
  
  if (filters.value.completed !== '') {
    result.completed = filters.value.completed === 'true'
  }
  
  if (filters.value.priority !== '') {
    result.priority = filters.value.priority as 'low' | 'medium' | 'high'
  }
  
  return result
})

const loadTodos = async () => {
  loading.value = true
  try {
    await todoStore.fetchTodos(apiFilters.value)
  } catch (error) {
    console.error('Error loading todos:', error)
  } finally {
    loading.value = false
  }
}

const applySorting = () => {
  // Sorting is handled by the computed property, no need to reload todos
}

const clearFilters = () => {
  filters.value = {
    completed: '',
    priority: ''
  }
  sortBy.value = 'created_desc'
  loadTodos()
}

const handleTodoCreated = (todo: Todo) => {
  loadTodos()
}

const handleTodoUpdated = (todo: Todo) => {
  loadTodos()
}

const handleTodoDeleted = (todoId: number) => {
  loadTodos()
}

onMounted(() => {
  loadTodos()
})
</script>

<style scoped>
/* Component-specific styles */
</style>