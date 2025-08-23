/**
 * Test Selectors
 * Contains all element selectors used in tests
 */

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