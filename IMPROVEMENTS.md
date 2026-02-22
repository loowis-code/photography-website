# Photography Website — Improvement Plan

Ordered by effort/impact ratio (best bang for buck first).

## Scores

| Area                   | Score | Notes                                                        |
| ---------------------- | ----- | ------------------------------------------------------------ |
| Architecture           | 8/10  | Clean file-based routing, good separation of concerns        |
| TypeScript             | 8/10  | Strict mode, well-defined types, minimal `any`               |
| CSS/Styling            | 7.5/10 | Consistent CSS Modules, hardcoded colors, limited breakpoints |
| Performance            | 6/10  | No image optimisation, inefficient queries, no lazy loading  |
| Security               | 6/10  | Auth guard solid, missing upload validation and sanitisation  |
| SEO                    | 5/10  | Basic meta/OG tags, no sitemap or structured data            |
| Accessibility          | 5/10  | Some alt text, missing focus states and keyboard nav         |
| Error Handling         | 3/10  | No try/catch, no error boundaries, `alert()` for feedback    |
| CI/CD                  | 3/10  | Dependabot only, no CI pipeline, empty Husky hooks           |
| Testing                | 0/10  | No tests                                                     |

---

## Tier 1 — Low Effort, High Impact

### 1. Add try/catch to all server functions
- **Files:** `src/lib/server/admin-images.ts`, `admin-collections.ts`, `images.ts`, `collections.ts`, `search.ts`
- **Why:** Any DB or R2 failure currently crashes with an unhandled error. Wrapping handlers and returning structured errors is straightforward.
- **Effort:** ~2 hrs

### 2. Add `loading="lazy"` to images below the fold
- **Files:** `src/components/ImageModal/ImageModal.tsx`, collection/gallery views
- **Why:** Free performance win for image-heavy pages.
- **Effort:** ~30 min

### 3. Replace `<div onClick>` with `<button>` for Film/Digital toggle
- **File:** `src/routes/index.tsx:41-60`
- **Why:** Currently not keyboard-accessible. Buttons get focus, Enter/Space, and screen reader semantics for free.
- **Effort:** ~30 min

### 4. Add file upload size validation
- **File:** `src/lib/r2.ts`
- **Why:** Currently accepts any size base64 payload. Add a max size check on the buffer before uploading.
- **Effort:** ~30 min

### 5. Add env var validation at startup
- **File:** New check in `src/lib/db.ts`, `src/lib/r2.ts`, `src/lib/auth.ts`
- **Why:** Fail fast with a clear message instead of cryptic runtime errors when a var is missing.
- **Effort:** ~30 min

### 6. Create CSS custom properties for colours
- **Files:** `src/styles/globals.css` + CSS modules that hardcode hex values
- **Why:** Eliminates scattered magic values, makes future theming easy.
- **Effort:** ~1 hr

### 7. Update patch-level dependencies
- **Why:** React 19.0.0 → 19.2.x, TypeScript, TanStack minor bumps. Low risk, picks up bug fixes.
- **Effort:** ~30 min

---

## Tier 2 — Medium Effort, High Impact

### 8. Add GitHub Actions CI pipeline
- **File:** `.github/workflows/ci.yml`
- **What:** Lint, type-check (`tsc --noEmit`), and build on PRs.
- **Why:** Catches regressions before merge. No tests to run yet, but the infrastructure is ready when they exist.
- **Effort:** ~2 hrs

### 9. Add React Error Boundaries
- **Files:** New component wrapping routes in `src/routes/__root.tsx`
- **Why:** Rendering errors currently white-screen the app. An error boundary can show a fallback UI.
- **Effort:** ~2 hrs

### 10. Replace `alert()` with inline form feedback
- **Files:** `src/routes/admin/new/image.tsx`, `new/collection.tsx`, `edit/image/$id.tsx`, `edit/collection/$id.tsx`
- **Why:** `alert()` blocks the thread and looks broken. Inline success/error messages are a better UX.
- **Effort:** ~3 hrs

### 11. Optimise `getCollectionWithImages` queries
- **File:** `src/lib/server/collections.ts:12-54`
- **Why:** Currently fetches ALL images, ALL cameras, and ALL films then filters in memory. Should query only the images in the collection with a JOIN.
- **Effort:** ~2 hrs

### 12. Activate Husky pre-commit hooks
- **Files:** `.husky/pre-commit`, `package.json` (add `lint-staged`)
- **Why:** Husky is installed but no hooks exist. Run lint + type-check on staged files before commit.
- **Effort:** ~1 hr

### 13. Add ARIA roles to image modals
- **Files:** `src/components/ImageModal/ModalContent/ModalContent.tsx`
- **Why:** Modals need `role="dialog"`, `aria-modal="true"`, focus trapping, and Escape-to-close.
- **Effort:** ~3 hrs

### 14. Add `sitemap.xml` and `robots.txt`
- **Why:** Currently invisible to search engines beyond what they can crawl. A sitemap ensures all image and collection pages are indexed.
- **Effort:** ~3 hrs

---

## Tier 3 — Medium Effort, Medium Impact

### 15. Add responsive images with `srcset`
- **Files:** `src/components/ImageModal/ImageModal.tsx`, `ImagePage/ImagePage.tsx`
- **Why:** Serving full-resolution images to mobile wastes bandwidth. Requires generating thumbnails (see #22).
- **Effort:** ~4 hrs (excluding thumbnail generation)

### 16. Server-side pagination for `/all-images`
- **File:** `src/lib/server/images.ts`, `src/routes/all-images.tsx`
- **Why:** Currently loads every visible image into memory on each page load. Fine for now, becomes a problem as the library grows.
- **Effort:** ~3 hrs

### 17. Add canonical tags to all pages
- **Files:** Route `head()` functions across `src/routes/`
- **Why:** Prevents duplicate content issues in search engines.
- **Effort:** ~1 hr

### 18. Add structured data (JSON-LD)
- **Files:** `src/routes/images/$id.tsx`, `src/routes/collections/$id.tsx`
- **Why:** `ImageObject` and `ImageGallery` schemas improve search appearance.
- **Effort:** ~3 hrs

### 19. Add more responsive breakpoints
- **Files:** CSS modules throughout `src/styles/` and `src/components/`
- **Why:** Currently only one breakpoint at 1320px. Tablet and small mobile need attention.
- **Effort:** ~4 hrs

### 20. Add OG tags to collection pages
- **File:** `src/routes/collection/$id.tsx`
- **Why:** Collection pages have no social sharing metadata.
- **Effort:** ~1 hr

---

## Tier 4 — High Effort, High Impact

### 21. Add test suite (Vitest)
- **What:** Unit tests for server functions, component rendering tests.
- **Why:** Zero tests currently. Start with server functions (auth, CRUD, R2 upload) as they carry the most risk.
- **Effort:** ~1-2 days

### 22. Image optimisation pipeline
- **What:** Generate WebP/AVIF variants and multiple sizes on upload. Serve via Cloudflare image transforms or pre-generate thumbnails to R2.
- **Why:** Largest performance win for an image-heavy site.
- **Effort:** ~1-2 days

### 23. Add E2E tests (Playwright)
- **What:** Auth flow, image upload, CRUD operations, search.
- **Why:** Catches integration issues that unit tests miss.
- **Effort:** ~2-3 days

### 24. Remove `next` transitive dependency
- **What:** `loowis-component-library` pulls in `next@15.5.7`, which causes 6 of the 7 npm audit vulnerabilities. Update or refactor the component library to remove the Next.js dependency.
- **Why:** Clears audit warnings and reduces bundle weight.
- **Effort:** Depends on component library scope

---

## Tier 5 — Low Priority

### 25. Add auto-deploy workflow
- **File:** `.github/workflows/deploy.yml`
- **What:** Deploy to Cloudflare Workers on merge to main.
- **Effort:** ~2 hrs

### 26. Error logging integration
- **What:** Sentry or similar. `.sentryclirc` already exists in the project.
- **Effort:** ~2 hrs

### 27. Add visible focus states to all interactive elements
- **Files:** CSS modules throughout
- **Effort:** ~2 hrs

### 28. Document infrastructure setup in README
- **What:** Neon DB setup, R2 bucket creation, GitHub OAuth app, Cloudflare Workers config.
- **Effort:** ~2 hrs
