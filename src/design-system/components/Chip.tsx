import { cx } from "@/design-system/foundation/classes"

const valueToneClass = {
  phosphor: "text-phosphor [text-shadow:var(--cw-glow-soft)]",
  accent: "text-accent",
  warning: "text-warning",
  success: "text-success",
  danger: "text-danger",
} as const

const baseClass =
  "inline-flex items-center gap-xs px-s py-[7px] bg-[color-mix(in_oklab,var(--cw-ink-800)_72%,transparent)] border border-line rounded-md backdrop-blur-md whitespace-nowrap"

type ChipProps = {
  readonly label: string
  readonly value: string | number
  readonly tone?: keyof typeof valueToneClass | undefined
}

/**
 * Glass-blurred HUD chip with a pixel key/value pair.
 *
 * Used as the floating status read-outs that orbit the waifu stage —
 * streak, tickets, level, pool balance. Tone controls only the value color
 * so the chip stays visually consistent.
 *
 * @param props - Component props.
 * @param props.label - Short uppercase label.
 * @param props.value - Read-out value (string or number).
 * @param props.tone - Semantic tone for the value.
 * @returns A HUD chip element.
 */
export function Chip({ label, tone = "phosphor", value }: ChipProps) {
  return (
    <span className={baseClass}>
      <span className="font-pixel text-micro tracking-[0.12em] uppercase text-text-dim">
        {label}
      </span>
      <span
        className={cx(
          "font-pixel text-label uppercase tracking-[0.1em]",
          valueToneClass[tone],
        )}
      >
        {value}
      </span>
    </span>
  )
}
