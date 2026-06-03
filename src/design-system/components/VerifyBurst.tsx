// @effect-diagnostics globalTimers:skip-file
import { useEffect } from "react"

type VerifyBurstProps = {
  readonly visible: boolean
  readonly onDone: () => void
}

const containerClass =
  "absolute inset-0 z-[30] grid place-content-center gap-s text-center pointer-events-none [background:radial-gradient(60%_40%_at_50%_50%,color-mix(in_oklab,var(--cw-accent)_22%,transparent),transparent_70%)] motion-safe:animate-[cw-fade_220ms_cubic-bezier(.2,.7,.3,1)]"
const coreClass =
  "font-hero text-[32px] text-accent [text-shadow:var(--cw-glow-accent)] motion-safe:animate-[cw-pop_420ms_cubic-bezier(.2,.7,.3,1)]"
const subClass =
  "font-pixel text-label uppercase tracking-[0.12em] text-phosphor [text-shadow:var(--cw-glow-soft)] motion-safe:animate-[cw-fade_420ms_cubic-bezier(.2,.7,.3,1)]"

/**
 * Brief celebratory burst overlay shown after a mission is verified.
 *
 * Anchors to the nearest positioned ancestor (typically the app shell) and
 * auto-dismisses after ~1.2s by calling `onDone`. Returns null when not
 * visible.
 *
 * @param props - Component props.
 * @param props.visible - Whether the burst is shown.
 * @param props.onDone - Callback after the auto-dismiss timeout.
 * @returns The burst overlay or null.
 */
export function VerifyBurst({ onDone, visible }: VerifyBurstProps) {
  useEffect(() => {
    if (!visible) {
      return
    }
    const id = setTimeout(onDone, 1200)
    return () => clearTimeout(id)
  }, [visible, onDone])

  if (!visible) {
    return null
  }

  return (
    <div className={containerClass} aria-live="polite">
      <span className={coreClass}>
        ★
      </span>
      <span className={subClass}>
        OBSERVATION RECORDED
      </span>
    </div>
  )
}
