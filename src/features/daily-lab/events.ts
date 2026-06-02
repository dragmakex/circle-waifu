/**
 * Pattern: Event Sink Boundary
 * Purpose: Daily lab domain events for replication and notifications.
 */

import type {
  DailyMission,
  MissionId,
  TransactionHash,
} from "@/api/circle-waifu-schema"
import * as Context from "effect/Context"
import * as DateTime from "effect/DateTime"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"

export type DailyLabEvent =
  | {
    readonly _tag: "MissionPrepared"
    readonly mission: DailyMission
    readonly occurredAt: DateTime.Utc
  }
  | {
    readonly _tag: "MissionVerified"
    readonly missionId: MissionId
    readonly transactionHash: TransactionHash
    readonly occurredAt: DateTime.Utc
  }

export interface DailyLabEventSink {
  readonly publish: (event: DailyLabEvent) => Effect.Effect<void>
}

export const DailyLabEventSink: Context.Service<
  DailyLabEventSink,
  DailyLabEventSink
> = Context.Service<DailyLabEventSink>("DailyLabEventSink")

export const DailyLabEventSinkNoop = Layer.succeed(DailyLabEventSink, {
  publish: () => Effect.void,
})
