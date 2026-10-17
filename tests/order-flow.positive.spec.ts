/**
 * POSITIVE TEST — Full E2E Order Flow
 *
 * Scenario: A valid user logs in, adds the "Sauce Labs Backpack" to their
 * cart, completes checkout with valid shipping info, and confirms the order.
 *
 * Covers: login → inventory → cart → checkout step-1 → checkout step-2 → confirmation
 */

import { test, expect } from '../src/fixtures';
import { USERS, CHECKOUT_INFO, PRODUCTS, PRODUCT_NAMES } from '../src/data/testData';

test.describe('Order Flow — Positive', () => {
  /**
   * Smoke test that verifies the happy-path end-to-end order flow.
   *
   * Each logical stage is wrapped in test.step() so failures pinpoint
   * exactly where in the flow the break occurred.
   */
  test('standard_user can place a complete order', async ({
    loginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
    confirmationPage,
  }) => {
    // ── 1. Login ─────────────────────────────────────────────────────────────
    await test.step('Login with valid credentials', async () => {
      await loginPage.goto();
      await loginPage.login(USERS.standard.username, USERS.standard.password);
      await loginPage.expectSuccessfulLogin();
    });

    // ── 2. Verify inventory page ──────────────────────────────────────────────
    await test.step('Inventory page is displayed', async () => {
      await inventoryPage.expectOnInventoryPage();
    });

    // ── 3. Add item to cart ───────────────────────────────────────────────────
    await test.step('Add "Sauce Labs Backpack" to cart', async () => {
      await inventoryPage.addItemToCart(PRODUCTS.backpack);
      await inventoryPage.expectCartBadge(1);
    });

    // ── 4. Navigate to cart ───────────────────────────────────────────────────
    await test.step('Open cart and verify item is present', async () => {
      await inventoryPage.goToCart();
      await cartPage.expectOnCartPage();
      await cartPage.expectItemInCart(PRODUCT_NAMES[PRODUCTS.backpack]);
      await cartPage.expectCartItemCount(1);
    });

    // ── 5. Checkout step 1 ────────────────────────────────────────────────────
    await test.step('Proceed to checkout and fill shipping info', async () => {
      await cartPage.proceedToCheckout();
      await checkoutPage.expectOnStep1();
      await checkoutPage.fillInfoAndContinue(CHECKOUT_INFO.valid);
    });

    // ── 6. Checkout step 2 ────────────────────────────────────────────────────
    await test.step('Review order summary on overview page', async () => {
      await checkoutPage.expectOnStep2();
      await checkoutPage.expectTotalVisible();
      await checkoutPage.expectSummaryItem(PRODUCT_NAMES[PRODUCTS.backpack]);
    });

    // ── 7. Finish order ───────────────────────────────────────────────────────
    await test.step('Finish the order', async () => {
      await checkoutPage.finishOrder();
    });

    // ── 8. Confirm order ──────────────────────────────────────────────────────
    await test.step('Order confirmation page is displayed', async () => {
      await confirmationPage.expectOrderComplete();
    });
  });
});
