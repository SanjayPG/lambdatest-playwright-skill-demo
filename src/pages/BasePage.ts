import { Page, expect } from '@playwright/test';

/**
 * Base page object — all page classes extend this.
 * Provides shared navigation helpers and the underlying Playwright `page`.
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async navigateTo(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async getTitle(): Promise<string> {
    return this.page.locator('.title').innerText();
  }

  /** Current page URL (snapshot at call time) */
  get url(): string {
    return this.page.url();
  }

  /** Assert the current URL matches a string or regex */
  async expectUrl(urlOrPattern: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(urlOrPattern);
  }
}
