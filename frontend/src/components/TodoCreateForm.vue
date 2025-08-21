<template>
  <div>
    <div class="mb-4">
      <h3 class="text-lg font-medium text-white">Create New Task</h3>
    </div>
    <div>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Title Input -->
        <div>
          <label for="title" class="block text-sm font-medium text-white/90 mb-1">
            Title *
          </label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            class="block w-full rounded-lg bg-white/20 border-white/30 text-white placeholder-white/60 shadow-sm focus:border-indigo-400 focus:ring-indigo-400 sm:text-sm transition-colors duration-200"
            placeholder="What needs to be done?"
            required
            :disabled="loading"
          />
        </div>

        <!-- Description Input -->
        <div>
          <label for="description" class="block text-sm font-medium text-white/90 mb-1">
            Description
          </label>
          <textarea
            id="description"
            v-model="form.description"
            rows="3"
            class="block w-full rounded-lg bg-white/20 border-white/30 text-white placeholder-white/60 shadow-sm focus:border-indigo-400 focus:ring-indigo-400 sm:text-sm transition-colors duration-200 resize-none"
            placeholder="Add more details (optional)"
            :disabled="loading"
          ></textarea>
        </div>

        <!-- Priority and Due Date Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Priority Select -->
          <div>
            <label for="priority" class="block text-sm font-medium text-white/90 mb-1">
              Priority
            </label>
            <select
              id="priority"
              v-model="form.priority"
              class="block w-full rounded-lg bg-white/20 border-white/30 text-white shadow-sm focus:border-indigo-400 focus:ring-indigo-400 sm:text-sm transition-colors duration-200"
              :disabled="loading"
            >
              <option value="low" class="text-gray-800">Low Priority</option>
              <option value="medium" class="text-gray-800">Medium Priority</option>
              <option value="high" class="text-gray-800">High Priority</option>
            </select>
          </div>

          <!-- Due Date Input -->
          <div>
            <label for="due_date" class="block text-sm font-medium text-white/90 mb-1">
              Due Date
            </label>
            <input
              id="due_date"
              v-model="form.due_date"
              type="datetime-local"
              class="block w-full rounded-lg bg-white/20 border-white/30 text-white shadow-sm focus:border-indigo-400 focus:ring-indigo-400 sm:text-sm transition-colors duration-200"
              :disabled="loading"
              :min="minDateTime"
            />
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="loading || !form.title.trim()"
            class="inline-flex items-center justify-center rounded-lg border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <PlusIcon class="h-5 w-5 mr-2" />
            {{ loading ? 'Creating...' : 'Create Task' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTodoStore } from '@/stores/todos'
import type { CreateTodoData } from '@/types'
import { PlusIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits<{
  created: []
}>()

const todoStore = useTodoStore()
const loading = ref(false)

// Form data
const form = ref<CreateTodoData & { due_date: string }>({
  title: '',
  description: '',
  priority: 'medium',
  due_date: ''
})

// Minimum datetime (current time)
const minDateTime = computed(() => {
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  return now.toISOString().slice(0, 16)
})

async function handleSubmit() {
  if (!form.value.title.trim()) return

  loading.value = true

  try {
    const todoData: CreateTodoData = {
      title: form.value.title.trim(),
      description: form.value.description?.trim() || undefined,
      priority: form.value.priority
    }

    // Add due date if provided
    if (form.value.due_date) {
      todoData.due_date = new Date(form.value.due_date).toISOString()
    }

    await todoStore.createTodo(todoData)

    // Reset form
    form.value = {
      title: '',
      description: '',
      priority: 'medium',
      due_date: ''
    }

    emit('created')
  } catch (error) {
    console.error('Failed to create todo:', error)
  } finally {
    loading.value = false
  }
}
</script>

