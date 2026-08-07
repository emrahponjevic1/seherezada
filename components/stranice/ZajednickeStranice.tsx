import type { Lang, Lokal } from "@/lib/domain"
import { formatRadnoVrijeme, ui } from "@/lib/i18n"
import { s } from "@/lib/sadrzaj"
import type { Dan } from "@/lib/domain"
import { href, SEO_PAGES, type SharedPage } from "@/lib/route"

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
import { Zemljevid } from "./Zemljevid"
import { SADRZAJ_SEO } from "./sadrzajSeo"
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
                <Pitanje key={i} pitanje={s(p.pitanje, lang)}>
                  {s(p.odgovor, lang)}
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
      // Lokalne zastupne slike, ne Unsplash adrese. Dvije od ranijih
      // osam pokazivale su na fotografiju koja je u međuvremenu skinuta
      // i vraćala je 404 — galerija je imala dvije prazne pločice.
      const slike = [
        { grupa: "hrana", url: "/jela/kebab/800.webp", opis: "galerija.slika1" },
        { grupa: "hrana", url: "/jela/pice/800.webp", opis: "galerija.slika2" },
        { grupa: "hrana", url: "/jela/burgeri/800.webp", opis: "galerija.slika3" },
        { grupa: "hrana", url: "/jela/falafel/800.webp", opis: "galerija.slika4" },
        { grupa: "lokal", url: "/rotisserie_hero.webp", opis: "galerija.slika5" },
        { grupa: "lokal", url: "/jela/meniji/800.webp", opis: "galerija.slika6" },
        { grupa: "ekipa", url: "/jela/dodatki/800.webp", opis: "galerija.slika7" },
        { grupa: "ekipa", url: "/jela/ostalo/800.webp", opis: "galerija.slika8" },
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
                <Pitanje key={i} pitanje={s(p.pitanje, lang)}>
                  {s(p.odgovor, lang)}
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

    // ── Kontakt ──────────────────────────────────────────────
    //  Ovo je stranica koju Google najpažljivije upoređuje sa Business
    //  profilom. Zato adresa, telefon i radno vrijeme moraju biti TEKST
    //  u serverskom HTML-u — ne samo u ugrađenoj mapi i ne kao slika.
    case "kontakt":
      return (
        <OkvirStranice
          mrvice={mrvice(ui("nav.kontakt", lang))}
          naslov={ui("nav.kontakt", lang)}
          uvod={s("kontakt.uvod", lang)}
        >
          <section className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-black font-poppins tracking-tight">
              {ui("kontakt.nasiLokali", lang)}
            </h2>

            {uPogonu.map((lokal) => (
              <div
                key={lokal.id}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 space-y-4"
              >
                <h3 className="text-xl font-black font-poppins">{lokal.naziv}</h3>

                <dl className="space-y-2 text-muted-foreground">
                  <div>
                    <dt className="sr-only">{ui("nav.lokal", lang)}</dt>
                    <dd className="text-foreground">{lokal.adresa}</dd>
                  </div>
                  <div>
                    <dt className="sr-only">{ui("akcija.poklici", lang)}</dt>
                    <dd>
                      <a
                        href={`tel:${lokal.telefon.replace(/\s/g, "")}`}
                        dir="ltr"
                        className="font-semibold text-shere-red hover:underline"
                      >
                        {lokal.telefon}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="sr-only">{ui("stanje.odprto", lang)}</dt>
                    <dd>{sazetakVremena(lokal, lang)}</dd>
                  </div>
                </dl>

                <Dugmad
                  stavke={[
                    ...(lokal.woltUrl
                      ? [{ naziv: ui("akcija.narociWolt", lang), adresa: lokal.woltUrl, vanjski: true }]
                      : []),
                    ...(lokal.glovoUrl
                      ? [{ naziv: ui("akcija.narociGlovo", lang), adresa: lokal.glovoUrl, vanjski: true }]
                      : []),
                    {
                      naziv: ui("akcija.navodila", lang),
                      adresa:
                        lokal.lat && lokal.lng
                          ? `https://maps.google.com/?q=${lokal.lat},${lokal.lng}`
                          : `https://maps.google.com/?q=${encodeURIComponent(lokal.adresa)}`,
                      vanjski: true,
                    },
                  ]}
                />

                <Zemljevid
                  naziv={lokal.naziv}
                  adresa={lokal.adresa}
                  lat={lokal.lat}
                  lng={lokal.lng}
                  natpis={ui("kontakt.zemljevid", lang)}
                />
              </div>
            ))}
          </section>

          <Odjeljak naslov={s("kontakt.potN", lang)}>
            <p>{s("kontakt.potT", lang)}</p>
          </Odjeljak>

          <Odjeljak naslov={s("kontakt.parkingN", lang)}>
            <p>{s("kontakt.parkingT", lang)}</p>
          </Odjeljak>

          <Odjeljak naslov={s("kontakt.placiloN", lang)}>
            <p>{s("kontakt.placiloT", lang)}</p>
          </Odjeljak>

          <Srodne
            naslov={ui("naslov.poglejteSe", lang)}
            stavke={[
              { naziv: ui("nav.celMeni", lang), adresa: a.meni },
              { naziv: ui("nav.faq", lang), adresa: a.faq },
              { naziv: ui("seo.dostava", lang), adresa: a.dostava },
            ]}
          />
        </OkvirStranice>
      )

    // ── Blog ─────────────────────────────────────────────────
    //  Ovo je i čvorište internih linkova: odavde snaga naslovne teče na
    //  devet ciljanih stranica. Bez njega su one dostupne samo iz
    //  podnožja i iz srodnih linkova.
    case "blog":
      return (
        <OkvirStranice
          mrvice={mrvice(ui("nav.blog", lang))}
          naslov={ui("nav.blog", lang)}
          uvod={s("blog.uvod", lang)}
        >
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))] max-w-none">
            {SEO_PAGES.map((stranicaSeo) => (
              <a
                key={stranicaSeo}
                href={href({ kind: "seo", lang, page: stranicaSeo }, glavniSlug)}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:border-shere-red/30 transition-colors group"
              >
                <h2 className="text-xl font-black font-poppins group-hover:text-shere-red transition-colors">
                  {ui(SADRZAJ_SEO[stranicaSeo].naslov, lang)}
                </h2>
                <p className="mt-2 text-muted-foreground leading-relaxed line-clamp-3">
                  {s(SADRZAJ_SEO[stranicaSeo].uvod, lang)}
                </p>
              </a>
            ))}
          </div>

          <Srodne
            naslov={ui("naslov.poglejteSe", lang)}
            stavke={[
              { naziv: ui("nav.celMeni", lang), adresa: a.meni },
              { naziv: ui("nav.halal", lang), adresa: a.halal },
            ]}
          />
        </OkvirStranice>
      )

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
