import { Button } from "@/design-system/components/Button"
import { Modal } from "@/design-system/components/Modal"
import { Text } from "@/design-system/components/Text"
import { TextField } from "@/design-system/components/TextField"
import { Inline } from "@/design-system/primitives/Inline"
import { Stack } from "@/design-system/primitives/Stack"
import { useState } from "react"

type NameModalProps = {
  readonly open: boolean
  readonly currentName: string
  readonly onClose: () => void
  readonly onSubmit: (name: string) => void
}

/**
 * Scrim modal that captures (or replaces) the waifu's name.
 *
 * @param props - Component props.
 * @param props.open - Whether the modal is visible.
 * @param props.currentName - Existing waifu name pre-filled into the input.
 * @param props.onClose - Dismiss callback.
 * @param props.onSubmit - Save callback receiving the trimmed name.
 * @returns The name modal.
 */
export function NameModal(
  { currentName, onClose, onSubmit, open }: NameModalProps,
) {
  const [draft, setDraft] = useState(currentName)

  const submit = () => {
    const trimmed = draft.trim()
    if (trimmed.length > 0) {
      onSubmit(trimmed)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Name your waifu">
      <Stack gap="m">
        <Text tone="caption" align="center">
          Lab protocol requires a designation for the companion. Up to 16
          characters.
        </Text>
        <TextField
          label="DESIGNATION"
          value={draft}
          maxLength={16}
          onChange={(event) => setDraft(event.currentTarget.value)}
        />
        <Inline align="end" gap="s" wrap>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submit}>
            Save designation
          </Button>
        </Inline>
      </Stack>
    </Modal>
  )
}
