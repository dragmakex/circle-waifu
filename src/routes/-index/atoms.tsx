/**
 * Pattern: Effect-native Atoms (React)
 * Purpose: Circle Waifu dashboard state with SSR hydration support.
 */

import { ApiClient } from "@/api/api-client"
import type {
  LabDashboardSnapshot,
  MissionPrepareInput,
  MissionVerifyInput,
} from "@/api/circle-waifu-schema"
import { LabDashboardSnapshot as LabDashboardSnapshotSchema } from "@/api/circle-waifu-schema"
import { serializable } from "@/lib/atom-utils"
import * as Context from "effect/Context"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Schema from "effect/Schema"
import * as AsyncResult from "effect/unstable/reactivity/AsyncResult"
import * as Atom from "effect/unstable/reactivity/Atom"
import * as RpcClientError from "effect/unstable/rpc/RpcClientError"

const LabDashboardAsyncResultSchema = AsyncResult.Schema({
  success: LabDashboardSnapshotSchema,
  error: RpcClientError.RpcClientError,
})

class Api extends Context.Service<Api>()("@app/index/CircleWaifuApi", {
  make: Effect.gen(function*() {
    const { rpc } = yield* ApiClient

    return {
      snapshot: () => rpc.lab_snapshot(),
      prepareMission: (input: MissionPrepareInput) =>
        rpc.mission_prepare({ input }),
      verifyMission: (input: MissionVerifyInput) =>
        rpc.mission_verify({ input }),
      shareResult: () => rpc.lab_snapshot(),
    } as const
  }),
}) {
  static readonly layer = Layer.effect(this, this.make).pipe(
    Layer.provide(ApiClient.layer),
  )
}

export const runtime = Atom.runtime(Api.layer)

type ReplaceValue<A> = {
  readonly _tag: "Replace"
  readonly value: A
}

/**
 * Wraps a remote async atom so successful snapshots can be replaced locally.
 *
 * @param remoteAtom - Remote atom populated through RPC.
 * @returns Writable atom with refresh support.
 */
function makeWritableAsyncAtom<A>(
  remoteAtom: Atom.Atom<
    AsyncResult.AsyncResult<A, RpcClientError.RpcClientError>
  >,
) {
  return Atom.writable(
    (get) => get(remoteAtom),
    (ctx, update: ReplaceValue<A>) => {
      ctx.setSelf(AsyncResult.success(update.value))
    },
    (refresh) => {
      refresh(remoteAtom)
    },
  )
}

const labDashboardRemoteAtom = runtime
  .atom(
    Effect.gen(function*() {
      const api = yield* Api
      return yield* api.snapshot()
    }),
  )
  .pipe(
    serializable({
      key: "@app/index/circle-waifu-dashboard",
      schema: Schema.toCodecJson(LabDashboardAsyncResultSchema),
    }),
  )

export const labDashboardAtom = Object.assign(
  makeWritableAsyncAtom(labDashboardRemoteAtom),
  { remote: labDashboardRemoteAtom },
)

/**
 * Derives a read-only async atom from the shared lab dashboard snapshot.
 *
 * @param selector - Projection applied to successful dashboard snapshots.
 * @returns Derived atom with a matching remote projection.
 */
function mapDashboardAtom<A>(selector: (snapshot: LabDashboardSnapshot) => A) {
  const remote = labDashboardRemoteAtom.pipe(
    Atom.map((result) => AsyncResult.map(result, selector)),
  )

  return Object.assign(
    labDashboardAtom.pipe(
      Atom.map((result) => AsyncResult.map(result, selector)),
    ),
    { remote },
  )
}

export const dailyMissionAtom = mapDashboardAtom((snapshot) => snapshot.mission)

export const streakAtom = mapDashboardAtom((snapshot) => snapshot.streak)

export const weeklyPoolAtom = mapDashboardAtom((snapshot) =>
  snapshot.weeklyPool
)

export const waifuStateAtom = mapDashboardAtom((snapshot) => snapshot.waifu)

const replaceDashboardSnapshot = (
  get: {
    readonly set: (
      atom: typeof labDashboardAtom,
      update: ReplaceValue<LabDashboardSnapshot>,
    ) => void
  },
  snapshot: LabDashboardSnapshot,
) => {
  get.set(labDashboardAtom, { _tag: "Replace", value: snapshot })
}

export const startMissionAtom = runtime.fn<MissionPrepareInput>()(
  Effect.fnUntraced(function*(input, get) {
    const api = yield* Api
    const snapshot = yield* api.prepareMission(input)
    replaceDashboardSnapshot(get, snapshot)
    return snapshot
  }),
)

export const verifyMissionAtom = runtime.fn<MissionVerifyInput>()(
  Effect.fnUntraced(function*(input, get) {
    const api = yield* Api
    const snapshot = yield* api.verifyMission(input)
    replaceDashboardSnapshot(get, snapshot)
    return snapshot
  }),
)

export const shareResultAtom = runtime.fn<void>()(
  Effect.fnUntraced(function*(_, get) {
    const api = yield* Api
    const snapshot = yield* api.shareResult()
    replaceDashboardSnapshot(get, snapshot)
    return snapshot.share
  }),
)
