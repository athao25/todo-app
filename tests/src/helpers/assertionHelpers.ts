/**
 * Assertion Helpers
 * Common assertion utilities for tests
 */

import { expect } from '@playwright/test';
import type { TodoDto } from '../interfaces/todoDto';
import type { ApiResponse } from '../interfaces/apiResponse';

export class AssertionHelpers {
  /**
   * Assert API response is successful
   */
  static expectSuccessResponse<T>(response: ApiResponse<T>): void {
    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(300);
    expect(response.error).toBeUndefined();
  }

  /**
   * Assert API response is an error
   */
  static expectErrorResponse<T>(response: ApiResponse<T>, expectedStatus?: number): void {
    if (expectedStatus) {
      expect(response.status).toBe(expectedStatus);
    } else {
      expect(response.status).toBeGreaterThanOrEqual(400);
    }
    expect(response.data).toBeUndefined();
  }

  /**
   * Assert todo has valid structure
   */
  static expectValidTodoStructure(todo: TodoDto): void {
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
  static expectTodoValues(todo: TodoDto, expected: Partial<TodoDto>): void {
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
  static expectTodosOrderedByCreation(todos: TodoDto[], descending = true): void {
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
   * Assert string matches pattern
   */
  static expectToMatchPattern(text: string, pattern: RegExp): void {
    expect(text).toMatch(pattern);
  }

  /**
   * Assert array has specific length
   */
  static expectLength<T>(array: T[], expectedLength: number): void {
    expect(array).toHaveLength(expectedLength);
  }

  /**
   * Assert object contains required properties
   */
  static expectToHaveProperties(object: object, properties: string[]): void {
    properties.forEach(property => {
      expect(object).toHaveProperty(property);
    });
  }
}