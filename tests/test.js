import { expect, test } from '@playwright/test';

// TODO: Add more integration tests

test('index page has expected text from readme', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByText('A tiny but mighty list virtualization library, with zero dependencies 💪')).toBeVisible();
});
