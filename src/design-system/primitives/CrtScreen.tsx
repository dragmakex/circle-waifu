import { cx } from "@/design-system/foundation/classes"
import type { ReactNode } from "react"

const baseClass = "relative isolate"
const scanlinesClass =
  "before:content-[''] before:absolute before:inset-0 before:z-[3] before:pointer-events-none before:bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_2px,rgba(0,0,0,var(--cw-scanline-opacity))_3px,rgba(0,0,0,var(--cw-scanline-opacity))_3px)] before:[background-size:100%_3px] before:[mix-blend-mode:multiply]"
const vignetteClass =
  "after:content-[''] after:absolute after:inset-0 after:z-[1] after:pointer-events-none after:[background:var(--cw-vignette)]"
const flickerClass =
  "motion-safe:before:animate-[cw-flicker_5.5s_steps(60)_infinite]"
const childrenLift = "[&>*]:relative [&>*]:z-[2]"

type CrtScreenProps = {
  readonly children: ReactNode
  readonly flicker?: boolean | undefined
  readonly beam?: boolean | undefined
  readonly rounded?: "md" | "lg" | undefined
  readonly tinted?: boolean | undefined
  readonly padded?: boolean | undefined
}

const radiusClass = {
  md: "rounded-md",
  lg: "rounded-lg",
} as const

const tintedClass =
  "bg-[radial-gradient(80%_60%_at_50%_0%,#0c1020,transparent_60%),var(--cw-ink-900)]"
const paddedClass = "px-m py-l sm:px-l sm:py-xl"

/**
 * Wraps a container with CRT effect layers: scanlines, vignette, optional
 * flicker and a sweeping scan beam. Children are auto-lifted above the
 * texture. Motion is gated behind `prefers-reduced-motion`.
 *
 * @param props - Component props.
 * @param props.children - Content to render inside the CRT.
 * @param props.flicker - Toggle the gentle flicker animation.
 * @param props.beam - Render a sweeping scan beam overlay.
 * @param props.rounded - Border-radius preset for the screen edge.
 * @param props.tinted - Apply the radial-tinted CRT interior gradient.
 * @param props.padded - Apply the standard interior padding scale.
 * @returns A semantic container with CRT FX layers.
 */
export function CrtScreen(
  {
    beam = false,
    children,
    flicker = false,
    padded = false,
    rounded,
    tinted = false,
  }: CrtScreenProps,
) {
  return (
    <div
      className={cx(
        baseClass,
        scanlinesClass,
        vignetteClass,
        childrenLift,
        flicker ? flickerClass : "",
        rounded ? cx(radiusClass[rounded], "overflow-hidden") : "",
        tinted ? tintedClass : "",
        padded ? paddedClass : "",
      )}
    >
      {children}
      {beam && (
        <span
          aria-hidden="true"
          className="absolute inset-0 z-[4] pointer-events-none overflow-hidden after:content-[''] after:absolute after:left-0 after:right-0 after:h-[28%] after:[background:linear-gradient(to_bottom,transparent,rgba(69,224,255,.06),transparent)] motion-safe:after:animate-[cw-sweep_7s_linear_infinite]"
        />
      )}
    </div>
  )
}
