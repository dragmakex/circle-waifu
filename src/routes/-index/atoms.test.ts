import * as Effect from "effect/Effect"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/api/api-client", () => ({
  ApiClient: {
    Default: { _tag: "Layer" },
  },
}))

const assertDashboardAtomExports = Effect.gen(function*() {
  const {
    dailyMissionAtom,
    labDashboardAtom,
    runtime,
    streakAtom,
    waifuStateAtom,
    weeklyPoolAtom,
  } = yield* Effect.promise(() => import("./atoms"))

  expect(runtime).toBeDefined()
  expect(labDashboardAtom).toBeDefined()
  expect(labDashboardAtom.remote).toBeDefined()
  expect(dailyMissionAtom.remote).toBeDefined()
  expect(streakAtom.remote).toBeDefined()
  expect(weeklyPoolAtom.remote).toBeDefined()
  expect(waifuStateAtom.remote).toBeDefined()
})

const assertDashboardMutationAtomExports = Effect.gen(function*() {
  const { shareResultAtom, startMissionAtom, verifyMissionAtom } = yield* Effect
    .promise(() => import("./atoms"))

  expect(startMissionAtom).toBeDefined()
  expect(verifyMissionAtom).toBeDefined()
  expect(shareResultAtom).toBeDefined()
})

describe("atoms", () => {
  it("exports Circle Waifu dashboard atoms", () =>
    Effect.runPromise(assertDashboardAtomExports))

  it("exports Circle Waifu mutation atoms", () =>
    Effect.runPromise(assertDashboardMutationAtomExports))
})
