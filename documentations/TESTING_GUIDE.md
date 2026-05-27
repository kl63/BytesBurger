# ByteBurger Testing Guide

## 🛡️ DATABASE SAFETY GUARANTEE

**Your production database is 100% SAFE!**

All tests are configured to use mocks and never touch your real Supabase database:

✅ **Vitest unit/component tests** - Use mocked Supabase client  
✅ **Playwright E2E tests** - Run against localhost development server  
✅ **Mock environment variables** - Tests use fake Supabase URLs  
✅ **No real data** - All database calls are intercepted and mocked  

---

## Testing Stack

### Unit & Component Testing
- **Vitest** - Fast unit testing framework
- **React Testing Library** - Component testing
- **@testing-library/jest-dom** - DOM matchers

### End-to-End Testing
- **Playwright** - Browser automation for E2E tests
- Tests multiple browsers (Chrome, Firefox, Safari)
- Mobile device testing included

---

## Running Tests

### Unit & Component Tests

```bash
# Run all unit tests (watch mode)
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage

# Run tests once (CI mode)
npm test -- --run
```

### End-to-End Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run specific test file
npx playwright test tests/e2e/homepage.spec.ts

# Run tests in specific browser
npx playwright test --project=chromium
```

### Run All Tests

```bash
# Run both unit and E2E tests
npm run test:all
```

---

## Test Structure

```
tests/
├── setup.ts              # Test configuration & mocks
├── components/           # Component tests
│   └── Button.test.tsx
├── utils/                # Utility function tests
│   └── cart.test.ts
└── e2e/                  # End-to-end tests
    └── homepage.spec.ts
```

---

## Writing Tests

### Component Test Example

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MyComponent } from '@/components/MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### Utility Function Test Example

```typescript
import { describe, it, expect } from 'vitest'
import { calculateTotal } from '@/lib/utils/cart'

describe('calculateTotal', () => {
  it('calculates correct total', () => {
    const result = calculateTotal(100, 10)
    expect(result).toBe(110)
  })
})
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test'

test('user can place an order', async ({ page }) => {
  await page.goto('/menu')
  await page.click('text=Add to Cart')
  await page.goto('/cart')
  await expect(page.locator('.cart-item')).toBeVisible()
})
```

---

## Mock Configuration

All Supabase database calls are automatically mocked in `tests/setup.ts`:

- ✅ `supabase.from()` - Mocked database queries
- ✅ `supabase.auth` - Mocked authentication
- ✅ `supabase.storage` - Mocked file uploads
- ✅ Next.js router - Mocked navigation

**This ensures tests NEVER touch your production database!**

---

## Test Coverage

Generate coverage reports:

```bash
npm run test:coverage
```

Coverage report will be available at:
- Terminal output (text format)
- `coverage/index.html` (HTML format)

---

## Best Practices

### ✅ DO:
- Write tests for all critical user flows
- Test edge cases and error states
- Keep tests simple and focused
- Use descriptive test names
- Mock external dependencies
- Test responsive layouts

### ❌ DON'T:
- Test implementation details
- Write flaky tests
- Skip error handling tests
- Test third-party libraries
- Use real database in tests
- Hardcode test data

---

## CI/CD Integration

Tests can run in GitHub Actions:

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test -- --run
      - run: npx playwright install
      - run: npm run test:e2e
```

---

## Troubleshooting

### Tests hanging or timing out

Check that mocks are properly configured in `tests/setup.ts`

### Import errors

Verify path aliases in `vitest.config.ts` match `tsconfig.json`

### Playwright browser not found

Run: `npx playwright install`

### Coverage not generating

Install coverage provider: `npm install -D @vitest/coverage-v8`

---

## Next Steps - Phase 12 Checklist

- [x] Setup Vitest
- [x] Setup React Testing Library  
- [x] Setup Playwright
- [x] Configure test mocks (database safe!)
- [ ] Create unit tests for utilities
- [ ] Test cart calculations
- [ ] Test authentication flows
- [ ] Test checkout process
- [ ] Test admin dashboard
- [ ] Run E2E browser tests
- [ ] Fix any failing tests
- [ ] Test responsive layouts
- [ ] Achieve 80%+ coverage

---

## Safety Reminder

**🛡️ ALL TESTS USE MOCKS - YOUR DATABASE IS SAFE!**

Tests never connect to your real Supabase instance. All database calls are intercepted and mocked in the test setup file.

If you ever need to test against a real database, create a separate test database and configure it explicitly - but the default setup protects your production data!
