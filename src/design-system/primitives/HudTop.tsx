import type { ReactNode } from "react"

type HudTopProps = {
  readonly left: ReactNode
  readonly right: ReactNode
}

const baseClass =
  "flex items-start justify-between gap-s px-m [padding-top:calc(env(safe-area-inset-top,0px)+14px)] pb-2xs relative z-[6]"

/**
 * Top HUD row: identity chip on the left, status chips on the right.
 *
 * @param props - Component props.
 * @param props.left - Left-aligned identity content (typically NameChip).
 * @param props.right - Right-aligned status content (typically Chip cluster).
 * @returns The HUD top bar element.
 */
export function HudTop({ left, right }: HudTopProps) {
  return (
    <div className={baseClass}>
      <div>
        {left}
      </div>
      <div className="flex items-start gap-xs">
        {right}
      </div>
    </div>
  )
}
