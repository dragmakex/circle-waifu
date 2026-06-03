import type {
  DailyMission,
  ShareResult,
  TransactionHash,
} from "@/api/circle-waifu-schema"
import { Badge } from "@/design-system/components/Badge"
import { Button } from "@/design-system/components/Button"
import { Card } from "@/design-system/components/Card"
import { Heading } from "@/design-system/components/Heading"
import { Text } from "@/design-system/components/Text"
import { TextField } from "@/design-system/components/TextField"
import { Inline } from "@/design-system/primitives/Inline"
import { Stack } from "@/design-system/primitives/Stack"
import { useAtomSet } from "@effect/atom-react"
import { useState } from "react"
import { shareResultAtom, startMissionAtom, verifyMissionAtom } from "./atoms"

type MissionDockProps = {
  readonly mission: DailyMission
  readonly share: ShareResult
}

const statusToTone = {
  ready: "pending",
  prepared: "pending",
  verified: "verified",
} as const

const fallbackTransactionHash =
  "0x00000000000000000000000000000000000000000000000000000000c1rc1e" as TransactionHash

/**
 * Mission action panel rendered as the day's CTA card.
 *
 * Shows today's hypothesis, the chain action, a transaction-hash input, and
 * the three action buttons (prepare, verify, share).
 *
 * @param props - Component props.
 * @param props.mission - Daily mission read model.
 * @param props.share - Share card metadata.
 * @returns Mission action card.
 */
export function MissionDock({ mission, share }: MissionDockProps) {
  const startMission = useAtomSet(startMissionAtom)
  const verifyMission = useAtomSet(verifyMissionAtom)
  const shareResult = useAtomSet(shareResultAtom)
  const [transactionHash, setTransactionHash] = useState("")

  const handlePrepare = () => {
    startMission({ missionId: mission.id })
  }

  const handleVerify = () => {
    verifyMission({
      missionId: mission.id,
      transactionHash: (transactionHash
        || fallbackTransactionHash) as TransactionHash,
    })
  }

  const handleShare = () => {
    shareResult()
  }

  return (
    <Card tone="accent" bracketed>
      <Stack gap="m">
        <Inline align="between" wrap>
          <Stack gap="2xs">
            <Text tone="label" as="span">
              TODAY&apos;S HYPOTHESIS
            </Text>
            <Heading as="h2" tone="section">
              {mission.title}
            </Heading>
          </Stack>
          <Badge tone={statusToTone[mission.status]}>
            {mission.status.toUpperCase()}
          </Badge>
        </Inline>
        <Text tone="note">
          {mission.hypothesis}
        </Text>
        <Stack gap="2xs">
          <Text tone="label" as="span">
            CHAIN ACTION
          </Text>
          <Text>
            {mission.action.label}
          </Text>
          <Text tone="caption">
            {mission.action.chainName} · {mission.costLabel} ·{" "}
            {mission.riskLabel}
          </Text>
        </Stack>
        <TextField
          label="GNOSIS TRANSACTION HASH"
          value={transactionHash}
          onChange={(event) => setTransactionHash(event.currentTarget.value)}
          placeholder="0x…"
          hint={mission.action.verificationHint}
        />
        <Inline wrap>
          <Button variant="phosphor" onClick={handlePrepare}>
            Prepare
          </Button>
          <Button variant="primary" onClick={handleVerify}>
            Run experiment
          </Button>
          <Button variant="ghost" onClick={handleShare}>
            Share cast
          </Button>
        </Inline>
        <Text tone="caption">
          Share card: {share.title}
        </Text>
      </Stack>
    </Card>
  )
}
