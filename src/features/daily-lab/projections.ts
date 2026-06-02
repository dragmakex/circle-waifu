/**
 * Pattern: Pure Projection Functions
 * Purpose: Derive Circle Waifu read-models from plain facts.
 */

import type {
  ActivityEntry,
  DailyMission,
  LabDashboardSnapshot,
  MissionId,
  ShareResult,
  StreakState,
  UserProfile,
  UtcDate,
  WaifuState,
  WalletAddress,
  WeekId,
  WeeklyPool,
} from "@/api/circle-waifu-schema"
import * as DateTime from "effect/DateTime"

const poolAddress =
  "0xC1rc1e000000000000000000000000000000Wa1f" as WalletAddress

export type CompletionFact = {
  readonly id: string
  readonly missionId: MissionId
  readonly missionDate: UtcDate
  readonly transactionHash: string
  readonly verifiedAt: DateTime.Utc
  readonly ticketGranted: number
}

export const utcDateFromDateTime = (now: DateTime.DateTime): UtcDate => {
  const date = DateTime.toDateUtc(now)
  const yyyy = String(date.getUTCFullYear())
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0")
  const dd = String(date.getUTCDate()).padStart(2, "0")

  return `${yyyy}-${mm}-${dd}` as UtcDate
}

export const weekIdFromDateTime = (now: DateTime.DateTime): WeekId => {
  const date = DateTime.toDateUtc(now)
  const firstDay = DateTime.toDateUtc(
    DateTime.makeUnsafe(Date.UTC(date.getUTCFullYear(), 0, 1)),
  )
  const dayOffset = Math.floor(
    (date.getTime() - firstDay.getTime()) / (24 * 60 * 60 * 1000),
  )
  const week = Math.floor((dayOffset + firstDay.getUTCDay()) / 7) + 1

  return `${date.getUTCFullYear()}-W${String(week).padStart(2, "0")}` as WeekId
}

export const missionIdForDate = (date: UtcDate): MissionId =>
  `mission-${date}-pool-contribution` as MissionId

export const deriveDailyMission = (
  today: UtcDate,
  completions: ReadonlyArray<CompletionFact>,
): DailyMission => {
  const missionId = missionIdForDate(today)
  const verified = completions.some((completion) =>
    completion.missionId === missionId
  )

  return {
    id: missionId,
    date: today,
    type: "contribute_pool",
    title: "Contribute to the weekly bento pool",
    hypothesis: "One capped CRC contribution increases network vitality.",
    reason:
      "The lab needs a visible pool seed so daily Circles activity creates shared upside instead of idle balance watching.",
    costLabel: "Suggested: 1 CRC. Daily cap: 5 CRC.",
    riskLabel:
      "Low-stakes contribution. Tickets are capped; this is not unlimited paid entry.",
    action: {
      label: "Send capped CRC to the pool safe",
      preferredPath: "circles_deeplink",
      chainName: "Gnosis Chain",
      chainId: "eip155:100",
      amountCrc: 1,
      targetAddress: poolAddress,
      deepLinkUrl: `https://app.aboutcircles.com/send/${poolAddress}?amount=1`,
      verificationHint:
        "Return with the Gnosis transaction hash; the MVP records one verified mission per UTC day.",
    },
    status: verified ? "verified" : "ready",
  }
}

export const deriveStreak = (
  today: UtcDate,
  completions: ReadonlyArray<CompletionFact>,
): StreakState => {
  const completedDates = [
    ...new Set(completions.map((item) => item.missionDate)),
  ]
    .sort()
  const lastCompletedDate = completedDates.at(-1) ?? null
  let current = 0
  let cursor = today

  for (let index = completedDates.length - 1; index >= 0; index--) {
    const completedDate = completedDates[index]
    if (completedDate !== cursor) {
      break
    }
    current += 1
    cursor = previousUtcDate(cursor)
  }

  const longest = Math.max(current, completedDates.length === 0 ? 0 : 1)

  return {
    current,
    longest,
    lastCompletedDate,
    integrity: current > 0
      ? "stable"
      : lastCompletedDate === null
      ? "needs_sample"
      : "broken",
  }
}

const previousUtcDate = (date: UtcDate): UtcDate => {
  const [yearText, monthText, dayText] = date.split("-")
  const previous = DateTime.toDateUtc(
    DateTime.makeUnsafe(
      Date.UTC(Number(yearText), Number(monthText) - 1, Number(dayText) - 1),
    ),
  )
  const yyyy = String(previous.getUTCFullYear())
  const mm = String(previous.getUTCMonth() + 1).padStart(2, "0")
  const dd = String(previous.getUTCDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}` as UtcDate
}

export const deriveWeeklyPool = (
  now: DateTime.DateTime,
  completions: ReadonlyArray<CompletionFact>,
): WeeklyPool => {
  const weekId = weekIdFromDateTime(now)
  const date = DateTime.toDateUtc(now)
  const day = date.getUTCDay()
  const mondayOffset = day === 0 ? -6 : 1 - day
  const start = DateTime.toDateUtc(
    DateTime.makeUnsafe(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate() + mondayOffset,
      ),
    ),
  )
  const end = DateTime.toDateUtc(
    DateTime.makeUnsafe(start.getTime() + 7 * 24 * 60 * 60 * 1000),
  )
  const tickets = completions.reduce((sum, item) => sum + item.ticketGranted, 0)
  const totalTickets = Math.max(tickets + 17, tickets)

  return {
    weekId,
    startTime: DateTime.makeUnsafe(start.getTime()),
    endTime: DateTime.makeUnsafe(end.getTime()),
    drawTime: DateTime.makeUnsafe(end.getTime()),
    poolAddress,
    balanceCrc: 42 + tickets,
    userTickets: tickets,
    totalTickets,
    oddsLabel: tickets === 0
      ? "Complete one mission to enter"
      : `${tickets}/${totalTickets}`,
    drawStatus: "open",
    prizeSplit: [
      { label: "1st", percent: 50 },
      { label: "2nd", percent: 25 },
      { label: "3rd", percent: 15 },
      { label: "Rollover", percent: 10 },
    ],
    winners: [
      { displayName: "Prior lab tech", prizeCrc: 12 },
    ],
  }
}

export const deriveWaifuState = (
  name: string,
  streak: StreakState,
  completions: ReadonlyArray<CompletionFact>,
): WaifuState => {
  const xp = completions.length * 25
  const level = Math.floor(xp / 100) + 1
  const verifiedToday = streak.current > 0

  return {
    name,
    mood: verifiedToday ? "pleased" : "undersampled",
    level,
    xp,
    nextLevelXp: level * 100,
    activeCosmetic: "amber lab coat",
    expression: verifiedToday ? "(^_^)" : "(¬_¬)",
    labNotes: [
      verifiedToday
        ? "Observation recorded. Streak integrity: stable."
        : "Your CRC aura is under-sampled. Perform one field experiment.",
      "Probability did not favor us last draw. The lab continues.",
    ],
  }
}

export const deriveActivity = (
  completions: ReadonlyArray<CompletionFact>,
): ReadonlyArray<ActivityEntry> =>
  [...completions]
    .sort((left, right) =>
      right.verifiedAt.epochMilliseconds - left.verifiedAt.epochMilliseconds
    )
    .map((completion) => ({
      id: completion.id,
      label: "Mission verified",
      detail: `Ticket granted for ${completion.transactionHash.slice(0, 10)}…`,
      occurredAt: completion.verifiedAt,
    }))

export const deriveShareResult = (
  user: UserProfile,
  streak: StreakState,
): ShareResult => ({
  title: "Circle Waifu lab result",
  url: `/?fid=${user.fid}&card=streak`,
  castText:
    `Observation recorded: ${user.displayName} reached streak ${streak.current} in Circle Waifu.`,
  imageAlt: "Retro research terminal showing Circle Waifu streak state",
})

export const deriveLabDashboardSnapshot = (
  user: UserProfile,
  waifuName: string,
  now: DateTime.DateTime,
  completions: ReadonlyArray<CompletionFact>,
): LabDashboardSnapshot => {
  const today = utcDateFromDateTime(now)
  const streak = deriveStreak(today, completions)
  const waifu = deriveWaifuState(waifuName, streak, completions)

  return {
    user,
    mission: deriveDailyMission(today, completions),
    streak,
    weeklyPool: deriveWeeklyPool(now, completions),
    waifu,
    activity: deriveActivity(completions),
    share: deriveShareResult(user, streak),
  }
}
