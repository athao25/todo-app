import { APIRequestContext } from '@playwright/test';
import { TodoDto, CreateTodoRequest, UpdateTodoRequest, ApiResponse } from '../interfaces';

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
}
