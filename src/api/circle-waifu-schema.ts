import * as Schema from "effect/Schema"

export const FarcasterFid = Schema.Number.pipe(Schema.brand("FarcasterFid"))
export type FarcasterFid = typeof FarcasterFid.Type

export const WalletAddress = Schema.String.pipe(Schema.brand("WalletAddress"))
export type WalletAddress = typeof WalletAddress.Type

export const TransactionHash = Schema.String.pipe(
  Schema.brand("TransactionHash"),
)
export type TransactionHash = typeof TransactionHash.Type

export const UtcDate = Schema.String.pipe(Schema.brand("UtcDate"))
export type UtcDate = typeof UtcDate.Type

export const WeekId = Schema.String.pipe(Schema.brand("WeekId"))
export type WeekId = typeof WeekId.Type

export const MissionId = Schema.String.pipe(Schema.brand("MissionId"))
export type MissionId = typeof MissionId.Type

export const UserProfile = Schema.Struct({
  fid: FarcasterFid,
  username: Schema.String,
  displayName: Schema.String,
  primaryWallet: WalletAddress,
  circlesProfile: WalletAddress,
  notificationStatus: Schema.Literals(["unknown", "enabled", "disabled"]),
})
export type UserProfile = typeof UserProfile.Type

export const MissionType = Schema.Literals([
  "contribute_pool",
  "tip_human",
  "trust_review",
  "support_service",
])
export type MissionType = typeof MissionType.Type

export const MissionAction = Schema.Struct({
  label: Schema.String,
  preferredPath: Schema.Literals(["farcaster_wallet", "circles_deeplink"]),
  chainName: Schema.String,
  chainId: Schema.String,
  amountCrc: Schema.Number,
  targetAddress: WalletAddress,
  deepLinkUrl: Schema.String,
  verificationHint: Schema.String,
})
export type MissionAction = typeof MissionAction.Type

export const DailyMission = Schema.Struct({
  id: MissionId,
  date: UtcDate,
  type: MissionType,
  title: Schema.String,
  hypothesis: Schema.String,
  reason: Schema.String,
  costLabel: Schema.String,
  riskLabel: Schema.String,
  action: MissionAction,
  status: Schema.Literals(["ready", "prepared", "verified"]),
})
export type DailyMission = typeof DailyMission.Type

export const StreakState = Schema.Struct({
  current: Schema.Number,
  longest: Schema.Number,
  lastCompletedDate: Schema.NullOr(UtcDate),
  integrity: Schema.Literals(["stable", "needs_sample", "broken"]),
})
export type StreakState = typeof StreakState.Type

export const WeeklyPool = Schema.Struct({
  weekId: WeekId,
  startTime: Schema.DateTimeUtc,
  endTime: Schema.DateTimeUtc,
  drawTime: Schema.DateTimeUtc,
  poolAddress: WalletAddress,
  balanceCrc: Schema.Number,
  userTickets: Schema.Number,
  totalTickets: Schema.Number,
  oddsLabel: Schema.String,
  drawStatus: Schema.Literals(["open", "drawing", "complete"]),
  prizeSplit: Schema.Array(
    Schema.Struct({ label: Schema.String, percent: Schema.Number }),
  ),
  winners: Schema.Array(
    Schema.Struct({ displayName: Schema.String, prizeCrc: Schema.Number }),
  ),
})
export type WeeklyPool = typeof WeeklyPool.Type

export const WaifuState = Schema.Struct({
  name: Schema.String,
  mood: Schema.Literals(["curious", "focused", "pleased", "undersampled"]),
  level: Schema.Number,
  xp: Schema.Number,
  nextLevelXp: Schema.Number,
  activeCosmetic: Schema.String,
  expression: Schema.String,
  labNotes: Schema.Array(Schema.String),
})
export type WaifuState = typeof WaifuState.Type

export const ActivityEntry = Schema.Struct({
  id: Schema.String,
  label: Schema.String,
  detail: Schema.String,
  occurredAt: Schema.DateTimeUtc,
})
export type ActivityEntry = typeof ActivityEntry.Type

export const ShareResult = Schema.Struct({
  title: Schema.String,
  url: Schema.String,
  castText: Schema.String,
  imageAlt: Schema.String,
})
export type ShareResult = typeof ShareResult.Type

export const LabDashboardSnapshot = Schema.Struct({
  user: UserProfile,
  mission: DailyMission,
  streak: StreakState,
  weeklyPool: WeeklyPool,
  waifu: WaifuState,
  activity: Schema.Array(ActivityEntry),
  share: ShareResult,
})
export type LabDashboardSnapshot = typeof LabDashboardSnapshot.Type

export const MissionPrepareInput = Schema.Struct({
  missionId: MissionId,
})
export type MissionPrepareInput = typeof MissionPrepareInput.Type

export const MissionVerifyInput = Schema.Struct({
  missionId: MissionId,
  transactionHash: TransactionHash,
})
export type MissionVerifyInput = typeof MissionVerifyInput.Type

export const PoolEnterInput = Schema.Struct({
  missionId: MissionId,
  transactionHash: TransactionHash,
})
export type PoolEnterInput = typeof PoolEnterInput.Type

export const WaifuProfileInput = Schema.Struct({
  name: Schema.NonEmptyString,
})
export type WaifuProfileInput = typeof WaifuProfileInput.Type

export const FarcasterAuthInput = Schema.Struct({
  token: Schema.String,
})
export type FarcasterAuthInput = typeof FarcasterAuthInput.Type

export const NotificationSubscribeInput = Schema.Struct({
  token: Schema.String,
})
export type NotificationSubscribeInput = typeof NotificationSubscribeInput.Type

export class MissionAlreadyVerified
  extends Schema.TaggedErrorClass<MissionAlreadyVerified>()(
    "MissionAlreadyVerified",
    { missionId: MissionId },
    { httpApiStatus: 409 },
  )
{}
