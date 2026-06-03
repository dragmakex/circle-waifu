import { Surface } from "@/design-system/primitives/Surface"

type CosmeticSlotProps = {
  readonly label: string
  readonly value: string
  readonly tone?: "default" | "subtle" | "accent" | undefined
}

/**
 * Compact "equipped cosmetic" chip used inside the waifu stage.
 *
 * @param props - Component props.
 * @param props.label - Slot label (e.g. "HAT", "AURA").
 * @param props.value - Currently equipped cosmetic identifier.
 * @param props.tone - Surface tone variant.
 * @returns A surface chip describing the cosmetic slot state.
 */
export function CosmeticSlot(
  { label, tone = "subtle", value }: CosmeticSlotProps,
) {
  return (
    <Surface tone={tone}>
      <div className="flex items-center gap-s px-s py-2xs min-w-[10rem]">
        <span className="font-pixel text-micro tracking-[0.12em] uppercase text-text-mut">
          {label}
        </span>
        <span className="font-pixel text-label text-phosphor [text-shadow:var(--cw-glow-soft)] truncate">
          {value}
        </span>
      </div>
    </Surface>
  )
}
