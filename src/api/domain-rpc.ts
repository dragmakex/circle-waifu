/**
 * Pattern: RpcGroup API Definition
 * Purpose: Type-safe Circle Waifu RPC contract using effect/unstable/rpc
 * See: docs/architecture/effect-simple-made-easy-mapping.md
 */

import {
  FarcasterAuthInput,
  LabDashboardSnapshot,
  MissionPrepareInput,
  MissionVerifyInput,
  NotificationSubscribeInput,
  PoolEnterInput,
  WaifuProfileInput,
  WeeklyPool,
} from "@/api/circle-waifu-schema"
import * as Rpc from "effect/unstable/rpc/Rpc"
import * as RpcGroup from "effect/unstable/rpc/RpcGroup"

export class CircleWaifuRpc extends RpcGroup.make(
  Rpc.make("lab_snapshot", {
    success: LabDashboardSnapshot,
  }),
  Rpc.make("mission_prepare", {
    success: LabDashboardSnapshot,
    payload: { input: MissionPrepareInput },
  }),
  Rpc.make("mission_verify", {
    success: LabDashboardSnapshot,
    payload: { input: MissionVerifyInput },
  }),
  Rpc.make("pool_snapshot", {
    success: WeeklyPool,
  }),
  Rpc.make("pool_enter", {
    success: LabDashboardSnapshot,
    payload: { input: PoolEnterInput },
  }),
  Rpc.make("pool_draw_status", {
    success: WeeklyPool,
  }),
  Rpc.make("waifu_update_profile", {
    success: LabDashboardSnapshot,
    payload: { input: WaifuProfileInput },
  }),
  Rpc.make("farcaster_auth_verify", {
    success: LabDashboardSnapshot,
    payload: { input: FarcasterAuthInput },
  }),
  Rpc.make("notification_subscribe", {
    success: LabDashboardSnapshot,
    payload: { input: NotificationSubscribeInput },
  }),
) {}

export class DomainRpc extends CircleWaifuRpc {}
