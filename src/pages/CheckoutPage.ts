import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export interface CheckoutInfo {
  firstName: string;
  lastName:  string;
  postalCode: string;
}

export class CheckoutPage extends BasePage {
  // ── Step-1 Selectors — skill priority: getByPlaceholder > getByRole > getByTestId ──
  // Inputs have placeholders; Continue/Cancel are input[type=submit] → button role
  private readonly firstNameInput  = this.page.getByPlaceholder('First Name');
  private readonly lastNameInput   = this.page.getByPlaceholder('Last Name');
  private readonly postalCodeInput = this.page.getByPlaceholder('Zip/Postal Code');
  private readonly continueButton  = this.page.getByRole('button', { name: 'Continue' });
  private readonly cancelButton    = this.page.getByRole('button', { name: 'Cancel' });
  private readonly errorContainer  = this.page.getByTestId('error');

  // ── Step-2 Selectors ──────────────────────────────────────────────────────
  private readonly summaryTotal = this.page.locator('.summary_total_label');
  private readonly finishButton = this.page.getByRole('button', { name: 'Finish' });

  // ── Step-1 Actions ────────────────────────────────────────────────────────
  async fillInfo(info: CheckoutInfo): Promise<void> {
    await this.firstNameInput.fill(info.firstName);
    await this.lastNameInput.fill(info.lastName);
    await this.postalCodeInput.fill(info.postalCode);
  }

  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }

  async fillInfoAndContinue(info: CheckoutInfo): Promise<void> {
    await this.fillInfo(info);
    await this.clickContinue();
  }

  async clickCancel(): Promise<void> {
    await this.cancelButton.click();
  }

  // ── Step-2 Actions ────────────────────────────────────────────────────────
  async finishOrder(): Promise<void> {
    await this.finishButton.click();
  }

  // ── Assertions ────────────────────────────────────────────────────────────
  async expectOnStep1(): Promise<void> {
    await expect(this.page).toHaveURL(/checkout-step-one\.html/);
    await expect(this.page.locator('.title')).toHaveText('Checkout: Your Information');
  }

  async expectOnStep2(): Promise<void> {
    await expect(this.page).toHaveURL(/checkout-step-two\.html/);
    await expect(this.page.locator('.title')).toHaveText('Checkout: Overview');
  }

  async expectSummaryItem(itemName: string): Promise<void> {
    await expect(
      this.page.locator('.inventory_item_name', { hasText: itemName })
    ).toBeVisible();
  }

  async expectTotalVisible(): Promise<void> {
    await expect(this.summaryTotal).toContainText('Total:');
  }

  async expectValidationError(message: string): Promise<void> {
    await expect(this.errorContainer).toBeVisible();
    await expect(this.errorContainer).toContainText(message);
  }

  async expectNoValidationError(): Promise<void> {
    await expect(this.errorContainer).not.toBeVisible();
  }
}
