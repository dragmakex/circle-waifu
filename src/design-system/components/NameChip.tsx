import type { ButtonHTMLAttributes } from "react"

type NameChipProps =
  & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">
  & {
    readonly name: string
    readonly level: number
    readonly streak: number
  }

const baseClass =
  "flex flex-col gap-[2px] text-left bg-[color-mix(in_oklab,var(--cw-ink-800)_72%,transparent)] border border-line rounded-md px-s py-2xs cursor-pointer backdrop-blur-md transition-colors duration-200 ease-out hover:border-accent focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--cw-ink-900),0_0_0_4px_var(--cw-phosphor)]"

const nameClass =
  "font-pixel text-label uppercase tracking-[0.12em] text-text [text-shadow:var(--cw-glow-soft)]"
const metaClass =
  "font-pixel text-micro uppercase tracking-[0.12em] text-text-dim flex items-center gap-xs"
const streakClass = "text-warning"

/**
 * Clickable HUD identity chip showing the waifu name + level + streak.
 *
 * Used as the top-left of the home HUD; clicking it opens the name modal.
 *
 * @param props - Component props.
 * @param props.name - Waifu name (rendered in caps).
 * @param props.level - Current waifu level.
 * @param props.streak - Current streak in days.
 * @returns A pressable identity chip.
 */
export function NameChip({ level, name, streak, ...props }: NameChipProps) {
  return (
    <button
      {...props}
      type={props.type ?? "button"}
      aria-label={`Rename ${name}`}
      className={baseClass}
    >
      <span className={nameClass}>
        {name.toUpperCase()}
      </span>
      <span className={metaClass}>
        <span>
          LV {level}
        </span>
        <span aria-hidden="true">
          ·
        </span>
        <span className={streakClass}>
          {streak}D STREAK
        </span>
      </span>
    </button>
  )
}
