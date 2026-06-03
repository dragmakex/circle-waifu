import type { LabDashboardSnapshot } from "@/api/circle-waifu-schema"
import { Chip } from "@/design-system/components/Chip"
import { Heading } from "@/design-system/components/Heading"
import { NameChip } from "@/design-system/components/NameChip"
import { Satellite } from "@/design-system/components/Satellite"
import { Text } from "@/design-system/components/Text"
import { WaifuSprite } from "@/design-system/components/WaifuSprite"
import { HomeLower } from "@/design-system/primitives/HomeLower"
import { HudTop } from "@/design-system/primitives/HudTop"
import { Stack } from "@/design-system/primitives/Stack"
import { StageWrap } from "@/design-system/primitives/StageWrap"
import { MissionDock } from "./mission-dock"

type LabConsoleProps = {
  readonly snapshot: LabDashboardSnapshot
  readonly onMissionTap: () => void
  readonly onNameWaifu: () => void
  readonly onOpenLog: () => void
  readonly onOpenPool: () => void
  readonly onOpenProfile: () => void
}

/**
 * Home / Lab Console screen.
 *
 * Mirrors the prototype layout: top HUD with a clickable name chip and
 * status chip cluster, a stage-wrap with a 3:4 waifu viewport and three
 * floating satellites (day badge top-left, log and pool shortcuts on
 * the sides), and a lower band hosting the greeting + mission CTA.
 *
 * @param props - Component props.
 * @param props.snapshot - Hydrated dashboard snapshot.
 * @param props.onMissionTap - Opens the mission detail sheet.
 * @param props.onNameWaifu - Opens the name modal.
 * @param props.onOpenLog - Opens the activity log sheet.
 * @param props.onOpenPool - Opens the weekly pool sheet.
 * @param props.onOpenProfile - Opens the waifu profile sheet.
 * @returns Home screen layout.
 */
export function LabConsole(
  {
    onMissionTap,
    onNameWaifu,
    onOpenLog,
    onOpenPool,
    onOpenProfile,
    snapshot,
  }: LabConsoleProps,
) {
  const dayIndex = Math.max(1, Math.min(99, snapshot.streak.current + 1))

  return (
    <>
      <HudTop
        left={
          <NameChip
            name={snapshot.waifu.name}
            level={snapshot.waifu.level}
            streak={snapshot.streak.current}
            onClick={onNameWaifu}
          />
        }
        right={
          <>
            <Chip
              label="TICKETS"
              value={`${snapshot.weeklyPool.userTickets}/7`}
            />
            <Chip
              label="POOL"
              value={`${snapshot.weeklyPool.balanceCrc}`}
              tone="accent"
            />
          </>
        }
      />

      <StageWrap
        topLeft={
          <Satellite
            label={`Day ${dayIndex}`}
            icon={`D${dayIndex}`}
            onClick={onOpenProfile}
          />
        }
        middleLeft={
          <Satellite
            label="Open observation log"
            icon="≣"
            size="m"
            onClick={onOpenLog}
          />
        }
        middleRight={
          <Satellite
            label="Open weekly pool"
            icon="◈"
            size="m"
            onClick={onOpenPool}
          />
        }
      >
        <WaifuSprite
          mood={snapshot.waifu.mood}
          name={snapshot.waifu.name}
          size="xl"
        />
      </StageWrap>

      <HomeLower>
        <Text>
          {`Greetings, ${snapshot.user.displayName}. Hypothesis engine online.`}
        </Text>
        <MissionDock
          mission={snapshot.mission}
          share={snapshot.share}
          onOpenDetail={onMissionTap}
        />
        <Stack gap="2xs">
          <Heading as="h2" tone="card">
            OBSERVATION LOG
          </Heading>
          {snapshot.activity.length === 0
            ? (
              <Text tone="caption">
                No verified field experiments yet. The lab notebook is waiting
                for one real CRC action.
              </Text>
            )
            : snapshot.activity.slice(0, 2).map((entry) => (
              <Text key={entry.id} tone="caption">
                {entry
                  .label} — {entry
                  .detail}
              </Text>
            ))}
        </Stack>
      </HomeLower>
    </>
  )
}
