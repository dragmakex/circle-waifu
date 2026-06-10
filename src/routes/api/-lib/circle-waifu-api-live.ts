/**
 * Pattern: HttpApiBuilder Handler Binding
 * Purpose: Bind Circle Waifu HTTP handlers to application workflows.
 */

import type {
  FarcasterAuthInput,
  MissionPrepareInput,
  MissionVerifyInput,
  NotificationSubscribeInput,
  PoolEnterInput,
  WaifuProfileInput,
} from "@/api/circle-waifu-schema"
import { DomainApi } from "@/api/domain-api"
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
import * as Layer from "effect/Layer"
import * as HttpApiBuilder from "effect/unstable/httpapi/HttpApiBuilder"

export const labSnapshotHandler = getLabDashboardSnapshot

export const missionPrepareHandler = (payload: MissionPrepareInput) =>
  prepareMission(payload)

export const missionVerifyHandler = (payload: MissionVerifyInput) =>
  verifyMission(payload)

export const poolSnapshotHandler = getPoolSnapshot

export const poolEnterHandler = (payload: PoolEnterInput) => enterPool(payload)

export const poolDrawStatusHandler = getPoolDrawStatus

export const waifuUpdateProfileHandler = (payload: WaifuProfileInput) =>
  updateWaifuProfile(payload)

export const farcasterAuthVerifyHandler = (payload: FarcasterAuthInput) =>
  verifyFarcasterAuth(payload)

export const notificationSubscribeHandler = (
  payload: NotificationSubscribeInput,
) => subscribeNotifications(payload)

export const CircleWaifuApiLive = HttpApiBuilder
  .group(
    DomainApi,
    "circleWaifu",
    (handlers) =>
      handlers
        .handle("labSnapshot", () => labSnapshotHandler)
        .handle(
          "missionPrepare",
          ({ payload }) => missionPrepareHandler(payload),
        )
        .handle("missionVerify", ({ payload }) => missionVerifyHandler(payload))
        .handle("poolSnapshot", () => poolSnapshotHandler)
        .handle("poolEnter", ({ payload }) => poolEnterHandler(payload))
        .handle("poolDrawStatus", () => poolDrawStatusHandler)
        .handle(
          "waifuUpdateProfile",
          ({ payload }) => waifuUpdateProfileHandler(payload),
        )
        .handle(
          "farcasterAuthVerify",
          ({ payload }) => farcasterAuthVerifyHandler(payload),
        )
        .handle(
          "notificationSubscribe",
          ({ payload }) => notificationSubscribeHandler(payload),
        ),
  )
  .pipe(Layer.provide(CircleWaifuApplicationLive))
