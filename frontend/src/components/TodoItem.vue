<template>
  <div 
    @click="toggleSelection"
    class="backdrop-blur-md rounded-lg shadow-xl p-4 border transition-colors duration-200 cursor-pointer"
    :class="{
      'bg-indigo-600/20 border-indigo-400 ring-2 ring-indigo-400': props.isSelected,
      'bg-white/8 border-white/15 hover:bg-white/12': !props.isSelected && todo.completed,
      'bg-white/15 border-white/30 hover:bg-white/20': !props.isSelected && !todo.completed
    }"
  >
    <div class="flex items-center space-x-3">
      <!-- Checkbox -->
      <button
        @click.stop="toggleCompleted"
        :disabled="loading"
        class="relative inline-flex h-8 w-8 sm:h-5 sm:w-5 items-center justify-center rounded-full border border-white/30 bg-white/20 transition-colors duration-200 hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        :class="{
          'bg-indigo-600 border-indigo-600': todo.completed,
          'hover:bg-white/30': !todo.completed
        }"
      >
        <CheckIcon 
          v-if="todo.completed"
          class="h-4 w-4 sm:h-3 sm:w-3 text-white"
        />
      </button>

      <!-- Title -->
      <div class="flex-1 min-w-0">
        <div v-if="!editingField.title">
          <h4 
            class="text-base font-medium px-2 py-1 rounded break-words"
            :class="{
              'text-white': !todo.completed,
              'text-white/60 line-through': todo.completed
            }"
          >
            {{ todo.title }}
          </h4>
          <p class="text-xs text-white/50 px-2 mt-1">
            Created {{ timeAgo }}
          </p>
        </div>
        <input
          v-else
          ref="titleInput"
          v-model="editValues.title"
          @blur="saveField('title')"
          @keydown.enter="saveField('title')"
          @keydown.escape="cancelEdit('title')"
          class="text-base font-medium bg-white/20 border-white/30 text-white placeholder-white/60 shadow-sm focus:border-indigo-400 focus:ring-indigo-400 rounded px-2 py-1 w-full"
          :class="{
            'line-through': todo.completed
          }"
        />
      </div>

      <!-- Actions -->
      <div class="flex items-center space-x-1 sm:space-x-2">
        <button
          @click.stop="startEditingField('title')"
          :disabled="loading"
          class="p-3 sm:p-2 text-white/60 hover:text-blue-400 transition-colors duration-200 disabled:opacity-50 rounded-lg min-h-[44px] sm:min-h-auto flex items-center justify-center"
          title="Edit todo"
        >
          <PencilIcon class="h-5 w-5" />
        </button>
        
        <button
          @click.stop="deleteTodo"
          :disabled="loading"
          class="p-3 sm:p-2 text-white/60 hover:text-red-400 transition-colors duration-200 disabled:opacity-50 rounded-lg min-h-[44px] sm:min-h-auto flex items-center justify-center"
          title="Delete todo"
        >
          <TrashIcon class="h-5 w-5" />
        </button>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmModal
      :is-open="showDeleteModal"
      :message="`Are you sure you want to delete '${todo.title}'? This action cannot be undone.`"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, onMounted, onUnmounted } from 'vue'
import { useTodoStore } from '@/stores/todos'
import { useToast } from '@/composables/useToast'
import type { Todo, UpdateTodoData } from '@/types'
import { CheckIcon, TrashIcon, PencilIcon } from '@heroicons/vue/24/outline'
import DeleteConfirmModal from './DeleteConfirmModal.vue'

const props = defineProps<{
  todo: Todo
  isSelected?: boolean
}>()

const emit = defineEmits<{
  updated: [todo: Todo]
  deleted: [id: number]
  selected: [id: number, selected: boolean]
}>()

const todoStore = useTodoStore()
const { success, error } = useToast()
const loading = ref(false)
const showDeleteModal = ref(false)
const currentTime = ref(Date.now())
let timeUpdateInterval: number | null = null

// Inline editing state
const editingField = ref({
  title: false
})

const editValues = ref({
  title: ''
})

// Template refs for focusing inputs
const titleInput = ref<HTMLInputElement>()

function toggleSelection() {
  emit('selected', props.todo.id, !props.isSelected)
}

const timeAgo = computed(() => {
  const createdAt = new Date(props.todo.created_at)
  const now = currentTime.value
  const diffMs = now - createdAt.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) {
    return 'just now'
  } else if (diffMins < 60) {
    const roundedMins = Math.floor(diffMins / 5) * 5
    return roundedMins === 0 ? 'just now' : `${roundedMins} min${roundedMins === 1 ? '' : 's'} ago`
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
  } else {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`
  }
})

onMounted(() => {
  // Update time every minute
  timeUpdateInterval = window.setInterval(() => {
    currentTime.value = Date.now()
  }, 60000)
})

onUnmounted(() => {
  if (timeUpdateInterval) {
    clearInterval(timeUpdateInterval)
  }
})

async function startEditingField(field: keyof typeof editingField.value) {
  if (field === 'title') {
    editValues.value.title = props.todo.title
  }
  
  editingField.value[field] = true
  
  // Focus the input after it's rendered
  await nextTick()
  if (field === 'title') {
    titleInput.value?.focus()
    titleInput.value?.select()
  }
}

function cancelEdit(field: keyof typeof editingField.value) {
  editingField.value[field] = false
}

async function saveField(field: keyof typeof editingField.value) {
  if (loading.value) return
  
  let updateData: UpdateTodoData = {}
  let hasChanges = false
  
  if (field === 'title') {
    if (editValues.value.title.trim() && editValues.value.title !== props.todo.title) {
      updateData.title = editValues.value.title.trim()
      hasChanges = true
    }
  }
  
  editingField.value[field] = false
  
  if (!hasChanges) return
  
  loading.value = true
  try {
    const updatedTodo = await todoStore.updateTodo(props.todo.id, updateData)
    emit('updated', updatedTodo)
  } catch (error) {
    console.error(`Failed to update ${field}:`, error)
  } finally {
    loading.value = false
  }
}

async function toggleCompleted() {
  if (loading.value) return
  
  loading.value = true
  try {
    const updatedTodo = await todoStore.updateTodo(props.todo.id, {
      completed: !props.todo.completed
    })
    emit('updated', updatedTodo)
  } catch (error) {
    console.error('Failed to toggle completion:', error)
  } finally {
    loading.value = false
  }
}

function deleteTodo() {
  if (loading.value) return
  showDeleteModal.value = true
}

async function confirmDelete() {
  showDeleteModal.value = false
  
  if (loading.value) return
  
  loading.value = true
  try {
    await todoStore.deleteTodo(props.todo.id)
    // Use a custom toast type for deletion that shows trash icon
    const { showToast } = useToast()
    showToast(`"${props.todo.title}" deleted successfully!`, 'deleted', 3000)
    emit('deleted', props.todo.id)
  } catch (err) {
    console.error('Failed to delete todo:', err)
    error('Failed to delete todo. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Component-specific styles */
</style>