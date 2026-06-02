/**
 * Pattern: HttpApi Definition
 * Purpose: Type-safe HTTP contract for Circle Waifu using effect/unstable/httpapi
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
import * as HttpApi from "effect/unstable/httpapi/HttpApi"
import * as HttpApiEndpoint from "effect/unstable/httpapi/HttpApiEndpoint"
import * as HttpApiGroup from "effect/unstable/httpapi/HttpApiGroup"

export class CircleWaifuApiGroup extends HttpApiGroup
  .make("circleWaifu")
  .add(
    HttpApiEndpoint.get("labSnapshot", "/lab/snapshot", {
      success: LabDashboardSnapshot,
    }),
  )
  .add(
    HttpApiEndpoint.post("missionPrepare", "/mission/prepare", {
      payload: MissionPrepareInput,
      success: LabDashboardSnapshot,
    }),
  )
  .add(
    HttpApiEndpoint.post("missionVerify", "/mission/verify", {
      payload: MissionVerifyInput,
      success: LabDashboardSnapshot,
    }),
  )
  .add(
    HttpApiEndpoint.get("poolSnapshot", "/pool/snapshot", {
      success: WeeklyPool,
    }),
  )
  .add(
    HttpApiEndpoint.post("poolEnter", "/pool/enter", {
      payload: PoolEnterInput,
      success: LabDashboardSnapshot,
    }),
  )
  .add(
    HttpApiEndpoint.get("poolDrawStatus", "/pool/draw-status", {
      success: WeeklyPool,
    }),
  )
  .add(
    HttpApiEndpoint.post("waifuUpdateProfile", "/waifu/profile", {
      payload: WaifuProfileInput,
      success: LabDashboardSnapshot,
    }),
  )
  .add(
    HttpApiEndpoint.post("farcasterAuthVerify", "/farcaster/auth", {
      payload: FarcasterAuthInput,
      success: LabDashboardSnapshot,
    }),
  )
  .add(
    HttpApiEndpoint.post("notificationSubscribe", "/notifications", {
      payload: NotificationSubscribeInput,
      success: LabDashboardSnapshot,
    }),
  )
{}

export class DomainApi extends HttpApi
  .make("api")
  .add(CircleWaifuApiGroup)
  .prefix("/api")
{}
