import { cx } from "@/design-system/foundation/classes"
import type { ReactNode } from "react"

const badgeBaseClass =
  "inline-flex items-center gap-[6px] font-pixel text-micro uppercase tracking-[0.1em] px-xs py-[4px] rounded-sm border"

const toneClass = {
  neutral: "text-text-mut border-text-mut",
  accent: "text-accent border-accent",
  success: "text-success border-success",
  warning: "text-warning border-warning",
  danger: "text-danger border-danger",
  verified: "text-success border-success",
  pending: "text-warning border-warning",
  failed: "text-danger border-danger",
  locked: "text-text-mut border-text-mut",
} as const

const dotClass =
  "before:content-[''] before:w-[6px] before:h-[6px] before:rounded-full before:bg-current before:shadow-[0_0_6px_currentColor]"

type BadgeProps = {
  readonly children: ReactNode
  readonly tone?: keyof typeof toneClass | undefined
  readonly dot?: boolean | undefined
}

/**
 * Renders a compact semantic badge.
 *
 * @param props - Badge props.
 * @param props.children - Badge content.
 * @param props.tone - Badge tone role.
 * @param props.dot - Render a leading status dot.
 * @returns A badge element.
 */
export function Badge(
  { children, dot = true, tone = "neutral" }: BadgeProps,
) {
  return (
    <span
      className={cx(badgeBaseClass, toneClass[tone], dot ? dotClass : "")}
    >
      {children}
    </span>
  )
}
