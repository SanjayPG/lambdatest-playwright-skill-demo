import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  // ── Selectors — skill priority: getByRole > getByTestId > raw CSS ──────────
  // Cart link: use getByTestId (no accessible label on the SVG icon link)
  private readonly cartLink  = this.page.getByTestId('shopping-cart-link');
  // Cart badge: no data-test or accessible label — raw locator
  private readonly cartBadge = this.page.locator('.shopping_cart_badge');
  private readonly pageTitle = this.page.locator('.title');

  // ── Actions ───────────────────────────────────────────────────────────────
  async addItemToCart(itemId: string): Promise<void> {
    await this.page.getByTestId(`add-to-cart-${itemId}`).click();
  }

  async removeItemFromCart(itemId: string): Promise<void> {
    await this.page.getByTestId(`remove-${itemId}`).click();
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }

  // ── Assertions ────────────────────────────────────────────────────────────
  async expectOnInventoryPage(): Promise<void> {
    await expect(this.page).toHaveURL(/inventory\.html/);
    await expect(this.pageTitle).toHaveText('Products');
  }

  async expectCartBadge(count: number): Promise<void> {
    await expect(this.cartBadge).toHaveText(String(count));
  }

  async expectCartBadgeHidden(): Promise<void> {
    await expect(this.cartBadge).not.toBeVisible();
  }
}
