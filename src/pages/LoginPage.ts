import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // ── Selectors — skill priority: getByPlaceholder > getByRole > getByTestId ──
  // Username/Password inputs have placeholders; login is input[type=submit] (button role)
  private readonly usernameInput  = this.page.getByPlaceholder('Username');
  private readonly passwordInput  = this.page.getByPlaceholder('Password');
  private readonly loginButton    = this.page.getByRole('button', { name: 'Login' });
  private readonly errorContainer = this.page.getByTestId('error');
  // error-button has no data-test or accessible label — raw locator as last resort
  private readonly errorDismiss   = this.page.locator('.error-button');

  // ── Navigation ────────────────────────────────────────────────────────────
  async goto(): Promise<void> {
    await this.navigateTo('/');
  }

  // ── Actions ───────────────────────────────────────────────────────────────
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async dismissError(): Promise<void> {
    await this.errorDismiss.click();
  }

  // ── Assertions ────────────────────────────────────────────────────────────
  async expectSuccessfulLogin(): Promise<void> {
    await expect(this.page).toHaveURL(/inventory\.html/);
  }

  async expectErrorMessage(message: string): Promise<void> {
    await expect(this.errorContainer).toBeVisible();
    await expect(this.errorContainer).toContainText(message);
  }

  async expectErrorNotVisible(): Promise<void> {
    await expect(this.errorContainer).not.toBeVisible();
  }
}
