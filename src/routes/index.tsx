import { getLabDashboardSnapshot } from "@/features/daily-lab/application"
import { HydrationBoundary } from "@/lib/atom-hydration"
import { dehydrate } from "@/lib/atom-utils"
import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import * as Clock from "effect/Clock"
import * as Effect from "effect/Effect"
import { pipe } from "effect/Function"
import * as AsyncResult from "effect/unstable/reactivity/AsyncResult"
import { App } from "./-index/app"
import { labDashboardAtom } from "./-index/atoms"
import { serverRuntime } from "./api/$"

const getLabDashboardHydration = pipe(
  getLabDashboardSnapshot,
  Effect.flatMap((snapshot) =>
    pipe(
      Clock.currentTimeMillis,
      Effect.map((dehydratedAt) => [
        dehydrate(
          labDashboardAtom.remote,
          AsyncResult.success(snapshot),
          dehydratedAt,
        ),
      ]),
    )
  ),
)

const getLabDashboard = createServerFn({ method: "GET" }).handler(() =>
  serverRuntime.runPromise(getLabDashboardHydration)
)

export const Route = createFileRoute("/")({
  loader: () => getLabDashboard(),
  component: AppWrapper,
})

/**
 * Provides SSR atom hydration for the Circle Waifu app route.
 *
 * @returns Hydrated app route component.
 */
function AppWrapper() {
  const dehydrated = Route.useLoaderData()
  return (
    <HydrationBoundary state={dehydrated}>
      <App />
    </HydrationBoundary>
  )
}
