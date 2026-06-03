import type { ReactNode } from "react"

type PageProps = {
  readonly children: ReactNode
}

/**
 * Full-page application wrapper with centered, constrained content.
 *
 * Renders as `<main>` — the browser's primary content landmark. On laptop
 * the layout stretches to 80rem; on phones it collapses to a single column
 * matching the Farcaster mini-app phone shell.
 *
 * @param props - Page props.
 * @param props.children - Page content.
 * @returns A semantic page wrapper.
 */
export function Page({ children }: PageProps) {
  return (
    <main className="min-h-screen bg-bg-canvas text-text">
      <div className="mx-auto w-full max-w-[80rem] px-m sm:px-l py-m sm:py-xl pb-[120px]">
        {children}
      </div>
    </main>
  )
}
