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

type MissionCardProps = {
  readonly mission: DailyMission
  readonly share: ShareResult
}

const fallbackTransactionHash =
  "0x00000000000000000000000000000000000000000000000000000000c1rc1e" as TransactionHash

/**
 * Renders the current daily mission and verification controls.
 *
 * @param props - Component props.
 * @param props.mission - Daily mission read model.
 * @param props.share - Share card metadata.
 * @returns Mission detail card.
 */
export function MissionCard({ mission, share }: MissionCardProps) {
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
      transactionHash:
        (transactionHash || fallbackTransactionHash) as TransactionHash,
    })
  }

  const handleShare = () => {
    shareResult()
  }

  return (
    <Card tone="accent">
      <Stack gap="m">
        <Inline align="between" wrap>
          <Stack gap="2xs">
            <Text tone="label">
              TODAY&apos;S HYPOTHESIS
            </Text>
            <Heading as="h2" tone="section">
              {mission.title}
            </Heading>
          </Stack>
          <Badge tone={mission.status === "verified" ? "success" : "accent"}>
            {mission.status.toUpperCase()}
          </Badge>
        </Inline>
        <Text>
          {mission.hypothesis}
        </Text>
        <Text tone="muted">
          {mission.reason}
        </Text>
        <Stack gap="2xs">
          <Text tone="label">
            CHAIN ACTION
          </Text>
          <Text>
            {mission.action.label}
          </Text>
          <Text tone="caption">
            {mission.action.chainName} · {mission.costLabel}
          </Text>
          <Text tone="caption">
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
          <Button onClick={handlePrepare} variant="secondary">
            Prepare action
          </Button>
          <Button onClick={handleVerify}>
            Verify mission
          </Button>
          <Button onClick={handleShare} variant="ghost">
            Share result
          </Button>
        </Inline>
        <Text tone="caption">
          Share card: {share.title} · {share.castText}
        </Text>
      </Stack>
    </Card>
  )
}
