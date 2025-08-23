/**
 * Test Data Helpers
 * Utility functions for generating and manipulating test data
 */

import { TestTodos } from '../constants/testTodos';
import type { TestTodoItem } from '../types/testData';

export class TestDataHelpers {
  /**
   * Get random valid todo
   */
  static getRandomValidTodo(): TestTodoItem {
    const randomIndex = Math.floor(Math.random() * TestTodos.valid.length);
    return TestTodos.valid[randomIndex];
  }

  /**
   * Get multiple random todos
   */
  static getRandomTodos(count: number): TestTodoItem[] {
    return Array.from({ length: count }, (_, index) => ({
      ...this.getRandomValidTodo(),
      title: `${this.getRandomValidTodo().title} ${index + 1}`
    }));
  }

  /**
   * Generate todo with specific length
   */
  static generateTodoWithLength(length: number): TestTodoItem {
    if (length < 1) throw new Error('Length must be at least 1');
    if (length > 250) throw new Error('Length cannot exceed 250');
    
    return {
      title: 'X'.repeat(length),
      completed: false,
    };
  }

  /**
   * Create todo variations for testing
   */
  static createTodoVariations(baseTodo: TestTodoItem): TestTodoItem[] {
    return [
      { ...baseTodo, completed: false },
      { ...baseTodo, completed: true },
      { ...baseTodo, title: baseTodo.title.toLowerCase() },
      { ...baseTodo, title: baseTodo.title.toUpperCase() },
    ];
  }

  /**
   * Get todos by completion status
   */
  static getTodosByStatus(completed: boolean): TestTodoItem[] {
    return TestTodos.valid.filter(todo => todo.completed === completed);
  }

  /**
   * Create time-based test data
   */
  static createTimeBasedTodos(count: number): Array<{ title: string; timeOffset: number }> {
    return Array.from({ length: count }, (_, index) => ({
      title: `Time test todo ${index + 1}`,
      timeOffset: index * 60 * 60, // 1 hour intervals
    }));
  }
}