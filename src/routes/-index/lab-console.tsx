import type { LabDashboardSnapshot } from "@/api/circle-waifu-schema"
import { Card } from "@/design-system/components/Card"
import { CosmeticSlot } from "@/design-system/components/CosmeticSlot"
import { Heading } from "@/design-system/components/Heading"
import { StatCard } from "@/design-system/components/StatCard"
import { Text } from "@/design-system/components/Text"
import { Stack } from "@/design-system/primitives/Stack"
import { Stage } from "@/design-system/primitives/Stage"
import { MissionDock } from "./mission-dock"
import { WaifuCenter } from "./waifu-center"

type LabConsoleProps = {
  readonly snapshot: LabDashboardSnapshot
}

/**
 * Renders the hydrated Circle Waifu dashboard snapshot.
 *
 * The waifu sprite sits at the center of a stage; streak, weekly tickets,
 * pool balance, and cosmetic slot anchor to the four corners; the mission
 * action dock spans the bottom. The activity log follows below the stage
 * so the tamagotchi feel remains the visual focus.
 *
 * @param props - Component props.
 * @param props.snapshot - Current lab dashboard read model.
 * @returns Dashboard layout with center waifu, corner stats, and action dock.
 */
export function LabConsole({ snapshot }: LabConsoleProps) {
  return (
    <Stack gap="xl">
      <Stage
        center={<WaifuCenter user={snapshot.user} waifu={snapshot.waifu} />}
        northWest={
          <StatCard
            label="STREAK"
            value={snapshot.streak.current}
            helper={snapshot.streak.integrity}
            tone={snapshot.streak.current > 0 ? "accent" : "default"}
          />
        }
        northEast={
          <StatCard
            label="TICKETS"
            value={snapshot.weeklyPool.userTickets}
            helper={`Odds: ${snapshot.weeklyPool.oddsLabel}`}
          />
        }
        southWest={
          <StatCard
            label="POOL CRC"
            value={snapshot.weeklyPool.balanceCrc}
            helper={`${snapshot.weeklyPool.weekId} · ${snapshot.weeklyPool.drawStatus}`}
          />
        }
        southEast={
          <CosmeticSlot
            label="EQUIPPED"
            value={snapshot.waifu.activeCosmetic}
            tone="accent"
          />
        }
        dock={
          <MissionDock
            mission={snapshot.mission}
            share={snapshot.share}
          />
        }
      />
      <Card tone="subtle">
        <Stack gap="s">
          <Heading as="h2" tone="card">
            OBSERVATION LOG
          </Heading>
          {snapshot.activity.length === 0
            ? (
              <Text tone="muted">
                No verified field experiments yet. The lab notebook is waiting
                for one real CRC action.
              </Text>
            )
            : snapshot.activity.map((entry) => (
              <Stack key={entry.id} gap="2xs">
                <Text tone="label">
                  {entry.label}
                </Text>
                <Text tone="caption">
                  {entry.detail}
                </Text>
              </Stack>
            ))}
          {snapshot.waifu.labNotes.length === 0 ? null : (
            <Stack gap="2xs">
              <Text tone="label">
                LAB NOTES
              </Text>
              {snapshot.waifu.labNotes.map((note) => (
                <Text key={note} tone="caption">
                  {note}
                </Text>
              ))}
            </Stack>
          )}
        </Stack>
      </Card>
    </Stack>
  )
}
