<template>
  <div data-testid="todo-create-form">
    <form @submit.prevent="handleSubmit" class="space-y-2">
      <div class="flex flex-col sm:flex-row gap-3 sm:gap-2">
        <div class="flex-1 space-y-1">
          <input
            ref="titleInput"
            v-model="form.title"
            data-testid="todo-input"
            type="text"
            maxlength="250"
            class="w-full rounded-lg bg-white/20 border-white/30 text-white placeholder-white/60 shadow-sm focus:border-indigo-400 focus:ring-indigo-400 text-base sm:text-sm transition-colors duration-200 px-4 py-3 sm:px-3 sm:py-2 min-h-[44px] sm:min-h-auto"
            :class="{
              'border-red-400/50 focus:border-red-400 focus:ring-red-400': form.title.length >= 240
            }"
            placeholder="What needs to be done?"
            required
            :disabled="loading"
          />
          <!-- Character Counter -->
          <div class="text-right">
            <span 
              class="text-xs transition-colors duration-200"
              :class="{
                'text-white/50': form.title.length < 200,
                'text-yellow-400': form.title.length >= 200 && form.title.length < 240,
                'text-red-400': form.title.length >= 240
              }"
            >
              {{ form.title.length }}/250
            </span>
          </div>
        </div>
        <button
          type="submit"
          data-testid="todo-add-button"
          :disabled="loading || !form.title.trim() || form.title.length > 250"
          class="px-6 py-3 sm:px-4 sm:py-2 rounded-lg border border-transparent bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 min-h-[44px] sm:min-h-auto font-medium self-start"
        >
          {{ loading ? '...' : 'Add Todo' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useTodoStore } from '@/stores/todos'
import { useToast } from '@/composables/useToast'
import type { CreateTodoData } from '@/types'

const emit = defineEmits<{
  created: []
}>()

const todoStore = useTodoStore()
const { success, error } = useToast()
const loading = ref(false)
const titleInput = ref<HTMLInputElement>()

// Form data
const form = ref<CreateTodoData>({
  title: ''
})

async function handleSubmit() {
  if (!form.value.title.trim()) return

  loading.value = true

  try {
    await todoStore.createTodo({
      title: form.value.title.trim()
    })

    // Show success toast
    success(`"${form.value.title.trim()}" added successfully!`)

    // Reset form
    form.value = {
      title: ''
    }

    emit('created')
    
    // Focus back to input for continuous adding
    setTimeout(() => {
      titleInput.value?.focus()
    }, 50)
  } catch (err) {
    console.error('Failed to create todo:', err)
    error('Failed to add todo. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>

