import type { LabDashboardSnapshot } from "@/api/circle-waifu-schema"
import { Badge } from "@/design-system/components/Badge"
import { Card } from "@/design-system/components/Card"
import { Heading } from "@/design-system/components/Heading"
import { Sheet } from "@/design-system/components/Sheet"
import { Text } from "@/design-system/components/Text"
import { Inline } from "@/design-system/primitives/Inline"
import { Stack } from "@/design-system/primitives/Stack"
import { MissionDock } from "./mission-dock"

type MissionSheetProps = {
  readonly open: boolean
  readonly onClose: () => void
  readonly snapshot: LabDashboardSnapshot
}

/**
 * Slide-up sheet for the detailed mission flow.
 *
 * @param props - Component props.
 * @param props.open - Whether the sheet is visible.
 * @param props.onClose - Dismiss callback.
 * @param props.snapshot - Hydrated dashboard snapshot.
 * @returns The mission sheet.
 */
export function MissionSheet({ onClose, open, snapshot }: MissionSheetProps) {
  return (
    <Sheet open={open} onClose={onClose} title="Mission detail">
      <Stack gap="m">
        <Card>
          <Stack gap="2xs">
            <Text tone="label" as="span">
              REASON
            </Text>
            <Text tone="note">
              {snapshot.mission.reason}
            </Text>
          </Stack>
        </Card>
        <Card tone="subtle">
          <Stack gap="2xs">
            <Inline align="between" wrap>
              <Text tone="label" as="span">
                EXPECTED COST
              </Text>
              <Badge tone="pending">
                {snapshot.mission.costLabel}
              </Badge>
            </Inline>
            <Text tone="caption">
              {snapshot.mission.riskLabel}
            </Text>
          </Stack>
        </Card>
        <Card tone="subtle">
          <Stack gap="2xs">
            <Text tone="label" as="span">
              VERIFICATION HINT
            </Text>
            <Text tone="caption">
              {snapshot.mission.action.verificationHint}
            </Text>
            <Text tone="caption">
              Target: {snapshot.mission.action.targetAddress}
            </Text>
          </Stack>
        </Card>
        <Heading as="h3" tone="card">
          ACTION
        </Heading>
        <MissionDock
          mission={snapshot.mission}
          share={snapshot.share}
        />
      </Stack>
    </Sheet>
  )
}
