import * as Effect from "effect/Effect"
import { describe, expect, it, vi } from "vitest"

vi.mock("./create-todo-form", () => ({
  CreateTodoForm: () => null,
}))

vi.mock("./dashboard-stats", () => ({
  DashboardStats: () => null,
}))

vi.mock("./grouped-todo-board", () => ({
  GroupedTodoBoard: () => null,
}))

vi.mock("./recent-activity", () => ({
  RecentActivity: () => null,
}))

const assertAppExports = Effect.gen(function*() {
  const { App } = yield* Effect.promise(() => import("./app"))
  expect(App).toBeDefined()
  expect(typeof App).toBe("function")
})

describe("App", () => {
  it("exports App component", () => Effect.runPromise(assertAppExports))
})
