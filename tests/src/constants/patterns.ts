/**
 * Test Patterns and Regular Expressions
 * Contains regex patterns for various test validations
 */

export const TimeDisplayPatterns = {
  justNow: /just now/i,
  minutes: /(\d+) min(s)? ago/i,
  hours: /(\d+) hour(s)? ago/i,
  days: /(\d+) day(s)? ago/i,
};

export const ValidationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  todoTitle: /^.{1,250}$/,
  nonEmpty: /^\S+.*$/,
};