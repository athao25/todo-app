/**
 * Test Configuration Types
 * Represents the structure of test configuration objects
 */

export interface TestTimeouts {
  short: number;
  medium: number;
  long: number;
}

export interface TestRetries {
  api: number;
  ui: number;
}

export interface TestDelays {
  animation: number;
  typing: number;
  network: number;
}