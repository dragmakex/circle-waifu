import type { ReactNode } from "react"

type AppShellProps = {
  readonly children: ReactNode
}

const canvasClass =
  "min-h-screen w-full grid place-items-center [background:radial-gradient(80%_60%_at_50%_0%,#0c1020,transparent_60%),#020308]"

const shellClass =
  "relative w-full max-w-[480px] sm:max-w-[480px] md:max-w-[720px] lg:max-w-[840px] h-[100dvh] sm:h-[min(92dvh,920px)] flex flex-col overflow-hidden rounded-[18px] [box-shadow:0_0_0_1px_var(--cw-line),0_30px_90px_rgba(0,0,0,.7),var(--cw-glow-phosphor)] bg-bg-canvas"

/**
 * Top-level app shell.
 *
 * Renders a phone-shaped CRT bezel: 480px-capped on phones (the prototype's
 * uncompromising mini-app aesthetic) and breathes up to ~840px on laptops
 * while retaining the rounded bezel and CRT halo glow. Content is always a
 * single vertical column anchored inside the shell — sheets, dock and
 * modal overlays anchor to the shell, not the viewport.
 *
 * @param props - Component props.
 * @param props.children - Shell contents.
 * @returns A semantic main landmark inside a CRT-haloed phone shell.
 */
export function AppShell({ children }: AppShellProps) {
  return (
    <div className={canvasClass}>
      <main className={shellClass}>
        {children}
      </main>
    </div>
  )
}
