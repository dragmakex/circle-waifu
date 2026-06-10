import { cx } from "@/design-system/foundation/classes"
import type { HTMLAttributes, ReactNode } from "react"

const toneClass = {
  body: "font-mono text-text text-body leading-[1.55]",
  muted: "font-mono text-text-dim text-body leading-[1.55]",
  label:
    "font-pixel text-phosphor text-label uppercase tracking-[0.14em] leading-[1.4] [text-shadow:var(--cw-glow-soft)]",
  accentLabel:
    "font-pixel text-accent text-label uppercase tracking-[0.14em] leading-[1.4]",
  dimLabel:
    "font-pixel text-text-dim text-label uppercase tracking-[0.14em] leading-[1.4]",
  micro:
    "font-pixel text-text-mut text-micro uppercase tracking-[0.12em] leading-[1.4]",
  caption: "font-mono text-text-mut text-[13px] leading-[1.45]",
  danger: "font-mono text-danger text-[13px] leading-[1.45]",
  note:
    "font-mono text-text text-body leading-[1.55] before:content-['>_'] before:text-phosphor",
} as const

const alignClass = {
  start: "text-left",
  center: "text-center",
} as const

type TextProps =
  & Omit<
    HTMLAttributes<HTMLParagraphElement | HTMLSpanElement | HTMLDivElement>,
    "className"
  >
  & {
    readonly children: ReactNode
    readonly as?: "p" | "span" | "div" | undefined
    readonly tone?: keyof typeof toneClass | undefined
    readonly align?: keyof typeof alignClass | undefined
  }

/**
 * Renders semantic body typography.
 *
 * @param props - Text props.
 * @param props.as - Underlying HTML element.
 * @param props.children - Text content.
 * @param props.tone - Typography role.
 * @param props.align - Text alignment.
 * @returns A semantic text element.
 */
export function Text(
  { align = "start", as = "p", children, tone = "body", ...props }: TextProps,
) {
  const Component = as
  return (
    <Component
      {...props}
      className={cx(toneClass[tone], alignClass[align])}
    >
      {children}
    </Component>
  )
}
