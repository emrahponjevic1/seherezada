"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

// Tema živi u localStorage-u, dakle van Reacta. Pretplatnici se obavještavaju
// ručno pri promjeni, a 'storage' pokriva promjenu iz druge kartice.
const pretplatnici = new Set<() => void>()

function objaviPromjenu() {
  pretplatnici.forEach((javi) => javi())
}

function pretplatiSe(javi: () => void) {
  pretplatnici.add(javi)
  window.addEventListener("storage", javi)
  return () => {
    pretplatnici.delete(javi)
    window.removeEventListener("storage", javi)
  }
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  // useSyncExternalStore, a ne useState: server vrati podrazumijevanu temu,
  // preglednik pročita zapamćenu, i React to spoji bez razmimoilaženja
  // pri hidraciji — što bi se sa čitanjem localStorage-a u useState desilo.
  const theme = useSyncExternalStore(
    pretplatiSe,
    () => {
      try {
        return (localStorage.getItem(storageKey) as Theme | null) ?? defaultTheme
      } catch {
        return defaultTheme
      }
    },
    () => defaultTheme,
  )

  const prviProlaz = useRef(true)

  useEffect(() => {
    // Prvi prolaz se preskače: klasu je već postavila blokirajuća skripta
    // u <head>, prije prvog iscrtavanja. Da je ovdje ponovo postavljamo,
    // pri osvježavanju bi bljesnula pogrešna tema.
    if (prviProlaz.current) {
      prviProlaz.current = false
      return
    }

    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const setTheme = useCallback(
    (nova: Theme) => {
      try {
        localStorage.setItem(storageKey, nova)
      } catch {
        /* bez trajnog pamćenja tema i dalje radi do osvježavanja */
      }
      objaviPromjenu()
    },
    [storageKey],
  )

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme])

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")
  return context
}
