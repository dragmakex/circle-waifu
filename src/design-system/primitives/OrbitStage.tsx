import { Button } from "@/design-system/components/Button"
import { WaifuSprite } from "@/design-system/components/WaifuSprite"

type Mood = "curious" | "focused" | "pleased" | "undersampled"

type OrbitStageProps = {
  readonly mood?: Mood | undefined
  readonly waifuName?: string | undefined
  readonly onPrepare?: (() => void) | undefined
  readonly onVerify?: (() => void) | undefined
  readonly onShare?: (() => void) | undefined
}

const canvasClass =
  "min-h-screen w-full flex items-center justify-center p-l bg-bg-canvas"

const orbitClass =
  "relative w-full max-w-[28rem] aspect-square grid place-items-center"

const topBtn = "absolute top-0 left-1/2 -translate-x-1/2"
const bottomBtn = "absolute bottom-0 left-1/2 -translate-x-1/2"
const leftBtn = "absolute left-0 top-1/2 -translate-y-1/2"
const rightBtn = "absolute right-0 top-1/2 -translate-y-1/2"

/**
 * The whole app: waifu in the middle, four buttons orbiting around her.
 *
 * @param props - Component props.
 * @param props.mood - Waifu mood (drives sprite + frame tint).
 * @param props.waifuName - Accessible label for the sprite.
 * @param props.onPrepare - Top button handler (prepare mission).
 * @param props.onVerify - Bottom button handler (verify mission).
 * @param props.onShare - Right button handler (share result cast).
 * @returns The full orbit stage.
 */
export function OrbitStage(
  {
    mood = "curious",
    onPrepare,
    onShare,
    onVerify,
    waifuName = "Waifu",
  }: OrbitStageProps,
) {
  return (
    <div className={canvasClass}>
      <div className={orbitClass}>
        <div className={topBtn}>
          <Button variant="phosphor" onClick={onPrepare}>
            Prepare
          </Button>
        </div>
        <div className={leftBtn}>
          <Button variant="ghost" onClick={onShare}>
            Share
          </Button>
        </div>
        <WaifuSprite mood={mood} name={waifuName} size="xl" />
        <div className={rightBtn}>
          <Button variant="ghost" onClick={onShare}>
            Pool
          </Button>
        </div>
        <div className={bottomBtn}>
          <Button variant="primary" onClick={onVerify}>
            Verify
          </Button>
        </div>
      </div>
    </div>
  )
}
