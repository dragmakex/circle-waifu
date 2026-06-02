import type { WeekId, WeeklyPool } from "@/api/circle-waifu-schema"
import * as Context from "effect/Context"
import * as DateTime from "effect/DateTime"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"

export type WeeklyPoolEvent =
  | {
    readonly _tag: "PoolEntered"
    readonly weekId: WeekId
    readonly occurredAt: DateTime.Utc
  }
  | {
    readonly _tag: "DrawStatusRead"
    readonly pool: WeeklyPool
    readonly occurredAt: DateTime.Utc
  }

export interface WeeklyPoolEventSink {
  readonly publish: (event: WeeklyPoolEvent) => Effect.Effect<void>
}

export const WeeklyPoolEventSink: Context.Service<
  WeeklyPoolEventSink,
  WeeklyPoolEventSink
> = Context.Service<WeeklyPoolEventSink>("WeeklyPoolEventSink")

export const WeeklyPoolEventSinkNoop = Layer.succeed(WeeklyPoolEventSink, {
  publish: () => Effect.void,
})
