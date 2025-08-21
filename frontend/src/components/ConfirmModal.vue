<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <!-- Background overlay -->
      <div 
        class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        @click="onCancel"
      ></div>

      <!-- Modal container -->
      <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white/10 backdrop-blur-md border border-white/20 shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <!-- Modal content -->
          <div class="px-6 py-6">
            <!-- Icon -->
            <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full" :class="iconBgClass">
              <component :is="iconComponent" class="h-6 w-6" :class="iconClass" aria-hidden="true" />
            </div>
            
            <!-- Title and message -->
            <div class="mt-4 text-center">
              <h3 class="text-lg font-medium text-white" id="modal-title">
                {{ title }}
              </h3>
              <div class="mt-2">
                <p class="text-sm text-white/80">
                  {{ message }}
                </p>
              </div>
            </div>
          </div>
          
          <!-- Action buttons -->
          <div class="bg-white/5 px-6 py-4 sm:flex sm:flex-row-reverse sm:gap-3">
            <button
              type="button"
              class="inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto transition-colors duration-200"
              :class="confirmButtonClass"
              @click="onConfirm"
            >
              {{ confirmText }}
            </button>
            <button
              type="button"
              class="mt-3 inline-flex w-full justify-center rounded-md bg-white/10 border border-white/30 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto transition-colors duration-200"
              @click="onCancel"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { ExclamationTriangleIcon, CheckIcon, ClockIcon } from '@heroicons/vue/24/outline'

interface Props {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  type?: 'danger' | 'success' | 'warning'
}

interface Emits {
  confirm: []
  cancel: []
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: 'Confirm',
  type: 'danger'
})

const emit = defineEmits<Emits>()

const iconComponent = computed(() => {
  if (props.type === 'danger') return ExclamationTriangleIcon
  if (props.type === 'warning') return ClockIcon
  return CheckIcon
})

const iconBgClass = computed(() => {
  if (props.type === 'danger') return 'bg-red-100/20'
  if (props.type === 'warning') return 'bg-yellow-100/20'
  return 'bg-green-100/20'
})

const iconClass = computed(() => {
  if (props.type === 'danger') return 'text-red-400'
  if (props.type === 'warning') return 'text-yellow-400'
  return 'text-green-400'
})

const confirmButtonClass = computed(() => {
  if (props.type === 'danger') return 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
  if (props.type === 'warning') return 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
  return 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
})

function onConfirm() {
  emit('confirm')
}

function onCancel() {
  emit('cancel')
}

// Handle escape key
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    onCancel()
  }
}

// Add/remove event listener when modal opens/closes
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    document.addEventListener('keydown', handleKeydown)
    document.body.style.overflow = 'hidden'
  } else {
    document.removeEventListener('keydown', handleKeydown)
    document.body.style.overflow = ''
  }
})
</script>