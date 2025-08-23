/**
 * Wait Helpers
 * Utility functions for handling waits and timeouts in tests
 */

import { Page, expect } from '@playwright/test';
import { TestConfig } from '../config/testConfig';

export class WaitHelpers {
  /**
   * Wait for element to be visible
   */
  static async waitForVisible(page: Page, selector: string, timeout?: number): Promise<void> {
    await expect(page.locator(selector)).toBeVisible({ 
      timeout: timeout || TestConfig.timeouts.medium 
    });
  }

  /**
   * Wait for element to be hidden
   */
  static async waitForHidden(page: Page, selector: string, timeout?: number): Promise<void> {
    await expect(page.locator(selector)).toBeHidden({ 
      timeout: timeout || TestConfig.timeouts.medium 
    });
  }

  /**
   * Wait for network idle
   */
  static async waitForNetworkIdle(page: Page, timeout?: number): Promise<void> {
    await page.waitForLoadState('networkidle', { 
      timeout: timeout || TestConfig.timeouts.long 
    });
  }

  /**
   * Wait for page load
   */
  static async waitForPageLoad(page: Page): Promise<void> {
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle');
  }

  /**
   * Custom delay
   */
  static async delay(ms: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Wait for animation to complete
   */
  static async waitForAnimation(): Promise<void> {
    await this.delay(TestConfig.delays.animation);
  }

  /**
   * Wait with retry mechanism
   */
  static async waitWithRetry<T>(
    operation: () => Promise<T>,
    retries: number = TestConfig.retries.ui,
    delay: number = TestConfig.delays.network
  ): Promise<T> {
    for (let i = 0; i < retries; i++) {
      try {
        return await operation();
      } catch (error) {
        if (i === retries - 1) throw error;
        await this.delay(delay);
      }
    }
    throw new Error('All retries exhausted');
  }
}