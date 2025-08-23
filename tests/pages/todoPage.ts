import { Page, Locator, expect } from '@playwright/test';

export interface Todo {
  id?: number;
  title: string;
  completed: boolean;
  created_at?: string;
}

/**
 * Page Object Model for Todo Application
 * Encapsulates all UI interactions and element selectors
 */
export class TodoPage {
  // Page elements - using data-testid for reliability
  private readonly appTitle: Locator;
  private readonly todoInput: Locator;
  private readonly addButton: Locator;
  private readonly emptyState: Locator;
  private readonly loadingState: Locator;
  private readonly filterAll: Locator;
  private readonly filterActive: Locator;
  private readonly filterCompleted: Locator;
  private readonly bulkActionsPanel: Locator;

  constructor(private page: Page) {
    // Initialize all locators
    this.appTitle = page.getByTestId('app-title');
    this.todoInput = page.getByTestId('todo-input');
    this.addButton = page.getByTestId('todo-add-button');
    this.emptyState = page.getByTestId('empty-state');
    this.loadingState = page.getByTestId('loading-state');
    this.filterAll = page.getByTestId('filter-all');
    this.filterActive = page.getByTestId('filter-active');
    this.filterCompleted = page.getByTestId('filter-completed');
    this.bulkActionsPanel = page.getByTestId('bulk-actions-panel');
  }

  /**
   * Navigation Methods
   */
  
  async navigateToApp(): Promise<void> {
    await this.page.goto('/');
    await this.waitForPageLoad();
  }

  
  async waitForPageLoad(): Promise<void> {
    await expect(this.page).toHaveTitle(/Todo/i);
    await expect(this.appTitle).toBeVisible();
    await this.waitForLoadingComplete();
  }

  private async waitForLoadingComplete(): Promise<void> {
    // Wait for loading state to disappear if present
    try {
      await expect(this.loadingState).not.toBeVisible({ timeout: 5000 });
    } catch {
      // Loading state might not appear, that's okay
    }
  }

  /**
   * Todo Management Methods
   */
  
  async addTodo(title: string): Promise<void> {
    await this.todoInput.fill(title);
    await this.addButton.click();
    
    // Wait for the todo to appear
    await this.waitForTodoToAppear();
  }

  
  async addMultipleTodos(titles: string[]): Promise<void> {
    for (const title of titles) {
      await this.addTodo(title);
      // Small delay to ensure proper ordering
      await this.page.waitForTimeout(100);
    }
  }

  private async waitForTodoToAppear(): Promise<void> {
    await expect(this.getTodoItems().first()).toBeVisible();
  }

  
  async deleteTodo(todoId: string): Promise<void> {
    const deleteButton = this.page.getByTestId(`todo-delete-${todoId}`);
    await deleteButton.click();
    
    // Handle confirmation modal if present
    await this.handleDeleteConfirmation();
  }

  private async handleDeleteConfirmation(): Promise<void> {
    const confirmButton = this.page.locator('button:has-text("Delete")');
    if (await confirmButton.isVisible({ timeout: 1000 })) {
      await confirmButton.click();
    }
  }

  
  async toggleTodoCompletion(todoId: string): Promise<void> {
    const checkbox = this.page.getByTestId(`todo-checkbox-${todoId}`);
    await checkbox.click();
  }

  async editTodo(todoId: string, newTitle: string): Promise<void> {
    const editButton = this.page.getByTestId(`todo-edit-${todoId}`);
    await editButton.click();
    
    // Find the edit input (assuming it appears after clicking edit)
    const editInput = this.page.locator(`[data-testid="todo-item-${todoId}"] input[type="text"]`);
    await editInput.fill(newTitle);
    await editInput.press('Enter');
  }

  /**
   * Filter Methods
   */
  
  async setFilterAll(): Promise<void> {
    await this.filterAll.click();
  }

  
  async setFilterActive(): Promise<void> {
    await this.filterActive.click();
  }

  
  async setFilterCompleted(): Promise<void> {
    await this.filterCompleted.click();
  }

  /**
   * Bulk Operations Methods
   */
  async selectTodo(todoId: string): Promise<void> {
    const todoItem = this.page.getByTestId(`todo-item-${todoId}`);
    await todoItem.click();
  }

  async bulkMarkCompleted(): Promise<void> {
    await expect(this.bulkActionsPanel).toBeVisible();
    const bulkCompleteButton = this.page.getByTestId('bulk-mark-completed');
    await bulkCompleteButton.click();
  }

  async bulkMarkIncomplete(): Promise<void> {
    await expect(this.bulkActionsPanel).toBeVisible();
    const bulkIncompleteButton = this.page.getByTestId('bulk-mark-incomplete');
    await bulkIncompleteButton.click();
  }

  async bulkDelete(): Promise<void> {
    await expect(this.bulkActionsPanel).toBeVisible();
    const bulkDeleteButton = this.page.getByTestId('bulk-delete-selected');
    await bulkDeleteButton.click();
    await this.handleDeleteConfirmation();
  }

  /**
   * Getter Methods for Elements
   */
  getTodoItems(): Locator {
    return this.page.locator('[data-testid^="todo-item-"]');
  }

  getTodoByTitle(title: string): Locator {
    return this.page.locator('[data-testid^="todo-item-"]').filter({ hasText: title });
  }

  getTodoById(todoId: string): Locator {
    return this.page.getByTestId(`todo-item-${todoId}`);
  }

  getTodoTitle(todoId: string): Locator {
    return this.page.getByTestId(`todo-title-${todoId}`);
  }

  getTodoCheckbox(todoId: string): Locator {
    return this.page.getByTestId(`todo-checkbox-${todoId}`);
  }

  /**
   * Utility Methods
   */
  async getTodoId(todoLocator: Locator): Promise<string | null> {
    const testId = await todoLocator.getAttribute('data-testid');
    return testId?.replace('todo-item-', '') || null;
  }

  async isTodoCompleted(todoId: string): Promise<boolean> {
    const todoTitle = this.getTodoTitle(todoId);
    const classes = await todoTitle.getAttribute('class');
    return classes?.includes('line-through') || false;
  }

  async getTodoCount(): Promise<number> {
    return await this.getTodoItems().count();
  }

  async isEmptyStateVisible(): Promise<boolean> {
    return await this.emptyState.isVisible();
  }

  async isBulkActionsPanelVisible(): Promise<boolean> {
    return await this.bulkActionsPanel.isVisible();
  }

  /**
   * Assertion Helpers
   */
  
  async expectTodoCount(expectedCount: number): Promise<void> {
    await expect(this.getTodoItems()).toHaveCount(expectedCount);
  }

  
  async expectTodoToExist(title: string): Promise<void> {
    await expect(this.getTodoByTitle(title)).toBeVisible();
  }

  
  async expectTodoToBeCompleted(todoId: string): Promise<void> {
    const todoTitle = this.getTodoTitle(todoId);
    await expect(todoTitle).toHaveClass(/line-through/);
  }

  
  async expectTodoToBeActive(todoId: string): Promise<void> {
    const todoTitle = this.getTodoTitle(todoId);
    await expect(todoTitle).not.toHaveClass(/line-through/);
  }

  
  async expectEmptyState(): Promise<void> {
    await expect(this.emptyState).toBeVisible();
    await expect(this.emptyState).toContainText('No todos found');
  }

  
  async expectPageToLoad(): Promise<void> {
    await expect(this.page).toHaveTitle(/Todo/i);
    await expect(this.appTitle).toBeVisible();
    await expect(this.appTitle).toContainText(/todo/i);
  }

  /**
   * Input Validation Methods
   */
  async expectAddButtonDisabled(): Promise<void> {
    await expect(this.addButton).toBeDisabled();
  }

  async expectAddButtonEnabled(): Promise<void> {
    await expect(this.addButton).toBeEnabled();
  }

  async clearInput(): Promise<void> {
    await this.todoInput.clear();
  }

  async getInputValue(): Promise<string> {
    return await this.todoInput.inputValue();
  }

  /**
   * Time Display Testing Methods
   */
  async getTodoTimeDisplay(todoId: string): Promise<string> {
    const timeElement = this.page.locator(`[data-testid="todo-item-${todoId}"] .text-xs`);
    return await timeElement.textContent() || '';
  }

  async expectTimeDisplay(todoId: string, expectedTimePattern: RegExp): Promise<void> {
    const timeText = await this.getTodoTimeDisplay(todoId);
    expect(timeText).toMatch(expectedTimePattern);
  }
}