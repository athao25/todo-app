<template>
  <div class="max-w-sm sm:max-w-2xl lg:max-w-4xl mx-auto" data-testid="todo-app-container">
    <!-- Create Todo Form -->
    <div class="bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-4 sm:p-6 mb-4 sm:mb-6 border border-white/20" data-testid="todo-create-section">
      <TodoCreateForm @todo-created="handleTodoCreated" />
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap justify-center gap-2 mb-4 sm:mb-6 relative" data-testid="todo-filters">
      <button
        @click="setFilter('all')"
        data-testid="filter-all"
        :class="[
          'px-4 py-2 sm:px-3 sm:py-1 rounded-full text-sm font-medium transition-colors duration-200 min-h-[44px] sm:min-h-auto',
          currentFilter === 'all' 
            ? 'bg-white/20 text-white border border-white/30' 
            : 'text-white/70 hover:text-white hover:bg-white/10'
        ]"
      >
        All
      </button>
      <button
        @click="setFilter('active')"
        data-testid="filter-active"
        :class="[
          'px-4 py-2 sm:px-3 sm:py-1 rounded-full text-sm font-medium transition-colors duration-200 min-h-[44px] sm:min-h-auto',
          currentFilter === 'active' 
            ? 'bg-white/20 text-white border border-white/30' 
            : 'text-white/70 hover:text-white hover:bg-white/10'
        ]"
      >
        Active
      </button>
      <button
        @click="setFilter('completed')"
        data-testid="filter-completed"
        :class="[
          'px-4 py-2 sm:px-3 sm:py-1 rounded-full text-sm font-medium transition-colors duration-200 min-h-[44px] sm:min-h-auto',
          currentFilter === 'completed' 
            ? 'bg-white/20 text-white border border-white/30' 
            : 'text-white/70 hover:text-white hover:bg-white/10'
        ]"
      >
        Completed
      </button>
    </div>

    <!-- Todo List -->
    <div class="space-y-4" data-testid="todo-list-container">
      <div v-if="loading" class="text-center py-8" data-testid="loading-state">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white/50 mx-auto"></div>
        <p class="mt-4 text-white/80">Loading todos...</p>
      </div>
      
      <div v-else-if="todos.length === 0" class="text-center py-12" data-testid="empty-state">
        <p class="text-white/90 text-lg">No todos found.</p>
        <p class="text-white/70 text-sm mt-2">Create your first todo above!</p>
      </div>
      
      <div v-else class="relative" data-testid="todo-list">
        <div class="space-y-6">
          <TodoItem
            v-for="todo in todos"
            :key="todo.id"
            :todo="todo"
            :is-selected="selectedTodos.has(todo.id)"
            @updated="handleTodoUpdated"
            @deleted="handleTodoDeleted"
            @selected="handleTodoSelected"
          />
        </div>
        
        <!-- Selection Actions Modal - Mobile Bottom Sheet / Desktop Sidebar -->
        <div 
          v-if="selectedTodos.size > 0"
          data-testid="bulk-actions-panel"
          class="fixed inset-x-0 bottom-0 z-50 bg-white/10 backdrop-blur-md border-t border-white/20 p-4 sm:p-6
                 lg:absolute lg:top-0 lg:-right-80 lg:bottom-auto lg:inset-x-auto lg:w-72 lg:h-fit lg:border lg:rounded-lg lg:border-white/20"
        >
          <div class="lg:p-0">
            <!-- Mobile Header -->
            <div class="flex items-center justify-between mb-4 lg:mb-4 lg:pb-3 lg:border-b lg:border-white/20">
              <h3 class="text-base font-semibold text-white">Bulk Actions</h3>
              <div class="flex items-center gap-2">
                <span class="px-2 py-1 text-xs font-medium bg-white/20 text-white/80 rounded-full border border-white/30">
                  {{ selectedTodos.size }} selected
                </span>
                <button
                  @click="clearSelection"
                  class="lg:hidden p-2 text-white/70 hover:text-white transition-colors duration-200"
                  title="Clear selection"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- Mobile Actions Grid / Desktop Vertical Stack -->
            <div class="grid grid-cols-2 gap-2 lg:space-y-3 lg:grid-cols-1">
              <button
                @click="toggleSelectAll"
                class="lg:hidden col-span-2 px-4 py-3 text-sm font-medium bg-indigo-600/30 text-indigo-200 hover:bg-indigo-600/40 hover:text-white rounded-lg border border-indigo-500/50 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {{ isAllSelected ? 'Deselect All' : 'Select All' }}
              </button>
              
              <button
                @click="showMarkCompletedConfirm = true"
                data-testid="bulk-mark-completed"
                class="px-4 py-3 rounded-lg text-sm font-medium bg-green-600/20 text-green-300 hover:bg-green-600/30 hover:text-white border border-green-600/30 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="hidden sm:inline lg:inline">Mark Completed</span>
                <span class="sm:hidden lg:hidden">Complete</span>
              </button>
              
              <button
                @click="showMarkIncompleteConfirm = true"
                data-testid="bulk-mark-incomplete"
                class="px-4 py-3 rounded-lg text-sm font-medium bg-yellow-600/20 text-yellow-300 hover:bg-yellow-600/30 hover:text-white border border-yellow-600/30 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="hidden sm:inline lg:inline">Mark Incomplete</span>
                <span class="sm:hidden lg:hidden">Incomplete</span>
              </button>
              
              <button
                @click="showDeleteConfirm = true"
                data-testid="bulk-delete-selected"
                class="col-span-2 lg:col-span-1 px-4 py-3 rounded-lg text-sm font-medium bg-red-600/20 text-red-300 hover:bg-red-600/30 hover:text-white border border-red-600/30 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                Delete Selected
              </button>
              
              <!-- Desktop only buttons -->
              <button
                @click="toggleSelectAll"
                class="hidden lg:block w-full px-4 py-3 rounded-lg text-sm font-medium bg-indigo-600/30 text-indigo-200 hover:bg-indigo-600/40 hover:text-white border border-indigo-500/50 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {{ isAllSelected ? 'Deselect All' : 'Select All' }}
              </button>
              
              <button
                @click="clearSelection"
                class="hidden lg:block w-full px-4 py-3 rounded-lg text-sm font-medium bg-white/20 text-white/70 hover:bg-white/30 hover:text-white border border-white/30 transition-all duration-200 flex items-center justify-center"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modals -->
    <ConfirmModal
      :is-open="showMarkCompletedConfirm"
      title="Mark as Completed"
      :message="`Are you sure you want to mark ${selectedTodos.size} item${selectedTodos.size === 1 ? '' : 's'} as completed?`"
      confirm-text="Mark Completed"
      type="success"
      @confirm="confirmMarkCompleted"
      @cancel="showMarkCompletedConfirm = false"
    />
    
    <ConfirmModal
      :is-open="showMarkIncompleteConfirm"
      title="Mark as Incomplete"
      :message="`Are you sure you want to mark ${selectedTodos.size} item${selectedTodos.size === 1 ? '' : 's'} as incomplete?`"
      confirm-text="Mark Incomplete"
      type="warning"
      @confirm="confirmMarkIncomplete"
      @cancel="showMarkIncompleteConfirm = false"
    />
    
    <ConfirmModal
      :is-open="showDeleteConfirm"
      title="Delete Items"
      :message="`Are you sure you want to delete ${selectedTodos.size} selected item${selectedTodos.size === 1 ? '' : 's'}? This action cannot be undone.`"
      confirm-text="Delete"
      type="danger"
      @confirm="confirmDeleteSelected"
      @cancel="showDeleteConfirm = false"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTodoStore } from '../stores/todos'
import TodoCreateForm from '../components/TodoCreateForm.vue'
import TodoItem from '../components/TodoItem.vue'
import ConfirmModal from '../components/ConfirmModal.vue'

const todoStore = useTodoStore()

const loading = ref(false)
const currentFilter = ref<'all' | 'active' | 'completed'>('all')
const selectedTodos = ref<Set<number>>(new Set())
const showMarkCompletedConfirm = ref(false)
const showMarkIncompleteConfirm = ref(false)
const showDeleteConfirm = ref(false)

// Filter and sort todos - completed items go to bottom
const todos = computed(() => {
  let filteredTodos = [...todoStore.todos]
  
  // Apply filter
  switch (currentFilter.value) {
    case 'active':
      filteredTodos = filteredTodos.filter(todo => !todo.completed)
      break
    case 'completed':
      filteredTodos = filteredTodos.filter(todo => todo.completed)
      break
    // 'all' shows everything, no filter needed
  }
  
  // Sort: active todos first, then completed todos, both by creation date (newest first)
  return filteredTodos.sort((a, b) => {
    // First sort by completion status (active first)
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    // Then by creation date (newest first)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
})

const completedCount = computed(() => todoStore.todos.filter(todo => todo.completed).length)

const setFilter = (filter: 'all' | 'active' | 'completed') => {
  currentFilter.value = filter
}

const clearCompleted = async () => {
  loading.value = true
  try {
    const completedTodos = todoStore.todos.filter(todo => todo.completed)
    for (const todo of completedTodos) {
      await todoStore.deleteTodo(todo.id)
    }
  } catch (error) {
    console.error('Error clearing completed todos:', error)
  } finally {
    loading.value = false
  }
}

const loadTodos = async () => {
  loading.value = true
  try {
    await todoStore.fetchTodos()
  } catch (error) {
    console.error('Error loading todos:', error)
  } finally {
    loading.value = false
  }
}

const handleTodoCreated = () => {
  // Store already handles adding the new todo
}

const handleTodoUpdated = () => {
  // Store already handles updating the todo
}

const handleTodoDeleted = () => {
  // Store already handles removing the todo
}

const handleTodoSelected = (todoId: number, selected: boolean) => {
  if (selected) {
    selectedTodos.value.add(todoId)
  } else {
    selectedTodos.value.delete(todoId)
  }
}

const markSelectedAsCompleted = async () => {
  if (selectedTodos.value.size === 0) return
  
  loading.value = true
  try {
    for (const todoId of selectedTodos.value) {
      await todoStore.updateTodo(todoId, { completed: true })
    }
    selectedTodos.value.clear()
  } catch (error) {
    console.error('Error marking selected as completed:', error)
  } finally {
    loading.value = false
  }
}

const deleteSelected = async () => {
  if (selectedTodos.value.size === 0) return
  
  loading.value = true
  try {
    for (const todoId of selectedTodos.value) {
      await todoStore.deleteTodo(todoId)
    }
    selectedTodos.value.clear()
  } catch (error) {
    console.error('Error deleting selected todos:', error)
  } finally {
    loading.value = false
  }
}

const clearSelection = () => {
  selectedTodos.value.clear()
}

const confirmMarkCompleted = async () => {
  showMarkCompletedConfirm.value = false
  await markSelectedAsCompleted()
}

const confirmDeleteSelected = async () => {
  showDeleteConfirm.value = false
  await deleteSelected()
}

const markSelectedAsIncomplete = async () => {
  if (selectedTodos.value.size === 0) return
  
  loading.value = true
  try {
    for (const todoId of selectedTodos.value) {
      await todoStore.updateTodo(todoId, { completed: false })
    }
    selectedTodos.value.clear()
  } catch (error) {
    console.error('Error marking selected as incomplete:', error)
  } finally {
    loading.value = false
  }
}

const confirmMarkIncomplete = async () => {
  showMarkIncompleteConfirm.value = false
  await markSelectedAsIncomplete()
}

const isAllSelected = computed(() => {
  return todos.value.length > 0 && selectedTodos.value.size === todos.value.length
})

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedTodos.value.clear()
  } else {
    for (const todo of todos.value) {
      selectedTodos.value.add(todo.id)
    }
  }
}

onMounted(() => {
  loadTodos()
})
</script>

<style scoped>
/* Component-specific styles */
</style>