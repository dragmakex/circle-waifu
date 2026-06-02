import type { WeeklyPool } from "@/api/circle-waifu-schema"
import { Badge } from "@/design-system/components/Badge"
import { Card } from "@/design-system/components/Card"
import { Heading } from "@/design-system/components/Heading"
import { Text } from "@/design-system/components/Text"
import { Inline } from "@/design-system/primitives/Inline"
import { Stack } from "@/design-system/primitives/Stack"

type PoolCardProps = {
  readonly pool: WeeklyPool
}

/**
 * Renders weekly pool status and transparent raffle rules.
 *
 * @param props - Component props.
 * @param props.pool - Weekly pool read model.
 * @returns Pool status card.
 */
export function PoolCard({ pool }: PoolCardProps) {
  return (
    <Card>
      <Stack gap="m">
        <Inline align="between" wrap>
          <Stack gap="2xs">
            <Text tone="label">
              WEEKLY BENTO POOL
            </Text>
            <Heading as="h2" tone="section">
              {pool.balanceCrc} CRC visible pool
            </Heading>
          </Stack>
          <Badge tone="success">
            {pool.drawStatus.toUpperCase()}
          </Badge>
        </Inline>
        <Text tone="muted">
          Tickets are capped at one verified daily mission per UTC day. More CRC
          does not buy dominance.
        </Text>
        <Inline wrap>
          {pool.prizeSplit.map((prize) => (
            <Badge key={prize.label} tone="neutral">
              {prize
                .label}: {prize
                .percent}%
            </Badge>
          ))}
        </Inline>
        <Stack gap="2xs">
          <Text tone="label">
            TRANSPARENT DRAW INPUTS
          </Text>
          <Text tone="caption">
            Week: {pool.weekId}
          </Text>
          <Text tone="caption">
            Pool safe: {pool.poolAddress}
          </Text>
          <Text tone="caption">
            User tickets: {pool.userTickets} · Total tickets:{" "}
            {pool.totalTickets}
          </Text>
        </Stack>
        <Stack gap="2xs">
          <Text tone="label">
            PRIOR WINNERS
          </Text>
          {pool.winners.map((winner) => (
            <Text key={winner.displayName} tone="caption">
              {winner
                .displayName}: {winner
                .prizeCrc} CRC
            </Text>
          ))}
        </Stack>
      </Stack>
    </Card>
  )
}
