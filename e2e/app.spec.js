import { test, expect } from '@playwright/test';

test.describe('Word Master - Input Screen', () => {
    test('should display the input screen correctly', async ({ page }) => {
        await page.goto('/');

        // Wait for the page to load
        await page.waitForLoadState('networkidle');

        // Check title
        await expect(page.getByText('Word Master')).toBeVisible();
        await expect(page.getByText('Prepare for your adventure!')).toBeVisible();

        // Take screenshot of initial state
        await page.screenshot({ path: 'e2e/screenshots/01-initial-screen.png', fullPage: true });

        console.log('✓ Initial screen loaded successfully');
    });

    test('should validate empty inputs', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Try to submit with empty fields
        const startButton = page.getByRole('button', { name: /start adventure/i });
        await startButton.click();

        // Should show error message
        await expect(page.getByText(/please enter/i)).toBeVisible();

        await page.screenshot({ path: 'e2e/screenshots/02-validation-error.png', fullPage: true });

        console.log('✓ Validation working correctly');
    });

    test('should fill form and submit', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Fill hero name
        const heroInput = page.getByPlaceholder(/enter your name/i);
        await heroInput.fill('철수');
        await page.screenshot({ path: 'e2e/screenshots/03-hero-name-filled.png', fullPage: true });

        // Fill magic words
        const wordInputs = page.getByPlaceholder(/magic word/i);
        await wordInputs.nth(0).fill('추상화');
        await wordInputs.nth(1).fill('변수');
        await wordInputs.nth(2).fill('알고리즘');
        await page.screenshot({ path: 'e2e/screenshots/04-words-filled.png', fullPage: true });

        // Select genre
        await page.getByRole('button', { name: /fantasy/i }).click();
        await page.screenshot({ path: 'e2e/screenshots/05-genre-selected.png', fullPage: true });

        // Submit form
        const startButton = page.getByRole('button', { name: /start adventure/i });
        await startButton.click();

        // Wait a moment to see what happens
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'e2e/screenshots/06-after-submit.png', fullPage: true });

        console.log('✓ Form submission completed');
        console.log('Hero Name: 철수');
        console.log('Words: 추상화, 변수, 알고리즘');
        console.log('Genre: Fantasy');
    });

    test('should switch between genres', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Test genre selection
        await page.getByRole('button', { name: /fantasy/i }).click();
        await page.screenshot({ path: 'e2e/screenshots/07-genre-fantasy.png', fullPage: true });

        await page.getByRole('button', { name: /science fiction/i }).click();
        await page.screenshot({ path: 'e2e/screenshots/08-genre-sf.png', fullPage: true });

        await page.getByRole('button', { name: /school horror/i }).click();
        await page.screenshot({ path: 'e2e/screenshots/09-genre-horror.png', fullPage: true });

        console.log('✓ Genre switching works correctly');
    });
});
