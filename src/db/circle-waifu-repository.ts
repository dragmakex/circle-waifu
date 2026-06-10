/**
 * Pattern: Context.Service + Repository.Adapter
 * Purpose: Circle Waifu persistence with Postgres/PGlite dual-adapter support.
 */

import type {
  MissionId,
  NotificationSubscribeInput,
  TransactionHash,
  UserProfile,
  UtcDate,
  WaifuProfileInput,
} from "@/api/circle-waifu-schema"
import {
  FarcasterFid as FarcasterFidSchema,
  TransactionHash as TransactionHashSchema,
  UtcDate as UtcDateSchema,
  WalletAddress as WalletAddressSchema,
} from "@/api/circle-waifu-schema"
import {
  labUsersTable,
  missionCompletionsTable,
  waifuProfilesTable,
} from "@/db/schema"
import type { CompletionFact } from "@/features/daily-lab/projections"
import { PGlite } from "@electric-sql/pglite"
import { eq, sql } from "drizzle-orm"
import { drizzle as drizzlePglite } from "drizzle-orm/pglite"
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js"
import * as Config from "effect/Config"
import * as Context from "effect/Context"
import * as DateTime from "effect/DateTime"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Option from "effect/Option"
import * as Schema from "effect/Schema"
import postgres from "postgres"

type RepositoryDatabaseConfig =
  | { readonly kind: "pglite"; readonly dataDir: string | undefined }
  | { readonly kind: "postgres"; readonly databaseUrl: string }

type CompletionRow = typeof missionCompletionsTable.$inferSelect

type WaifuRow = typeof waifuProfilesTable.$inferSelect

const defaultFid = Schema.decodeUnknownSync(FarcasterFidSchema)(1138)
const defaultWallet = Schema.decodeUnknownSync(WalletAddressSchema)(
  "0x0000000000000000000000000000000000001138",
)
const decodeWallet = Schema.decodeUnknownSync(WalletAddressSchema)
const decodeFid = Schema.decodeUnknownSync(FarcasterFidSchema)
const decodeUtcDate = Schema.decodeUnknownSync(UtcDateSchema)
const decodeTxHash = Schema.decodeUnknownSync(TransactionHashSchema)
const decodeDateTime = Schema.decodeUnknownSync(Schema.DateTimeUtcFromDate)

const defaultUser: UserProfile = {
  fid: defaultFid,
  username: "labtech",
  displayName: "Lab Tech",
  primaryWallet: defaultWallet,
  circlesProfile: defaultWallet,
  notificationStatus: "unknown",
}

const createTablesSql = [
  sql`
    CREATE TABLE IF NOT EXISTS lab_users (
      fid integer PRIMARY KEY,
      username text NOT NULL,
      display_name text NOT NULL,
      primary_wallet text NOT NULL,
      circles_profile text NOT NULL,
      notification_status text NOT NULL
    )
  `,
  sql`
    CREATE TABLE IF NOT EXISTS mission_completions (
      id text PRIMARY KEY,
      fid integer NOT NULL,
      mission_id text NOT NULL,
      mission_date text NOT NULL,
      transaction_hash text NOT NULL,
      verified_at timestamptz NOT NULL,
      ticket_granted integer NOT NULL
    )
  `,
  sql`
    CREATE TABLE IF NOT EXISTS waifu_profiles (
      fid integer PRIMARY KEY,
      name text NOT NULL,
      active_cosmetic text NOT NULL
    )
  `,
] as const

const liveDatabaseConfig = Effect.gen(function*() {
  const databaseUrl = yield* Config.option(Config.string("DATABASE_URL"))
  return Option.match(databaseUrl, {
    onNone: () =>
      ({
        kind: "pglite",
        dataDir: undefined,
      }) satisfies RepositoryDatabaseConfig,
    onSome: (url) =>
      ({
        kind: "postgres",
        databaseUrl: url,
      }) satisfies RepositoryDatabaseConfig,
  })
})

const toUser = (row: typeof labUsersTable.$inferSelect): UserProfile => ({
  fid: decodeFid(row.fid),
  username: row.username,
  displayName: row.displayName,
  primaryWallet: decodeWallet(row.primaryWallet),
  circlesProfile: decodeWallet(row.circlesProfile),
  notificationStatus: row.notificationStatus === "enabled"
    ? "enabled"
    : row.notificationStatus === "disabled"
    ? "disabled"
    : "unknown",
})

const toCompletion = (row: CompletionRow): CompletionFact => ({
  id: row.id,
  missionId: row.missionId as MissionId,
  missionDate: decodeUtcDate(row.missionDate),
  transactionHash: decodeTxHash(row.transactionHash),
  verifiedAt: decodeDateTime(row.verifiedAt),
  ticketGranted: row.ticketGranted,
})

type CircleWaifuRepositoryShape = {
  readonly getUser: Effect.Effect<UserProfile>
  readonly getWaifuName: Effect.Effect<string>
  readonly listCompletions: Effect.Effect<ReadonlyArray<CompletionFact>>
  readonly prepareMission: (missionId: MissionId) => Effect.Effect<void>
  readonly verifyMission: (input: {
    readonly missionId: MissionId
    readonly missionDate: UtcDate
    readonly transactionHash: TransactionHash
    readonly verifiedAt: DateTime.Utc
  }) => Effect.Effect<void>
  readonly updateWaifuProfile: (input: WaifuProfileInput) => Effect.Effect<void>
  readonly subscribeNotifications: (
    input: NotificationSubscribeInput,
  ) => Effect.Effect<void>
}

type RepositoryQueries = {
  readonly getUser: () => Promise<typeof labUsersTable.$inferSelect | undefined>
  readonly upsertUser: (user: UserProfile) => Promise<void>
  readonly getWaifu: () => Promise<WaifuRow | undefined>
  readonly upsertWaifu: (name: string) => Promise<void>
  readonly listCompletions: () => Promise<Array<CompletionRow>>
  readonly insertCompletion: (completion: {
    readonly id: string
    readonly missionId: MissionId
    readonly missionDate: UtcDate
    readonly transactionHash: TransactionHash
    readonly verifiedAt: Date
  }) => Promise<void>
  readonly updateNotificationStatus: (status: "enabled") => Promise<void>
}

/**
 * Builds repository behavior from adapter-specific query functions.
 *
 * @param queries - Database operations normalized for the selected adapter.
 * @returns A repository service implementation.
 */
function makeRepositoryFromQueries(
  queries: RepositoryQueries,
): CircleWaifuRepositoryShape {
  const ensureUser = Effect.promise(() => queries.upsertUser(defaultUser))

  return {
    getUser: ensureUser.pipe(
      Effect.flatMap(() => Effect.promise(() => queries.getUser())),
      Effect.map((row) => row === undefined ? defaultUser : toUser(row)),
    ),
    getWaifuName: Effect.promise(() => queries.getWaifu()).pipe(
      Effect.map((row) => row?.name ?? "Aki"),
    ),
    listCompletions: Effect.promise(() => queries.listCompletions()).pipe(
      Effect.map((rows) => rows.map(toCompletion)),
    ),
    prepareMission: () => Effect.void,
    verifyMission: (input) =>
      Effect.promise(() =>
        queries.insertCompletion({
          id: `${input.missionId}:${input.transactionHash}`,
          missionId: input.missionId,
          missionDate: input.missionDate,
          transactionHash: input.transactionHash,
          verifiedAt: DateTime.toDateUtc(input.verifiedAt),
        })
      ),
    updateWaifuProfile: (input) =>
      Effect.promise(() => queries.upsertWaifu(input.name)),
    subscribeNotifications: () =>
      ensureUser.pipe(
        Effect.flatMap(() =>
          Effect.promise(() => queries.updateNotificationStatus("enabled"))
        ),
      ),
  }
}

/**
 * Selects the repository adapter for the resolved database configuration.
 *
 * @param config - Runtime database configuration.
 * @returns A scoped repository effect for the selected adapter.
 */
function makeRepository(config: RepositoryDatabaseConfig) {
  return config.kind === "postgres"
    ? makePostgresRepository(config.databaseUrl)
    : makePgliteRepository(config.dataDir)
}

const makeLiveRepository = liveDatabaseConfig.pipe(
  Effect.flatMap(makeRepository),
  Effect.orDie,
)

export class CircleWaifuRepository
  extends Context.Service<CircleWaifuRepository>()(
    "CircleWaifuRepository",
    { make: makeLiveRepository },
  )
{
  static readonly layer = Layer.effect(this, this.make)
}

/**
 * Builds the PostgreSQL-backed Circle Waifu repository.
 *
 * @param databaseUrl - PostgreSQL connection URL.
 * @returns A scoped repository effect backed by postgres.js and Drizzle.
 */
function makePostgresRepository(databaseUrl: string) {
  return Effect.gen(function*() {
    const client = postgres(databaseUrl, { prepare: false })
    const db = drizzlePostgres(client, {
      schema: { labUsersTable, missionCompletionsTable, waifuProfilesTable },
    })

    yield* Effect.forEach(
      createTablesSql,
      (statement) => Effect.promise(() => db.execute(statement)),
    )
    yield* Effect.addFinalizer(() => Effect.promise(() => client.end()))

    return makeRepositoryFromQueries({
      getUser: () =>
        db.select().from(labUsersTable).limit(1).then(([row]) => row),
      upsertUser: (user) =>
        db.insert(labUsersTable).values(user).onConflictDoNothing().then(() =>
          undefined
        ),
      getWaifu: () =>
        db.select().from(waifuProfilesTable).limit(1).then(([row]) => row),
      upsertWaifu: (name) =>
        db
          .insert(waifuProfilesTable)
          .values({ fid: defaultFid, name, activeCosmetic: "amber lab coat" })
          .onConflictDoUpdate({
            target: waifuProfilesTable.fid,
            set: { name },
          })
          .then(() => undefined),
      listCompletions: () => db.select().from(missionCompletionsTable),
      insertCompletion: (completion) =>
        db
          .insert(missionCompletionsTable)
          .values({ ...completion, fid: defaultFid, ticketGranted: 1 })
          .onConflictDoNothing()
          .then(() => undefined),
      updateNotificationStatus: (notificationStatus) =>
        db
          .update(labUsersTable)
          .set({ notificationStatus })
          .where(eq(labUsersTable.fid, defaultFid))
          .then(() => undefined),
    })
  })
}

/**
 * Builds the PGlite-backed Circle Waifu repository.
 *
 * @param dataDir - Optional local persistence directory.
 * @returns A scoped repository effect backed by embedded PGlite and Drizzle.
 */
function makePgliteRepository(dataDir: string | undefined) {
  return Effect.gen(function*() {
    const client = dataDir === undefined ? new PGlite() : new PGlite(dataDir)
    const db = drizzlePglite({
      client,
      schema: { labUsersTable, missionCompletionsTable, waifuProfilesTable },
    })

    yield* Effect.forEach(
      createTablesSql,
      (statement) => Effect.promise(() => db.execute(statement)),
    )
    yield* Effect.addFinalizer(() => Effect.promise(() => client.close()))

    return makeRepositoryFromQueries({
      getUser: () =>
        db.select().from(labUsersTable).limit(1).then(([row]) => row),
      upsertUser: (user) =>
        db.insert(labUsersTable).values(user).onConflictDoNothing().then(() =>
          undefined
        ),
      getWaifu: () =>
        db.select().from(waifuProfilesTable).limit(1).then(([row]) => row),
      upsertWaifu: (name) =>
        db
          .insert(waifuProfilesTable)
          .values({ fid: defaultFid, name, activeCosmetic: "amber lab coat" })
          .onConflictDoUpdate({
            target: waifuProfilesTable.fid,
            set: { name },
          })
          .then(() => undefined),
      listCompletions: () => db.select().from(missionCompletionsTable),
      insertCompletion: (completion) =>
        db
          .insert(missionCompletionsTable)
          .values({ ...completion, fid: defaultFid, ticketGranted: 1 })
          .onConflictDoNothing()
          .then(() => undefined),
      updateNotificationStatus: (notificationStatus) =>
        db
          .update(labUsersTable)
          .set({ notificationStatus })
          .where(eq(labUsersTable.fid, defaultFid))
          .then(() => undefined),
    })
  })
}
