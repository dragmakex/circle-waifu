import type { ReactNode } from "react"

type StageWrapProps = {
  readonly children: ReactNode
  readonly topLeft?: ReactNode | undefined
  readonly middleLeft?: ReactNode | undefined
  readonly middleRight?: ReactNode | undefined
}

const wrapClass =
  "relative flex-1 min-h-0 grid place-items-center px-[18px] pt-xs"
const tlClass = "absolute top-[4px] left-0 z-[7]"
const mlClass = "absolute left-[-2px] top-1/2 -translate-y-1/2 z-[7]"
const mrClass = "absolute right-[-2px] top-[42%] -translate-y-1/2 z-[7]"

/**
 * Centerpiece stage that hosts the waifu portrait and floating satellites.
 *
 * Matches the prototype `.stage-wrap` exactly: a flex-1 grid that centers
 * the 3:4 waifu viewport vertically while letting up to three small
 * circular satellites float at the top-left and middle edges.
 *
 * @param props - Component props.
 * @param props.children - Centerpiece (typically a waifu viewport).
 * @param props.topLeft - Optional top-left satellite slot.
 * @param props.middleLeft - Optional middle-left satellite slot.
 * @param props.middleRight - Optional middle-right satellite slot.
 * @returns The stage container.
 */
export function StageWrap(
  { children, middleLeft, middleRight, topLeft }: StageWrapProps,
) {
  return (
    <div className={wrapClass}>
      {topLeft === undefined ? null : (
        <div className={tlClass}>
          {topLeft}
        </div>
      )}
      {middleLeft === undefined ? null : (
        <div className={mlClass}>
          {middleLeft}
        </div>
      )}
      {middleRight === undefined ? null : (
        <div className={mrClass}>
          {middleRight}
        </div>
      )}
      {children}
    </div>
  )
}
