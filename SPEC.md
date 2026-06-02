# Circle Waifu: Waifu Research Lab

## Summary

Circle Waifu is a Farcaster Mini App for Circles users. A retro research-assistant waifu gives the user one useful onchain mission per day, verifies the action, advances a streak, and grants a weekly raffle ticket. Each week, eligible tickets enter a transparent CRC prize pool and a few users win.

The product combines three loops:

1. **Useful daily onchain action** — the user does something real in Circles instead of only clicking a button.
2. **Waifu companion progression** — the assistant levels up from verified activity and writes a daily lab note.
3. **Weekly low-stakes pool** — streak participation earns tickets for a capped, transparent prize draw.

The MVP should be utility-first, with pet and gambling layers as retention mechanics.

## Hackathon Positioning

Circle Garage leaderboard inspirations:

| Project        | Useful idea to steal                                                  |
| -------------- | --------------------------------------------------------------------- |
| Yield          | Simple financial action with live balance feedback.                   |
| The Kitty      | Shared CRC pots create a small working economy.                       |
| HatchLife      | Daily CRC activity can grow a cute persistent creature.               |
| Trust Cleaner  | Circles trust-graph maintenance is useful and judge-friendly.         |
| Hootpot        | Payment receipts and community-funded rewards create practical loops. |
| Word Circles   | Daily habit games are easy to understand.                             |
| Dollar Auction | CRC pot games are exciting when rules are clear and onchain.          |

Circle Waifu should feel less like a generic casino and more like a playful daily Circles operating system: one useful action, one companion reaction, one weekly chance to win.

## Target User

A Farcaster user who:

- already has or can create a Circles profile,
- wants a small daily reason to use CRC,
- enjoys cute/pixel companion interfaces,
- likes low-stakes social games,
- discovers apps through casts rather than app stores.

## Core Product Thesis

Circles needs repeat, meaningful, social usage. A Farcaster-native waifu can turn one daily Circles action into a habit by making the action:

- **guided** — “do this today,”
- **verified** — “we saw it onchain,”
- **emotional** — “your assistant reacts,”
- **social** — “share your streak/result,”
- **rewarded** — “earn a weekly pool ticket.”

## MVP Game: Daily Lab Mission

### Daily loop

1. User opens the Farcaster Mini App.
2. App identifies the user by Farcaster context and bound wallet.
3. Waifu presents today’s mission.
4. User performs one onchain Circles action.
5. App verifies the transaction or indexed event.
6. Streak increments if the action is valid for the current UTC day.
7. User receives one weekly ticket.
8. Waifu gains XP and generates a short lab note.
9. User can share a cast with a dynamic embed.

### Example missions

Missions should start simple and expand later.

MVP missions:

- **Contribute to the weekly pool**: send a small capped CRC amount to the pool safe/contract.
- **Tip a human**: send CRC to a trusted profile or Farcaster mutual.
- **Trust review**: review a suggested trust relation and confirm “keep” or execute an untrust action.
- **Support a service**: pay a small CRC amount to a listed service/provider.

Post-MVP missions:

- feed the waifu by receiving CRC from another user,
- sponsor another user’s ticket,
- join a group pool,
- complete a merchant receipt flow,
- vote on next week’s mission theme.

## Weekly Bento Pool

### Purpose

The weekly pool gives users a reason to return while keeping the daily action useful. It is a raffle-style prize pool, not a yield product.

### Ticket rules

- One verified daily mission grants one ticket.
- Maximum seven mission tickets per week.
- Optional bonus ticket for sharing a result cast, capped at one per week.
- Ticket count should be capped so whales cannot dominate purely by depositing more.
- Missed days do not erase existing weekly tickets, but they break the streak.

### Pool rules

- Pool is denominated in CRC.
- Contributions are capped per user per day.
- Weekly draw occurs at a fixed UTC time.
- Winners are selected from eligible tickets using a transparent randomness source.
- Prize split for MVP:
  - 50% first place,
  - 25% second place,
  - 15% third place,
  - 10% rolls over or funds next week’s seed pool.
- Operator fee should be zero for hackathon credibility unless explicitly disclosed.

### Risk controls

- Use “weekly prize pool” language, not casino language.
- Keep entries capped and low-stakes.
- Do not sell unlimited tickets.
- Show odds and rules clearly.
- Require useful mission completion, not only payment.
- Add legal/disclaimer copy before public launch.

## Waifu Companion

The waifu is the emotional interface for the system.

### State

- name/persona,
- mood,
- level,
- XP,
- current streak,
- longest streak,
- weekly tickets,
- lab notes,
- cosmetic unlocks.

### Behavior

- Greets the user by Farcaster display name.
- Explains today’s mission in short, playful copy.
- Reacts to success/failure.
- Writes a daily “experiment log.”
- Changes expression based on streak state.
- Celebrates wins and near misses.

### Tone

Smart, dry, cute, and slightly research-lab coded. Avoid infantilizing copy.

Examples:

- “Hypothesis: one useful CRC action increases network vitality.”
- “Observation recorded. Streak integrity: stable.”
- “Your CRC aura is under-sampled. Perform one field experiment.”
- “Probability did not favor us. The lab continues.”

## Farcaster Mini App Requirements

The app must be designed as a Farcaster Mini App from the start.

### SDK

- Install and use `@farcaster/miniapp-sdk`.
- Call `sdk.actions.ready()` after the initial app shell and data are ready.
- Use Farcaster context for FID, username, display name, and cast context.
- Use Quick Auth or the recommended Farcaster auth flow for server identity.
- Support notifications for daily reminders and weekly draw results.

### Sharing

Every important state should have a shareable URL with Farcaster embed metadata:

- root app invite,
- daily mission completion,
- weekly pool status,
- winner announcement,
- public waifu/streak card.

Use `fc:miniapp` meta tags with:

- 3:2 PNG/WebP dynamic image,
- clear button CTA,
- `launch_miniapp` action,
- app name and splash metadata.

### Publishing

Host or configure Farcaster manifest at:

```text
/.well-known/farcaster.json
```

Planned manifest shape:

- `name`: `Circle Waifu`
- `subtitle`: `Daily CRC lab`
- `primaryCategory`: `games` or `finance`
- `tags`: `circles`, `crc`, `streaks`, `raffle`, `waifu`
- `requiredChains`: include Gnosis Chain if Farcaster host support permits.
- `requiredCapabilities`: wallet provider, notifications, sharing.

### Wallet and chain handling

Primary actions happen on Gnosis Chain with Circles CRC.

Because Farcaster wallet chain support can vary by client, the implementation must support two paths:

1. **Preferred**: transact directly through the Farcaster Mini App EVM provider.
2. **Fallback**: deep-link to the Circles/Gnosis app transfer flow, then verify the resulting transaction/indexed event when the user returns.

## Onchain Model

### MVP architecture

Prefer minimal onchain complexity for hackathon delivery:

- A weekly pool Safe or simple contract receives CRC contributions.
- Server/indexer records verified mission completions and ticket eligibility.
- Weekly draw can be server-executed initially, with public inputs and audit trail.
- Payout transactions are visible on Gnosis Chain.

### Ideal architecture

Post-MVP should move draw settlement onchain:

- weekly pool contract,
- ticket registry or commitment root,
- randomness integration,
- deterministic winner selection,
- payout settlement function.

### Verification sources

- Gnosis Chain transaction receipt,
- Circles transfer event/indexer data,
- trust graph API/indexer,
- Farcaster identity context,
- app database for mission state and draw records.

## Product Screens

### 1. Home / Lab Console

Shows:

- waifu portrait,
- greeting,
- current daily mission,
- action button,
- streak status,
- weekly ticket count,
- weekly pool amount.

### 2. Mission Detail

Shows:

- mission reason,
- exact onchain action,
- expected cost,
- risk/disclaimer,
- transaction CTA,
- verification state.

### 3. Weekly Pool

Shows:

- prize pool balance,
- draw countdown,
- user tickets,
- total tickets,
- odds estimate,
- prize split,
- prior winners.

### 4. Waifu Profile

Shows:

- level and XP,
- mood,
- unlocked cosmetics,
- lab-note history,
- longest streak,
- public share card.

### 5. Activity Log

Shows:

- verified daily actions,
- transaction links,
- ticket grants,
- draw entries,
- payouts.

## Visual Direction

Retro research terminal plus pixel waifu.

### References

- Nous/research-lab energy: austere, intelligent, experimental.
- 1980s/1990s terminal UI: CRT scanlines, amber/green phosphor, ASCII panels.
- Pixel companion game: small expressive waifu sprite, not anime overload.

### Palette

- Canvas: near-black ink or warm off-white.
- Primary text: phosphor amber/green.
- Accent: electric violet or cyan.
- Warning: saturated red/orange.
- Success: laboratory green.

### Typography

- Monospace for console labels and metrics.
- Crisp sans-serif for readable body text.
- Heavy use of short labels:
  - `TODAY'S HYPOTHESIS`
  - `CHAIN ACTION`
  - `STREAK INTEGRITY`
  - `WEEKLY BENTO POOL`
  - `OBSERVATION LOG`

### Design-system rule

Do not style route code directly. Update the existing design-system tokens and components, then compose screens using registered primitives/components.

## Repository Transformation Plan

The current repo is an Effect + TanStack Start template with a todo dashboard. The implementation should remove the template product while preserving architectural patterns.

### Keep

- TanStack Start routing and SSR.
- Effect service/layer architecture.
- Effect-native atoms with SSR hydration.
- RPC pattern for client/server communication.
- Drizzle/PGlite/Postgres persistence pattern.
- Design-system enforcement and registry.
- Vitest/browser/visual test setup.
- Observability hooks where still useful.

### Remove or replace

- Todo domain schemas.
- Todo repository/table.
- Todo dashboard route components.
- Todo-specific tests and visual snapshots.
- Template README/product copy.

### New structure

```text
src/
├── api/
│   ├── circle-waifu-schema.ts
│   ├── circle-waifu-rpc.ts
│   └── farcaster-schema.ts
├── db/
│   ├── circle-waifu-schema.ts
│   └── circle-waifu-repository.ts
├── features/
│   ├── daily-lab/
│   │   ├── application.ts
│   │   ├── projections.ts
│   │   └── events.ts
│   ├── weekly-pool/
│   │   ├── application.ts
│   │   ├── projections.ts
│   │   └── events.ts
│   └── waifu/
│       ├── application.ts
│       ├── projections.ts
│       └── events.ts
├── routes/
│   ├── -index/
│   │   ├── app.tsx
│   │   ├── atoms.tsx
│   │   ├── lab-console.tsx
│   │   ├── mission-card.tsx
│   │   ├── pool-card.tsx
│   │   └── waifu-panel.tsx
│   ├── api/$
│   └── .well-known/farcaster.json.ts
└── design-system/
```

## Domain Model

### User

- Farcaster FID.
- Primary wallet address.
- Circles profile address.
- Display name.
- Notification token status.

### Mission

- ID.
- Date.
- Type.
- Required action.
- Minimum/maximum CRC amount where applicable.
- Verification rule.
- Reward rule.

### Mission completion

- User ID.
- Mission ID.
- Transaction hash or external verification reference.
- Verified at.
- Ticket granted.
- Streak result.

### Streak

- Current count.
- Longest count.
- Last completed date.
- Freeze/repair state if added later.

### Weekly pool

- Week ID.
- Start/end time.
- Pool address.
- CRC balance.
- Ticket count.
- Draw status.
- Winners.
- Payout transactions.

### Waifu state

- User ID.
- Level.
- XP.
- Mood.
- Active cosmetic.
- Lab notes.

## State Management

Use the repo’s Effect-native Atoms pattern.

Required atoms:

- `labDashboardAtom` — full SSR-hydrated dashboard snapshot.
- `dailyMissionAtom` — derived current mission view.
- `streakAtom` — derived streak view.
- `weeklyPoolAtom` — derived pool view.
- `waifuStateAtom` — derived waifu view.
- `startMissionAtom` — prepares action.
- `verifyMissionAtom` — verifies action and refreshes snapshot.
- `shareResultAtom` — prepares share URL/embed state.

No `Effect.runPromise` in React components. Components call atom mutations/hooks.

## API / RPC Use Cases

MVP RPC methods:

- `lab_snapshot`
- `mission_prepare`
- `mission_verify`
- `pool_snapshot`
- `pool_enter`
- `pool_draw_status`
- `waifu_update_profile`
- `farcaster_auth_verify`
- `notification_subscribe`

Each mutation should return a fresh dashboard snapshot so the UI stays synchronized.

## Success Metrics

Hackathon MVP success:

- User can open the app inside Farcaster.
- User can connect/identify Farcaster + wallet.
- User can complete at least one real Circles action.
- App verifies that action.
- Streak and ticket update immediately.
- Weekly pool screen shows real or seeded CRC balance.
- Result can be shared as a Farcaster embed.
- App has a distinct retro waifu research-lab visual identity.

Product metrics:

- daily mission completion rate,
- D1/D7 retention,
- average streak length,
- share rate per completion,
- weekly pool participation,
- CRC transaction volume,
- successful payout rate.

## MVP Cutline

### Must have

- Farcaster Mini App shell.
- Manifest/embed metadata.
- Waifu lab console.
- One or two mission types.
- Mission verification.
- Streak tracking.
- Weekly tickets.
- Weekly pool page.
- Shareable completion card.
- Template todo product removed.

### Should have

- Notifications.
- Dynamic embed images.
- Prior winners list.
- Waifu XP/mood changes.
- Fallback Circles/Gnosis app deep links.

### Could have

- Multiple waifu personalities.
- Cosmetic unlocks.
- Group pools.
- Public leaderboard.
- Trust-cleaner mission type.
- Merchant/service mission type.

### Not MVP

- Complex casino mechanics.
- Unlimited paid ticket buying.
- Multi-token support.
- Fully onchain randomness if it threatens delivery.
- Custom design-system components without clear need.

## Open Questions

1. What exact CRC action should be the first MVP mission?
2. Will the hackathon judges prefer direct Gnosis/Circles integration over Farcaster-native polish?
3. Which Farcaster clients support the needed wallet chain path for Gnosis Chain today?
4. Should the weekly pool use a Safe first or a minimal contract first?
5. What randomness source is acceptable for the first public draw?
6. Should the waifu have a fixed name or let users name her?

## Recommended First Build

Build the smallest impressive vertical slice:

1. Replace todo dashboard with Waifu Lab Console.
2. Add Farcaster Mini App SDK and call `ready()`.
3. Add user identity binding from Farcaster context.
4. Implement “contribute small CRC to weekly pool” mission.
5. Verify transaction and grant ticket.
6. Render streak, ticket, and pool dashboard.
7. Add dynamic share card for completion.
8. Add one retro pixel waifu state and one weekly draw record.

This is enough to show the core loop and should be credible for Circle Garage: useful Circles action, social Farcaster distribution, clear daily retention, and a transparent weekly prize pool.
