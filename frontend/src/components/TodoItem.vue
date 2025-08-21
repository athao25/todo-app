<template>
  <div 
    class="bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-6 border border-white/20 hover:bg-white/15 transition-colors duration-200"
    :class="{ 'opacity-75': todo.completed }"
  >
    <div class="flex items-start space-x-4">
      <!-- Checkbox -->
      <div class="flex-shrink-0 pt-1">
        <button
          @click="toggleCompleted"
          :disabled="loading"
          class="relative inline-flex h-5 w-5 items-center justify-center rounded border border-white/30 bg-white/20 transition-colors duration-200 hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          :class="{
            'bg-indigo-600 border-indigo-600': todo.completed,
            'hover:bg-white/30': !todo.completed
          }"
        >
          <CheckIcon 
            v-if="todo.completed"
            class="h-3 w-3 text-white"
          />
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <!-- Title -->
        <div class="mb-2">
          <h4 
            v-if="!editingField.title"
            @click="startEditingField('title')"
            class="text-lg font-medium cursor-pointer hover:bg-white/10 px-2 py-1 rounded transition-colors"
            :class="{
              'text-white': !todo.completed,
              'text-white/60 line-through': todo.completed
            }"
            title="Click to edit"
          >
            {{ todo.title }}
          </h4>
          <input
            v-else
            ref="titleInput"
            v-model="editValues.title"
            @blur="saveField('title')"
            @keydown.enter="saveField('title')"
            @keydown.escape="cancelEdit('title')"
            class="text-lg font-medium bg-white/20 border-white/30 text-white placeholder-white/60 shadow-sm focus:border-indigo-400 focus:ring-indigo-400 rounded px-2 py-1 w-full"
            :class="{
              'line-through': todo.completed
            }"
          />
          
          <!-- Description -->
          <p 
            v-if="todo.description && !editingField.description"
            @click="startEditingField('description')"
            class="mt-1 text-sm cursor-pointer hover:bg-white/10 px-2 py-1 rounded transition-colors"
            :class="{
              'text-white/80': !todo.completed,
              'text-white/50': todo.completed
            }"
            title="Click to edit"
          >
            {{ todo.description }}
          </p>
          <textarea
            v-else-if="editingField.description"
            ref="descriptionInput"
            v-model="editValues.description"
            @blur="saveField('description')"
            @keydown.escape="cancelEdit('description')"
            rows="2"
            class="mt-1 text-sm bg-white/20 border-white/30 text-white placeholder-white/60 shadow-sm focus:border-indigo-400 focus:ring-indigo-400 rounded px-2 py-1 w-full resize-none"
          ></textarea>
          <p 
            v-else-if="!todo.description && !editingField.description"
            @click="startEditingField('description')"
            class="mt-1 text-sm cursor-pointer hover:bg-white/10 px-2 py-1 rounded transition-colors text-white/50 italic"
            title="Click to add description"
          >
            Click to add description...
          </p>
        </div>

        <!-- Metadata -->
        <div class="flex flex-wrap items-center gap-3 text-sm text-white/70">
          <!-- Priority Badge -->
          <span 
            v-if="!editingField.priority"
            @click="startEditingField('priority')"
            class="badge cursor-pointer hover:bg-white/10 transition-colors"
            :class="priorityBadgeClass"
            title="Click to edit priority"
          >
            {{ priorityText }}
          </span>
          <select
            v-else
            ref="priorityInput"
            v-model="editValues.priority"
            @blur="saveField('priority')"
            @change="saveField('priority')"
            @keydown.escape="cancelEdit('priority')"
            class="text-sm bg-white/20 border-white/30 text-white shadow-sm focus:border-indigo-400 focus:ring-indigo-400 rounded px-2 py-1"
          >
            <option value="low" class="text-gray-800">Low Priority</option>
            <option value="medium" class="text-gray-800">Medium Priority</option>
            <option value="high" class="text-gray-800">High Priority</option>
          </select>

          <!-- Due Date -->
          <span 
            v-if="todo.due_date && !editingField.due_date"
            @click="startEditingField('due_date')"
            class="flex items-center cursor-pointer hover:bg-white/10 px-2 py-1 rounded transition-colors"
            :class="dueDateClass"
            title="Click to edit due date"
          >
            <CalendarIcon class="h-4 w-4 mr-1" />
            {{ formatDueDate(todo.due_date) }}
          </span>
          <span 
            v-else-if="!todo.due_date && !editingField.due_date"
            @click="startEditingField('due_date')"
            class="flex items-center cursor-pointer hover:bg-white/10 px-2 py-1 rounded transition-colors text-white/50 italic"
            title="Click to add due date"
          >
            <CalendarIcon class="h-4 w-4 mr-1" />
            Click to add due date...
          </span>
          <input
            v-else
            ref="dueDateInput"
            v-model="editValues.due_date"
            @blur="saveField('due_date')"
            @keydown.enter="saveField('due_date')"
            @keydown.escape="cancelEdit('due_date')"
            type="datetime-local"
            class="text-sm bg-white/20 border-white/30 text-white shadow-sm focus:border-indigo-400 focus:ring-indigo-400 rounded px-2 py-1"
          />

          <!-- Created Time -->
          <span class="flex items-center text-white/60">
            <ClockIcon class="h-4 w-4 mr-1" />
            Created {{ formatCreatedTime(todo.created_at) }}
          </span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex-shrink-0">
        <div class="flex items-center space-x-2">
          <!-- Delete Button -->
          <button
            @click="deleteTodo"
            :disabled="loading"
            class="p-2 text-white/60 hover:text-red-400 transition-colors duration-200 disabled:opacity-50"
            title="Delete todo"
          >
            <TrashIcon class="h-5 w-5" />
          </button>
        </div>
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
import { ref, computed, nextTick } from 'vue'
import { useTodoStore } from '@/stores/todos'
import type { Todo, UpdateTodoData } from '@/types'
import { 
  CheckIcon, 
  CalendarIcon, 
  ClockIcon, 
  ArrowPathIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'
import { formatDistanceToNow, format } from 'date-fns'
import DeleteConfirmModal from './DeleteConfirmModal.vue'

const props = defineProps<{
  todo: Todo
}>()

const emit = defineEmits<{
  updated: [todo: Todo]
  deleted: [id: number]
}>()

const todoStore = useTodoStore()
const loading = ref(false)
const showDeleteModal = ref(false)

// Inline editing state
const editingField = ref({
  title: false,
  description: false,
  priority: false,
  due_date: false
})

const editValues = ref({
  title: '',
  description: '',
  priority: 'medium' as 'low' | 'medium' | 'high',
  due_date: ''
})

// Template refs for focusing inputs
const titleInput = ref<HTMLInputElement>()
const descriptionInput = ref<HTMLTextAreaElement>()
const priorityInput = ref<HTMLSelectElement>()
const dueDateInput = ref<HTMLInputElement>()

// Priority badge styling
const priorityBadgeClass = computed(() => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
  switch (props.todo.priority) {
    case 'high':
      return `${baseClasses} bg-red-100 text-red-800`
    case 'medium':
      return `${baseClasses} bg-yellow-100 text-yellow-800`
    case 'low':
      return `${baseClasses} bg-green-100 text-green-800`
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`
  }
})

const priorityText = computed(() => {
  switch (props.todo.priority) {
    case 'high': return 'High Priority'
    case 'medium': return 'Medium Priority'
    case 'low': return 'Low Priority'
    default: return 'Unknown Priority'
  }
})

const dueDateClass = computed(() => {
  if (!props.todo.due_date) return ''
  
  const dueDate = new Date(props.todo.due_date)
  const now = new Date()
  const isOverdue = dueDate < now && !props.todo.completed
  
  return isOverdue ? 'text-red-400' : ''
})

function formatDueDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  
  if (date.toDateString() === now.toDateString()) {
    return `Today at ${format(date, 'h:mm a')}`
  } else if (date.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString()) {
    return `Tomorrow at ${format(date, 'h:mm a')}`
  } else {
    return format(date, 'MMM d, yyyy \'at\' h:mm a')
  }
}

function formatRelativeDate(dateString: string): string {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true })
}

function formatCreatedTime(dateString: string): string {
  const createdDate = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - createdDate.getTime()
  
  // Convert to minutes
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  
  if (diffMinutes < 60) {
    // Under 1 hour: round to nearest 5-minute increment
    const roundedMinutes = Math.max(5, Math.ceil(diffMinutes / 5) * 5)
    return `~${roundedMinutes} mins ago`
  }
  
  // Convert to hours
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  
  if (diffHours < 24) {
    // Under 24 hours: show hours
    return `~${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
  }
  
  // 24+ hours: show days
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  return `~${diffDays} day${diffDays === 1 ? '' : 's'} ago`
}

async function startEditingField(field: keyof typeof editingField.value) {
  // Set the edit value to current value
  switch (field) {
    case 'title':
      editValues.value.title = props.todo.title
      break
    case 'description':
      editValues.value.description = props.todo.description || ''
      break
    case 'priority':
      editValues.value.priority = props.todo.priority
      break
    case 'due_date':
      if (props.todo.due_date) {
        const date = new Date(props.todo.due_date)
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
        editValues.value.due_date = date.toISOString().slice(0, 16)
      } else {
        editValues.value.due_date = ''
      }
      break
  }
  
  editingField.value[field] = true
  
  // Focus the input after it's rendered
  await nextTick()
  switch (field) {
    case 'title':
      titleInput.value?.focus()
      titleInput.value?.select()
      break
    case 'description':
      descriptionInput.value?.focus()
      break
    case 'priority':
      priorityInput.value?.focus()
      break
    case 'due_date':
      dueDateInput.value?.focus()
      break
  }
}

function cancelEdit(field: keyof typeof editingField.value) {
  editingField.value[field] = false
}

async function saveField(field: keyof typeof editingField.value) {
  if (loading.value) return
  
  let updateData: UpdateTodoData = {}
  let hasChanges = false
  
  switch (field) {
    case 'title':
      if (editValues.value.title.trim() && editValues.value.title !== props.todo.title) {
        updateData.title = editValues.value.title.trim()
        hasChanges = true
      }
      break
    case 'description':
      if (editValues.value.description !== (props.todo.description || '')) {
        updateData.description = editValues.value.description || undefined
        hasChanges = true
      }
      break
    case 'priority':
      if (editValues.value.priority !== props.todo.priority) {
        updateData.priority = editValues.value.priority
        hasChanges = true
      }
      break
    case 'due_date':
      const newDueDate = editValues.value.due_date ? new Date(editValues.value.due_date).toISOString() : undefined
      const currentDueDate = props.todo.due_date
      if (newDueDate !== currentDueDate) {
        updateData.due_date = newDueDate
        hasChanges = true
      }
      break
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
    emit('deleted', props.todo.id)
  } catch (error) {
    console.error('Failed to delete todo:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Component-specific styles */
</style>