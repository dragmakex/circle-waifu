/**
 * Pattern: Effect.gen Workflow
 * Purpose: Circle Waifu use-case orchestration with repository and event sinks.
 */

import type {
  FarcasterAuthInput,
  LabDashboardSnapshot,
  MissionPrepareInput,
  MissionVerifyInput,
  NotificationSubscribeInput,
  PoolEnterInput,
  WaifuProfileInput,
  WeeklyPool,
} from "@/api/circle-waifu-schema"
import { CircleWaifuRepository } from "@/db/circle-waifu-repository"
import {
  type DailyLabEvent,
  DailyLabEventSink,
  DailyLabEventSinkNoop,
} from "@/features/daily-lab/events"
import {
  deriveLabDashboardSnapshot,
  deriveWeeklyPool,
  utcDateFromDateTime,
} from "@/features/daily-lab/projections"
import { WaifuEventSinkNoop } from "@/features/waifu/events"
import { WeeklyPoolEventSinkNoop } from "@/features/weekly-pool/events"
import * as DateTime from "effect/DateTime"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"

const publishDailyLabEvent = (event: DailyLabEvent) =>
  Effect.flatMap(DailyLabEventSink.asEffect(), (sink) => sink.publish(event))

export const getLabDashboardSnapshot: Effect.Effect<
  LabDashboardSnapshot,
  never,
  CircleWaifuRepository
> = Effect
  .gen(function*() {
    const repository = yield* CircleWaifuRepository
    const now = yield* DateTime.now
    const [user, waifuName, completions] = yield* Effect.all([
      repository.getUser,
      repository.getWaifuName,
      repository.listCompletions,
    ])

    return deriveLabDashboardSnapshot(user, waifuName, now, completions)
  })
  .pipe(Effect.withSpan("CircleWaifu.snapshot"))

export const prepareMission = Effect.fn("CircleWaifu.mission.prepare")(
  function*(input: MissionPrepareInput) {
    const repository = yield* CircleWaifuRepository
    const snapshot = yield* getLabDashboardSnapshot

    yield* repository.prepareMission(input.missionId)
    yield* publishDailyLabEvent({
      _tag: "MissionPrepared",
      mission: snapshot.mission,
      occurredAt: yield* DateTime.now,
    })

    return {
      ...snapshot,
      mission: { ...snapshot.mission, status: "prepared" as const },
    }
  },
)

export const verifyMission = Effect.fn("CircleWaifu.mission.verify")(
  function*(input: MissionVerifyInput) {
    const repository = yield* CircleWaifuRepository
    const now = yield* DateTime.now
    const today = utcDateFromDateTime(now)

    yield* repository.verifyMission({
      missionId: input.missionId,
      missionDate: today,
      transactionHash: input.transactionHash,
      verifiedAt: now,
    })
    yield* publishDailyLabEvent({
      _tag: "MissionVerified",
      missionId: input.missionId,
      transactionHash: input.transactionHash,
      occurredAt: now,
    })

    return yield* getLabDashboardSnapshot
  },
)

export const getPoolSnapshot: Effect.Effect<
  WeeklyPool,
  never,
  CircleWaifuRepository
> = Effect
  .gen(function*() {
    const repository = yield* CircleWaifuRepository
    const now = yield* DateTime.now
    const completions = yield* repository.listCompletions

    return deriveWeeklyPool(now, completions)
  })
  .pipe(Effect.withSpan("CircleWaifu.pool.snapshot"))

export const enterPool = (input: PoolEnterInput) =>
  verifyMission({
    missionId: input.missionId,
    transactionHash: input.transactionHash,
  })
    .pipe(Effect.withSpan("CircleWaifu.pool.enter"))

export const getPoolDrawStatus = getPoolSnapshot.pipe(
  Effect.withSpan("CircleWaifu.pool.drawStatus"),
)

export const updateWaifuProfile = Effect.fn("CircleWaifu.waifu.updateProfile")(
  function*(input: WaifuProfileInput) {
    const repository = yield* CircleWaifuRepository
    yield* repository.updateWaifuProfile(input)
    return yield* getLabDashboardSnapshot
  },
)

export const verifyFarcasterAuth = (_input: FarcasterAuthInput) =>
  getLabDashboardSnapshot.pipe(Effect.withSpan("CircleWaifu.farcaster.auth"))

export const subscribeNotifications = Effect.fn(
  "CircleWaifu.notifications.subscribe",
)(function*(input: NotificationSubscribeInput) {
  const repository = yield* CircleWaifuRepository
  yield* repository.subscribeNotifications(input)
  return yield* getLabDashboardSnapshot
})

export const CircleWaifuApplicationLive = Layer.mergeAll(
  CircleWaifuRepository.layer,
  DailyLabEventSinkNoop,
  WeeklyPoolEventSinkNoop,
  WaifuEventSinkNoop,
)
