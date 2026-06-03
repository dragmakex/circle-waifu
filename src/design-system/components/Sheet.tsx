import { cx } from "@/design-system/foundation/classes"
import type { ReactNode } from "react"
import { useEffect } from "react"

type SheetProps = {
  readonly open: boolean
  readonly title: string
  readonly onClose: () => void
  readonly children: ReactNode
}

const containerBase =
  "fixed inset-0 z-40 flex flex-col bg-bg-canvas motion-safe:animate-[cw-sheet-up_220ms_cubic-bezier(.2,.7,.3,1)]"
const headBase =
  "flex items-center justify-between gap-s px-m [padding-top:calc(env(safe-area-inset-top,0px)+16px)] pb-s border-b border-line bg-[color-mix(in_oklab,var(--cw-ink-800)_86%,transparent)] backdrop-blur-md"
const bodyBase = "flex-1 overflow-y-auto px-m py-m"
const closeBase =
  "inline-flex items-center justify-center w-[36px] h-[36px] rounded-md border-2 border-line-bright bg-bg-raised text-phosphor cursor-pointer hover:[box-shadow:var(--cw-glow-soft)] focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--cw-ink-900),0_0_0_4px_var(--cw-phosphor)]"
const titleBase =
  "font-pixel text-label uppercase tracking-[0.12em] text-phosphor [text-shadow:var(--cw-glow-soft)]"

/**
 * Full-screen slide-up sheet for secondary screens.
 *
 * Respects `prefers-reduced-motion` by skipping the entry animation.
 * Renders nothing when `open` is false.
 *
 * @param props - Component props.
 * @param props.open - Whether the sheet is visible.
 * @param props.title - Sheet title rendered in the header.
 * @param props.onClose - Callback invoked when the user dismisses the sheet.
 * @param props.children - Sheet body content.
 * @returns The sheet element when open, otherwise null.
 */
export function Sheet(
  { children, onClose, open, title }: SheetProps,
) {
  useEffect(() => {
    if (!open) {
      return
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("keydown", onKey)
    }
  }, [open, onClose])

  if (!open) {
    return null
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className={containerBase}
    >
      <header className={headBase}>
        <h2 className={cx(titleBase, "m-0")}>
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className={closeBase}
          aria-label="Close"
        >
          ✕
        </button>
      </header>
      <div className={bodyBase}>
        {children}
      </div>
    </div>
  )
}
