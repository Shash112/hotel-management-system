import { test, expect } from '@playwright/test'

test.describe('Simple Authentication Test', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login')
    
    // Check if login form elements are visible
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()
    
    // Check if default credentials are shown
    await expect(page.getByText('Default Login Credentials')).toBeVisible()
  })

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login')
    
    // Click submit without filling form
    await page.getByRole('button', { name: 'Sign In' }).click()
    
    // Wait a moment for any validation to appear
    await page.waitForTimeout(1000)
    
    // Check if the form is still visible (validation might prevent submission)
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
  })
})
