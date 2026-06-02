// @effect-diagnostics asyncFunction:skip-file
import { expect, test } from "vitest"
import { render } from "vitest-browser-react"
import { page } from "vitest/browser"
import { Footer } from "../component/Footer"

/**
 * Visual Regression Tests for Footer
 *
 * These tests capture screenshots and compare them against reference images
 * to ensure the Bulgarian wisdom is displayed with Bulgarian precision.
 */

test("Footer renders correctly with Bulgarian motto", async () => {
  const screen = await render(<Footer />)

  // Wait for the motto to be visible
  await expect.element(page.getByTestId("bulgarian-motto")).toBeVisible()

  // Capture screenshot of the footer
  await expect(screen.container).toMatchScreenshot("footer-default")
})

test("Footer displays Bulgarian flag correctly", async () => {
  const screen = await render(<Footer />)

  // Wait for the flag to be visible
  await expect.element(page.getByTestId("footer-flag")).toBeVisible()

  // Capture screenshot showing the flag
  await expect(screen.container).toMatchScreenshot("footer-with-flag")
})

test("Footer maintains consistent styling across browsers", async () => {
  const screen = await render(<Footer />)

  // Wait for all elements to render
  await expect.element(page.getByTestId("bulgarian-joke")).toBeVisible()

  // This test runs across chromium, firefox, webkit
  await expect(screen.container).toMatchScreenshot("footer-cross-browser")
})
