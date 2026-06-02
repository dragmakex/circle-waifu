/**
 * Pattern: RpcServer Handler Binding
 * Purpose: Bind Circle Waifu RPC handlers to application workflows.
 */

import type {
  FarcasterAuthInput,
  MissionPrepareInput,
  MissionVerifyInput,
  NotificationSubscribeInput,
  PoolEnterInput,
  WaifuProfileInput,
} from "@/api/circle-waifu-schema"
import { DomainRpc } from "@/api/domain-rpc"
import {
  CircleWaifuApplicationLive,
  enterPool,
  getLabDashboardSnapshot,
  getPoolDrawStatus,
  getPoolSnapshot,
  prepareMission,
  subscribeNotifications,
  updateWaifuProfile,
  verifyFarcasterAuth,
  verifyMission,
} from "@/features/daily-lab/application"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"

export const createRpcHandlers = Effect.succeed({
  lab_snapshot: () => getLabDashboardSnapshot,

  mission_prepare: ({ input }: { input: MissionPrepareInput }) =>
    prepareMission(input),

  mission_verify: ({ input }: { input: MissionVerifyInput }) =>
    verifyMission(input),

  pool_snapshot: () => getPoolSnapshot,

  pool_enter: ({ input }: { input: PoolEnterInput }) => enterPool(input),

  pool_draw_status: () => getPoolDrawStatus,

  waifu_update_profile: ({ input }: { input: WaifuProfileInput }) =>
    updateWaifuProfile(input),

  farcaster_auth_verify: ({ input }: { input: FarcasterAuthInput }) =>
    verifyFarcasterAuth(input),

  notification_subscribe: ({ input }: { input: NotificationSubscribeInput }) =>
    subscribeNotifications(input),
})

export const CircleWaifuRpcLive = DomainRpc
  .toLayer(createRpcHandlers)
  .pipe(Layer.provide(CircleWaifuApplicationLive))
