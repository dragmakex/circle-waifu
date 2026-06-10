import { cx } from "@/design-system/foundation/classes"
import type { ButtonHTMLAttributes, ReactNode } from "react"

const baseClass =
  "inline-flex items-center justify-center gap-xs min-h-11 px-m py-s border-2 rounded-md font-pixel text-label uppercase tracking-[0.14em] cursor-pointer transition-all duration-150 ease-out hover:not-disabled:-translate-y-px active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:translate-y-0 focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--cw-ink-900),0_0_0_4px_var(--cw-phosphor)]"

const variantClass = {
  primary:
    "bg-accent text-text-inv border-accent-hi shadow-[var(--cw-glow-accent)] hover:not-disabled:brightness-110",
  phosphor:
    "bg-transparent text-phosphor border-phosphor-dim hover:not-disabled:border-phosphor hover:not-disabled:shadow-[var(--cw-glow-phosphor)]",
  secondary:
    "bg-bg-raised text-text border-line-bright hover:not-disabled:shadow-[var(--cw-glow-soft)]",
  ghost: "bg-transparent text-text-dim border-line",
  danger: "bg-danger text-text-inv border-danger",
} as const

type ButtonProps =
  & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">
  & {
    readonly children: ReactNode
    readonly variant?: keyof typeof variantClass | undefined
    readonly loading?: boolean | undefined
  }

/**
 * Renders a semantic application button.
 *
 * @param props - Button props.
 * @param props.children - Button label content.
 * @param props.disabled - Whether the button is disabled.
 * @param props.loading - Whether to show the busy state.
 * @param props.type - Button type attribute.
 * @param props.variant - Semantic visual variant.
 * @returns A styled button element.
 */
export function Button(
  {
    children,
    disabled,
    loading = false,
    type = "button",
    variant = "primary",
    ...props
  }: ButtonProps,
) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      className={cx(baseClass, variantClass[variant])}
    >
      {loading ? "WORKING…" : children}
    </button>
  )
}
