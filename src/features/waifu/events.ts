import type { WaifuState } from "@/api/circle-waifu-schema"
import * as Context from "effect/Context"
import * as DateTime from "effect/DateTime"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"

export type WaifuEvent = {
  readonly _tag: "WaifuProfileUpdated"
  readonly waifu: WaifuState
  readonly occurredAt: DateTime.Utc
}

export interface WaifuEventSink {
  readonly publish: (event: WaifuEvent) => Effect.Effect<void>
}

export const WaifuEventSink: Context.Service<WaifuEventSink, WaifuEventSink> =
  Context.Service<WaifuEventSink>("WaifuEventSink")

export const WaifuEventSinkNoop = Layer.succeed(WaifuEventSink, {
  publish: () => Effect.void,
})
