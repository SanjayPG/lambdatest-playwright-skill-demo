// Import base from lambdatest-setup so the cloud/local page fixture is active
import { test as base } from './lambdatest-setup';
import { LoginPage }       from '../pages/LoginPage';
import { InventoryPage }   from '../pages/InventoryPage';
import { CartPage }        from '../pages/CartPage';
import { CheckoutPage }    from '../pages/CheckoutPage';
import { ConfirmationPage } from '../pages/ConfirmationPage';

/** Typed extension of Playwright test with pre-wired page objects */
export type PageObjects = {
  loginPage:        LoginPage;
  inventoryPage:    InventoryPage;
  cartPage:         CartPage;
  checkoutPage:     CheckoutPage;
  confirmationPage: ConfirmationPage;
};

/** Custom test fixture — import in every spec file instead of `@playwright/test` */
export const test = base.extend<PageObjects>({
  loginPage:        async ({ page }, use) => { await use(new LoginPage(page));        },
  inventoryPage:    async ({ page }, use) => { await use(new InventoryPage(page));    },
  cartPage:         async ({ page }, use) => { await use(new CartPage(page));         },
  checkoutPage:     async ({ page }, use) => { await use(new CheckoutPage(page));     },
  confirmationPage: async ({ page }, use) => { await use(new ConfirmationPage(page)); },
});

export { expect } from './lambdatest-setup';
