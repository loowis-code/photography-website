import { test, expect } from '@playwright/test'

// 1x1 transparent PNG to replace production images
const PLACEHOLDER_PNG = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64',
)

test.beforeEach(async ({ page }) => {
    await page.route('**/images.loowis.co.uk/**', (route) =>
        route.fulfill({
            contentType: 'image/png',
            body: PLACEHOLDER_PNG,
        }),
    )
})

test.describe('Admin Dashboard', () => {
    test('loads and shows Edit Images heading', async ({ page }) => {
        await page.goto('/admin')
        await expect(
            page.getByRole('heading', { name: 'Edit Images' }),
        ).toBeVisible()
    })

    test('displays image grid with titles', async ({ page }) => {
        await page.goto('/admin')
        const images = page.locator('img')
        await expect(images.first()).toBeVisible()
    })

    test('image links navigate to edit page', async ({ page }) => {
        await page.goto('/admin')
        const editLink = page.locator('a[href*="/admin/edit/image/"]').first()
        await editLink.click()
        await expect(page).toHaveURL(/\/admin\/edit\/image\/[a-z0-9-]+/)
    })
})

test.describe('Admin Navbar', () => {
    test('all navigation links are present', async ({ page }) => {
        await page.goto('/admin')
        await expect(
            page.getByRole('link', { name: 'Edit Images' }),
        ).toBeVisible()
        await expect(
            page.getByRole('link', { name: 'Upload New Image' }),
        ).toBeVisible()
        await expect(
            page.getByRole('link', { name: 'Create New Collection' }),
        ).toBeVisible()
        await expect(
            page.getByRole('link', { name: 'Edit Collections' }),
        ).toBeVisible()
        await expect(page.getByRole('link', { name: 'Sign Out' })).toBeVisible()
    })

    test('Upload New Image link navigates correctly', async ({ page }) => {
        await page.goto('/admin')
        await page.getByRole('link', { name: 'Upload New Image' }).click()
        await expect(page).toHaveURL('/admin/new/image')
    })

    test('Create New Collection link navigates correctly', async ({ page }) => {
        await page.goto('/admin')
        await page.getByRole('link', { name: 'Create New Collection' }).click()
        await expect(page).toHaveURL('/admin/new/collection')
    })

    test('Edit Collections link navigates correctly', async ({ page }) => {
        await page.goto('/admin')
        await page.getByRole('link', { name: 'Edit Collections' }).click()
        await expect(page).toHaveURL('/admin/edit/collection')
    })
})

test.describe('New Image Form', () => {
    test('renders form with required fields', async ({ page }) => {
        await page.goto('/admin/new/image')
        await expect(page.getByLabel(/title/i)).toBeVisible()
        await expect(page.getByLabel(/description/i)).toBeVisible()
    })
})

test.describe('New Collection Form', () => {
    test('renders form', async ({ page }) => {
        await page.goto('/admin/new/collection')
        await expect(
            page.getByRole('heading', { name: 'Create New Collection' }),
        ).toBeVisible()
        await expect(page.locator('input[name="name"]')).toBeVisible()
    })
})
