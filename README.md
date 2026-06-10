# Circle Waifu

Circle Waifu is a Farcaster Mini App prototype for Circles users. A retro research-assistant waifu gives the user one useful onchain mission per day, tracks verification, advances streak state, and grants weekly pool tickets.

The repository is a full-stack TypeScript app built with **TanStack Start**, **React 19**, **Effect**, **Bun**, **Tailwind CSS 4**, and the **Farcaster Mini App SDK**.

## What This Repo Contains

- **Farcaster Mini App shell** — the home route renders a single-screen lab console and calls `sdk.actions.ready()` when app data is ready.
- **Circle Waifu domain model** — typed schemas for users, missions, waifu state, streaks, activity, share payloads, and weekly pools.
- **Effect application layer** — mission preparation, mission verification, pool entry/status, waifu profile updates, auth verification, and notifications are modeled as Effect workflows.
- **Type-safe HTTP and RPC contracts** — domain endpoints are defined with `effect/unstable/httpapi` and `effect/unstable/rpc`.
- **Postgres-shaped persistence** — repository adapter supports `DATABASE_URL` Postgres or local PGlite fallback through Drizzle.
- **Design-system-driven UI** — reusable primitives/components are registered in `src/design-system/registry.ts`, including the orbit-stage waifu layout.
- **Observability hooks** — Sentry, PostHog, OpenTelemetry, Loki, Tempo, Prometheus, Grafana, and Pyroscope wiring remain available from the starter foundation.

## Product Loop

1. User opens the Farcaster Mini App.
2. The app loads the lab dashboard snapshot.
3. Waifu presents the daily Circles mission.
4. User prepares or completes the mission.
5. The app verifies a transaction hash or indexed event boundary.
6. A verified mission updates streak, waifu progress, activity, and weekly pool tickets.
7. User can share the result back to Farcaster.

See [`SPEC.md`](./SPEC.md) for the product specification.

## Tech Stack

| Area                    | Tools                                                    |
| ----------------------- | -------------------------------------------------------- |
| Runtime/package manager | Bun                                                      |
| App framework           | TanStack Start, TanStack Router, Nitro                   |
| UI                      | React 19, Tailwind CSS 4                                 |
| Domain/runtime          | Effect, Effect Schema, Effect Layer                      |
| State                   | `effect/unstable/reactivity`, `@effect/atom-react`       |
| API                     | `effect/unstable/httpapi`, `effect/unstable/rpc`         |
| Database                | Drizzle ORM, Postgres, PGlite                            |
| Mini App                | `@farcaster/miniapp-sdk`                                 |
| Quality                 | Vitest, Playwright browser tests, Oxlint, dprint, tsgo   |
| Observability           | Sentry, PostHog, OpenTelemetry, Grafana stack, Pyroscope |

## Quick Start

```bash
bun install
cp .env.example .env
bun run dev
```

Open <http://localhost:3000>.

Install browser dependencies before running browser/component tests:

```bash
bunx playwright install --with-deps
```

Optional Nix shell:

```bash
nix develop
```

## Environment

Important local variables are documented in [`.env.example`](./.env.example).

- `DATABASE_URL` — when set, the app uses Postgres; otherwise it uses local in-memory PGlite.
- `VITE_POSTHOG_KEY`, `VITE_POSTHOG_HOST`, `POSTHOG_API_KEY`, `POSTHOG_HOST` — analytics.
- `SENTRY_DSN`, `VITE_SENTRY_DSN` — error tracking.
- `OTLP_ENDPOINT`, `LOKI_ENDPOINT`, `LOKI_OTLP_ENDPOINT`, `PYROSCOPE_SERVER_ADDRESS` — telemetry/profiling.

## Project Structure

```text
circle-waifu/
├── SPEC.md                         # Product specification
├── src/
│   ├── api/                        # Circle Waifu schemas, HTTP API, RPC API
│   ├── db/                         # Drizzle schema and repository adapter
│   ├── design-system/              # Registered UI primitives/components
│   ├── features/
│   │   ├── daily-lab/              # Mission orchestration, projections, events
│   │   ├── waifu/                  # Waifu domain projections/events
│   │   └── weekly-pool/            # Weekly pool projections/events
│   ├── lib/                        # Hydration, atoms, telemetry, analytics helpers
│   └── routes/                     # TanStack Start routes and API runtime wiring
├── docs/
│   ├── architecture/               # Effect/native atoms and architecture patterns
│   ├── design-system/              # UI rules
│   └── guides/                     # Setup, testing, DB, observability, quality
├── AGENTS.md                       # Contributor/agent workflow index
└── package.json                    # Scripts and dependencies
```

## Key Files

- [`src/routes/index.tsx`](./src/routes/index.tsx) — SSR route loader and atom hydration for the app shell.
- [`src/routes/-index/app.tsx`](./src/routes/-index/app.tsx) — Farcaster Mini App UI entry point.
- [`src/api/circle-waifu-schema.ts`](./src/api/circle-waifu-schema.ts) — domain schemas and branded types.
- [`src/features/daily-lab/application.ts`](./src/features/daily-lab/application.ts) — Circle Waifu use cases.
- [`src/features/daily-lab/projections.ts`](./src/features/daily-lab/projections.ts) — pure dashboard/pool derivation.
- [`src/db/circle-waifu-repository.ts`](./src/db/circle-waifu-repository.ts) — Postgres/PGlite repository.
- [`src/design-system/primitives/OrbitStage.tsx`](./src/design-system/primitives/OrbitStage.tsx) — current single-screen waifu layout.

## Scripts

```bash
bun run dev                 # Start development server
bun run build               # Build for production
bun run preview             # Preview production build

bun run typecheck           # TypeScript via tsgo
bun run lint                # Oxlint
bun run lint:type-aware     # Type-aware Oxlint
bun run lint:design-system  # Enforce design-system registry rules
bun run format              # Format with dprint
bun run format:check        # Check formatting

bun run test                # Vitest suite
bun run test:unit           # Unit tests
bun run test:component      # Browser component tests
bun run test:browser        # Chromium browser tests
bun run test:visual         # Visual regression tests
bun run test:coverage       # Coverage suite

bun run validate            # Full repository validation
```

## Documentation

Start with:

- [`SPEC.md`](./SPEC.md) — product behavior and MVP scope.
- [`AGENTS.md`](./AGENTS.md) — contributor workflow and repository rules.
- [`docs/architecture/effect-native-atoms.md`](./docs/architecture/effect-native-atoms.md) — required state-management pattern.
- [`docs/architecture/effect-simple-made-easy-mapping.md`](./docs/architecture/effect-simple-made-easy-mapping.md) — feature architecture mapping.
- [`docs/design-system/rules.md`](./docs/design-system/rules.md) — UI/design-system rules.
- [`docs/guides/testing.md`](./docs/guides/testing.md) — testing expectations.

## Observability Stack

The app can connect to the LAOS/self-hosted observability stack used by the starter foundation.

```bash
git clone https://github.com/dtechvision/laos.git ../laos
cd ../laos
docker compose up -d
```

Then copy `.env.example` to `.env` and fill Sentry, PostHog, OTLP, Loki, and Pyroscope values as needed.

## Current Status

Circle Waifu is an MVP/prototype implementation. The repo has the domain contracts, application workflows, persistence adapter, SSR hydration, Farcaster app shell, and current waifu UI. Some external integrations are intentionally boundary-shaped and still need production credentials, real Farcaster identity verification, and live Circles event verification before launch.
