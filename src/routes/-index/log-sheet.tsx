import type { LabDashboardSnapshot } from "@/api/circle-waifu-schema"
import { Card } from "@/design-system/components/Card"
import { EmptyState } from "@/design-system/components/EmptyState"
import { Sheet } from "@/design-system/components/Sheet"
import { Text } from "@/design-system/components/Text"
import { Stack } from "@/design-system/primitives/Stack"

type LogSheetProps = {
  readonly open: boolean
  readonly onClose: () => void
  readonly snapshot: LabDashboardSnapshot
}

/**
 * Slide-up sheet for the verified-action activity log.
 *
 * @param props - Component props.
 * @param props.open - Whether the sheet is visible.
 * @param props.onClose - Dismiss callback.
 * @param props.snapshot - Hydrated dashboard snapshot.
 * @returns The log sheet.
 */
export function LogSheet({ onClose, open, snapshot }: LogSheetProps) {
  return (
    <Sheet open={open} onClose={onClose} title="Observation log">
      {snapshot.activity.length === 0
        ? (
          <EmptyState
            title="No field experiments yet"
            description="Verified Circles actions will land here with a transaction link, ticket grant, and streak result."
          />
        )
        : (
          <Stack gap="s">
            {snapshot.activity.map((entry) => (
              <Card key={entry.id}>
                <Stack gap="2xs">
                  <Text tone="label" as="span">
                    {entry.label}
                  </Text>
                  <Text tone="caption">
                    {entry.detail}
                  </Text>
                </Stack>
              </Card>
            ))}
          </Stack>
        )}
    </Sheet>
  )
}
