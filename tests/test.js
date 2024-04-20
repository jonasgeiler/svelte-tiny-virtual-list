import { expect, test } from '@playwright/test';

// TODO: Add more integration tests

test('index page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'svelte-tiny-virtual-list' })).toBeVisible();
});
