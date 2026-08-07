import Link from "next/link"
import { s } from "@/lib/sadrzaj"
import { ArrowRight, ChevronDown } from "lucide-react"

import { formatRadnoVrijeme, ui } from "@/lib/i18n"
import type { Dan, Lang, Lokal } from "@/lib/domain"
import { href } from "@/lib/route"

/**
 * Sekcija 8 — Pogosta vprašanja. NOVA.
 *
 * Koristi native <details>, ne JS accordion. Time su SVA pitanja i
 * odgovori u izvornom HTML-u i rade i sa isključenim JavaScriptom —
 * baš ono što plan traži („sakriveni CSS-om, ne izostavljeni").
 *
 * Odgovor na „Do kdaj ste odprti?" se izvodi iz radnog vremena i nabraja
 * sve lokale — nikad se ne prepisuje ručno.
 */

const DANI_REDOM: Dan[] = ["pon", "uto", "sri", "cet", "pet", "sub", "ned"]

// Skraćeni dani žive u katalogu pod danKratko.* (korak 22).

/** Spaja uzastopne dane sa istim vremenom: „Pon–Čet 09:00 – 02:00". */
function sazetakVremena(lokal: Lokal, lang: Lang): string {
  const grupe: { od: Dan; do: Dan; vrijeme: string }[] = []

  for (const dan of DANI_REDOM) {
    const vrijeme = formatRadnoVrijeme(lokal.radnoVrijeme, dan, lang)
    const zadnja = grupe[grupe.length - 1]

    if (zadnja && zadnja.vrijeme === vrijeme) {
      zadnja.do = dan
    } else {
      grupe.push({ od: dan, do: dan, vrijeme })
    }
  }

  return grupe
    .map((g) => {
      const od = ui(`danKratko.${g.od}`, lang)
      const doo = ui(`danKratko.${g.do}`, lang)
      const raspon = g.od === g.do ? od : `${od}–${doo}`
      return `${raspon} ${g.vrijeme}`
    })
    .join(" · ")
}

function Pitanje({
  pitanje,
  children,
}: {
  pitanje: string
  children: React.ReactNode
}) {
  return (
    <details className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-6 py-4">
      <summary className="flex items-center justify-between gap-4 cursor-pointer font-bold text-lg list-none">
        {pitanje}
        <ChevronDown
          size={20}
          className="shrink-0 text-shere-red transition-transform group-open:rotate-180"
        />
      </summary>
      <div className="pt-3 text-muted-foreground leading-relaxed">
        {children}
      </div>
    </details>
  )
}

export function FaqIzvod({
  lokali,
  lang,
  glavniSlug,
}: {
  lokali: Lokal[]
  lang: Lang
  glavniSlug: string
}) {
  const svaVprasanja = href(
    { kind: "shared", lang, page: "pogosta-vprasanja" },
    glavniSlug,
  )
  const uPogonu = lokali.filter((l) => l.stanje === "radi")

  return (
    <section className="w-full py-20 md:py-24">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <h2 className="text-4xl md:text-5xl font-black font-poppins tracking-tight mb-10 text-center md:text-start">
          {ui("nav.faq", lang)}
        </h2>

        <div className="space-y-4 max-w-3xl">
          <Pitanje
            pitanje={s("faq.halal.pitanje", lang)}
          >
            {s("faq.halal.odgovor", lang)}
          </Pitanje>

          <Pitanje
            pitanje={s("faq.pitanje.doKdaj", lang)}
          >
            <ul className="space-y-2">
              {uPogonu.map((lokal) => (
                <li key={lokal.id}>
                  <span className="font-semibold text-foreground">
                    {lokal.naziv}
                  </span>{" "}
                  — {sazetakVremena(lokal, lang)}
                </li>
              ))}
            </ul>
          </Pitanje>

          <Pitanje
            pitanje={s("faq.vegetarijansko.pitanje", lang)}
          >
            {s("faq.vegetarijansko.odgovor", lang)}
          </Pitanje>

          <Pitanje
            pitanje={s("faq.dostava.pitanje", lang)}
          >
            {s("faq.dostava.odgovor", lang)}
          </Pitanje>
        </div>

        <div className="mt-10">
          <Link
            href={svaVprasanja}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm font-bold hover:scale-105 active:scale-95 transition-transform"
          >
            {ui("akcija.vsaVprasanja", lang)}
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}
