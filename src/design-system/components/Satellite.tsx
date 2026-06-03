import { cx } from "@/design-system/foundation/classes"
import type { ButtonHTMLAttributes, ReactNode } from "react"

const sizeClass = {
  s: "w-[38px] h-[38px] text-[15px]",
  m: "w-[44px] h-[44px] text-[18px]",
} as const

const baseClass =
  "grid place-items-center rounded-full cursor-pointer bg-[color-mix(in_oklab,var(--cw-ink-800)_75%,transparent)] border-2 border-line-bright text-phosphor backdrop-blur-md transition-transform duration-200 ease-out hover:not-disabled:scale-110 hover:not-disabled:[box-shadow:var(--cw-glow-phosphor)] hover:not-disabled:border-phosphor focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--cw-ink-900),0_0_0_4px_var(--cw-phosphor)]"

type SatelliteProps =
  & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">
  & {
    readonly label: string
    readonly icon: ReactNode
    readonly size?: keyof typeof sizeClass | undefined
  }

/**
 * Small circular floating action button used as a stage satellite.
 *
 * Designed to be absolute-positioned by a parent like `StageWrap`. The
 * default size matches the prototype's 38px top-left satellite; `m`
 * matches the 44px side satellites.
 *
 * @param props - Component props.
 * @param props.label - Accessible label (mapped to aria-label).
 * @param props.icon - Glyph/icon content rendered visually.
 * @param props.size - Sprite size token.
 * @returns A round satellite button.
 */
export function Satellite(
  { icon, label, size = "s", ...props }: SatelliteProps,
) {
  return (
    <button
      {...props}
      type={props.type ?? "button"}
      aria-label={label}
      className={cx(baseClass, sizeClass[size])}
    >
      <span aria-hidden="true">
        {icon}
      </span>
    </button>
  )
}
