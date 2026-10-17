# Playwright Test Automation Framework

A production-grade Playwright test automation framework with TestMu AI (LambdaTest) cloud integration, Page Object Model architecture, custom fixtures, and Jenkins CI/CD pipeline.

## Features

- **Multi-Browser Support**: Chromium, Firefox, WebKit with local and cloud execution
- **TestMu AI Cloud Integration**: Run tests on 3000+ browser/OS combinations and real devices
- **Page Object Model**: Scalable architecture with BasePage and specialized page classes
- **Custom Fixtures**: Auto-wired page objects with local/cloud execution handling
- **Centralized Test Data**: All test data in one place for easy maintenance
- **TypeScript**: Type-safe test development with full IntelliSense
- **Test Steps**: Organized test flow with clear step-by-step execution
- **CI/CD Ready**: Jenkins pipeline for automated test execution

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd playwirghtAgentSKill
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

## Configuration

### Local Execution

The default configuration in `playwright.config.ts` is set up for local execution with multiple browsers.

### TestMu AI Cloud Execution

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Add your TestMu AI credentials to `.env`:
```
LT_USERNAME=your-username
LT_ACCESS_KEY=your-access-key
```

Or set them as environment variables:

**Linux/macOS:**
```bash
export LT_USERNAME="your-username"
export LT_ACCESS_KEY="your-access-key"
```

**Windows:**
```cmd
set LT_USERNAME="your-username"
set LT_ACCESS_KEY="your-access-key"
```

Get your credentials from [TestMu AI Dashboard](https://automation.lambdatest.com/).

## Running Tests

### Local Execution

```bash
# Run all tests
npx playwright test

# Run tests in headed mode
npx playwright test --headed

# Run tests in UI mode (interactive)
npx playwright test --ui

# Run tests in debug mode
npx playwright test --debug

# Run specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run specific test file
npx playwright test tests/example.spec.ts

# Run tests matching a pattern
npx playwright test tests/login
```

### Cloud Execution (TestMu AI)

Project name format: `browserName:version:platform@lambdatest`

```bash
# Run on Chrome (Windows 11)
npx playwright test --project="chrome:latest:Windows 11@lambdatest"

# Run on Edge (macOS)
npx playwright test --project="MicrosoftEdge:latest:macOS Sonoma@lambdatest"

# Run on Firefox (Linux)
npx playwright test --project="firefox:latest:Linux@lambdatest"

# Run specific test on cloud
npx playwright test tests/order-flow.positive.spec.ts --project="chrome:latest:Windows 11@lambdatest"
```

### Test Reports

```bash
# Show HTML report
npx playwright show-report

# Generate test with codegen
npx playwright codegen https://www.saucedemo.com

# Update snapshots
npx playwright test --update-snapshots
```

## Test Coverage

### Positive Tests (`order-flow.positive.spec.ts`)

**Complete Order Flow** - Full E2E happy path test covering:
1. Login with valid credentials (standard_user)
2. Verify inventory page loads
3. Add "Sauce Labs Backpack" to cart
4. Navigate to cart and verify item
5. Proceed to checkout
6. Fill shipping information
7. Review order summary
8. Complete order
9. Verify order confirmation page

### Negative Tests (`order-flow.negative.spec.ts`)

**Login Validation** - Tests invalid login scenarios:
- Locked out user attempt
- Invalid credentials
- Missing username
- Missing password

**Checkout Validation** - Tests checkout form validation:
- Missing first name
- Missing last name
- Missing postal code

## Project Structure

```
playwright-framework/
├── src/
│   ├── pages/
│   │   ├── BasePage.ts              # Base page with common utilities
│   │   ├── LoginPage.ts             # Login page object
│   │   ├── InventoryPage.ts         # Products/Inventory page object
│   │   ├── CartPage.ts              # Shopping cart page object
│   │   ├── CheckoutPage.ts          # Checkout page object
│   │   └── ConfirmationPage.ts      # Order confirmation page object
│   ├── fixtures/
│   │   ├── index.ts                 # Custom fixtures with page objects
│   │   └── lambdatest-setup.ts      # LambdaTest cloud fixture (local + cloud)
│   ├── data/
│   │   └── testData.ts              # Centralized test data (users, products, checkout info)
│   └── utils/                       # Utility functions
├── tests/
│   ├── order-flow.positive.spec.ts  # Positive order flow tests (E2E happy path)
│   └── order-flow.negative.spec.ts  # Negative order flow tests (validation errors)
├── test-results/                    # Test execution results and artifacts
├── playwright.config.ts             # Playwright configuration (browsers, retries, reporters)
├── package.json                     # Project dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
├── Jenkinsfile                      # Jenkins CI/CD pipeline
├── jenkins/                         # Jenkins setup scripts
├── .env.example                     # Example environment variables
├── .gitignore                       # Git ignore rules
└── README.md                        # This file
```

## Architecture

### Page Object Model

All page classes extend `BasePage.ts` which provides:
- `navigateTo(path)`: Navigate to a URL
- `getTitle()`: Get page title
- `url`: Current page URL property
- `expectUrl(pattern)`: Assert URL matches pattern

Example page object:
```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

### Custom Fixtures

Tests import fixtures from `src/fixtures/index.ts` instead of `@playwright/test`:

```typescript
import { test, expect } from '../src/fixtures';
import { USERS } from '../src/data/testData';

test('login test', async ({ loginPage, inventoryPage }) => {
  // Page objects are auto-injected and ready to use
  await loginPage.goto();
  await loginPage.login(USERS.standard.username, USERS.standard.password);
  await inventoryPage.expectOnInventoryPage();
});
```

The fixture handles:
- Automatic page object instantiation
- Local vs cloud execution based on project name
- Test status reporting to LambdaTest dashboard

### Centralized Test Data

All test data is in `src/data/testData.ts`:

```typescript
export const USERS = {
  standard: { username: 'standard_user', password: 'secret_sauce' },
  locked: { username: 'locked_out_user', password: 'secret_sauce' },
};

export const PRODUCTS = {
  backpack: 'sauce-labs-backpack',
  bikeLight: 'sauce-labs-bike-light',
};

export const ERROR_MESSAGES = {
  lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
  wrongCredentials: 'Epic sadface: Username and password do not match...',
};
```

### Test Organization

Tests use `test.step()` for clear, organized flow:

```typescript
test('complete order flow', async ({ loginPage, cartPage, checkoutPage }) => {
  await test.step('Login with valid credentials', async () => {
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
  });

  await test.step('Add item to cart', async () => {
    await inventoryPage.addItemToCart(PRODUCTS.backpack);
    await inventoryPage.expectCartBadge(1);
  });

  await test.step('Complete checkout', async () => {
    await cartPage.proceedToCheckout();
    await checkoutPage.fillInfoAndContinue(CHECKOUT_INFO.valid);
    await checkoutPage.finishOrder();
  });
});
```

## Best Practices

This project follows Playwright best practices:

### 1. Web-First Assertions
Always use auto-retrying assertions:
```typescript
// ✅ Good - Auto-retries until visible or timeout
await expect(page.getByRole('button')).toBeVisible();

// ❌ Bad - No retry, race condition
expect(await page.locator('button').isVisible()).toBe(true);
```

### 2. Accessible Selectors
Use `data-test` attributes and accessible locators:
```typescript
// ✅ Good - Stable, accessible
page.locator('[data-test="username"]')
page.getByRole('button', { name: 'Submit' })

// ❌ Bad - Fragile CSS selectors
page.locator('.login-btn')
page.locator('#username')
```

### 3. Centralized Test Data
All test data in `src/data/testData.ts`:
```typescript
// ✅ Good - Centralized, reusable
await loginPage.login(USERS.standard.username, USERS.standard.password);

// ❌ Bad - Hard-coded values scattered in tests
await loginPage.login('standard_user', 'secret_sauce');
```

### 4. Page Object Model
Encapsulate page logic in page classes:
```typescript
// ✅ Good - Reusable, maintainable
await loginPage.login(username, password);
await loginPage.expectSuccessfulLogin();

// ❌ Bad - Direct page interactions in tests
await page.locator('[data-test="username"]').fill(username);
await page.locator('[data-test="password"]').fill(password);
```

### 5. Test Steps
Organize tests with `test.step()`:
```typescript
// ✅ Good - Clear failure pinpointing
await test.step('Login with valid credentials', async () => {
  await loginPage.login(USERS.standard.username, USERS.standard.password);
});

// ❌ Bad - Unclear where failure occurred
await loginPage.login(USERS.standard.username, USERS.standard.password);
```

### 6. No Hard Waits
Use auto-waiting assertions instead of timeouts:
```typescript
// ✅ Good - Smart waiting
await expect(page.getByText('Success')).toBeVisible();

// ❌ Bad - Arbitrary timeout
await page.waitForTimeout(3000);
```

### 7. Independent Tests
Each test must be able to run standalone and in any order.

## Available Page Objects

### BasePage
Base class for all page objects:
- `navigateTo(path)`: Navigate to URL
- `getTitle()`: Get page title text
- `url`: Current page URL property
- `expectUrl(pattern)`: Assert URL matches

### LoginPage (extends BasePage)
- `goto()`: Navigate to login page
- `login(username, password)`: Fill credentials and submit
- `expectSuccessfulLogin()`: Assert login succeeded
- `expectErrorMessage(message)`: Assert error displayed

### InventoryPage (extends BasePage)
- `expectOnInventoryPage()`: Assert on inventory page
- `addItemToCart(productId)`: Add product to cart
- `expectCartBadge(count)`: Assert cart badge shows count
- `goToCart()`: Navigate to cart

### CartPage (extends BasePage)
- `expectOnCartPage()`: Assert on cart page
- `expectItemInCart(name)`: Assert product in cart
- `expectCartItemCount(count)`: Assert cart item count
- `proceedToCheckout()`: Click checkout button
- `removeItem(productId)`: Remove item from cart

### CheckoutPage (extends BasePage)
- `expectOnStep1()`: Assert on checkout info page
- `fillInfoAndContinue(info)`: Fill shipping info and continue
- `expectOnStep2()`: Assert on checkout overview page
- `expectTotalVisible()`: Assert price total visible
- `expectSummaryItem(name)`: Assert item in order summary
- `finishOrder()`: Click finish button
- `expectErrorMessage(message)`: Assert validation error

### ConfirmationPage (extends BasePage)
- `expectOrderComplete()`: Assert order confirmation displayed

## CI/CD Integration

### Jenkins

The project includes a complete Jenkins pipeline configuration (`Jenkinsfile`) that:
- Installs Node.js dependencies
- Installs Playwright browsers
- Runs tests across multiple browsers
- Publishes HTML test reports
- Archives test artifacts and videos
- Sends notifications on failure

To run in Jenkins:
1. Set up LambdaTest credentials as Jenkins secrets (`LT_USERNAME`, `LT_ACCESS_KEY`)
2. Create a new Pipeline job
3. Point to this repository
4. Jenkins will automatically use the `Jenkinsfile`

### GitHub Actions

Add a workflow file in `.github/workflows/playwright.yml` for GitHub Actions integration.

## Debugging

### Debug Mode

```bash
npx playwright test --debug
```

### Playwright Inspector

```bash
# Open inspector
npx playwright test --debug

# Pause execution
await page.pause();
```

### Trace Viewer

```bash
# Generate trace
npx playwright test --trace on

# View trace
npx playwright show-trace trace.zip
```

### Visual Studio Code

Use the Playwright Test extension for VS Code for integrated debugging.

## LambdaTest (TestMu AI) Integration

### How It Works

The `src/fixtures/lambdatest-setup.ts` fixture automatically detects execution mode:

**Local Execution**: When project name does NOT include `@lambdatest`
```bash
npx playwright test --project=chromium  # Runs locally
```

**Cloud Execution**: When project name includes `@lambdatest`
```bash
npx playwright test --project="chrome:latest:Windows 11@lambdatest"  # Runs on cloud
```

The fixture:
- Parses browser, version, and platform from project name
- Connects to LambdaTest CDP endpoint with capabilities
- Automatically reports test status (pass/fail) to LambdaTest dashboard
- Handles browser/context/page lifecycle

### LambdaTest Dashboard Features

When running on TestMu AI cloud, you get:
- **3000+ Browser/OS Combinations**: Test on any browser and OS
- **Real Devices**: Test on actual mobile devices
- **Network Logs**: Capture network traffic
- **Video Recording**: Automatic video recording of test execution
- **Screenshots**: Automatic screenshots on failure
- **Console Logs**: Capture browser console logs
- **Test Status**: Automatic pass/fail reporting
- **Test Dashboard**: View all test results, videos, logs in one place

View results at: [LambdaTest Automation Dashboard](https://automation.lambdatest.com/)

## Troubleshooting

### Common Issues

1. **Browsers not installed**:
   ```bash
   npx playwright install
   ```

2. **Port already in use**:
   - Check if another process is using port 3000
   - Update `webServer.port` in `playwright.config.ts`

3. **Tests timing out**:
   - Increase timeout in `playwright.config.ts`
   - Check network connectivity
   - Verify selectors are correct

4. **TestMu AI authentication failed**:
   - Verify `LT_USERNAME` and `LT_ACCESS_KEY` are set correctly
   - Check credentials at https://automation.lambdatest.com/

## Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Submit a pull request

## License

[MIT](LICENSE)

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [TestMu AI Documentation](https://www.lambdatest.com/support/docs/)
- [TestMu AI Dashboard](https://automation.lambdatest.com/)
- [TestMu AI Playwright Guide](https://www.lambdatest.com/support/docs/playwright-testing/)

## Support

For issues and questions:
- Playwright: https://github.com/microsoft/playwright/issues
- TestMu AI: https://support.lambdatest.com/
- Project Issues: [Your repository issues page]
