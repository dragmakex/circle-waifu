import { cx } from "@/design-system/foundation/classes"

const moodSheet = {
  curious: "/waifu/idle.png",
  focused: "/waifu/focused.png",
  pleased: "/waifu/happy.png",
  undersampled: "/waifu/sleepy.png",
} as const

const moodFrame = {
  curious:
    "border-phosphor-dim [box-shadow:inset_0_0_60px_rgba(0,0,0,.6),var(--cw-glow-phosphor)]",
  focused:
    "border-accent [box-shadow:inset_0_0_60px_rgba(0,0,0,.6),var(--cw-glow-accent)]",
  pleased:
    "border-success [box-shadow:inset_0_0_60px_rgba(0,0,0,.6),var(--cw-glow-soft)]",
  undersampled:
    "border-text-mut [box-shadow:inset_0_0_60px_rgba(0,0,0,.6),var(--cw-glow-soft)] saturate-[.7]",
} as const

const sizeClass = {
  m: "max-w-[10rem]",
  l: "max-w-[14rem]",
  xl: "max-w-[18rem] sm:max-w-[22rem]",
} as const

type WaifuSpriteProps = {
  readonly mood: keyof typeof moodSheet
  readonly name: string
  readonly size?: keyof typeof sizeClass | undefined
  readonly animated?: boolean | undefined
}

const frameBase =
  "relative aspect-[3/4] w-full overflow-hidden rounded-lg border-2 bg-[radial-gradient(80%_60%_at_50%_38%,color-mix(in_oklab,var(--cw-accent)_14%,transparent),transparent_70%),var(--cw-ink-800)]"

const spriteBase =
  "absolute inset-0 bg-no-repeat [image-rendering:pixelated] [background-size:400%_100%] [background-position:0_0] bg-center"

const animatedClass = "animate-[var(--animate-waifu-sprite)]"

/**
 * Renders the animated pixel waifu inside a 3:4 mood-framed CRT viewport.
 *
 * The frame border + glow shift with `mood` so the user feels the waifu's
 * state before reading any label. The sprite itself remains a 4-frame
 * 128x32 sheet rendered with `image-rendering: pixelated` and animated via
 * a CSS `steps(4)` keyframe for crisp playback.
 *
 * @param props - Component props.
 * @param props.mood - Current waifu mood; drives frame tint + sheet.
 * @param props.name - Accessible label for the sprite image.
 * @param props.size - Sprite container size token (defaults to `l`).
 * @param props.animated - Whether to run the blink/idle animation.
 * @returns The waifu viewport element.
 */
export function WaifuSprite(
  { animated = true, mood, name, size = "l" }: WaifuSpriteProps,
) {
  const sheet = moodSheet[mood]
  return (
    <div
      role="img"
      aria-label={`${name} (${mood})`}
      className={cx(frameBase, moodFrame[mood], sizeClass[size])}
    >
      <span
        aria-hidden="true"
        className={cx(spriteBase, animated ? animatedClass : "")}
        style={{ backgroundImage: `url(${sheet})` }}
      />
    </div>
  )
}
