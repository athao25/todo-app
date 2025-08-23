/**
 * Test Todo Data Constants
 * Contains predefined todo items for testing various scenarios
 */

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