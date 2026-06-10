// @effect-diagnostics asyncFunction:skip-file
import { Badge } from "@/design-system/components/Badge"
import { expect, test } from "vitest"
import { render } from "vitest-browser-react"
import { page } from "vitest/browser"

test("Badge applies the pixel-label terminal contract", async () => {
  await render(
    <Badge>
      Due 26. März 2026
    </Badge>,
  )

  const badge = page.getByText("Due 26. März 2026")

  await expect.element(badge).toBeVisible()
  await expect.element(badge).toHaveClass(/font-pixel/)
  await expect.element(badge).toHaveClass(/uppercase/)
  await expect.element(badge).toHaveClass(/text-text-mut/)
  await expect.element(badge).toHaveClass(/border-text-mut/)
})

test("Badge swaps text + border tone for each semantic role", async () => {
  await render(
    <>
      <Badge tone="accent">
        Accent
      </Badge>
      <Badge tone="success">
        Success
      </Badge>
      <Badge tone="danger">
        Danger
      </Badge>
    </>,
  )

  await expect.element(page.getByText("Accent")).toHaveClass(/text-accent/)
  await expect.element(page.getByText("Accent")).toHaveClass(/border-accent/)

  await expect.element(page.getByText("Success")).toHaveClass(/text-success/)
  await expect.element(page.getByText("Success")).toHaveClass(/border-success/)

  await expect.element(page.getByText("Danger")).toHaveClass(/text-danger/)
  await expect.element(page.getByText("Danger")).toHaveClass(/border-danger/)
})
