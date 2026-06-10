import type {
  LabDashboardSnapshot,
  MissionId,
  TransactionHash,
} from "@/api/circle-waifu-schema"
import { OrbitStage } from "@/design-system/primitives/OrbitStage"
import { useAtomSet, useAtomValue } from "@effect/atom-react"
import sdk from "@farcaster/miniapp-sdk"
import * as AsyncResult from "effect/unstable/reactivity/AsyncResult"
import { useEffect } from "react"
import {
  labDashboardAtom,
  shareResultAtom,
  startMissionAtom,
  verifyMissionAtom,
} from "./atoms"

const fallbackTransactionHash =
  "0x00000000000000000000000000000000000000000000000000000000c1rc1e" as TransactionHash

/**
 * Renders the Farcaster Mini App lab console shell.
 *
 * Single screen: animated waifu in the middle, four action buttons
 * orbiting around her. Nothing else.
 *
 * @returns Circle Waifu application UI.
 */
export function App() {
  const result = useAtomValue(labDashboardAtom)
  const startMission = useAtomSet(startMissionAtom)
  const verifyMission = useAtomSet(verifyMissionAtom)
  const shareResult = useAtomSet(shareResultAtom)

  useEffect(() => {
    if (result._tag !== "Initial" && !result.waiting) {
      void sdk.actions.ready()
    }
  }, [result])

  return AsyncResult
    .builder(result)
    .onInitial(() => <OrbitStage />)
    .onFailure(() => <OrbitStage />)
    .onSuccess((snapshot: LabDashboardSnapshot) => (
      <OrbitStage
        mood={snapshot.waifu.mood}
        waifuName={snapshot.waifu.name}
        onPrepare={() =>
          startMission({ missionId: snapshot.mission.id as MissionId })}
        onVerify={() =>
          verifyMission({
            missionId: snapshot.mission.id as MissionId,
            transactionHash: fallbackTransactionHash,
          })}
        onShare={() => shareResult()}
      />
    ))
    .render()
}
