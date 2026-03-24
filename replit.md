# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   └── api-server/         # Express API server
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers; `src/routes/health.ts` exposes `GET /health` (full path: `/api/health`)
- Depends on: `@workspace/db`, `@workspace/api-zod`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.cjs`)
- Build bundles an allowlist of deps (express, cors, pg, drizzle-orm, zod, etc.) and externalizes the rest

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports schema
- `src/schema/index.ts` — barrel re-export of all models
- `src/schema/<modelname>.ts` — table definitions with `drizzle-zod` insert schemas (no models definitions exist right now)
- `drizzle.config.ts` — Drizzle Kit config (requires `DATABASE_URL`, automatically provided by Replit)
- Exports: `.` (pool, db, schema), `./schema` (schema only)

Production migrations are handled by Replit when publishing. In development, we just use `pnpm --filter @workspace/db run push`, and we fallback to `pnpm --filter @workspace/db run push-force`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`). Running codegen produces output into two sibling packages:

1. `lib/api-client-react/src/generated/` — React Query hooks + fetch client
2. `lib/api-zod/src/generated/` — Zod schemas

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec (e.g. `HealthCheckResponse`). Used by `api-server` for response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec (e.g. `useHealthCheck`, `healthCheck`).

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`. Run scripts via `pnpm --filter @workspace/scripts run <script>`. Scripts can import any workspace package (e.g., `@workspace/db`) by adding it as a dependency in `scripts/package.json`.

### `artifacts/maher-zari` (`@workspace/maher-zari`)

Expo React Native mobile app for **Maher Zarai Markaz** — a pesticide/agricultural shop in Rawalpindi. Replaces DigiKhata with offline-first functionality.

- **Platform**: Android APK (direct install, no Play Store). Web preview available for development.
- **Auth**: 6-digit PIN login (Admin PIN: 000000, Viewer PIN: 111111) + fingerprint biometric
- **Roles**: Admin (full CRUD access), Viewer (read-only)
- **Database**: expo-sqlite (SQLite) for offline-first storage. On web preview, uses in-memory mock data from seed arrays.
- **Theme**: Primary Orange #FF6B35, Red #E53935, Green #2E7D32, Background #F5F5F5
- **Navigation**: 5 tabs — Khata (customer ledger), Stock (inventory), Bills, Scanner (AI notebook), More (settings/reports)

#### Key Files
- `app/_layout.tsx` — Root layout with DB init, AuthProvider, navigation stack
- `app/login.tsx` — 6-digit PIN login screen
- `app/index.tsx` — Auth redirect (login or tabs)
- `app/(tabs)/_layout.tsx` — 5-tab navigation
- `contexts/AuthContext.tsx` — Authentication context (admin/viewer roles, PIN/biometric)
- `database/index.ts` — All SQLite CRUD operations + web fallback with in-memory data
- `database/schema.ts` — Table CREATE statements (customers, products, transactions, bills, stock_entries, settings)
- `data/customers.ts` — 119 seeded customers from DigiKhata export
- `data/products.ts` — 170+ seeded products from DigiKhata All Items export
- `constants/colors.ts` — Color palette
- `constants/theme.ts` — Typography, spacing, shadows

#### Seed Data
- 119 customers imported from DigiKhata PDF (with opening balances)
- 170+ products imported from DigiKhata All Items PDF (with current stock levels)
- Total receivable: ~Rs 2.4M across customers
- 1 supplier: Ahmad Khan Lalian (Rs 14,967 payable)

#### Phase Status
- **Phase 1 (Foundation)**: COMPLETE — PIN login, 5-tab navigation, database layer, seed data, all screens built
- **Phase 2 (Full Khata)**: PENDING — Full transaction history, bill generation, WhatsApp sharing, PDF export
- **Phase 3 (AI Scanner)**: PENDING — Gemini 1.5 Flash Urdu handwriting recognition
- **Phase 4 (Backup)**: PENDING — Google Drive automatic backup
