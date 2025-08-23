/**
 * String Helpers
 * Utility functions for string manipulation in tests
 */

export class StringHelpers {
  /**
   * Generate random string of specified length
   */
  static generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
  }

  /**
   * Generate string with special characters
   */
  static generateSpecialCharString(): string {
    return 'Special chars: !@#$%^&*()[]{}|;:,.<>?';
  }

  /**
   * Generate emoji string
   */
  static generateEmojiString(): string {
    const emojis = ['📝', '✅', '🚀', '💯', '🎯', '⭐', '🔥', '💡'];
    return emojis.slice(0, Math.floor(Math.random() * emojis.length) + 1).join(' ');
  }

  /**
   * Truncate string to specified length
   */
  static truncate(text: string, maxLength: number): string {
    return text.length <= maxLength ? text : text.substring(0, maxLength) + '...';
  }

  /**
   * Clean whitespace
   */
  static cleanWhitespace(text: string): string {
    return text.trim().replace(/\s+/g, ' ');
  }

  /**
   * Generate unique identifier
   */
  static generateUniqueId(prefix = 'test'): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Validate todo title constraints
   */
  static isValidTodoTitle(title: string): boolean {
    return title.length > 0 && title.length <= 250 && title.trim().length > 0;
  }

  /**
   * Get validation error message for invalid title
   */
  static getTitleValidationError(title: string): string | null {
    if (title.length === 0 || title.trim().length === 0) {
      return 'Title cannot be empty';
    }
    if (title.length > 250) {
      return 'Title cannot exceed 250 characters';
    }
    return null;
  }
}