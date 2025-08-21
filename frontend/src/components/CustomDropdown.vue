<template>
  <div class="relative" ref="dropdownRef">
    <!-- Dropdown Button -->
    <button
      @click="toggleDropdown"
      class="w-full rounded-lg bg-white/20 border-white/30 text-white shadow-sm focus:border-indigo-400 focus:ring-indigo-400 transition-colors duration-200 px-3 py-2 text-left flex items-center justify-between"
      :class="{ 'border-indigo-400 ring-1 ring-indigo-400': isOpen }"
    >
      <span class="truncate">{{ selectedOption?.label || placeholder }}</span>
      <ChevronDownIcon 
        class="h-4 w-4 text-white/70 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <!-- Dropdown Menu -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="isOpen"
          class="fixed z-[9999] bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-xl overflow-hidden"
          :style="dropdownStyle"
        >
          <div class="max-h-60 overflow-auto">
            <button
              v-for="option in options"
              :key="option.value"
              @click="selectOption(option)"
              class="w-full px-3 py-2 text-left text-white/90 hover:bg-white/20 transition-colors duration-150 flex items-center"
              :class="{ 
                'bg-white/15': option.value === modelValue,
                'text-white': option.value === modelValue,
                'text-white/70': option.value !== modelValue
              }"
            >
              <span class="mr-2">{{ option.icon }}</span>
              <span>{{ option.label }}</span>
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

interface DropdownOption {
  value: string
  label: string
  icon?: string
}

interface Props {
  modelValue: string
  options: DropdownOption[]
  placeholder?: string
}

interface Emits {
  'update:modelValue': [value: string]
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select an option'
})

const emit = defineEmits<Emits>()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement>()

const selectedOption = computed(() => {
  return props.options.find(option => option.value === props.modelValue)
})

const dropdownStyle = computed(() => {
  if (!isOpen.value || !dropdownRef.value) return {
    position: undefined,
    top: undefined,
    left: undefined,
    width: undefined,
    minWidth: undefined
  }
  
  const rect = dropdownRef.value.getBoundingClientRect()
  return {
    position: 'fixed' as const,
    top: `${rect.bottom + 4}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    minWidth: `${rect.width}px`
  }
})

function toggleDropdown() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    // Force a recompute of the dropdown style
    nextTick(() => {
      // Trigger reactivity
    })
  }
}

function selectOption(option: DropdownOption) {
  emit('update:modelValue', option.value)
  isOpen.value = false
}

function closeDropdown() {
  isOpen.value = false
}

// Close dropdown when clicking outside
function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

// Close dropdown on escape key
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* Custom scrollbar for dropdown */
.max-h-60::-webkit-scrollbar {
  width: 6px;
}

.max-h-60::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.max-h-60::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.max-h-60::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>