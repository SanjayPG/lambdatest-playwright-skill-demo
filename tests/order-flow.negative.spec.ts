/**
 * NEGATIVE TESTS — Login Failures & Checkout Form Validation
 *
 * Scenario A (Login):
 *   • locked_out_user — valid password but account is locked
 *   • invalid credentials — wrong username/password combo
 *   • empty username — no input submitted
 *   • error dismiss — the (X) button clears the error message
 *
 * Scenario B (Checkout validation):
 *   • submit completely empty form → "First Name is required"
 *   • submit with only first name   → "Last Name is required"
 *   • submit with first + last name → "Postal Code is required"
 */

import { test }  from '../src/fixtures';
import { USERS, CHECKOUT_INFO, PRODUCTS, ERROR_MESSAGES } from '../src/data/testData';

// ── Scenario A: Login failures ──────────────────────────────────────────────

test.describe('Negative — Login Failures', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('locked_out_user is blocked with a clear error message', async ({ loginPage }) => {
    await loginPage.login(USERS.locked.username, USERS.locked.password);

    // Must not be redirected away
    await loginPage.expectUrl('https://www.saucedemo.com/');
    await loginPage.expectErrorMessage(ERROR_MESSAGES.lockedOut);
  });

  test('invalid credentials produce a mismatch error', async ({ loginPage }) => {
    await loginPage.login(USERS.invalid.username, USERS.invalid.password);

    await loginPage.expectUrl('https://www.saucedemo.com/');
    await loginPage.expectErrorMessage(ERROR_MESSAGES.wrongCredentials);
  });

  test('submitting with empty username shows "Username is required"', async ({ loginPage }) => {
    // Call login with empty strings — the button click with no username triggers validation
    await loginPage.login('', '');
    await loginPage.expectErrorMessage(ERROR_MESSAGES.usernameRequired);
  });

  test('error message is dismissed when the × button is clicked', async ({ loginPage }) => {
    await loginPage.login(USERS.locked.username, USERS.locked.password);
    await loginPage.expectErrorMessage(ERROR_MESSAGES.lockedOut);

    // Dismiss
    await loginPage.dismissError();
    await loginPage.expectErrorNotVisible();
  });
});

// ── Scenario B: Checkout form validation ────────────────────────────────────

test.describe('Negative — Checkout Form Validation', () => {
  /**
   * Each test in this suite needs to be on checkout-step-one.html.
   * beforeEach: login → add item → open cart → click Checkout.
   */
  test.beforeEach(async ({ loginPage, inventoryPage, cartPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await loginPage.expectSuccessfulLogin();

    await inventoryPage.addItemToCart(PRODUCTS.backpack);
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
  });

  test('clicking Continue with empty form shows "First Name is required"', async ({
    checkoutPage,
  }) => {
    await checkoutPage.expectOnStep1();
    await checkoutPage.clickContinue();     // submit without any data

    await checkoutPage.expectValidationError(ERROR_MESSAGES.firstNameRequired);
    // Page must NOT advance to step 2
    await checkoutPage.expectUrl(/checkout-step-one\.html/);
  });

  test('filling only first name and continuing shows "Last Name is required"', async ({
    checkoutPage,
  }) => {
    await checkoutPage.expectOnStep1();
    await checkoutPage.fillInfoAndContinue(CHECKOUT_INFO.missingLast);

    await checkoutPage.expectValidationError(ERROR_MESSAGES.lastNameRequired);
    await checkoutPage.expectUrl(/checkout-step-one\.html/);
  });

  test('omitting postal code shows "Postal Code is required"', async ({
    checkoutPage,
  }) => {
    await checkoutPage.expectOnStep1();
    await checkoutPage.fillInfoAndContinue(CHECKOUT_INFO.missingPostal);

    await checkoutPage.expectValidationError(ERROR_MESSAGES.postalRequired);
    await checkoutPage.expectUrl(/checkout-step-one\.html/);
  });
});
