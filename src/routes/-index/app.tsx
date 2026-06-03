import { Footer } from "@/component/Footer"
import { Card } from "@/design-system/components/Card"
import { Dock } from "@/design-system/components/Dock"
import { Page } from "@/design-system/components/Page"
import { PageHeader } from "@/design-system/components/PageHeader"
import { Text } from "@/design-system/components/Text"
import { ThemeToggle } from "@/design-system/components/ThemeToggle"
import { Stack } from "@/design-system/primitives/Stack"
import { useAtomValue } from "@effect/atom-react"
import sdk from "@farcaster/miniapp-sdk"
import * as AsyncResult from "effect/unstable/reactivity/AsyncResult"
import { useEffect, useState } from "react"
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
 * @returns Circle Waifu application UI.
 */
export function App() {
  const result = useAtomValue(labDashboardAtom)
  const [activeScreen, setActiveScreen] = useState<Screen>("home")
  const [nameModalOpen, setNameModalOpen] = useState(false)

  useEffect(() => {
    if (result._tag !== "Initial" && !result.waiting) {
      void sdk.actions.ready()
    }
  }, [result])

  const handleSelect = (key: Screen) => {
    if (key === "home") {
      setActiveScreen("home")
      return
    }
    setActiveScreen(key)
  }

  const closeSheet = () => setActiveScreen("home")

  return (
    <Page>
      <Stack gap="l">
        <PageHeader
          title="CIRCLE WAIFU"
          description="Daily CRC lab. One mission. One observation. One weekly bento ticket."
        />
        {AsyncResult
          .builder(result)
          .onInitial(() => (
            <Card tone="subtle">
              <Text tone="muted">
                Booting Farcaster lab console…
              </Text>
            </Card>
          ))
          .onFailure(() => (
            <Card tone="danger">
              <Text tone="danger">
                Lab snapshot unavailable. Check the RPC console and retry.
              </Text>
            </Card>
          ))
          .onSuccess((snapshot) => (
            <>
              <LabConsole snapshot={snapshot} />
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
            </>
          ))
          .render()}
        <Footer />
      </Stack>
      <Dock
        items={dockItems}
        active={activeScreen}
        onSelect={handleSelect}
      />
      <ThemeToggle />
    </Page>
  )
}
