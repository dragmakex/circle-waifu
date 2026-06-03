import { useEffect, useState } from "react"

type Theme = "dark" | "light"

const STORAGE_KEY = "cw-theme"

const buttonClass =
  "absolute right-[14px] bottom-[calc(76px+14px)] z-[14] w-[40px] h-[40px] rounded-full grid place-items-center bg-[color-mix(in_oklab,var(--cw-ink-800)_80%,transparent)] border-2 border-line-bright text-phosphor cursor-pointer backdrop-blur-md text-[16px] transition-transform duration-200 ease-out hover:scale-110 hover:[box-shadow:var(--cw-glow-phosphor)] focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--cw-ink-900),0_0_0_4px_var(--cw-phosphor)]"

const readInitialTheme = (): Theme => {
  if (typeof window === "undefined") {
    return "dark"
  }
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === "dark" || stored === "light") {
    return stored
  }
  return "dark"
}

const applyTheme = (theme: Theme): void => {
  if (typeof document === "undefined") {
    return
  }
  document.documentElement.setAttribute("data-theme", theme)
}

/**
 * Floating theme toggle FAB.
 *
 * Persists the user's choice to `localStorage` and applies it to
 * `<html data-theme>` so the cascade tokens swap instantly. Default is
 * `dark` (the SSR-rendered baseline).
 *
 * @returns A fixed-position theme toggle button.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark")

  useEffect(() => {
    const initial = readInitialTheme()
    setTheme(initial)
    applyTheme(initial)
  }, [])

  const onToggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark"
    setTheme(next)
    applyTheme(next)
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, next)
    }
  }

  const label = theme === "dark"
    ? "Switch to lab paper theme"
    : "Switch to CRT theme"

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onToggle}
      className={buttonClass}
    >
      <span aria-hidden="true">
        {theme === "dark" ? "☀" : "◐"}
      </span>
    </button>
  )
}
