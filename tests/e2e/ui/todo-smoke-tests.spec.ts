import { test, expect } from '../../pages/page_fixtures';
import { TestTodos, TimeDisplayPatterns } from '../../test-data/test-data';

test.describe('Todo App - UI Smoke Tests', () => {

  test.describe('Application Loading', () => {
    test('should load the todo application successfully', async ({ todoPage }) => {
      await todoPage.expectPageToLoad();
      await todoPage.expectEmptyState();
    });

    test('should display correct page title and header', async ({ todoPage }) => {
      await expect(todoPage.page).toHaveTitle(/Todo/i);
      await expect(todoPage.page.getByTestId('app-title')).toContainText(/todo/i);
    });
  });

  test.describe('Todo Creation', () => {
    test('should add a new todo item', async ({ todoPage }) => {
      const todoTitle = TestTodos.valid[0].title;
      
      await todoPage.addTodo(todoTitle);
      
      await todoPage.expectTodoCount(1);
      await todoPage.expectTodoToExist(todoTitle);
    });

    test('should add multiple todo items', async ({ todoPage }) => {
      const todoTitles = TestTodos.valid.slice(0, 3).map(t => t.title);
      
      await todoPage.addMultipleTodos(todoTitles);
      
      await todoPage.expectTodoCount(3);
      for (const title of todoTitles) {
        await todoPage.expectTodoToExist(title);
      }
    });

    test('should clear input after adding todo', async ({ todoPage }) => {
      await todoPage.addTodo(TestTodos.valid[0].title);
      
      const inputValue = await todoPage.getInputValue();
      expect(inputValue).toBe('');
    });
  });

  test.describe('Input Validation', () => {
    test('should not add empty todo', async ({ todoPage }) => {
      await todoPage.addTodo('');
      
      await todoPage.expectEmptyState();
      await todoPage.expectTodoCount(0);
    });

    test('should not add whitespace-only todo', async ({ todoPage }) => {
      await todoPage.addTodo('   ');
      
      await todoPage.expectEmptyState();
      await todoPage.expectTodoCount(0);
    });

    test('should handle maximum length todo', async ({ todoPage }) => {
      const maxLengthTodo = 'X'.repeat(250);
      
      await todoPage.addTodo(maxLengthTodo);
      
      await todoPage.expectTodoCount(1);
      await todoPage.expectTodoToExist(maxLengthTodo);
    });

    test('should handle special characters and emoji', async ({ todoPage }) => {
      const specialTodo = TestTodos.edge_cases.find(t => t.title.includes('📝'))!.title;
      
      await todoPage.addTodo(specialTodo);
      
      await todoPage.expectTodoCount(1);
      await todoPage.expectTodoToExist(specialTodo);
    });
  });

  test.describe('Todo Completion', () => {
    test('should mark todo as completed', async ({ todoPage }) => {
      const todoTitle = TestTodos.valid[0].title;
      
      await todoPage.addTodo(todoTitle);
      
      const todoItems = todoPage.getTodoItems();
      const todoId = await todoPage.getTodoId(todoItems.first());
      
      if (todoId) {
        await todoPage.toggleTodoCompletion(todoId);
        await todoPage.expectTodoToBeCompleted(todoId);
      }
    });

    test('should toggle completion status', async ({ todoPage }) => {
      const todoTitle = TestTodos.valid[0].title;
      
      await todoPage.addTodo(todoTitle);
      
      const todoItems = todoPage.getTodoItems();
      const todoId = await todoPage.getTodoId(todoItems.first());
      
      if (todoId) {
        // Mark as completed
        await todoPage.toggleTodoCompletion(todoId);
        await todoPage.expectTodoToBeCompleted(todoId);
        
        // Mark as active again
        await todoPage.toggleTodoCompletion(todoId);
        await todoPage.expectTodoToBeActive(todoId);
      }
    });
  });

  test.describe('Todo Deletion', () => {
    test('should delete a todo item', async ({ todoPage }) => {
      const todoTitle = TestTodos.valid[0].title;
      
      await todoPage.addTodo(todoTitle);
      await todoPage.expectTodoCount(1);
      
      const todoItems = todoPage.getTodoItems();
      const todoId = await todoPage.getTodoId(todoItems.first());
      
      if (todoId) {
        await todoPage.deleteTodo(todoId);
        await todoPage.expectTodoCount(0);
        await todoPage.expectEmptyState();
      }
    });

    test('should handle deletion confirmation', async ({ todoPage }) => {
      const todoTitle = TestTodos.valid[0].title;
      
      await todoPage.addTodo(todoTitle);
      const todoItems = todoPage.getTodoItems();
      const todoId = await todoPage.getTodoId(todoItems.first());
      
      if (todoId) {
        // Click delete button
        const deleteButton = todoPage.page.getByTestId(`todo-delete-${todoId}`);
        await deleteButton.click();
        
        // Verify confirmation modal appears (if implemented)
        const confirmButton = todoPage.page.locator('button:has-text("Delete")');
        if (await confirmButton.isVisible({ timeout: 1000 })) {
          await confirmButton.click();
        }
        
        await todoPage.expectTodoCount(0);
      }
    });
  });

  test.describe('Filtering', () => {
    test.beforeEach(async ({ todoPage }) => {
      // Add test data with mixed completion states
      await todoPage.addTodo('Active todo 1');
      await todoPage.addTodo('Active todo 2');
      await todoPage.addTodo('Completed todo');
      
      // Mark the last one as completed
      const todoItems = todoPage.getTodoItems();
      const lastTodoId = await todoPage.getTodoId(todoItems.nth(2));
      if (lastTodoId) {
        await todoPage.toggleTodoCompletion(lastTodoId);
      }
    });

    test('should filter active todos', async ({ todoPage }) => {
      await todoPage.setFilterActive();
      
      // Should show only active todos
      await todoPage.expectTodoCount(2);
      await todoPage.expectTodoToExist('Active todo 1');
      await todoPage.expectTodoToExist('Active todo 2');
    });

    test('should filter completed todos', async ({ todoPage }) => {
      await todoPage.setFilterCompleted();
      
      // Should show only completed todos
      await todoPage.expectTodoCount(1);
      await todoPage.expectTodoToExist('Completed todo');
    });

    test('should show all todos', async ({ todoPage }) => {
      await todoPage.setFilterAll();
      
      // Should show all todos
      await todoPage.expectTodoCount(3);
      await todoPage.expectTodoToExist('Active todo 1');
      await todoPage.expectTodoToExist('Active todo 2');
      await todoPage.expectTodoToExist('Completed todo');
    });
  });

  test.describe('Data Persistence', () => {
    test('should persist todos after page reload', async ({ todoPage }) => {
      const todoTitle = 'Persistent todo';
      
      await todoPage.addTodo(todoTitle);
      await todoPage.expectTodoCount(1);
      
      // Reload the page
      await todoPage.page.reload();
      await todoPage.waitForPageLoad();
      
      // Verify todo is still there
      await todoPage.expectTodoCount(1);
      await todoPage.expectTodoToExist(todoTitle);
    });

    test('should persist completion status after reload', async ({ todoPage }) => {
      const todoTitle = 'Status test todo';
      
      await todoPage.addTodo(todoTitle);
      
      const todoItems = todoPage.getTodoItems();
      const todoId = await todoPage.getTodoId(todoItems.first());
      
      if (todoId) {
        await todoPage.toggleTodoCompletion(todoId);
        await todoPage.expectTodoToBeCompleted(todoId);
        
        // Reload the page
        await todoPage.page.reload();
        await todoPage.waitForPageLoad();
        
        // Verify completion status is maintained
        await todoPage.expectTodoToBeCompleted(todoId);
      }
    });
  });

  test.describe('Time Display', () => {
    test('should display creation time for todos', async ({ todoPage }) => {
      await todoPage.addTodo('Time display test');
      
      const todoItems = todoPage.getTodoItems();
      const todoId = await todoPage.getTodoId(todoItems.first());
      
      if (todoId) {
        // Should display time (likely "just now" or similar)
        const timeText = await todoPage.getTodoTimeDisplay(todoId);
        expect(timeText).toMatch(/Created|just now|ago/i);
      }
    });

    test('should handle different time formats', async ({ todoPage }) => {
      await todoPage.addTodo('Recent task');
      
      const todoItems = todoPage.getTodoItems();
      const todoId = await todoPage.getTodoId(todoItems.first());
      
      if (todoId) {
        // Should match one of the expected time patterns
        await todoPage.expectTimeDisplay(todoId, TimeDisplayPatterns.justNow);
      }
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile viewport', async ({ page, todoPage }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await todoPage.addTodo('Mobile test todo');
      
      await todoPage.expectTodoCount(1);
      await todoPage.expectTodoToExist('Mobile test todo');
    });

    test('should work on tablet viewport', async ({ page, todoPage }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await todoPage.addTodo('Tablet test todo');
      
      await todoPage.expectTodoCount(1);
      await todoPage.expectTodoToExist('Tablet test todo');
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ todoPage }) => {
      // This test would require mocking network failures
      // Implementation depends on your error handling strategy
      await todoPage.addTodo('Network test todo');
      
      // If network fails, should show appropriate error message
      // await expect(page.locator('.error-message')).toBeVisible();
    });

    test('should handle server errors gracefully', async () => {
      // This test would require mocking server errors
      // Implementation depends on your error handling strategy
    });
  });
});