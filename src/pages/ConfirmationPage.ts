import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ConfirmationPage extends BasePage {
  // ── Selectors — skill priority: getByRole > getByTestId > raw CSS ──────────
  private readonly pageTitle      = this.page.locator('.title');
  private readonly completeHeader = this.page.getByRole('heading', { name: 'Thank you for your order!' });
  private readonly ponyExpress    = this.page.locator('.pony_express');
  private readonly backToProducts = this.page.getByTestId('back-to-products');

  // ── Actions ───────────────────────────────────────────────────────────────
  async goBackToProducts(): Promise<void> {
    await this.backToProducts.click();
  }

  // ── Assertions ────────────────────────────────────────────────────────────
  async expectOrderComplete(): Promise<void> {
    await expect(this.page).toHaveURL(/checkout-complete\.html/);
    await expect(this.pageTitle).toHaveText('Checkout: Complete!');
    await expect(this.completeHeader).toBeVisible();
    await expect(this.ponyExpress).toBeVisible();
    await expect(this.backToProducts).toBeVisible();
  }
}
