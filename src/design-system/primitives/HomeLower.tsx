import type { ReactNode } from "react"

type HomeLowerProps = {
  readonly children: ReactNode
}

const baseClass = "relative z-[6] flex flex-col gap-s px-m pt-2xs pb-s"

/**
 * Lower band of the home screen: greeting + mission card.
 *
 * Sits between the stage and the dock; the parent shell handles the
 * bottom safe-area inset via the dock element itself.
 *
 * @param props - Component props.
 * @param props.children - Lower-band content.
 * @returns The home lower container.
 */
export function HomeLower({ children }: HomeLowerProps) {
  return (
    <div className={baseClass}>
      {children}
    </div>
  )
}
