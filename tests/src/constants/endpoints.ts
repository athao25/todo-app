/**
 * API Endpoints Constants
 * Contains all API endpoint definitions
 */

export const ApiEndpoints = {
  todos: '/api/todos',
  health: '/api/health',
  todo: (id: number) => `/api/todos/${id}`,
};

export const BaseUrls = {
  development: 'http://localhost:5000',
  staging: 'https://staging-api.example.com',
  production: 'https://api.example.com',
};