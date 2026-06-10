import type { HTMLAttributes, ReactNode } from "react"

const toneClass = {
  page:
    "m-0 font-hero text-phosphor [text-shadow:var(--cw-glow-phosphor)] text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.1]",
  display:
    "m-0 font-hero text-text text-[clamp(1.5rem,3vw,2rem)] [text-shadow:var(--cw-glow-soft)] leading-[1.1]",
  section:
    "m-0 font-pixel text-text text-[18px] uppercase tracking-[0.08em] leading-[1.25]",
  card:
    "m-0 font-pixel text-text text-[14px] uppercase tracking-[0.1em] leading-[1.25]",
  readout:
    "m-0 font-hero text-text text-h2 [text-shadow:var(--cw-glow-soft)] leading-[1.1]",
} as const

type HeadingProps =
  & Omit<HTMLAttributes<HTMLHeadingElement>, "className">
  & {
    readonly children: ReactNode
    readonly as?: "h1" | "h2" | "h3" | "h4" | undefined
    readonly tone?: keyof typeof toneClass | undefined
  }

/**
 * Renders semantic heading typography.
 *
 * @param props - Heading props.
 * @param props.as - Underlying heading element.
 * @param props.children - Heading content.
 * @param props.tone - Heading role.
 * @returns A semantic heading element.
 */
export function Heading(
  { as = "h2", children, tone = "section", ...props }: HeadingProps,
) {
  const Component = as
  return (
    <Component {...props} className={toneClass[tone]}>
      {children}
    </Component>
  )
}
