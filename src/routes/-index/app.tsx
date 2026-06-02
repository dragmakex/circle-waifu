import { Footer } from "@/component/Footer"
import { Card } from "@/design-system/components/Card"
import { Page } from "@/design-system/components/Page"
import { PageHeader } from "@/design-system/components/PageHeader"
import { Text } from "@/design-system/components/Text"
import { Stack } from "@/design-system/primitives/Stack"
import { useAtomValue } from "@effect/atom-react"
import sdk from "@farcaster/miniapp-sdk"
import * as AsyncResult from "effect/unstable/reactivity/AsyncResult"
import { useEffect } from "react"
import { labDashboardAtom } from "./atoms"
import { LabConsole } from "./lab-console"

/**
 * Renders the Farcaster Mini App lab console shell.
 *
 * @returns Circle Waifu application UI.
 */
export function App() {
  const result = useAtomValue(labDashboardAtom)

  useEffect(() => {
    if (result._tag !== "Initial" && !result.waiting) {
      void sdk.actions.ready()
    }
  }, [result])

  return (
    <Page>
      <Stack gap="xl">
        <PageHeader
          title="Circle Waifu"
          description="Daily CRC lab: one useful onchain mission, one companion observation, one capped weekly bento ticket."
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
          .onSuccess((snapshot) => <LabConsole snapshot={snapshot} />)
          .render()}
      </Stack>
      <Footer />
    </Page>
  )
}
