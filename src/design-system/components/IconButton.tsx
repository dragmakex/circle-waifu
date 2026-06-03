import { cx } from "@/design-system/foundation/classes"
import type { ButtonHTMLAttributes, ReactNode } from "react"

const baseClass =
  "inline-grid place-items-center w-[44px] h-[44px] rounded-full bg-[color-mix(in_oklab,var(--cw-ink-800)_78%,transparent)] border-2 border-line-bright text-phosphor backdrop-blur-md cursor-pointer transition-transform duration-200 ease-out hover:not-disabled:scale-110 hover:not-disabled:[box-shadow:var(--cw-glow-phosphor)] hover:not-disabled:border-phosphor active:translate-y-px focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--cw-ink-900),0_0_0_4px_var(--cw-phosphor)]"
const activeClass =
  "!border-accent !text-accent [box-shadow:var(--cw-glow-accent)]"

type IconButtonProps =
  & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">
  & {
    readonly label: string
    readonly icon: ReactNode
    readonly active?: boolean | undefined
  }

/**
 * Round satellite icon button (≥44px). Used for stage satellites and
 * other compact navigation affordances.
 *
 * @param props - Component props.
 * @param props.label - Accessible label (rendered to aria-label).
 * @param props.icon - Glyph/icon content rendered visually.
 * @param props.active - Active-state styling (magenta accent).
 * @returns An icon-only round button.
 */
export function IconButton(
  { active = false, icon, label, ...props }: IconButtonProps,
) {
  return (
    <button
      {...props}
      type={props.type ?? "button"}
      aria-label={label}
      aria-pressed={active}
      className={cx(baseClass, active ? activeClass : "")}
    >
      <span aria-hidden="true">
        {icon}
      </span>
    </button>
  )
}
