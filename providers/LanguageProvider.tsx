"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type Language = "sl" | "en"

type LanguageProviderState = {
  lang: Language
  setLang: (lang: Language) => void
  t: <T>(sl: T, en: T) => T
}

const initialState: LanguageProviderState = {
  lang: "sl",
  setLang: () => null,
  t: function<T>(sl: T, _en: T): T { return sl },
}

const LanguageContext = createContext<LanguageProviderState>(initialState)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("sl")

  function t<T>(slText: T, enText: T): T {
    return lang === "sl" ? slText : enText
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined)
    throw new Error("useLanguage must be used within a LanguageProvider")
  return context
}