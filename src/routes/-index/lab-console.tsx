import type { LabDashboardSnapshot } from "@/api/circle-waifu-schema"
import { Card } from "@/design-system/components/Card"
import { Heading } from "@/design-system/components/Heading"
import { StatCard } from "@/design-system/components/StatCard"
import { Text } from "@/design-system/components/Text"
import { Grid } from "@/design-system/primitives/Grid"
import { Stack } from "@/design-system/primitives/Stack"
import { MissionCard } from "./mission-card"
import { PoolCard } from "./pool-card"
import { WaifuPanel } from "./waifu-panel"

type LabConsoleProps = {
  readonly snapshot: LabDashboardSnapshot
}

/**
 * Renders the hydrated Circle Waifu dashboard snapshot.
 *
 * @param props - Component props.
 * @param props.snapshot - Current lab dashboard read model.
 * @returns Dashboard sections for mission, pool, waifu, and activity.
 */
export function LabConsole({ snapshot }: LabConsoleProps) {
  return (
    <Stack gap="xl">
      <Grid layout="stats">
        <StatCard
          label="STREAK INTEGRITY"
          value={snapshot.streak.current}
          helper={snapshot.streak.integrity}
          tone={snapshot.streak.current > 0 ? "accent" : "default"}
        />
        <StatCard
          label="WEEKLY TICKETS"
          value={snapshot.weeklyPool.userTickets}
          helper={`Odds: ${snapshot.weeklyPool.oddsLabel}`}
        />
        <StatCard
          label="POOL CRC"
          value={snapshot.weeklyPool.balanceCrc}
          helper={snapshot.weeklyPool.weekId}
        />
      </Grid>
      <Grid layout="dashboard">
        <Stack gap="l">
          <MissionCard mission={snapshot.mission} share={snapshot.share} />
          <PoolCard pool={snapshot.weeklyPool} />
        </Stack>
        <Stack gap="l">
          <WaifuPanel waifu={snapshot.waifu} user={snapshot.user} />
          <Card tone="subtle">
            <Stack gap="s">
              <Heading as="h2" tone="card">
                OBSERVATION LOG
              </Heading>
              {snapshot.activity.length === 0
                ? (
                  <Text tone="muted">
                    No verified field experiments yet. The lab notebook is
                    waiting for one real CRC action.
                  </Text>
                )
                : snapshot.activity.map((entry) => (
                  <Stack key={entry.id} gap="2xs">
                    <Text tone="label">
                      {entry
                        .label}
                    </Text>
                    <Text tone="caption">
                      {entry
                        .detail}
                    </Text>
                  </Stack>
                ))}
            </Stack>
          </Card>
        </Stack>
      </Grid>
    </Stack>
  )
}
