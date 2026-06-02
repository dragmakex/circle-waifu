import type { UserProfile, WaifuState } from "@/api/circle-waifu-schema"
import { Badge } from "@/design-system/components/Badge"
import { Card } from "@/design-system/components/Card"
import { Heading } from "@/design-system/components/Heading"
import { Text } from "@/design-system/components/Text"
import { Inline } from "@/design-system/primitives/Inline"
import { Stack } from "@/design-system/primitives/Stack"

type WaifuPanelProps = {
  readonly user: UserProfile
  readonly waifu: WaifuState
}

/**
 * Renders the companion state for the current Farcaster user.
 *
 * @param props - Component props.
 * @param props.user - Bound user identity.
 * @param props.waifu - Companion progression state.
 * @returns Waifu companion panel.
 */
export function WaifuPanel({ user, waifu }: WaifuPanelProps) {
  return (
    <Card tone="subtle">
      <Stack gap="m" align="center">
        <Text tone="label">
          WAIFU RESEARCH ASSISTANT
        </Text>
        <Heading as="h2" tone="display">
          {waifu.expression}
        </Heading>
        <Stack gap="2xs" align="center">
          <Heading as="h3" tone="section">
            {waifu.name}
          </Heading>
          <Text align="center" tone="muted">
            Greetings, {user.displayName}. Hypothesis engine online.
          </Text>
        </Stack>
        <Inline wrap>
          <Badge tone="accent">
            LVL {waifu.level}
          </Badge>
          <Badge tone="neutral">
            XP {waifu.xp}/{waifu.nextLevelXp}
          </Badge>
          <Badge tone="success">
            {waifu.mood}
          </Badge>
        </Inline>
        <Text align="center" tone="caption">
          Cosmetic: {waifu.activeCosmetic}
        </Text>
        <Stack gap="2xs">
          {waifu.labNotes.map((note) => (
            <Text key={note} tone="caption">
              {note}
            </Text>
          ))}
        </Stack>
      </Stack>
    </Card>
  )
}
