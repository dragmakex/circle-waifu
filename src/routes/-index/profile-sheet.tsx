import type { LabDashboardSnapshot } from "@/api/circle-waifu-schema"
import { Badge } from "@/design-system/components/Badge"
import { Card } from "@/design-system/components/Card"
import { CosmeticSlot } from "@/design-system/components/CosmeticSlot"
import { Heading } from "@/design-system/components/Heading"
import { MoodMeter } from "@/design-system/components/MoodMeter"
import { Sheet } from "@/design-system/components/Sheet"
import { Text } from "@/design-system/components/Text"
import { WaifuSprite } from "@/design-system/components/WaifuSprite"
import { Inline } from "@/design-system/primitives/Inline"
import { Stack } from "@/design-system/primitives/Stack"

type ProfileSheetProps = {
  readonly open: boolean
  readonly onClose: () => void
  readonly snapshot: LabDashboardSnapshot
}

const cosmetics = [
  { state: "equipped" as const, label: "CYAN CRT" },
  { state: "unlocked" as const, label: "LAB COAT" },
  { state: "unlocked" as const, label: "AMBER SKIN" },
  { state: "locked" as const, label: "NEON HALO" },
  { state: "locked" as const, label: "VHS GRAIN" },
  { state: "locked" as const, label: "DAY 30" },
]

const stateTone = {
  equipped: "accent",
  unlocked: "default",
  locked: "subtle",
} as const

/**
 * Slide-up sheet for the waifu profile + cosmetics screen.
 *
 * @param props - Component props.
 * @param props.open - Whether the sheet is visible.
 * @param props.onClose - Dismiss callback.
 * @param props.snapshot - Hydrated dashboard snapshot.
 * @returns The profile sheet.
 */
export function ProfileSheet(
  { onClose, open, snapshot }: ProfileSheetProps,
) {
  const { streak, waifu } = snapshot
  return (
    <Sheet open={open} onClose={onClose} title="Waifu profile">
      <Stack gap="m">
        <Inline gap="m" align="start" wrap>
          <WaifuSprite mood={waifu.mood} name={waifu.name} size="m" />
          <Stack gap="2xs">
            <Heading as="h2" tone="display">
              {waifu.name}
            </Heading>
            <Inline wrap>
              <Badge tone="accent">
                LV {waifu.level}
              </Badge>
              <Badge tone="neutral">
                XP {waifu.xp}/{waifu.nextLevelXp}
              </Badge>
              <Badge tone="pending">
                {waifu.mood}
              </Badge>
            </Inline>
          </Stack>
        </Inline>
        <MoodMeter
          label="LEVEL PROGRESS"
          value={waifu.xp}
          max={waifu.nextLevelXp}
          tone="accent"
        />
        <Card tone="subtle">
          <Stack gap="2xs">
            <Text tone="label" as="span">
              STREAK
            </Text>
            <Text>
              Current {streak.current}d · Longest {streak.longest}d
            </Text>
            <Text tone="caption">
              Integrity: {streak.integrity}
            </Text>
          </Stack>
        </Card>
        <Heading as="h3" tone="card">
          COSMETICS
        </Heading>
        <Inline wrap>
          {cosmetics.map((cosmetic) => (
            <CosmeticSlot
              key={cosmetic.label}
              label={cosmetic.state.toUpperCase()}
              value={cosmetic.label}
              tone={stateTone[cosmetic.state]}
            />
          ))}
        </Inline>
        <Card>
          <Stack gap="2xs">
            <Text tone="label" as="span">
              LAB NOTES
            </Text>
            {waifu.labNotes.map((note) => (
              <Text key={note} tone="note">
                {note}
              </Text>
            ))}
          </Stack>
        </Card>
      </Stack>
    </Sheet>
  )
}
