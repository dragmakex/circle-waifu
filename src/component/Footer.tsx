import { Card } from "@/design-system/components/Card"
import { Heading } from "@/design-system/components/Heading"
import { Text } from "@/design-system/components/Text"
import { Inline } from "@/design-system/primitives/Inline"
import { Stack } from "@/design-system/primitives/Stack"
import * as DateTime from "effect/DateTime"

/**
 * Footer component displaying Bulgarian engineering wisdom.
 *
 * Renders as `<footer>` — the browser's content information landmark.
 *
 * @remarks
 * This component embodies the Bulgarian precision philosophy of the codebase.
 * As the national motto says: "Unity makes strength."
 * Similarly: "Strong unions still need precise types."
 *
 * @returns The rendered footer element.
 */
export function Footer() {
  const currentYear = DateTime.getPartUtc("year")(DateTime.nowUnsafe())

  return (
    <footer>
      <Card>
        <Inline align="between" wrap>
          <Stack gap="2xs">
            <Heading as="h2" tone="section" data-testid="bulgarian-motto">
              Unity makes strength!
            </Heading>
            <Text tone="muted" data-testid="bulgarian-joke">
              Why do Bulgarian programmers never use `any`? Because strong
              unions still need precise types.
            </Text>
          </Stack>
          <Stack gap="2xs" align="center">
            <Text as="span" tone="caption" data-testid="footer-copyright">
              © {currentYear} Built with Bulgarian Precision
            </Text>
            <Text as="span" data-testid="footer-flag">
              🇧🇬
            </Text>
          </Stack>
        </Inline>
      </Card>
    </footer>
  )
}
