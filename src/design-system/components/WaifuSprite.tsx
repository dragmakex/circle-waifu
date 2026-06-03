import { cx } from "@/design-system/foundation/classes"

const moodSheet = {
  curious: "/waifu/idle.png",
  focused: "/waifu/focused.png",
  pleased: "/waifu/happy.png",
  undersampled: "/waifu/sleepy.png",
} as const

const sizeClass = {
  m: "w-32 h-32 sm:w-40 sm:h-40",
  l: "w-40 h-40 sm:w-56 sm:h-56",
  xl: "w-56 h-56 sm:w-72 sm:h-72",
} as const

type WaifuSpriteProps = {
  readonly mood: keyof typeof moodSheet
  readonly name: string
  readonly size?: keyof typeof sizeClass | undefined
  readonly animated?: boolean | undefined
}

const baseClass =
  "block bg-no-repeat [image-rendering:pixelated] [background-size:400%_100%]"
const animatedClass = "animate-[var(--animate-waifu-sprite)]"

/**
 * Renders the animated pixel waifu sprite for the current mood.
 *
 * Uses a 4-frame 128x32 sprite sheet rendered with `image-rendering: pixelated`
 * and a CSS `steps(4)` keyframe so the sprite scales crisply on any device.
 *
 * @param props - Component props.
 * @param props.mood - Current waifu mood, selects which sprite sheet to load.
 * @param props.name - Accessible label for the sprite image.
 * @param props.size - Sprite size token (defaults to `l`).
 * @param props.animated - Whether to run the blink/idle animation.
 * @returns The waifu sprite element.
 */
export function WaifuSprite(
  { animated = true, mood, name, size = "l" }: WaifuSpriteProps,
) {
  const sheet = moodSheet[mood]
  return (
    <span
      role="img"
      aria-label={`${name} (${mood})`}
      className={cx(
        baseClass,
        sizeClass[size],
        animated ? animatedClass : "",
      )}
      style={{ backgroundImage: `url(${sheet})` }}
    />
  )
}
