import type { LabDashboardSnapshot } from "@/api/circle-waifu-schema"
import { Badge } from "@/design-system/components/Badge"
import { Card } from "@/design-system/components/Card"
import { Heading } from "@/design-system/components/Heading"
import { Sheet } from "@/design-system/components/Sheet"
import { StatCard } from "@/design-system/components/StatCard"
import { Text } from "@/design-system/components/Text"
import { Grid } from "@/design-system/primitives/Grid"
import { Inline } from "@/design-system/primitives/Inline"
import { Stack } from "@/design-system/primitives/Stack"

type PoolSheetProps = {
  readonly open: boolean
  readonly onClose: () => void
  readonly snapshot: LabDashboardSnapshot
}

/**
 * Slide-up sheet for the weekly pool screen.
 *
 * @param props - Component props.
 * @param props.open - Whether the sheet is visible.
 * @param props.onClose - Dismiss callback.
 * @param props.snapshot - Hydrated dashboard snapshot.
 * @returns The pool sheet.
 */
export function PoolSheet({ onClose, open, snapshot }: PoolSheetProps) {
  const pool = snapshot.weeklyPool
  return (
    <Sheet open={open} onClose={onClose} title="Weekly bento pool">
      <Stack gap="m">
        <Grid layout="stats">
          <StatCard
            label="POOL CRC"
            value={pool.balanceCrc}
            helper={pool.weekId}
          />
          <StatCard
            label="MY TICKETS"
            value={pool.userTickets}
            helper={pool.oddsLabel}
          />
          <StatCard
            label="TOTAL"
            value={pool.totalTickets}
            helper="all entries"
          />
        </Grid>
        <Card tone="accent">
          <Stack gap="2xs">
            <Inline align="between" wrap>
              <Text tone="label" as="span">
                PRIZE SPLIT
              </Text>
              <Badge tone="verified">
                {pool.drawStatus.toUpperCase()}
              </Badge>
            </Inline>
            <Inline wrap>
              {pool.prizeSplit.map((prize) => (
                <Badge key={prize.label} tone="neutral">
                  {prize
                    .label}: {prize
                    .percent}%
                </Badge>
              ))}
            </Inline>
          </Stack>
        </Card>
        <Card>
          <Stack gap="2xs">
            <Text tone="label" as="span">
              TRANSPARENT DRAW INPUTS
            </Text>
            <Text tone="caption">
              Pool safe: {pool.poolAddress}
            </Text>
            <Text tone="caption">
              Week: {pool.weekId}
            </Text>
            <Text tone="caption">
              User tickets are capped at 7 per week.
            </Text>
          </Stack>
        </Card>
        <Heading as="h3" tone="card">
          PRIOR WINNERS
        </Heading>
        {pool.winners.length === 0
          ? (
            <Text tone="muted">
              No prior draws on record yet.
            </Text>
          )
          : (
            <Stack gap="2xs">
              {pool.winners.map((winner) => (
                <Text key={winner.displayName} tone="caption">
                  {winner
                    .displayName}: {winner
                    .prizeCrc} CRC
                </Text>
              ))}
            </Stack>
          )}
      </Stack>
    </Sheet>
  )
}
