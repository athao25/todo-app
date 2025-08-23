import { APIRequestContext, expect } from '@playwright/test';

export interface TodoDto {
  id?: number;
  title: string;
  completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTodoRequest {
  title: string;
}

export interface UpdateTodoRequest {
  title?: string;
  completed?: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  status: number;
}

/**
 * API Client for Todo Backend
 * Encapsulates all API interactions for testing
 */
export class TodoApiClient {
  private readonly baseURL: string;

  constructor(
    private request: APIRequestContext,
    baseURL: string = process.env.API_BASE_URL || 'http://localhost:5000'
  ) {
    this.baseURL = baseURL;
  }

  /**
   * Todo CRUD Operations
   */

  /**
   * Create a new todo
   */
  async createTodo(todo: CreateTodoRequest): Promise<ApiResponse<TodoDto>> {
    const response = await this.request.post(`${this.baseURL}/api/todos`, {
      data: todo,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return {
      data: response.ok() ? await response.json() : undefined,
      status: response.status(),
      error: !response.ok() ? await response.text() : undefined,
    };
  }

  /**
   * Get all todos
   */
  async getAllTodos(): Promise<ApiResponse<TodoDto[]>> {
    const response = await this.request.get(`${this.baseURL}/api/todos`);

    return {
      data: response.ok() ? await response.json() : undefined,
      status: response.status(),
      error: !response.ok() ? await response.text() : undefined,
    };
  }

  /**
   * Get todo by ID
   */
  async getTodoById(id: number): Promise<ApiResponse<TodoDto>> {
    const response = await this.request.get(`${this.baseURL}/api/todos/${id}`);

    return {
      data: response.ok() ? await response.json() : undefined,
      status: response.status(),
      error: !response.ok() ? await response.text() : undefined,
    };
  }

  /**
   * Update todo by ID
   */
  async updateTodo(id: number, updates: UpdateTodoRequest): Promise<ApiResponse<TodoDto>> {
    const response = await this.request.put(`${this.baseURL}/api/todos/${id}`, {
      data: updates,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return {
      data: response.ok() ? await response.json() : undefined,
      status: response.status(),
      error: !response.ok() ? await response.text() : undefined,
    };
  }

  /**
   * Delete todo by ID
   */
  async deleteTodo(id: number): Promise<ApiResponse<void>> {
    const response = await this.request.delete(`${this.baseURL}/api/todos/${id}`);

    return {
      status: response.status(),
      error: !response.ok() ? await response.text() : undefined,
    };
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<ApiResponse<{ status: string }>> {
    const response = await this.request.get(`${this.baseURL}/api/health`);

    return {
      data: response.ok() ? await response.json() : undefined,
      status: response.status(),
      error: !response.ok() ? await response.text() : undefined,
    };
  }

  /**
   * Test Utility Methods
   */

  /**
   * Create multiple todos for testing
   */
  async createMultipleTodos(todos: CreateTodoRequest[]): Promise<TodoDto[]> {
    const createdTodos: TodoDto[] = [];
    
    for (const todo of todos) {
      const response = await this.createTodo(todo);
      if (response.data) {
        createdTodos.push(response.data);
      }
    }
    
    return createdTodos;
  }

  /**
   * Clean up all todos (for test setup/teardown)
   */
  async deleteAllTodos(): Promise<void> {
    const response = await this.getAllTodos();
    
    if (response.data && response.data.length > 0) {
      const deletePromises = response.data.map(todo => 
        todo.id ? this.deleteTodo(todo.id) : Promise.resolve()
      );
      
      await Promise.all(deletePromises);
    }
  }

  /**
   * Create test data with specific time ranges for time display testing
   */
  async createTestDataWithTimeRanges(): Promise<TodoDto[]> {
    const testTodos: CreateTodoRequest[] = [
      { title: 'Just created task' },
      { title: 'Recent task (5 mins)' },
      { title: 'Older task (1 hour)' },
      { title: 'Yesterday task' },
      { title: 'Week old task' },
      { title: 'Month old task' },
    ];

    return await this.createMultipleTodos(testTodos);
  }

  /**
   * Assertion Helpers for API Testing
   */

  /**
   * Assert successful response
   */
  expectSuccessResponse<T>(response: ApiResponse<T>): void {
    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(300);
    expect(response.error).toBeUndefined();
  }

  /**
   * Assert error response
   */
  expectErrorResponse<T>(response: ApiResponse<T>, expectedStatus?: number): void {
    if (expectedStatus) {
      expect(response.status).toBe(expectedStatus);
    } else {
      expect(response.status).toBeGreaterThanOrEqual(400);
    }
    expect(response.data).toBeUndefined();
  }

  /**
   * Assert todo structure
   */
  expectValidTodoStructure(todo: TodoDto): void {
    expect(todo).toHaveProperty('id');
    expect(todo).toHaveProperty('title');
    expect(todo).toHaveProperty('completed');
    expect(todo).toHaveProperty('created_at');
    expect(todo).toHaveProperty('updated_at');
    
    expect(typeof todo.id).toBe('number');
    expect(typeof todo.title).toBe('string');
    expect(typeof todo.completed).toBe('boolean');
    expect(typeof todo.created_at).toBe('string');
    expect(typeof todo.updated_at).toBe('string');
  }

  /**
   * Assert todo matches expected values
   */
  expectTodoValues(todo: TodoDto, expected: Partial<TodoDto>): void {
    if (expected.title !== undefined) {
      expect(todo.title).toBe(expected.title);
    }
    if (expected.completed !== undefined) {
      expect(todo.completed).toBe(expected.completed);
    }
    if (expected.id !== undefined) {
      expect(todo.id).toBe(expected.id);
    }
  }

  /**
   * Assert todos are ordered by creation date
   */
  expectTodosOrderedByCreation(todos: TodoDto[], descending = true): void {
    for (let i = 0; i < todos.length - 1; i++) {
      const current = new Date(todos[i].created_at!);
      const next = new Date(todos[i + 1].created_at!);
      
      if (descending) {
        expect(current.getTime()).toBeGreaterThanOrEqual(next.getTime());
      } else {
        expect(current.getTime()).toBeLessThanOrEqual(next.getTime());
      }
    }
  }

  /**
   * Validation Helpers
   */

  /**
   * Validate todo title constraints
   */
  isValidTodoTitle(title: string): boolean {
    return title.length > 0 && title.length <= 250 && title.trim().length > 0;
  }

  /**
   * Get validation error message for invalid title
   */
  getTitleValidationError(title: string): string | null {
    if (title.length === 0 || title.trim().length === 0) {
      return 'Title cannot be empty';
    }
    if (title.length > 250) {
      return 'Title cannot exceed 250 characters';
    }
    return null;
  }
}