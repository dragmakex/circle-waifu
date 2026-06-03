import type { UserProfile, WaifuState } from "@/api/circle-waifu-schema"
import { Heading } from "@/design-system/components/Heading"
import { MoodMeter } from "@/design-system/components/MoodMeter"
import { Text } from "@/design-system/components/Text"
import { WaifuSprite } from "@/design-system/components/WaifuSprite"
import { Stack } from "@/design-system/primitives/Stack"

type WaifuCenterProps = {
  readonly user: UserProfile
  readonly waifu: WaifuState
}

const moodTone = {
  curious: "neutral",
  focused: "accent",
  pleased: "success",
  undersampled: "neutral",
} as const

/**
 * Center stage piece: 3:4 mood-framed pixel sprite + greeting + mood meter.
 *
 * @param props - Component props.
 * @param props.user - Bound Farcaster user identity.
 * @param props.waifu - Companion progression state.
 * @returns The center stage block.
 */
export function WaifuCenter({ user, waifu }: WaifuCenterProps) {
  return (
    <Stack align="center" gap="m">
      <WaifuSprite mood={waifu.mood} name={waifu.name} size="xl" />
      <Stack align="center" gap="2xs">
        <Heading as="h2" tone="display">
          {waifu.name}
        </Heading>
        <Text align="center" tone="muted">
          {`Greetings, ${user.displayName}. Hypothesis engine online.`}
        </Text>
      </Stack>
      <MoodMeter
        label={`MOOD · ${waifu.mood.toUpperCase()}`}
        value={waifu.xp}
        max={waifu.nextLevelXp}
        tone={moodTone[waifu.mood]}
      />
    </Stack>
  )
}
