import { cx } from "@/design-system/foundation/classes"
import * as Array from "effect/Array"

const toneClass = {
  accent:
    "bg-[repeating-linear-gradient(90deg,var(--cw-accent)_0_6px,var(--cw-accent-dim)_6px_8px)]",
  success:
    "bg-[repeating-linear-gradient(90deg,var(--cw-success)_0_6px,var(--cw-phosphor-dim)_6px_8px)]",
  danger:
    "bg-[repeating-linear-gradient(90deg,var(--cw-danger)_0_6px,var(--cw-accent-dim)_6px_8px)]",
  neutral:
    "bg-[repeating-linear-gradient(90deg,var(--cw-phosphor)_0_6px,var(--cw-phosphor-dim)_6px_8px)]",
} as const

type MoodMeterProps = {
  readonly label: string
  readonly value: number
  readonly max: number
  readonly tone?: keyof typeof toneClass | undefined
  readonly segments?: number | undefined
}

/**
 * Segmented mood/care progress bar.
 *
 * Values outside `[0, max]` are clamped. The bar renders `segments` discrete
 * cells (default 8) so it feels like a tamagotchi care meter rather than a
 * continuous progress bar. Each filled cell uses a dithered phosphor/accent
 * stripe so it reads as a refreshing CRT display.
 *
 * @param props - Component props.
 * @param props.label - Short label rendered above the bar.
 * @param props.value - Current value, clamped to [0, max].
 * @param props.max - Maximum value the bar can represent.
 * @param props.tone - Semantic fill tone.
 * @param props.segments - Number of discrete cells.
 * @returns A segmented progress indicator.
 */
export function MoodMeter(
  { label, max, segments = 8, tone = "neutral", value }: MoodMeterProps,
) {
  const ratio = max <= 0 ? 0 : Math.max(0, Math.min(1, value / max))
  const filled = Math.round(ratio * segments)
  return (
    <div
      className="flex flex-col gap-2xs w-full"
      role="meter"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <span className="font-pixel text-micro tracking-[0.12em] uppercase text-text-mut">
        {label}
      </span>
      <div className="flex gap-2xs">
        {Array.makeBy(segments, (index) => (
          <span
            key={index}
            className={cx(
              "flex-1 h-3 rounded-sm border border-line",
              index < filled
                ? cx(toneClass[tone], "[box-shadow:var(--cw-glow-soft)]")
                : "bg-bg-inset",
            )}
          />
        ))}
      </div>
    </div>
  )
}
