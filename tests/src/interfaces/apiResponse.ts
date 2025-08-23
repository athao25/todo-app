/**
 * Generic API Response Interface
 * Represents the standardized structure for API responses
 */
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  status: number;
}