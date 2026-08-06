import Link from "next/link"
import { ArrowRight, ChevronDown } from "lucide-react"

import { formatRadnoVrijeme, t } from "@/lib/i18n"
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

const KRATKI_DAN: Record<Dan, { sl: string; en: string }> = {
  pon: { sl: "Pon", en: "Mon" },
  uto: { sl: "Tor", en: "Tue" },
  sri: { sl: "Sre", en: "Wed" },
  cet: { sl: "Čet", en: "Thu" },
  pet: { sl: "Pet", en: "Fri" },
  sub: { sl: "Sob", en: "Sat" },
  ned: { sl: "Ned", en: "Sun" },
}

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
      const od = t(KRATKI_DAN[g.od], lang)
      const doo = t(KRATKI_DAN[g.do], lang)
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
        <h2 className="text-4xl md:text-5xl font-black font-poppins tracking-tight mb-10 text-center md:text-left">
          {t(
            { sl: "Pogosta vprašanja", en: "Frequently asked questions" },
            lang,
          )}
        </h2>

        <div className="space-y-4 max-w-3xl">
          <Pitanje
            pitanje={t(
              { sl: "Je meso res halal?", en: "Is the meat really halal?" },
              lang,
            )}
          >
            {t(
              {
                sl: "Da. Meso nabavljamo pri preverjenih halal dobaviteljih in ga pripravljamo ločeno. V kuhinji ni svinjine in ne uporabljamo alkohola — to velja za vse jedi, tudi za burgerje in pice.",
                en: "Yes. We source our meat from certified halal suppliers and prepare it separately. There is no pork in the kitchen and we use no alcohol — this applies to every dish, burgers and pizzas included.",
              },
              lang,
            )}
          </Pitanje>

          <Pitanje
            pitanje={t(
              { sl: "Do kdaj ste odprti?", en: "How late are you open?" },
              lang,
            )}
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
            pitanje={t(
              {
                sl: "Imate vegetarijansko ponudbo?",
                en: "Do you have vegetarian options?",
              },
              lang,
            )}
          >
            {t(
              {
                sl: "Imamo. Falafel v jufki in falafel plošča sta povsem rastlinska, prav tako pomfri in sezonska solata. Med picami sta vegetarijanski margerita in vegetariana.",
                en: "We do. Falafel in yufka and the falafel plate are fully plant-based, as are the fries and the seasonal salad. Among the pizzas, margherita and vegetariana are vegetarian.",
              },
              lang,
            )}
          </Pitanje>

          <Pitanje
            pitanje={t({ sl: "Dostavljate?", en: "Do you deliver?" }, lang)}
          >
            {t(
              {
                sl: "Dostava poteka prek Wolta in Glova. Lahko pa jed tudi naročite po telefonu in jo prevzamete pri nas.",
                en: "Delivery runs through Wolt and Glovo. You can also order by phone and pick your food up at the counter.",
              },
              lang,
            )}
          </Pitanje>
        </div>

        <div className="mt-10">
          <Link
            href={svaVprasanja}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm font-bold hover:scale-105 active:scale-95 transition-transform"
          >
            {t({ sl: "Vsa vprašanja", en: "All questions" }, lang)}
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}
