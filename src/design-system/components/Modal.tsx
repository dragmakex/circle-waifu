import type { ReactNode } from "react"
import { useEffect } from "react"

type ModalProps = {
  readonly open: boolean
  readonly title: string
  readonly onClose: () => void
  readonly children: ReactNode
}

const scrim =
  "fixed inset-0 z-50 grid place-items-center p-l bg-[rgba(2,3,8,.74)] backdrop-blur-sm motion-safe:animate-[cw-fade_220ms_cubic-bezier(.2,.7,.3,1)]"
const dialogBase =
  "w-full max-w-[320px] text-center bg-bg-panel border-2 border-line-bright rounded-md p-l flex flex-col gap-m"
const titleBase =
  "m-0 font-pixel text-label uppercase tracking-[0.12em] text-phosphor [text-shadow:var(--cw-glow-soft)]"

/**
 * Centered scrim modal (e.g. for the name-your-waifu flow).
 *
 * Escape closes the modal. Click outside also closes. Renders null
 * when `open` is false.
 *
 * @param props - Component props.
 * @param props.open - Whether the modal is visible.
 * @param props.title - Dialog title rendered at the top.
 * @param props.onClose - Dismiss callback.
 * @param props.children - Dialog body.
 * @returns The modal element when open, otherwise null.
 */
export function Modal({ children, onClose, open, title }: ModalProps) {
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
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
      className={scrim}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={dialogBase}
      >
        <h2 className={titleBase}>
          {title}
        </h2>
        {children}
      </div>
    </div>
  )
}
