import type { ReactNode } from "react"

const toneClass = {
  default: "relative bg-bg-panel border border-line rounded-md",
  subtle:
    "relative bg-bg-raised border border-line rounded-md shadow-[inset_0_0_0_1px_rgba(255,255,255,.02)]",
  accent:
    "relative bg-bg-panel border-2 border-phosphor-dim rounded-md shadow-[var(--cw-glow-phosphor)]",
  danger: "relative bg-bg-panel border-2 border-danger rounded-md",
  glow:
    "relative bg-bg-panel border-2 border-accent-dim rounded-md shadow-[var(--cw-glow-accent)]",
} as const

type SurfaceProps = {
  readonly children: ReactNode
  readonly tone?: keyof typeof toneClass | undefined
  readonly as?: "div" | "section" | undefined
}

/**
 * Semantic surface container for grouped content.
 *
 * Renders as `<section>` — the browser's element for thematically
 * grouped content with a heading.
 *
 * @param props - Surface props.
 * @param props.children - Surface content.
 * @param props.tone - Surface tone role.
 * @param props.as - Underlying semantic container.
 * @returns A semantic container with visual surface treatment.
 */
export function Surface(
  { as = "section", children, tone = "default" }: SurfaceProps,
) {
  const Component = as

  return (
    <Component className={toneClass[tone]}>
      {children}
    </Component>
  )
}
