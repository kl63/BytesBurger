import { test, expect } from '@playwright/test'

/**
 * 🛡️ E2E HOMEPAGE TESTS
 * 
 * These tests run in a real browser against localhost:3000
 * They test the actual UI without touching your production database
 */

test.describe('Homepage', () => {
  test('should display homepage correctly', async ({ page }) => {
    await page.goto('/')
    
    // Check page title
    await expect(page).toHaveTitle(/ByteBurger/i)
    
    // Check main heading exists
    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toBeVisible()
  })

  test('should have navigation menu', async ({ page }) => {
    await page.goto('/')
    
    // Check for common nav links (use .first() since there are multiple Menu links)
    const menuLink = page.getByRole('link', { name: /menu/i }).first()
    await expect(menuLink).toBeVisible()
  })

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    await expect(page.locator('body')).toBeVisible()
  })
})
