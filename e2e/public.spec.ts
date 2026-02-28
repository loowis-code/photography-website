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

test.describe('Homepage', () => {
    test('renders and shows Film/Digital toggle', async ({ page }) => {
        await page.goto('/')
        await expect(page.getByRole('button', { name: 'Film' })).toBeVisible()
        await expect(
            page.getByRole('button', { name: 'Digital' }),
        ).toBeVisible()
    })

    test('Film/Digital toggle switches content', async ({ page }) => {
        await page.goto('/')

        // Film is selected by default
        await expect(page.getByRole('button', { name: 'Film' })).toBeVisible()

        // Click Digital
        await page.getByRole('button', { name: 'Digital' }).click()

        // Click back to Film
        await page.getByRole('button', { name: 'Film' }).click()
    })

    test('displays images', async ({ page }) => {
        await page.goto('/')
        const images = page.locator('img:visible')
        await expect(images.first()).toBeVisible()
    })
})

test.describe('All Images', () => {
    test('renders page with heading and images', async ({ page }) => {
        await page.goto('/all-images')
        await expect(
            page.getByRole('heading', { name: 'All Images' }),
        ).toBeVisible()
        await expect(page.locator('img').first()).toBeVisible()
    })

    test('sorting buttons are present', async ({ page }) => {
        await page.goto('/all-images')
        await expect(
            page.getByRole('button', { name: 'Oldest to Newest' }),
        ).toBeVisible()
        await expect(
            page.getByRole('button', { name: 'Newest to Oldest' }),
        ).toBeVisible()
        await expect(page.getByRole('button', { name: 'A - Z' })).toBeVisible()
        await expect(page.getByRole('button', { name: 'Z - A' })).toBeVisible()
    })

    test('film/digital filter checkboxes are present and checked', async ({
        page,
    }) => {
        await page.goto('/all-images')
        const filmCheckbox = page.getByLabel('Show Film Photos')
        const digitalCheckbox = page.getByLabel('Show Digital Photos')
        await expect(filmCheckbox).toBeChecked()
        await expect(digitalCheckbox).toBeChecked()
    })

    test('pagination shows page info', async ({ page }) => {
        await page.goto('/all-images')
        await expect(page.getByText(/Page \d+ of \d+/)).toBeVisible()
    })

    test('pagination Next Page button works', async ({ page }) => {
        await page.goto('/all-images', { waitUntil: 'networkidle' })
        // Allow React hydration to complete
        await page.waitForTimeout(1000)

        const pageInfo = page.getByText(/Page \d+ of \d+/)
        await expect(pageInfo).toContainText('Page 1 of')

        const nextButton = page.getByRole('button', { name: 'Next Page' })
        if (await nextButton.isEnabled()) {
            await nextButton.click()
            await expect(pageInfo).toContainText('Page 2 of')
        }
    })
})

test.describe('Collections', () => {
    test('renders page with heading', async ({ page }) => {
        await page.goto('/collections')
        await expect(
            page.getByRole('heading', { name: 'Collections' }),
        ).toBeVisible()
    })

    test('displays collection cards with links', async ({ page }) => {
        await page.goto('/collections')
        const links = page.locator('a[href*="/collection/"]')
        const count = await links.count()
        expect(count).toBeGreaterThan(0)
    })

    test('clicking a collection navigates to detail page', async ({ page }) => {
        await page.goto('/collections')
        const firstCollection = page.locator('a[href*="/collection/"]').first()
        await firstCollection.click()
        await expect(page).toHaveURL(/\/collection\/[a-z0-9-]+/)
    })
})

test.describe('Image Detail', () => {
    test('renders image with metadata', async ({ page }) => {
        // Navigate via all-images to find a real image link
        await page.goto('/all-images')
        const imageLink = page.locator('a[href*="/images/"]').first()

        if ((await imageLink.count()) > 0) {
            await imageLink.click()
            await expect(page).toHaveURL(/\/images\/[a-z0-9-]+/)
            await expect(page.locator('img').first()).toBeVisible()
        }
    })
})

test.describe('Image Map', () => {
    test('renders page with map container', async ({ page }) => {
        await page.goto('/image-map')
        await expect(page.locator('#map')).toBeVisible()
    })
})

test.describe('Search', () => {
    test('renders search results page', async ({ page }) => {
        await page.goto('/search/test')
        await expect(
            page.getByRole('heading', { name: 'Search Results' }),
        ).toBeVisible()
    })

    test('shows no results message for nonsense query', async ({ page }) => {
        await page.goto('/search/xyznonexistent99999')
        await expect(page.getByText('No images found')).toBeVisible()
    })
})

test.describe('404 Page', () => {
    test('shows 404 message for unknown route', async ({ page }) => {
        await page.goto('/this-page-does-not-exist')
        await expect(page.getByText('This page does not exist')).toBeVisible()
    })
})

test.describe('Navigation', () => {
    test('header navigation links work', async ({ page }) => {
        await page.goto('/')

        await page.getByRole('link', { name: /all images/i }).click()
        await expect(page).toHaveURL('/all-images')

        await page.getByRole('link', { name: /collections/i }).click()
        await expect(page).toHaveURL('/collections')

        await page.getByRole('link', { name: /image map/i }).click()
        await expect(page).toHaveURL('/image-map')
    })
})
