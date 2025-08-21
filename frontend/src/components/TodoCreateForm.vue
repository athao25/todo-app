<template>
  <div>
    <form @submit.prevent="handleSubmit" class="flex gap-2">
      <input
        ref="titleInput"
        v-model="form.title"
        type="text"
        class="flex-1 rounded-lg bg-white/20 border-white/30 text-white placeholder-white/60 shadow-sm focus:border-indigo-400 focus:ring-indigo-400 sm:text-sm transition-colors duration-200"
        placeholder="What needs to be done?"
        required
        :disabled="loading"
      />
      <button
        type="submit"
        :disabled="loading || !form.title.trim()"
        class="px-4 py-2 rounded-lg border border-transparent bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {{ loading ? '...' : 'Add' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useTodoStore } from '@/stores/todos'
import type { CreateTodoData } from '@/types'

const emit = defineEmits<{
  created: []
}>()

const todoStore = useTodoStore()
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

    // Reset form
    form.value = {
      title: ''
    }

    emit('created')
    
    // Focus back to input for continuous adding
    setTimeout(() => {
      titleInput.value?.focus()
    }, 50)
  } catch (error) {
    console.error('Failed to create todo:', error)
  } finally {
    loading.value = false
  }
}
</script>

