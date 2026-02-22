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

- [x] **1. Add try/catch to all server functions** (~2 hrs) — `src/lib/server/admin-images.ts`, `admin-collections.ts`, `images.ts`, `collections.ts`, `search.ts`, `reference.ts`
- ~~**2. Add `loading="lazy"` to images below the fold**~~ — Cancelled: CSS columns layout prevents effective lazy loading, and switching to CSS Grid creates visual gaps
- [ ] **3. Replace `<div onClick>` with `<button>` for Film/Digital toggle** (~30 min) — `src/routes/index.tsx:41-60`
- [ ] **4. Add file upload size validation** (~30 min) — `src/lib/r2.ts`
- [ ] **5. Add env var validation at startup** (~30 min) — `src/lib/db.ts`, `src/lib/r2.ts`, `src/lib/auth.ts`
- [ ] **6. Create CSS custom properties for colours** (~1 hr) — `src/styles/globals.css` + CSS modules
- [ ] **7. Update patch-level dependencies** (~30 min) — React 19.0.0 → 19.2.x, TypeScript, TanStack minor bumps

---

## Tier 2 — Medium Effort, High Impact

- [ ] **8. Add GitHub Actions CI pipeline** (~2 hrs) — `.github/workflows/ci.yml`
- [ ] **9. Add React Error Boundaries** (~2 hrs) — `src/routes/__root.tsx`
- [ ] **10. Replace `alert()` with inline form feedback** (~3 hrs) — Admin route files
- [ ] **11. Optimise `getCollectionWithImages` queries** (~2 hrs) — `src/lib/server/collections.ts:12-54`
- [ ] **12. Activate Husky pre-commit hooks** (~1 hr) — `.husky/pre-commit`, `package.json`
- [ ] **13. Add ARIA roles to image modals** (~3 hrs) — `src/components/ImageModal/ModalContent/ModalContent.tsx`
- [ ] **14. Add `sitemap.xml` and `robots.txt`** (~3 hrs)

---

## Tier 3 — Medium Effort, Medium Impact

- [ ] **15. Add responsive images with `srcset`** (~4 hrs) — `src/components/ImageModal/ImageModal.tsx`, `ImagePage/ImagePage.tsx`
- [ ] **16. Server-side pagination for `/all-images` and `/collection/$id`** (~4 hrs) — `src/lib/server/images.ts`, `src/lib/server/collections.ts`, `src/routes/all-images.tsx`, `src/routes/collection/$id.tsx`
- [ ] **17. Add canonical tags to all pages** (~1 hr) — Route `head()` functions
- [ ] **18. Add structured data (JSON-LD)** (~3 hrs) — `src/routes/images/$id.tsx`, `src/routes/collections/$id.tsx`
- [ ] **19. Add more responsive breakpoints** (~4 hrs) — CSS modules throughout
- [ ] **20. Add OG tags to collection pages** (~1 hr) — `src/routes/collection/$id.tsx`

---

## Tier 4 — High Effort, High Impact

- [ ] **21. Add test suite (Vitest)** (~1-2 days) — Server function unit tests, component rendering tests
- [ ] **22. Image optimisation pipeline** (~1-2 days) — WebP/AVIF variants, multiple sizes on upload
- [ ] **23. Add E2E tests (Playwright)** (~2-3 days) — Auth flow, image upload, CRUD, search
- [ ] **24. Remove `next` transitive dependency** (varies) — `loowis-component-library` pulls in `next@15.5.7`

---

## Tier 5 — Low Priority

- [ ] **25. Add auto-deploy workflow** (~2 hrs) — `.github/workflows/deploy.yml`
- [ ] **26. Error logging integration** (~2 hrs) — Sentry or similar
- [ ] **27. Add visible focus states to all interactive elements** (~2 hrs) — CSS modules throughout
- [ ] **28. Document infrastructure setup in README** (~2 hrs) — Neon DB, R2, OAuth, Cloudflare setup
