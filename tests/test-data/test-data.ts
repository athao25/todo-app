export const TestTodos = {
  valid: [
    {
      title: 'Complete project proposal',
      completed: false,
    },
    {
      title: 'Buy groceries for the week',
      completed: false,
    },
    {
      title: 'Schedule dentist appointment',
      completed: true,
    },
    {
      title: 'Review code changes',
      completed: false,
    },
    {
      title: 'Update website content',
      completed: true,
    },
  ],

  edge_cases: [
    {
      title: 'A', // Single character
      completed: false,
    },
    {
      title: 'X'.repeat(250), // Maximum length
      completed: false,
    },
    {
      title: 'Todo with special characters: !@#$%^&*()[]{}|;:,.<>?',
      completed: false,
    },
    {
      title: 'Todo with emoji 📝 ✅ 🚀',
      completed: false,
    },
  ],

  invalid: [
    '', // Empty string
    '   ', // Only whitespace
    'X'.repeat(251), // Exceeds maximum length
  ],

  bulk_operation_test_data: [
    { title: 'Task 1 - Active', completed: false },
    { title: 'Task 2 - Active', completed: false },
    { title: 'Task 3 - Completed', completed: true },
    { title: 'Task 4 - Active', completed: false },
    { title: 'Task 5 - Completed', completed: true },
  ],

  time_display_test_data: [
    { title: 'Just now task', timeOffset: 0 }, // seconds
    { title: '2 minutes ago task', timeOffset: 2 * 60 }, // 2 minutes
    { title: '15 minutes ago task', timeOffset: 15 * 60 }, // 15 minutes
    { title: '1 hour ago task', timeOffset: 60 * 60 }, // 1 hour
    { title: '6 hours ago task', timeOffset: 6 * 60 * 60 }, // 6 hours
    { title: '1 day ago task', timeOffset: 24 * 60 * 60 }, // 1 day
    { title: '3 days ago task', timeOffset: 3 * 24 * 60 * 60 }, // 3 days
    { title: '1 week ago task', timeOffset: 7 * 24 * 60 * 60 }, // 1 week
  ],
};

export const TimeDisplayPatterns = {
  justNow: /just now/i,
  minutes: /(\d+) min(s)? ago/i,
  hours: /(\d+) hour(s)? ago/i,
  days: /(\d+) day(s)? ago/i,
};

export const ApiEndpoints = {
  todos: '/api/todos',
  health: '/api/health',
  todo: (id: number) => `/api/todos/${id}`,
};

export const TestUsers = {
  default: {
    name: 'Test User',
    preferences: {
      theme: 'default',
      notifications: true,
    },
  },
};

export const ErrorMessages = {
  required_field: 'This field is required',
  max_length_exceeded: 'Maximum length exceeded',
  invalid_input: 'Invalid input',
  network_error: 'Network error occurred',
  server_error: 'Server error occurred',
};

export const TestSelectors = {
  // Main elements
  appTitle: '[data-testid="app-title"]',
  todoInput: '[data-testid="todo-input"]',
  addButton: '[data-testid="todo-add-button"]',
  todoList: '[data-testid="todo-list"]',
  emptyState: '[data-testid="empty-state"]',
  loadingState: '[data-testid="loading-state"]',

  // Filters
  filterAll: '[data-testid="filter-all"]',
  filterActive: '[data-testid="filter-active"]',
  filterCompleted: '[data-testid="filter-completed"]',

  // Todo items (dynamic)
  todoItem: (id: string) => `[data-testid="todo-item-${id}"]`,
  todoTitle: (id: string) => `[data-testid="todo-title-${id}"]`,
  todoCheckbox: (id: string) => `[data-testid="todo-checkbox-${id}"]`,
  todoEdit: (id: string) => `[data-testid="todo-edit-${id}"]`,
  todoDelete: (id: string) => `[data-testid="todo-delete-${id}"]`,

  // Bulk operations
  bulkActionsPanel: '[data-testid="bulk-actions-panel"]',
  bulkMarkCompleted: '[data-testid="bulk-mark-completed"]',
  bulkMarkIncomplete: '[data-testid="bulk-mark-incomplete"]',
  bulkDelete: '[data-testid="bulk-delete-selected"]',
};

export const TestConfig = {
  timeouts: {
    short: 2000,
    medium: 5000,
    long: 10000,
  },
  retries: {
    api: 3,
    ui: 2,
  },
  delays: {
    animation: 300,
    typing: 100,
    network: 500,
  },
};