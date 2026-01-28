import { test, expect } from '@playwright/test';

test.describe('Design System Components', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/docs/ui');
  });

  test('selection controls use design system primitives', async ({ page }) => {
    // Switch
    const switchControl = page.getByTestId('ds-switch').getByRole('switch');
    await expect(switchControl).toBeVisible();
    await expect(switchControl).toHaveCSS('width', '56px');
    await expect(switchControl).toHaveCSS('height', '32px');

    // Checkbox
    const checkboxControl = page.getByTestId('ds-checkbox');
    await expect(checkboxControl).toBeVisible();
    await expect(checkboxControl.locator('span').first()).toHaveCSS('width', '16px');
    await expect(checkboxControl.locator('span').first()).toHaveCSS('height', '16px');

    // Radio group
    const radioGroup = page.getByTestId('ds-radio');
    await expect(radioGroup).toBeVisible();
    const radioOption = radioGroup.getByRole('radio').first();
    await expect(radioOption).toBeVisible();
    await expect(radioOption.locator('span').first()).toHaveCSS('width', '16px');
    await expect(radioOption.locator('span').first()).toHaveCSS('height', '16px');
  });

  test('select component chevron rotates when open', async ({ page }) => {
    // Closed select - chevron should not be rotated
    const closedSelect = page.getByTestId('ds-select-closed');
    await expect(closedSelect).toBeVisible();
    await expect(page.getByTestId('ds-select-closed-chevron')).not.toHaveClass(/rotate-180/);

    // Open select - chevron should be rotated
    const openSelect = page.getByTestId('ds-select-open');
    await expect(openSelect).toBeVisible();
    await expect(page.getByTestId('ds-select-open-chevron')).toHaveClass(/rotate-180/);
  });

  test('card component uses design tokens', async ({ page }) => {
    const card = page.getByTestId('ds-card');
    await expect(card).toBeVisible();
    // Card should have border-radius from token (8px)
    await expect(card).toHaveCSS('border-radius', '8px');
  });

  test('badges use design tokens for variants', async ({ page }) => {
    const badgesContainer = page.getByTestId('ds-badges');
    await expect(badgesContainer).toBeVisible();

    // Check badge exists and has correct border-radius (pill shape)
    const neutralBadge = page.getByTestId('ds-badge-neutral');
    await expect(neutralBadge).toBeVisible();
    await expect(neutralBadge).toHaveCSS('border-radius', '999px');

    const successBadge = page.getByTestId('ds-badge-success');
    await expect(successBadge).toBeVisible();

    const warningBadge = page.getByTestId('ds-badge-warning');
    await expect(warningBadge).toBeVisible();

    const dangerBadge = page.getByTestId('ds-badge-danger');
    await expect(dangerBadge).toBeVisible();
  });

  test('banners use design tokens for variants', async ({ page }) => {
    const bannersContainer = page.getByTestId('ds-banners');
    await expect(bannersContainer).toBeVisible();

    // Check banners exist and have correct border-radius
    const infoBanner = page.getByTestId('ds-banner-info');
    await expect(infoBanner).toBeVisible();
    await expect(infoBanner).toHaveCSS('border-radius', '8px');
    await expect(infoBanner).toHaveCSS('padding', '16px');

    const warningBanner = page.getByTestId('ds-banner-warning');
    await expect(warningBanner).toBeVisible();

    const dangerBanner = page.getByTestId('ds-banner-danger');
    await expect(dangerBanner).toBeVisible();

    const successBanner = page.getByTestId('ds-banner-success');
    await expect(successBanner).toBeVisible();
  });

  test('buttons use design tokens', async ({ page }) => {
    const primaryButton = page.getByTestId('ds-button-primary');
    await expect(primaryButton).toBeVisible();
    // Button should have pill-shaped border-radius (64px)
    await expect(primaryButton).toHaveCSS('border-radius', '64px');
    // Button should have correct height (lg = 48px)
    await expect(primaryButton).toHaveCSS('height', '48px');

    const secondaryButton = page.getByTestId('ds-button-secondary');
    await expect(secondaryButton).toBeVisible();

    const tertiaryButton = page.getByTestId('ds-button-tertiary');
    await expect(tertiaryButton).toBeVisible();
  });

  test('links use design tokens', async ({ page }) => {
    const link = page.getByTestId('ds-link');
    await expect(link).toBeVisible();
    // Link should use primary color from token
    await expect(link).toHaveCSS('color', 'rgb(0, 121, 202)'); // #0079ca
  });

  test('input fields use design tokens', async ({ page }) => {
    const input = page.getByTestId('ds-input');
    await expect(input).toBeVisible();
    // Input should have correct height and border-radius from tokens
    await expect(input).toHaveCSS('height', '56px');
    await expect(input).toHaveCSS('border-radius', '8px');

    const disabledInput = page.getByTestId('ds-input-disabled');
    await expect(disabledInput).toBeVisible();
    // Disabled input should have disabled background color
    await expect(disabledInput).toHaveCSS('background-color', 'rgb(242, 243, 243)'); // #f2f3f3

    const errorInput = page.getByTestId('ds-input-error');
    await expect(errorInput).toBeVisible();
    // Error input should have danger border color
    await expect(errorInput).toHaveCSS('border-color', 'rgb(235, 0, 82)'); // #eb0052
  });

  test('table uses design tokens', async ({ page }) => {
    const tableContainer = page.getByTestId('ds-table');
    await expect(tableContainer).toBeVisible();

    // Table header should have correct background color
    const tableHead = tableContainer.locator('thead');
    await expect(tableHead).toHaveCSS('background-color', 'rgb(242, 243, 243)'); // #f2f3f3

    // Table body should have correct background color
    const tableBody = tableContainer.locator('tbody');
    await expect(tableBody).toHaveCSS('background-color', 'rgb(255, 255, 255)'); // #ffffff
  });
});
