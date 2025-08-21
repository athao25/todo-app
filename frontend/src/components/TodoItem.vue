<template>
  <div class="bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-4 border border-white/20 hover:bg-white/15 transition-colors duration-200">
    <div class="flex items-center space-x-3">
      <!-- Checkbox -->
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

      <!-- Title -->
      <div class="flex-1 min-w-0">
        <h4 
          v-if="!editingField.title"
          @click="startEditingField('title')"
          class="text-base font-medium cursor-pointer hover:bg-white/10 px-2 py-1 rounded transition-colors"
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
          class="text-base font-medium bg-white/20 border-white/30 text-white placeholder-white/60 shadow-sm focus:border-indigo-400 focus:ring-indigo-400 rounded px-2 py-1 w-full"
          :class="{
            'line-through': todo.completed
          }"
        />
      </div>

      <!-- Actions -->
      <button
        @click="deleteTodo"
        :disabled="loading"
        class="p-2 text-white/60 hover:text-red-400 transition-colors duration-200 disabled:opacity-50"
        title="Delete todo"
      >
        <TrashIcon class="h-5 w-5" />
      </button>
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
import { ref, nextTick } from 'vue'
import { useTodoStore } from '@/stores/todos'
import type { Todo, UpdateTodoData } from '@/types'
import { CheckIcon, TrashIcon } from '@heroicons/vue/24/outline'
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
  title: false
})

const editValues = ref({
  title: ''
})

// Template refs for focusing inputs
const titleInput = ref<HTMLInputElement>()

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