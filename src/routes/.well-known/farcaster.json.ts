import { createFileRoute } from "@tanstack/react-router"

const manifest = {
  name: "Circle Waifu",
  subtitle: "Daily CRC lab",
  primaryCategory: "games",
  tags: ["circles", "crc", "streaks", "raffle", "waifu"],
  requiredChains: ["eip155:100"],
  requiredCapabilities: ["wallet.getEthereumProvider", "actions.composeCast"],
} as const

export const Route = createFileRoute("/.well-known/farcaster.json")({
  server: {
    handlers: {
      GET: () => Response.json(manifest),
    },
  },
})
