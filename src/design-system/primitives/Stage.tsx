import type { ReactNode } from "react"

type StageProps = {
  readonly center: ReactNode
  readonly northWest?: ReactNode | undefined
  readonly northEast?: ReactNode | undefined
  readonly southWest?: ReactNode | undefined
  readonly southEast?: ReactNode | undefined
  readonly dock?: ReactNode | undefined
}

const containerClass = "relative w-full mx-auto max-w-[64rem] grid gap-m"
  + " grid-cols-1 grid-rows-[auto_auto_auto_auto_auto_auto_auto]"
  + " [grid-template-areas:'nw''ne''center''sw''se''dock']"
  + " sm:grid-cols-3 sm:grid-rows-[auto_minmax(18rem,1fr)_auto_auto]"
  + " sm:[grid-template-areas:'nw_._ne''._center_.''sw_._se''dock_dock_dock']"
  + " sm:gap-l"

const slotBase = "flex items-stretch"
const nwClass = `${slotBase} [grid-area:nw] justify-start`
const neClass = `${slotBase} [grid-area:ne] justify-end`
const swClass = `${slotBase} [grid-area:sw] justify-start sm:items-end`
const seClass = `${slotBase} [grid-area:se] justify-end sm:items-end`
const centerClass =
  "[grid-area:center] flex flex-col items-center justify-center gap-s"
const dockClass = "[grid-area:dock] w-full"

/**
 * Tamagotchi-style center stage with optional corner slots and a bottom dock.
 *
 * On mobile, the slots collapse into a single column so the center sprite is
 * always visible above the dock. On wider viewports the corners surround the
 * sprite and the dock anchors to the bottom edge.
 *
 * @param props - Stage props.
 * @param props.center - Primary visual centerpiece (sprite + name).
 * @param props.northWest - Optional top-left status pill.
 * @param props.northEast - Optional top-right status pill.
 * @param props.southWest - Optional bottom-left status pill.
 * @param props.southEast - Optional bottom-right status pill.
 * @param props.dock - Bottom action dock content.
 * @returns The stage container with positioned slots.
 */
export function Stage(
  { center, dock, northEast, northWest, southEast, southWest }: StageProps,
) {
  return (
    <div className={containerClass}>
      {northWest === undefined ? null : (
        <div className={nwClass}>
          {northWest}
        </div>
      )}
      {northEast === undefined ? null : (
        <div className={neClass}>
          {northEast}
        </div>
      )}
      <div className={centerClass}>
        {center}
      </div>
      {southWest === undefined ? null : (
        <div className={swClass}>
          {southWest}
        </div>
      )}
      {southEast === undefined ? null : (
        <div className={seClass}>
          {southEast}
        </div>
      )}
      {dock === undefined ? null : (
        <div className={dockClass}>
          {dock}
        </div>
      )}
    </div>
  )
}
