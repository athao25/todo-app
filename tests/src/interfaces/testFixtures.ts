/**
 * Test Fixtures Interface
 * Represents the custom test fixtures used in Playwright tests
 */
import { TodoPage } from '../pages/todoPage';
import { TodoApiClient } from '../api-client/todoApiClient';

export interface TestFixtures {
  todoPage: TodoPage;
  todoApiClient: TodoApiClient;
}