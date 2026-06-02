import * as Effect from "effect/Effect"
import { describe, expect, it, vi } from "vitest"

vi.mock("./lab-console", () => ({
  LabConsole: () => null,
}))

vi.mock("@farcaster/miniapp-sdk", () => ({
  default: { actions: { ready: vi.fn() } },
}))

const assertAppExports = Effect.gen(function*() {
  const { App } = yield* Effect.promise(() => import("./app"))
  expect(App).toBeDefined()
  expect(typeof App).toBe("function")
})

describe("App", () => {
  it("exports App component", () => Effect.runPromise(assertAppExports))
})
