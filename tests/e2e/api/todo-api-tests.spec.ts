import { test, expect } from '../../src/fixtures/page_fixtures';
import { TestTodos } from '../../src/constants';

test.describe('Todo API - Backend Tests', () => {

  test.describe('Health Check', () => {
    test('should return healthy status', async ({ todoApiClient }) => {
      const response = await todoApiClient.healthCheck();
      
      todoApiClient.expectSuccessResponse(response);
      expect(response.data?.status).toBe('healthy');
    });
  });

  test.describe('Create Todo', () => {
    test('should create a new todo successfully', async ({ todoApiClient }) => {
      const newTodo = { title: TestTodos.valid[0].title };
      
      const response = await todoApiClient.createTodo(newTodo);
      
      todoApiClient.expectSuccessResponse(response);
      expect(response.status).toBe(201);
      
      if (response.data) {
        todoApiClient.expectValidTodoStructure(response.data);
        todoApiClient.expectTodoValues(response.data, {
          title: newTodo.title,
          completed: false,
        });
      }
    });

    test('should create multiple todos', async ({ todoApiClient }) => {
      const todoTitles = TestTodos.valid.slice(0, 3).map(t => ({ title: t.title }));
      
      const createdTodos = await todoApiClient.createMultipleTodos(todoTitles);
      
      expect(createdTodos).toHaveLength(3);
      createdTodos.forEach((todo, index) => {
        todoApiClient.expectValidTodoStructure(todo);
        todoApiClient.expectTodoValues(todo, {
          title: todoTitles[index].title,
          completed: false,
        });
      });
    });

    test('should handle edge case todo titles', async ({ todoApiClient }) => {
      for (const testTodo of TestTodos.edge_cases) {
        const response = await todoApiClient.createTodo({ title: testTodo.title });
        
        todoApiClient.expectSuccessResponse(response);
        if (response.data) {
          todoApiClient.expectTodoValues(response.data, { title: testTodo.title });
        }
      }
    });

    test('should reject empty todo title', async ({ todoApiClient }) => {
      const response = await todoApiClient.createTodo({ title: '' });
      
      todoApiClient.expectErrorResponse(response, 400);
    });

    test('should reject whitespace-only title', async ({ todoApiClient }) => {
      const response = await todoApiClient.createTodo({ title: '   ' });
      
      todoApiClient.expectErrorResponse(response, 400);
    });

    test('should reject title exceeding max length', async ({ todoApiClient }) => {
      const longTitle = 'X'.repeat(251);
      const response = await todoApiClient.createTodo({ title: longTitle });
      
      todoApiClient.expectErrorResponse(response, 400);
    });
  });

  test.describe('Get Todos', () => {
    test('should return empty array when no todos exist', async ({ todoApiClient }) => {
      const response = await todoApiClient.getAllTodos();
      
      todoApiClient.expectSuccessResponse(response);
      expect(response.data).toEqual([]);
    });

    test('should return all todos', async ({ todoApiClient }) => {
      // Create test todos
      const testTodos = TestTodos.valid.slice(0, 3).map(t => ({ title: t.title }));
      await todoApiClient.createMultipleTodos(testTodos);
      
      const response = await todoApiClient.getAllTodos();
      
      todoApiClient.expectSuccessResponse(response);
      expect(response.data).toHaveLength(3);
      
      response.data?.forEach(todo => {
        todoApiClient.expectValidTodoStructure(todo);
      });
    });

    test('should return todos in correct order', async ({ todoApiClient }) => {
      // Create todos with slight delay to ensure different timestamps
      for (let i = 0; i < 3; i++) {
        await todoApiClient.createTodo({ title: `Todo ${i}` });
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      const response = await todoApiClient.getAllTodos();
      
      todoApiClient.expectSuccessResponse(response);
      if (response.data && response.data.length > 1) {
        todoApiClient.expectTodosOrderedByCreation(response.data);
      }
    });
  });

  test.describe('Get Todo by ID', () => {
    test('should return specific todo by ID', async ({ todoApiClient }) => {
      const newTodo = { title: TestTodos.valid[0].title };
      const createResponse = await todoApiClient.createTodo(newTodo);
      
      if (createResponse.data?.id) {
        const getResponse = await todoApiClient.getTodoById(createResponse.data.id);
        
        todoApiClient.expectSuccessResponse(getResponse);
        if (getResponse.data) {
          todoApiClient.expectTodoValues(getResponse.data, {
            id: createResponse.data.id,
            title: newTodo.title,
          });
        }
      }
    });

    test('should return 404 for non-existent todo', async ({ todoApiClient }) => {
      const response = await todoApiClient.getTodoById(99999);
      
      todoApiClient.expectErrorResponse(response, 404);
    });

    test('should handle invalid ID format', async ({ todoApiClient }) => {
      // This test assumes the API validates ID format
      // Implementation depends on your API behavior
    });
  });

  test.describe('Update Todo', () => {
    test('should update todo title', async ({ todoApiClient }) => {
      const newTodo = { title: TestTodos.valid[0].title };
      const createResponse = await todoApiClient.createTodo(newTodo);
      
      if (createResponse.data?.id) {
        const updatedTitle = 'Updated title';
        const updateResponse = await todoApiClient.updateTodo(createResponse.data.id, {
          title: updatedTitle,
        });
        
        todoApiClient.expectSuccessResponse(updateResponse);
        if (updateResponse.data) {
          todoApiClient.expectTodoValues(updateResponse.data, {
            id: createResponse.data.id,
            title: updatedTitle,
          });
        }
      }
    });

    test('should update todo completion status', async ({ todoApiClient }) => {
      const newTodo = { title: TestTodos.valid[0].title };
      const createResponse = await todoApiClient.createTodo(newTodo);
      
      if (createResponse.data?.id) {
        const updateResponse = await todoApiClient.updateTodo(createResponse.data.id, {
          completed: true,
        });
        
        todoApiClient.expectSuccessResponse(updateResponse);
        if (updateResponse.data) {
          todoApiClient.expectTodoValues(updateResponse.data, {
            id: createResponse.data.id,
            completed: true,
          });
        }
      }
    });

    test('should update multiple fields simultaneously', async ({ todoApiClient }) => {
      const newTodo = { title: TestTodos.valid[0].title };
      const createResponse = await todoApiClient.createTodo(newTodo);
      
      if (createResponse.data?.id) {
        const updatedTitle = 'Updated title and status';
        const updateResponse = await todoApiClient.updateTodo(createResponse.data.id, {
          title: updatedTitle,
          completed: true,
        });
        
        todoApiClient.expectSuccessResponse(updateResponse);
        if (updateResponse.data) {
          todoApiClient.expectTodoValues(updateResponse.data, {
            id: createResponse.data.id,
            title: updatedTitle,
            completed: true,
          });
        }
      }
    });

    test('should return 404 for non-existent todo update', async ({ todoApiClient }) => {
      const response = await todoApiClient.updateTodo(99999, { title: 'Updated' });
      
      todoApiClient.expectErrorResponse(response, 404);
    });

    test('should validate updated title constraints', async ({ todoApiClient }) => {
      const newTodo = { title: TestTodos.valid[0].title };
      const createResponse = await todoApiClient.createTodo(newTodo);
      
      if (createResponse.data?.id) {
        // Test empty title
        const emptyTitleResponse = await todoApiClient.updateTodo(createResponse.data.id, {
          title: '',
        });
        todoApiClient.expectErrorResponse(emptyTitleResponse, 400);
        
        // Test overly long title
        const longTitle = 'X'.repeat(251);
        const longTitleResponse = await todoApiClient.updateTodo(createResponse.data.id, {
          title: longTitle,
        });
        todoApiClient.expectErrorResponse(longTitleResponse, 400);
      }
    });
  });

  test.describe('Delete Todo', () => {
    test('should delete existing todo', async ({ todoApiClient }) => {
      const newTodo = { title: TestTodos.valid[0].title };
      const createResponse = await todoApiClient.createTodo(newTodo);
      
      if (createResponse.data?.id) {
        const deleteResponse = await todoApiClient.deleteTodo(createResponse.data.id);
        
        todoApiClient.expectSuccessResponse(deleteResponse);
        expect(deleteResponse.status).toBe(204);
        
        // Verify todo is actually deleted
        const getResponse = await todoApiClient.getTodoById(createResponse.data.id);
        todoApiClient.expectErrorResponse(getResponse, 404);
      }
    });

    test('should return 404 for non-existent todo deletion', async ({ todoApiClient }) => {
      const response = await todoApiClient.deleteTodo(99999);
      
      todoApiClient.expectErrorResponse(response, 404);
    });

    test('should handle multiple deletions', async ({ todoApiClient }) => {
      const testTodos = TestTodos.valid.slice(0, 3).map(t => ({ title: t.title }));
      const createdTodos = await todoApiClient.createMultipleTodos(testTodos);
      
      // Delete all todos
      for (const todo of createdTodos) {
        if (todo.id) {
          const deleteResponse = await todoApiClient.deleteTodo(todo.id);
          todoApiClient.expectSuccessResponse(deleteResponse);
        }
      }
      
      // Verify all are deleted
      const getResponse = await todoApiClient.getAllTodos();
      todoApiClient.expectSuccessResponse(getResponse);
      expect(getResponse.data).toHaveLength(0);
    });
  });

  test.describe('Data Validation and Constraints', () => {
    test('should enforce title length constraints', async ({ todoApiClient }) => {
      // Test minimum length (single character should be valid)
      const minResponse = await todoApiClient.createTodo({ title: 'A' });
      todoApiClient.expectSuccessResponse(minResponse);
      
      // Test maximum length (250 characters should be valid)
      const maxResponse = await todoApiClient.createTodo({ title: 'X'.repeat(250) });
      todoApiClient.expectSuccessResponse(maxResponse);
      
      // Test exceeding maximum length
      const overMaxResponse = await todoApiClient.createTodo({ title: 'X'.repeat(251) });
      todoApiClient.expectErrorResponse(overMaxResponse, 400);
    });

    test('should handle special characters correctly', async ({ todoApiClient }) => {
      const specialCharsTitle = TestTodos.edge_cases.find(t => 
        t.title.includes('!@#$%^&*')
      )?.title || 'Special chars: !@#$%^&*';
      
      const response = await todoApiClient.createTodo({ title: specialCharsTitle });
      
      todoApiClient.expectSuccessResponse(response);
      if (response.data) {
        expect(response.data.title).toBe(specialCharsTitle);
      }
    });

    test('should handle unicode and emoji characters', async ({ todoApiClient }) => {
      const unicodeTitle = TestTodos.edge_cases.find(t => 
        t.title.includes('📝')
      )?.title || 'Unicode: 📝 ✅ 🚀';
      
      const response = await todoApiClient.createTodo({ title: unicodeTitle });
      
      todoApiClient.expectSuccessResponse(response);
      if (response.data) {
        expect(response.data.title).toBe(unicodeTitle);
      }
    });
  });

  test.describe('Concurrent Operations', () => {
    test('should handle concurrent todo creation', async ({ todoApiClient }) => {
      const concurrentTodos = Array.from({ length: 5 }, (_, i) => ({
        title: `Concurrent Todo ${i}`,
      }));
      
      const promises = concurrentTodos.map(todo => todoApiClient.createTodo(todo));
      const responses = await Promise.all(promises);
      
      responses.forEach(response => {
        todoApiClient.expectSuccessResponse(response);
      });
      
      // Verify all todos were created
      const getAllResponse = await todoApiClient.getAllTodos();
      expect(getAllResponse.data).toHaveLength(5);
    });

    test('should handle concurrent updates on same todo', async ({ todoApiClient }) => {
      const newTodo = { title: TestTodos.valid[0].title };
      const createResponse = await todoApiClient.createTodo(newTodo);
      
      if (createResponse.data?.id) {
        // Attempt concurrent updates (this tests race condition handling)
        const updatePromises = [
          todoApiClient.updateTodo(createResponse.data.id, { title: 'Update 1' }),
          todoApiClient.updateTodo(createResponse.data.id, { title: 'Update 2' }),
          todoApiClient.updateTodo(createResponse.data.id, { completed: true }),
        ];
        
        const responses = await Promise.all(updatePromises);
        
        // At least one should succeed
        const successfulResponses = responses.filter(r => r.status < 400);
        expect(successfulResponses.length).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Performance', () => {
    test('should handle large number of todos efficiently', async ({ todoApiClient }) => {
      const startTime = Date.now();
      
      // Create 100 todos
      const largeTodoSet = Array.from({ length: 100 }, (_, i) => ({
        title: `Performance Test Todo ${i}`,
      }));
      
      await todoApiClient.createMultipleTodos(largeTodoSet);
      
      const creationTime = Date.now() - startTime;
      
      // Fetch all todos
      const fetchStart = Date.now();
      const response = await todoApiClient.getAllTodos();
      const fetchTime = Date.now() - fetchStart;
      
      todoApiClient.expectSuccessResponse(response);
      expect(response.data).toHaveLength(100);
      
      // Performance assertions (adjust thresholds based on your requirements)
      expect(creationTime).toBeLessThan(30000); // 30 seconds for creation
      expect(fetchTime).toBeLessThan(5000); // 5 seconds for fetching
    });
  });
});