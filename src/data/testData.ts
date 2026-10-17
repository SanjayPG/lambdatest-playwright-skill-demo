/** Centralised test data — keep all magic strings here, not in test files */

export const USERS = {
  standard: {
    username: 'standard_user',
    password: 'secret_sauce',
  },
  locked: {
    username: 'locked_out_user',
    password: 'secret_sauce',
  },
  invalid: {
    username: 'invalid_user',
    password: 'wrong_password',
  },
} as const;

export const CHECKOUT_INFO = {
  valid: {
    firstName:  'John',
    lastName:   'Doe',
    postalCode: '12345',
  },
  missingFirst: {
    firstName:  '',
    lastName:   'Doe',
    postalCode: '12345',
  },
  missingLast: {
    firstName:  'John',
    lastName:   '',
    postalCode: '12345',
  },
  missingPostal: {
    firstName:  'John',
    lastName:   'Doe',
    postalCode: '',
  },
} as const;

export const PRODUCTS = {
  backpack:     'sauce-labs-backpack',
  bikeLight:    'sauce-labs-bike-light',
  boltTShirt:   'sauce-labs-bolt-t-shirt',
  fleeceJacket: 'sauce-labs-fleece-jacket',
} as const;

export const PRODUCT_NAMES = {
  [PRODUCTS.backpack]:     'Sauce Labs Backpack',
  [PRODUCTS.bikeLight]:    'Sauce Labs Bike Light',
  [PRODUCTS.boltTShirt]:   'Sauce Labs Bolt T-Shirt',
  [PRODUCTS.fleeceJacket]: 'Sauce Labs Fleece Jacket',
} as const;

export const ERROR_MESSAGES = {
  lockedOut:         'Epic sadface: Sorry, this user has been locked out.',
  wrongCredentials:  'Epic sadface: Username and password do not match any user in this service',
  usernameRequired:  'Epic sadface: Username is required',
  passwordRequired:  'Epic sadface: Password is required',
  firstNameRequired: 'Error: First Name is required',
  lastNameRequired:  'Error: Last Name is required',
  postalRequired:    'Error: Postal Code is required',
} as const;
