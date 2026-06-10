import { FarcasterFid, WalletAddress } from "@/api/circle-waifu-schema"
import * as Schema from "effect/Schema"

export const FarcasterMiniAppContext = Schema.Struct({
  fid: FarcasterFid,
  username: Schema.String,
  displayName: Schema.String,
  custodyAddress: WalletAddress,
  castHash: Schema.OptionFromOptionalKey(Schema.String),
})
export type FarcasterMiniAppContext = typeof FarcasterMiniAppContext.Type

export const FarcasterManifest = Schema.Struct({
  name: Schema.String,
  subtitle: Schema.String,
  primaryCategory: Schema.String,
  tags: Schema.Array(Schema.String),
  requiredChains: Schema.Array(Schema.String),
  requiredCapabilities: Schema.Array(Schema.String),
})
export type FarcasterManifest = typeof FarcasterManifest.Type
