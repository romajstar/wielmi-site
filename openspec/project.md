# Project Context

## Purpose
Marketing site for a small company (Wielmi) offering smart home installations, electrical installations, and local
network services in Krakow. The site highlights services, showcases trust signals, and collects contact inquiries.

## Tech Stack
- Next.js 15 (App Router) with static export (`output: "export"`).
- React 18 + TypeScript (strict mode).
- Tailwind CSS for styling.
- Node.js test runner + Testing Library for UI tests.
- PostHog Cloud EU for production browser errors and always-cookieless pageviews.
- next-sitemap and next-export-optimize-images for SEO and static image optimization.

## Project Conventions

### Code Style
- TypeScript-first, functional React components, `use client` only when hooks/state are needed.
- Use `@/` path alias for imports from `src/`.
- Tailwind utility classes for styling; shared UI in `src/ui`.

### Architecture Patterns
- Next.js App Router routes in `src/app`; each top-level folder is a public page.
- Reusable sections/components live in `src/ui`, shared helpers in `src/lib`, constants in `src/constants.ts`.
- Static export build (no server-side API routes).
- SEO metadata centralized in `src/lib/meta.tsx` and `src/lib/seo.ts`.
- Images use `next-export-optimize-images` and `next-export-optimize-images/image`.

### Testing Strategy
- Node.js native test runner with `@testing-library/*` for component tests.
- `pnpm test` / `npm run test` runs the suite.

### Git Workflow
- No specific workflow documented; follow team norms for branches and commits.

## Domain Context
- Site language is Polish; content targets customers in Krakow.
- Core services: smart home systems, electrical installations, and local network setup.
- Primary conversion action is the contact form and phone contact.

## Important Constraints
- Static export only; avoid server-only features or API routes.
- Contact form submits via Web3Forms using `NEXT_PUBLIC_FORM_ACCESS_KEY`.
- PostHog is explicitly enabled at build time for production only; no browser persistence, person profiles, replay, interaction capture, or analytics consent banner.
- SEO relies on canonical URLs using `NEXT_PUBLIC_BASE_URL` and sitemap `SITE_URL`.

## External Dependencies
- Web3Forms (contact form submission).
- PostHog via `posthog-js` for browser errors/pageviews; source-map uploads are deferred. See `docs/posthog-cloud-setup.md` for project and CI configuration.
- next-sitemap for sitemap/robots generation.
