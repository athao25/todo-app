import { test as base, expect } from '@playwright/test';
import { TodoPage } from './todoPage';
import { TodoApiClient } from '../api-client/todoApiClient';

// Define the test fixtures interface
interface TestFixtures {
  todoPage: TodoPage;
  todoApiClient: TodoApiClient;
}

// Create custom test with page fixtures following Checkly patterns
export const test = base.extend<TestFixtures>({
  // Page Object fixtures for each page type
  todoPage: async ({ page }, use) => {
    const todoPage = new TodoPage(page);
    await todoPage.navigateToApp();
    await use(todoPage);
  },

  todoApiClient: async ({ request }, use) => {
    const todoApiClient = new TodoApiClient(request);
    
    // Clean up any existing test data before each test
    await todoApiClient.deleteAllTodos();
    
    await use(todoApiClient);
    
    // Clean up after each test
    await todoApiClient.deleteAllTodos();
  },
});

export { expect };