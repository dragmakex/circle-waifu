import type { LabDashboardSnapshot } from "@/api/circle-waifu-schema"
import { Chip } from "@/design-system/components/Chip"
import { Heading } from "@/design-system/components/Heading"
import { Text } from "@/design-system/components/Text"
import { CrtScreen } from "@/design-system/primitives/CrtScreen"
import { Inline } from "@/design-system/primitives/Inline"
import { Stack } from "@/design-system/primitives/Stack"
import { Stage } from "@/design-system/primitives/Stage"
import { MissionDock } from "./mission-dock"
import { WaifuCenter } from "./waifu-center"

type LabConsoleProps = {
  readonly snapshot: LabDashboardSnapshot
}

/**
 * Home / Lab Console screen.
 *
 * Composes the floating HUD around the CRT-framed waifu, with chips for
 * streak / tickets / pool / level, plus the daily mission action panel.
 *
 * @param props - Component props.
 * @param props.snapshot - Hydrated dashboard snapshot.
 * @returns Home screen layout.
 */
export function LabConsole({ snapshot }: LabConsoleProps) {
  return (
    <Stack gap="l">
      <Inline align="between" wrap>
        <Chip
          label={snapshot.waifu.name.toUpperCase()}
          value={`LV ${snapshot.waifu.level}`}
          tone="accent"
        />
        <Inline gap="xs" wrap>
          <Chip
            label="STREAK"
            value={`${snapshot.streak.current}d`}
            tone="warning"
          />
          <Chip
            label="TICKETS"
            value={`${snapshot.weeklyPool.userTickets}/7`}
          />
        </Inline>
      </Inline>

      <CrtScreen flicker beam rounded="lg" tinted padded>
        <Stage
          center={<WaifuCenter user={snapshot.user} waifu={snapshot.waifu} />}
          northWest={
            <Chip
              label="LV"
              value={snapshot.waifu.level}
              tone="accent"
            />
          }
          northEast={
            <Chip
              label="POOL"
              value={`${snapshot.weeklyPool.balanceCrc} CRC`}
            />
          }
          southWest={
            <Chip
              label="MOOD"
              value={snapshot
                .waifu
                .mood
                .toUpperCase()}
            />
          }
          southEast={
            <Chip
              label="STATUS"
              value={snapshot.weeklyPool.drawStatus.toUpperCase()}
              tone="success"
            />
          }
          dock={
            <MissionDock
              mission={snapshot.mission}
              share={snapshot.share}
            />
          }
        />
      </CrtScreen>

      <Stack gap="s">
        <Heading as="h2" tone="card">
          OBSERVATION LOG
        </Heading>
        {snapshot.activity.length === 0
          ? (
            <Text tone="muted">
              No verified field experiments yet. The lab notebook is waiting for
              one real CRC action.
            </Text>
          )
          : snapshot.activity.map((entry) => (
            <Stack key={entry.id} gap="2xs">
              <Text tone="label" as="span">
                {entry.label}
              </Text>
              <Text tone="caption">
                {entry.detail}
              </Text>
            </Stack>
          ))}
      </Stack>
    </Stack>
  )
}
