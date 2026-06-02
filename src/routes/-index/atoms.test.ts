import * as Effect from "effect/Effect"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/api/api-client", () => ({
  ApiClient: {
    Default: { _tag: "Layer" },
  },
}))

const assertDashboardAtomExports = Effect.gen(function*() {
  const { runtime, todoGroupsAtom, todosAtom, todoStatsAtom } = yield* Effect
    .promise(() => import("./atoms"))

  expect(runtime).toBeDefined()
  expect(todosAtom).toBeDefined()
  expect(todosAtom.remote).toBeDefined()
  expect(todoStatsAtom).toBeDefined()
  expect(todoStatsAtom.remote).toBeDefined()
  expect(todoGroupsAtom).toBeDefined()
  expect(todoGroupsAtom.remote).toBeDefined()
})

const assertDashboardMutationAtomExports = Effect.gen(function*() {
  const { createTodoAtom, deleteTodoAtom, updateTodoAtom } = yield* Effect
    .promise(() => import("./atoms"))

  expect(createTodoAtom).toBeDefined()
  expect(updateTodoAtom).toBeDefined()
  expect(deleteTodoAtom).toBeDefined()
})

describe("atoms", () => {
  it("exports runtime and dashboard atoms", () =>
    Effect.runPromise(assertDashboardAtomExports))

  it("exports dashboard mutation atoms", () =>
    Effect.runPromise(assertDashboardMutationAtomExports))
})
