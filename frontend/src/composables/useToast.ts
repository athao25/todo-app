import { ref, reactive } from 'vue'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info' | 'deleted'
  duration?: number
}

const toasts = ref<Toast[]>([])

let toastIdCounter = 0

export function useToast() {
  const showToast = (message: string, type: Toast['type'] = 'info', duration = 3000) => {
    const id = `toast-${++toastIdCounter}`
    
    const toast: Toast = {
      id,
      message,
      type,
      duration
    }
    
    toasts.value.push(toast)
    
    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
    
    return id
  }
  
  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }
  
  const success = (message: string, duration?: number) => {
    return showToast(message, 'success', duration)
  }
  
  const error = (message: string, duration?: number) => {
    return showToast(message, 'error', duration)
  }
  
  const warning = (message: string, duration?: number) => {
    return showToast(message, 'warning', duration)
  }
  
  const info = (message: string, duration?: number) => {
    return showToast(message, 'info', duration)
  }
  
  const clear = () => {
    toasts.value = []
  }
  
  return {
    toasts,
    showToast,
    removeToast,
    success,
    error,
    warning,
    info,
    clear
  }
}