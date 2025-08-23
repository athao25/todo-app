/**
 * Test Data Types
 * Represents the structure of test data objects
 */

export interface TestTodoItem {
  title: string;
  completed: boolean;
}

export interface TimeDisplayTestItem {
  title: string;
  timeOffset: number;
}

export interface TestUser {
  name: string;
  preferences: {
    theme: string;
    notifications: boolean;
  };
}