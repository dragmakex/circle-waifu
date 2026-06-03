import { cx } from "@/design-system/foundation/classes"
import type { ReactNode } from "react"

type DockItem<T extends string> = {
  readonly key: T
  readonly label: string
  readonly icon: ReactNode
}

type DockProps<T extends string> = {
  readonly items: ReadonlyArray<DockItem<T>>
  readonly active: T
  readonly onSelect: (key: T) => void
}

const dockBase =
  "fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around gap-xs px-m h-[76px] bg-[color-mix(in_oklab,var(--cw-ink-800)_86%,transparent)] border-t-2 border-line backdrop-blur-md [padding-bottom:env(safe-area-inset-bottom,0px)]"

const buttonBase =
  "flex flex-col items-center gap-[4px] bg-transparent border-0 cursor-pointer px-s py-2xs text-text-mut font-pixel text-micro uppercase tracking-[0.12em] transition-colors duration-150 hover:text-text-dim focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--cw-ink-900),0_0_0_4px_var(--cw-phosphor)]"
const buttonActive = "text-phosphor [text-shadow:var(--cw-glow-soft)]"

/**
 * Blurred bottom dock with pixel-labeled buttons.
 *
 * @param props - Component props.
 * @param props.items - Dock entries to render.
 * @param props.active - Currently active item key.
 * @param props.onSelect - Selection callback.
 * @returns A semantic navigation dock.
 */
export function Dock<T extends string>(
  { active, items, onSelect }: DockProps<T>,
) {
  return (
    <nav className={dockBase} aria-label="Primary">
      {items.map((item) => {
        const isActive = item.key === active
        return (
          <button
            key={item.key}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(item.key)}
            className={cx(buttonBase, isActive ? buttonActive : "")}
          >
            <span className="text-[20px] leading-none" aria-hidden="true">
              {item.icon}
            </span>
            <span>
              {item.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
