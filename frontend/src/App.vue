<template>
  <div id="app" class="min-h-screen bg-gradient-to-br from-[#242124] to-[#5A4FCF]" data-testid="app">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 pb-24 lg:pb-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 text-center" data-testid="app-title">To Do List</h1>
      <router-view />
    </div>
    
    <!-- Toast Notifications -->
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import ToastContainer from '@/components/ToastContainer.vue'
</script>

<style scoped>
/* App-level styles if needed */
</style>