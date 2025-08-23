/**
 * Todo Interface for Page Object Model
 * Represents a Todo item structure used in UI tests
 */
export interface Todo {
  id?: number;
  title: string;
  completed: boolean;
  created_at?: string;
}