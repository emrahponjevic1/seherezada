import type { Lang, Lokal } from "@/lib/domain"
import { formatRadnoVrijeme, t, ui } from "@/lib/i18n"
import { s } from "@/lib/sadrzaj"
import type { Dan } from "@/lib/domain"
import { href, type SharedPage } from "@/lib/route"

import {
  Dugmad,
  GrupaPitanja,
  Odjeljak,
  OkvirStranice,
  Pitanje,
  Srodne,
  type Mrvica,
} from "./dijelovi"
import { GalerijaFilter } from "./GalerijaFilter"
import {
  CAS_IN_LOKACIJA,
  HALAL_I_SASTOJCI,
  NAROCANJE_IN_CENE,
} from "./sadrzajFaq"

/**
 * Šest zajedničkih stranica — iste za sve lokale.
 *
 * Demo sadržaj je prihvatljiv; bitno je da struktura, hijerarhija naslova
 * i unutrašnje povezivanje rade. Nijedna stranica ne smije ostati siroče.
 */

const DANI_REDOM: Dan[] = ["pon", "uto", "sri", "cet", "pet", "sub", "ned"]

// Skraćeni dani žive u katalogu pod danKratko.* (korak 22).

/** „Pon–Čet 09:00 – 02:00 · Pet–Sob 09:00 – 05:00 · Ned 10:00 – 05:00" */
export function sazetakVremena(lokal: Lokal, lang: Lang): string {
  const grupe: { od: Dan; do: Dan; vrijeme: string }[] = []

  for (const dan of DANI_REDOM) {
    const vrijeme = formatRadnoVrijeme(lokal.radnoVrijeme, dan, lang)
    const zadnja = grupe[grupe.length - 1]
    if (zadnja && zadnja.vrijeme === vrijeme) zadnja.do = dan
    else grupe.push({ od: dan, do: dan, vrijeme })
  }

  return grupe
    .map((g) => {
      const od = ui(`danKratko.${g.od}`, lang)
      const doo = ui(`danKratko.${g.do}`, lang)
      return `${g.od === g.do ? od : `${od}–${doo}`} ${g.vrijeme}`
    })
    .join(" · ")
}

// ─────────────────────────────────────────────────────────────

export function ZajednickaStranica({
  stranica,
  lokali,
  lang,
  glavniSlug,
}: {
  stranica: SharedPage
  lokali: Lokal[]
  lang: Lang
  glavniSlug: string
}) {
  const a = {
    domov: href({ kind: "lokal-home", lang, lokal: glavniSlug }, glavniSlug),
    meni: href(
      { kind: "lokal-page", lang, lokal: glavniSlug, page: "meni" },
      glavniSlug,
    ),
    halal: href({ kind: "shared", lang, page: "halal" }, glavniSlug),
    oNas: href({ kind: "shared", lang, page: "o-nas" }, glavniSlug),
    galerija: href({ kind: "shared", lang, page: "galerija" }, glavniSlug),
    faq: href({ kind: "shared", lang, page: "pogosta-vprasanja" }, glavniSlug),
    zasebnost: href({ kind: "shared", lang, page: "zasebnost" }, glavniSlug),
    pogoji: href({ kind: "shared", lang, page: "pogoji" }, glavniSlug),
    kebab: href({ kind: "seo", lang, page: "kebab-ljubljana" }, glavniSlug),
    falafel: href({ kind: "seo", lang, page: "falafel-ljubljana" }, glavniSlug),
    halalHrana: href(
      { kind: "seo", lang, page: "halal-hrana-ljubljana" },
      glavniSlug,
    ),
    nocna: href({ kind: "seo", lang, page: "nocna-hrana-ljubljana" }, glavniSlug),
    dostava: href({ kind: "seo", lang, page: "dostava-ljubljana" }, glavniSlug),
  }

  const domov = ui("akcija.domov", lang)
  const uPogonu = lokali.filter((l) => l.stanje === "radi")

  const mrvice = (naziv: string): Mrvica[] => [
    { naziv: domov, adresa: a.domov },
    { naziv },
  ]

  switch (stranica) {
    // ── O nas ────────────────────────────────────────────────
    case "o-nas":
      return (
        <OkvirStranice
          mrvice={mrvice(ui("nav.oNas", lang))}
          naslov={ui("nav.oNas", lang)}
          uvod={s("oNas.uvod", lang)}
        >
          <Odjeljak naslov={s("oNas.pocetak.naslov", lang)}>
            <p>
              {s("oNas.pocetak.p1", lang)}
            </p>
            <p>
              {s("oNas.pocetak.p2", lang)}
            </p>
          </Odjeljak>

          <Odjeljak
            naslov={s("oNas.razlika.naslov", lang)}
          >
            <p>
              {s("oNas.razlika.p1", lang)}
            </p>
            <p>
              {s("oNas.razlika.p2", lang)}
            </p>
          </Odjeljak>

          <Odjeljak naslov={s("oNas.ekipa.naslov", lang)}>
            <p>
              {s("oNas.ekipa.p1", lang)}
            </p>
          </Odjeljak>

          <Odjeljak naslov={s("oNas.halal.naslov", lang)}>
            <p>
              {s("oNas.halal.p1", lang)}
            </p>
            <Dugmad
              stavke={[
                {
                  naziv: ui("akcija.preberiOHalalu", lang),
                  adresa: a.halal,
                  glavno: true,
                },
              ]}
            />
          </Odjeljak>

          <Dugmad
            stavke={[
              {
                naziv: ui("akcija.poglejMeni", lang),
                adresa: a.meni,
                glavno: true,
              },
              {
                naziv: ui("nav.galerija", lang),
                adresa: a.galerija,
              },
              {
                naziv: ui("nav.faq", lang),
                adresa: a.faq,
              },
            ]}
          />
        </OkvirStranice>
      )

    // ── Halal ────────────────────────────────────────────────
    case "halal":
      return (
        <OkvirStranice
          mrvice={mrvice("Halal")}
          naslov={s("halal.naslov", lang)}
          uvod={s("halal.uvod", lang)}
        >
          <Odjeljak naslov={s("halal.pomen.naslov", lang)}>
            <p>
              {s("halal.pomen.p1", lang)}
            </p>
          </Odjeljak>

          <Odjeljak naslov={s("halal.meso.naslov", lang)}>
            <p>
              {s("halal.meso.p1", lang)}
            </p>
          </Odjeljak>

          <Odjeljak naslov={s("halal.certifikat.naslov", lang)}>
            <p>
              {s("halal.certifikat.p1", lang)}
            </p>
          </Odjeljak>

          <Odjeljak
            naslov={s("halal.odvojeno.naslov", lang)}
          >
            <p>
              {s("halal.odvojeno.p1", lang)}
            </p>
          </Odjeljak>

          <Odjeljak naslov={s("halal.bezAlkohola.naslov", lang)}>
            <p>
              {s("halal.bezAlkohola.p1", lang)}
            </p>
          </Odjeljak>

          <Odjeljak naslov={ui("nav.faq", lang)}>
            <div className="space-y-3">
              {HALAL_I_SASTOJCI.slice(0, 4).map((p, i) => (
                <Pitanje key={i} pitanje={t(p.pitanje, lang)}>
                  {t(p.odgovor, lang)}
                </Pitanje>
              ))}
            </div>
          </Odjeljak>

          <Srodne
            naslov={ui("naslov.poglejteSe", lang)}
            stavke={[
              { naziv: ui("seo.kebabLjubljana", lang), adresa: a.kebab },
              { naziv: ui("seo.falafelLjubljana", lang), adresa: a.falafel },
              { naziv: ui("seo.halalHranaLjubljana", lang), adresa: a.halalHrana },
              { naziv: ui("nav.celMeni", lang), adresa: a.meni },
            ]}
          />
        </OkvirStranice>
      )

    // ── Galerija ─────────────────────────────────────────────
    case "galerija": {
      const slike = [
        { grupa: "hrana", url: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&q=80", opis: "galerija.slika1" },
        { grupa: "hrana", url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80", opis: "galerija.slika2" },
        { grupa: "hrana", url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80", opis: "galerija.slika3" },
        { grupa: "hrana", url: "https://images.unsplash.com/photo-1593010950930-741fb981f26a?w=800&q=80", opis: "galerija.slika4" },
        { grupa: "lokal", url: "/rotisserie_hero.webp", opis: "galerija.slika5" },
        { grupa: "lokal", url: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&q=80", opis: "galerija.slika6" },
        { grupa: "ekipa", url: "https://images.unsplash.com/photo-1593010950930-741fb981f26a?w=800&q=80", opis: "galerija.slika7" },
        { grupa: "ekipa", url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80", opis: "galerija.slika8" },
      ]

      return (
        <OkvirStranice
          mrvice={mrvice(ui("nav.galerija", lang))}
          naslov={ui("nav.galerija", lang)}
          uvod={s("galerija.uvod", lang)}
        >
          <div className="max-w-none">
            <GalerijaFilter
              svi={ui("meni.vse", lang)}
              grupe={[
                { kljuc: "hrana", naziv: ui("galerija.hrana", lang) },
                { kljuc: "lokal", naziv: ui("galerija.lokal", lang) },
                { kljuc: "ekipa", naziv: ui("galerija.ekipa", lang) },
              ]}
            >
              {slike.map((slika, i) => (
                <figure
                  key={i}
                  data-grupa={slika.grupa}
                  className="rounded-2xl overflow-hidden border border-white/5 bg-white/5"
                >
                  <img
                    src={slika.url}
                    alt={s(slika.opis, lang)}
                    width={800}
                    height={600}
                    loading={i < 3 ? "eager" : "lazy"}
                    className="w-full aspect-[4/3] object-cover"
                  />
                  <figcaption className="p-4 text-sm text-muted-foreground">
                    {s(slika.opis, lang)}
                  </figcaption>
                </figure>
              ))}
            </GalerijaFilter>
          </div>

          <Srodne
            naslov={ui("naslov.poglejteSe", lang)}
            stavke={[
              { naziv: ui("nav.celMeni", lang), adresa: a.meni },
              { naziv: ui("nav.oNas", lang), adresa: a.oNas },
            ]}
          />
        </OkvirStranice>
      )
    }

    // ── Pogosta vprašanja ────────────────────────────────────
    case "pogosta-vprasanja": {
      const odgovorOVremenu = uPogonu
        .map((l) => `${l.naziv} — ${sazetakVremena(l, lang)}`)
        .join(" · ")

      return (
        <OkvirStranice
          mrvice={mrvice(ui("nav.faq", lang))}
          naslov={ui("nav.faq", lang)}
          uvod={s("faq.uvod", lang)}
        >
          <GrupaPitanja
            naslov={s("faq.grupa.halal", lang)}
            pitanja={HALAL_I_SASTOJCI}
            lang={lang}
          />

          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-black font-poppins tracking-tight">
              {s("faq.grupa.vrijeme", lang)}
            </h2>
            <div className="space-y-3">
              {/* Odgovor se izvodi iz radnog vremena i nabraja SVE lokale. */}
              <Pitanje
                pitanje={s("faq.pitanje.doKdaj", lang)}
              >
                {odgovorOVremenu}
              </Pitanje>
              {CAS_IN_LOKACIJA.map((p, i) => (
                <Pitanje key={i} pitanje={t(p.pitanje, lang)}>
                  {t(p.odgovor, lang)}
                </Pitanje>
              ))}
            </div>
          </section>

          <GrupaPitanja
            naslov={s("faq.grupa.narucivanje", lang)}
            pitanja={NAROCANJE_IN_CENE}
            lang={lang}
          />

          <Srodne
            naslov={ui("naslov.poglejteSe", lang)}
            stavke={[
              { naziv: "Halal", adresa: a.halal },
              { naziv: ui("nav.celMeni", lang), adresa: a.meni },
              { naziv: ui("seo.dostava", lang), adresa: a.dostava },
              { naziv: ui("seo.nocnaHrana", lang), adresa: a.nocna },
            ]}
          />
        </OkvirStranice>
      )
    }

    // ── Zasebnost ────────────────────────────────────────────
    case "zasebnost":
      return (
        <OkvirStranice
          mrvice={mrvice(ui("stranica.zasebnost", lang))}
          naslov={s("zasebnost.naslov", lang)}
          uvod={s("zasebnost.uvod", lang)}
        >
          <Odjeljak naslov={s("zasebnost.upravljavec.naslov", lang)}>
            <p>
              {s("zasebnost.upravljavec.p1", lang)}
            </p>
          </Odjeljak>

          <Odjeljak naslov={s("zasebnost.zbiramo.naslov", lang)}>
            <p>
              {s("zasebnost.zbiramo.p1", lang)}
            </p>
          </Odjeljak>

          <Odjeljak naslov={s("zasebnost.piskotki.naslov", lang)}>
            <p>
              {s("zasebnost.piskotki.p1", lang)}
            </p>
          </Odjeljak>

          <Odjeljak naslov={s("zasebnost.pravice.naslov", lang)}>
            <p>
              {s("zasebnost.pravice.p1", lang)}
            </p>
          </Odjeljak>

          <Srodne
            naslov={ui("naslov.poglejteSe", lang)}
            stavke={[
              { naziv: ui("stranica.pogojiUporabe", lang), adresa: a.pogoji },
              { naziv: ui("nav.faq", lang), adresa: a.faq },
            ]}
          />
        </OkvirStranice>
      )

    // ── Pogoji ───────────────────────────────────────────────
    case "pogoji":
      return (
        <OkvirStranice
          mrvice={mrvice(ui("stranica.pogoji", lang))}
          naslov={ui("stranica.pogojiUporabe", lang)}
          uvod={s("pogoji.uvod", lang)}
        >
          <Odjeljak naslov={s("pogoji.narocanje.naslov", lang)}>
            <p>
              {s("pogoji.narocanje.p1", lang)}
            </p>
          </Odjeljak>

          <Odjeljak naslov={s("pogoji.cene.naslov", lang)}>
            <p>
              {s("pogoji.cene.p1", lang)}
            </p>
          </Odjeljak>

          <Odjeljak naslov={ui("seo.dostava", lang)}>
            <p>
              {s("pogoji.dostava.p1", lang)}
            </p>
          </Odjeljak>

          <Odjeljak naslov={s("pogoji.reklamacije.naslov", lang)}>
            <p>
              {s("pogoji.reklamacije.p1", lang)}
            </p>
          </Odjeljak>

          <Srodne
            naslov={ui("naslov.poglejteSe", lang)}
            stavke={[
              { naziv: ui("stranica.zasebnost", lang), adresa: a.zasebnost },
              { naziv: ui("seo.dostava", lang), adresa: a.dostava },
            ]}
          />
        </OkvirStranice>
      )
  }
}
