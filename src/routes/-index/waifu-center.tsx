import type { UserProfile, WaifuState } from "@/api/circle-waifu-schema"
import { Badge } from "@/design-system/components/Badge"
import { Heading } from "@/design-system/components/Heading"
import { MoodMeter } from "@/design-system/components/MoodMeter"
import { Text } from "@/design-system/components/Text"
import { WaifuSprite } from "@/design-system/components/WaifuSprite"
import { Inline } from "@/design-system/primitives/Inline"
import { Stack } from "@/design-system/primitives/Stack"

type WaifuCenterProps = {
  readonly user: UserProfile
  readonly waifu: WaifuState
}

const moodTone = {
  curious: "accent",
  focused: "accent",
  pleased: "success",
  undersampled: "neutral",
} as const

/**
 * Center stage piece: animated pixel sprite, name, greeting and mood meter.
 *
 * @param props - Component props.
 * @param props.user - Bound Farcaster user identity.
 * @param props.waifu - Companion progression state.
 * @returns The center stage block.
 */
export function WaifuCenter({ user, waifu }: WaifuCenterProps) {
  return (
    <Stack align="center" gap="s">
      <WaifuSprite mood={waifu.mood} name={waifu.name} size="xl" />
      <Stack align="center" gap="2xs">
        <Heading as="h2" tone="section">
          {waifu.name}
        </Heading>
        <Text align="center" tone="muted">
          {`Greetings, ${user.displayName}. Hypothesis engine online.`}
        </Text>
      </Stack>
      <Inline wrap>
        <Badge tone="accent">
          LVL {waifu.level}
        </Badge>
        <Badge tone="neutral">
          XP {waifu.xp}/{waifu.nextLevelXp}
        </Badge>
        <Badge tone={moodTone[waifu.mood]}>
          {waifu.mood}
        </Badge>
      </Inline>
      <MoodMeter
        label="MOOD"
        value={waifu.xp}
        max={waifu.nextLevelXp}
        tone={moodTone[waifu.mood]}
      />
    </Stack>
  )
}
