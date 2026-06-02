import * as Effect from "effect/Effect"
import { describe, expect, it, vi } from "vitest"

vi.mock("./grouped-todo-board", () => ({
  GroupedTodoBoard: () => null,
}))

const assertTodoListExports = Effect.gen(function*() {
  const { TodoList } = yield* Effect.promise(() => import("./todo-list"))
  expect(TodoList).toBeDefined()
  expect(typeof TodoList).toBe("function")
})

describe("TodoList", () => {
  it("exports TodoList component", () =>
    Effect.runPromise(assertTodoListExports))
})
