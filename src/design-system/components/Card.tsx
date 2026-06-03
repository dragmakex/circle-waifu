import { cx } from "@/design-system/foundation/classes"
import { Surface } from "@/design-system/primitives/Surface"
import type { ReactNode } from "react"

type CardProps = {
  readonly children: ReactNode
  readonly tone?:
    | "default"
    | "subtle"
    | "accent"
    | "danger"
    | "glow"
    | undefined
  readonly bracketed?: boolean | undefined
}

const bracketWrap =
  "before:content-[''] before:absolute before:top-[-2px] before:left-[-2px] before:w-3 before:h-3 before:border-2 before:border-phosphor before:border-r-0 before:border-b-0 before:pointer-events-none"
const bracketAfter =
  "after:content-[''] after:absolute after:bottom-[-2px] after:right-[-2px] after:w-3 after:h-3 after:border-2 after:border-phosphor after:border-l-0 after:border-t-0 after:pointer-events-none"

/**
 * Renders a padded semantic card surface.
 *
 * @param props - Card props.
 * @param props.children - Card content.
 * @param props.tone - Surface tone role.
 * @param props.bracketed - Adds ASCII corner brackets on the surface.
 * @returns A card wrapper.
 */
export function Card(
  { bracketed = false, children, tone = "default" }: CardProps,
) {
  return (
    <Surface tone={tone}>
      <div
        className={cx("p-m", bracketed ? cx(bracketWrap, bracketAfter) : "")}
      >
        {children}
      </div>
    </Surface>
  )
}
