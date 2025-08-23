/**
 * Todo Data Transfer Object Interface
 * Represents the structure of a Todo item as returned by the API
 */
export interface TodoDto {
  id?: number;
  title: string;
  completed: boolean;
  created_at?: string;
  updated_at?: string;
}