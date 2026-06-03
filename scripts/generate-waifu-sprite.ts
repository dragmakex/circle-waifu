#!/usr/bin/env bun
// @effect-diagnostics asyncFunction:skip-file globalConsole:skip-file nodeBuiltinImport:skip-file

import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { deflateSync } from "node:zlib"

const FRAME_W = 32
const FRAME_H = 32
const FRAMES = 4

type Mood = "idle" | "happy" | "focused" | "sleepy"

type Palette = {
  readonly transparent: number
  readonly hair: number
  readonly hairShade: number
  readonly skin: number
  readonly skinShade: number
  readonly eyeWhite: number
  readonly eyeColor: number
  readonly mouth: number
  readonly tieDark: number
  readonly tieLight: number
  readonly outline: number
}

const moodPalette = (mood: Mood): Palette => {
  const base = {
    transparent: 0x00000000,
    hair: 0x4ce3d6ff,
    hairShade: 0x2fb8acff,
    skin: 0xffe2c8ff,
    skinShade: 0xeac2a0ff,
    eyeWhite: 0xffffffff,
    eyeColor: 0x2fb8acff,
    mouth: 0x9e3a52ff,
    tieDark: 0x1a1f2eff,
    tieLight: 0x5a6378ff,
    outline: 0x12131aff,
  }
  if (mood === "happy") {
    return { ...base, eyeColor: 0x4ce3d6ff }
  }
  if (mood === "focused") {
    return { ...base, eyeColor: 0xc084fcff }
  }
  if (mood === "sleepy") {
    return { ...base, eyeColor: 0xa0a8b8ff }
  }
  return base
}

// Base 32x32 pixel grid. Eye and mouth slots use '.', and are painted per-frame.
// Legend:
//   .  transparent / slot (overwritten by frame for eye+mouth regions)
//   o  outline
//   h  hair
//   H  hair shade
//   s  skin
//   S  skin shade
//   t  tie dark
//   T  tie light
const BASE_TEMPLATE: ReadonlyArray<string> = [
  "................................",
  "...........oooooooooo...........",
  ".........oohhhhhhhhhhoo.........",
  ".......oohhhhhhhhhhhhhhoo.......",
  "......ohhhhhHHHHHHhhhhhhho......",
  ".....ohhhhHHHhhhhHHHhhhhhho.....",
  "....ohhhhHHhhhhhhhhHHhhhhhho....",
  "...ohhhhHHhhssssssshhHHhhhhho...",
  "...ohhhHhhssssssssssshhHhhhho...",
  "..ohhhHhsssssssssssssshHhhhho...",
  "..ohhhhssssssssssssssssshhho....",
  "..ohhhhsss....sss....shhhho.....",
  "..ohhhhsss....sss....shhhho.....",
  "..ohhhhssssssssssssssssshhho....",
  "..ohhhhssssss......sssssshho....",
  "..ohhhhSsssss......ssssssShho...",
  "..ohhhhhSsssssssssssssssShhho...",
  "...ohhhhhSSsssssssssSSShhhho....",
  "....ohhhhhhSSSSSSSSShhhhhho.....",
  "....ohhhhhhhHhhhhhhhhhhhho......",
  "....ohhhhhhTTttTTttTTThhhho.....",
  "....ohhhhhhTtttTTtttTThhhho.....",
  "...ohhhhhhhTTttttttTTThhhho.....",
  "...ohhhhhhhhTTTTTTTTThhhhho.....",
  "..ohhhhhhhhhhhhhhhhhhhhhhho.....",
  "..ohhhhhhhhhhhhhhhhhhhhhhho.....",
  "...ohhhhhhhhhhhhhhhhhhhhho......",
  "....oohhhhhhhhhhhhhhhhhoo.......",
  "......oohhhhhhhhhhhhhoo.........",
  "........ooohhhhhhhooo...........",
  "..........oooooooo..............",
  "................................",
]

const charColor = (ch: string, palette: Palette): number => {
  switch (ch) {
    case "o":
      return palette.outline
    case "h":
      return palette.hair
    case "H":
      return palette.hairShade
    case "s":
      return palette.skin
    case "S":
      return palette.skinShade
    case "w":
      return palette.eyeWhite
    case "e":
      return palette.eyeColor
    case "m":
      return palette.mouth
    case "t":
      return palette.tieDark
    case "T":
      return palette.tieLight
    default:
      return palette.transparent
  }
}

type EyeShape = "open" | "half" | "closed" | "wide"
type MouthShape = "small" | "smile" | "neutral" | "dot"

const FRAMES_BY_MOOD: Record<
  Mood,
  ReadonlyArray<{ readonly eye: EyeShape; readonly mouth: MouthShape }>
> = {
  idle: [
    { eye: "open", mouth: "small" },
    { eye: "open", mouth: "small" },
    { eye: "half", mouth: "small" },
    { eye: "closed", mouth: "small" },
  ],
  happy: [
    { eye: "wide", mouth: "smile" },
    { eye: "open", mouth: "smile" },
    { eye: "wide", mouth: "smile" },
    { eye: "half", mouth: "smile" },
  ],
  focused: [
    { eye: "open", mouth: "neutral" },
    { eye: "open", mouth: "neutral" },
    { eye: "open", mouth: "neutral" },
    { eye: "half", mouth: "neutral" },
  ],
  sleepy: [
    { eye: "half", mouth: "dot" },
    { eye: "closed", mouth: "dot" },
    { eye: "closed", mouth: "dot" },
    { eye: "half", mouth: "dot" },
  ],
}

// Eye region occupies rows 11..12, cols 11..12 (left) and 16..17 (right).
const paintEyes = (
  grid: Array<Array<string>>,
  shape: EyeShape,
): void => {
  const set = (y: number, x: number, ch: string) => {
    const row = grid[y]
    if (row) {
      row[x] = ch
    }
  }
  const drawEye = (xLeft: number) => {
    if (shape === "open") {
      set(11, xLeft, "w")
      set(11, xLeft + 1, "w")
      set(12, xLeft, "e")
      set(12, xLeft + 1, "e")
    } else if (shape === "wide") {
      set(11, xLeft, "e")
      set(11, xLeft + 1, "e")
      set(12, xLeft, "e")
      set(12, xLeft + 1, "e")
    } else if (shape === "half") {
      set(11, xLeft, "s")
      set(11, xLeft + 1, "s")
      set(12, xLeft, "o")
      set(12, xLeft + 1, "o")
    } else {
      set(11, xLeft, "s")
      set(11, xLeft + 1, "s")
      set(12, xLeft, "S")
      set(12, xLeft + 1, "S")
    }
  }
  drawEye(11)
  drawEye(17)
}

// Mouth region occupies rows 14..15, cols 12..17.
const paintMouth = (
  grid: Array<Array<string>>,
  shape: MouthShape,
): void => {
  const set = (y: number, x: number, ch: string) => {
    const row = grid[y]
    if (row) {
      row[x] = ch
    }
  }
  // Fill mouth area with skin first so previous frames are clean.
  for (let y = 14; y <= 15; y++) {
    for (let x = 12; x <= 17; x++) {
      set(y, x, "s")
    }
  }
  if (shape === "small") {
    set(15, 14, "m")
    set(15, 15, "m")
  } else if (shape === "smile") {
    set(14, 13, "m")
    set(14, 16, "m")
    set(15, 14, "m")
    set(15, 15, "m")
  } else if (shape === "neutral") {
    set(15, 13, "m")
    set(15, 14, "m")
    set(15, 15, "m")
    set(15, 16, "m")
  } else {
    set(15, 14, "m")
    set(15, 15, "m")
  }
}

const composeFrame = (mood: Mood, frameIndex: number): Array<Array<string>> => {
  const grid: Array<Array<string>> = BASE_TEMPLATE.map((row) => row.split(""))
  const frame = FRAMES_BY_MOOD[mood][frameIndex]
  if (!frame) {
    throw new Error(`bad frame ${mood}#${frameIndex}`)
  }
  paintEyes(grid, frame.eye)
  paintMouth(grid, frame.mouth)
  return grid
}

const crcTable: ReadonlyArray<number> = (() => {
  const table: Array<number> = []
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    }
    table[n] = c >>> 0
  }
  return table
})()

const crc32 = (buf: Buffer): number => {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) {
    const byte = buf[i] as number
    c = (crcTable[(c ^ byte) & 0xff] as number) ^ (c >>> 8)
  }
  return (c ^ 0xffffffff) >>> 0
}

const chunk = (type: string, data: Buffer): Buffer => {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const typeBuf = Buffer.from(type, "ascii")
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0)
  return Buffer.concat([len, typeBuf, data, crc])
}

const encodePng = (raw: Buffer, width: number, height: number): Buffer => {
  const signature = Buffer.from([
    0x89,
    0x50,
    0x4e,
    0x47,
    0x0d,
    0x0a,
    0x1a,
    0x0a,
  ])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0
  const idat = deflateSync(raw)
  return Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ])
}

const buildSheet = (mood: Mood): Buffer => {
  const palette = moodPalette(mood)
  const sheetWidth = FRAME_W * FRAMES
  const sheetHeight = FRAME_H
  const stride = sheetWidth * 4
  const raw = Buffer.alloc(sheetHeight * (stride + 1))
  for (let f = 0; f < FRAMES; f++) {
    const grid = composeFrame(mood, f)
    for (let y = 0; y < FRAME_H; y++) {
      const rowOffset = y * (stride + 1)
      raw[rowOffset] = 0
      const row = grid[y]
      if (!row) {
        continue
      }
      for (let x = 0; x < FRAME_W; x++) {
        const ch = row[x] ?? "."
        const argb = charColor(ch, palette)
        const r = (argb >>> 24) & 0xff
        const g = (argb >>> 16) & 0xff
        const b = (argb >>> 8) & 0xff
        const a = argb & 0xff
        const pixelOffset = rowOffset + 1 + (f * FRAME_W + x) * 4
        raw[pixelOffset] = r
        raw[pixelOffset + 1] = g
        raw[pixelOffset + 2] = b
        raw[pixelOffset + 3] = a
      }
    }
  }
  return encodePng(raw, sheetWidth, sheetHeight)
}

const moods: ReadonlyArray<Mood> = ["idle", "happy", "focused", "sleepy"]
const outDir = join(process.cwd(), "public", "waifu")
mkdirSync(outDir, { recursive: true })
for (const mood of moods) {
  const png = buildSheet(mood)
  const path = join(outDir, `${mood}.png`)
  writeFileSync(path, png)
  process.stdout.write(`wrote ${path} (${png.length} bytes)\n`)
}
