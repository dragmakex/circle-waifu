import { Card } from "@/design-system/components/Card"
import { Dock } from "@/design-system/components/Dock"
import { Text } from "@/design-system/components/Text"
import { ThemeToggle } from "@/design-system/components/ThemeToggle"
import { VerifyBurst } from "@/design-system/components/VerifyBurst"
import { AppShell } from "@/design-system/primitives/AppShell"
import { Stack } from "@/design-system/primitives/Stack"
import { useAtomValue } from "@effect/atom-react"
import sdk from "@farcaster/miniapp-sdk"
import * as AsyncResult from "effect/unstable/reactivity/AsyncResult"
import { useEffect, useRef, useState } from "react"
import { labDashboardAtom } from "./atoms"
import { LabConsole } from "./lab-console"
import { LogSheet } from "./log-sheet"
import { MissionSheet } from "./mission-sheet"
import { NameModal } from "./name-modal"
import { PoolSheet } from "./pool-sheet"
import { ProfileSheet } from "./profile-sheet"

type Screen = "home" | "mission" | "pool" | "profile" | "log"

const dockItems = [
  { key: "home" as const, label: "HOME", icon: "⌂" },
  { key: "pool" as const, label: "POOL", icon: "◈" },
  { key: "profile" as const, label: "WAIFU", icon: "☻" },
  { key: "log" as const, label: "LOG", icon: "≣" },
]

/**
 * Renders the Farcaster Mini App lab console shell.
 *
 * Composes the full prototype layout: a CRT-haloed phone bezel containing
 * the home stage, sheets, modal, dock and theme toggle, with a verify
 * burst overlay that triggers on a mission status transition.
 *
 * @returns Circle Waifu application UI.
 */
export function App() {
  const result = useAtomValue(labDashboardAtom)
  const [activeScreen, setActiveScreen] = useState<Screen>("home")
  const [nameModalOpen, setNameModalOpen] = useState(false)
  const [burstVisible, setBurstVisible] = useState(false)
  const lastVerifiedMissionId = useRef<string | null>(null)

  useEffect(() => {
    if (result._tag !== "Initial" && !result.waiting) {
      void sdk.actions.ready()
    }
  }, [result])

  // Fire the verify burst when a mission status flips to verified.
  useEffect(() => {
    if (result._tag !== "Success") {
      return
    }
    const snapshot = result.value
    if (snapshot.mission.status !== "verified") {
      return
    }
    if (lastVerifiedMissionId.current === snapshot.mission.id) {
      return
    }
    lastVerifiedMissionId.current = snapshot.mission.id
    setBurstVisible(true)
  }, [result])

  const closeSheet = () => setActiveScreen("home")
  const onMissionTap = () => setActiveScreen("mission")
  const onNameWaifu = () => setNameModalOpen(true)

  return (
    <AppShell>
      {AsyncResult
        .builder(result)
        .onInitial(() => (
          <Stack gap="m">
            <Card tone="subtle">
              <Text tone="muted">
                Booting Farcaster lab console…
              </Text>
            </Card>
          </Stack>
        ))
        .onFailure(() => (
          <Stack gap="m">
            <Card tone="danger">
              <Text tone="danger">
                Lab snapshot unavailable. Check the RPC console and retry.
              </Text>
            </Card>
          </Stack>
        ))
        .onSuccess((snapshot) => (
          <>
            <LabConsole
              snapshot={snapshot}
              onMissionTap={onMissionTap}
              onNameWaifu={onNameWaifu}
              onOpenLog={() => setActiveScreen("log")}
              onOpenPool={() => setActiveScreen("pool")}
              onOpenProfile={() => setActiveScreen("profile")}
            />
            <MissionSheet
              open={activeScreen === "mission"}
              onClose={closeSheet}
              snapshot={snapshot}
            />
            <PoolSheet
              open={activeScreen === "pool"}
              onClose={closeSheet}
              snapshot={snapshot}
            />
            <ProfileSheet
              open={activeScreen === "profile"}
              onClose={closeSheet}
              snapshot={snapshot}
            />
            <LogSheet
              open={activeScreen === "log"}
              onClose={closeSheet}
              snapshot={snapshot}
            />
            <NameModal
              open={nameModalOpen}
              currentName={snapshot.waifu.name}
              onClose={() => setNameModalOpen(false)}
              onSubmit={() => setNameModalOpen(false)}
            />
            <VerifyBurst
              visible={burstVisible}
              onDone={() => setBurstVisible(false)}
            />
          </>
        ))
        .render()}
      <ThemeToggle />
      <Dock
        items={dockItems}
        active={activeScreen}
        onSelect={(key) => setActiveScreen(key)}
      />
    </AppShell>
  )
}
