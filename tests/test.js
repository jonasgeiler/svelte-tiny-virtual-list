import { expect, test } from '@playwright/test';

// TODO: Add more integration tests
// (maybe go to the equal height example and check that item #1 exists and is
// visible and item #99999 does not exist and is not visible)

test('index page has expected text from readme', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByText('A tiny but mighty list virtualization library, with zero dependencies 💪')).toBeVisible();
});
