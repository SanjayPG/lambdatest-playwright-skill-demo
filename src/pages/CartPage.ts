import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  // ── Selectors — skill priority: getByRole > getByTestId > raw CSS ──────────
  private readonly pageTitle        = this.page.locator('.title');
  private readonly cartItems        = this.page.locator('.cart_item');
  // Checkout/Continue are input[type=submit] — getByRole('button') applies
  private readonly checkoutButton          = this.page.getByRole('button', { name: 'Checkout' });
  private readonly continueShoppingButton  = this.page.getByRole('button', { name: 'Continue Shopping' });

  // ── Actions ───────────────────────────────────────────────────────────────
  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  // ── Assertions ────────────────────────────────────────────────────────────
  async expectOnCartPage(): Promise<void> {
    await expect(this.page).toHaveURL(/cart\.html/);
    await expect(this.pageTitle).toHaveText('Your Cart');
  }

  async expectItemInCart(itemName: string): Promise<void> {
    await expect(
      this.page.locator('.inventory_item_name', { hasText: itemName })
    ).toBeVisible();
  }

  async expectCartItemCount(count: number): Promise<void> {
    await expect(this.cartItems).toHaveCount(count);
  }
}
