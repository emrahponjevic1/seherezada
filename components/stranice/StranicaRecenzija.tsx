import { Star } from "lucide-react"
import { s, s2 } from "@/lib/sadrzaj"

import type { Lang, Lokal } from "@/lib/domain"
import { ui } from "@/lib/i18n"
import { href } from "@/lib/route"
import { PraznoRecenzije } from "@/components/stanja/PraznoStanje"

import { Dugmad, OkvirStranice, Srodne, type Mrvica } from "./dijelovi"

/**
 * Recenzije po lokalu — /{lokal}/recenzije.
 *
 * Ocjena i broj recenzija su TOG lokala; nikad se ne zbrajaju ni miješaju.
 * Sadržaj recenzija je za sada demo — korak 21 ih povlači sa Google Places
 * API-ja, po lokalu, i tada dodaje i oznaku „Vir: Google".
 */

/**
 * Demo recenzije drže KLJUČEVE, ne tekst — inače bi gost na /zh čitao
 * slovenske recenzije.
 *
 * Kad korak 21 dovede prave Google recenzije, one ostaju na jeziku na
 * kojem su napisane: tuđe riječi se ne prevode. Prevodi se samo okvir
 * oko njih — „pred 2 tednoma", zvjezdice, naslovi.
 */
const DEMO_RECENZIJE = [
  { ime: "Nejc P.", ocjena: 5, kada: "vrijeme.pred2Tjedna", tekst: "recenzija.demo1" },
  { ime: "Ana K.", ocjena: 5, kada: "vrijeme.predMjesec", tekst: "recenzija.demo2" },
  { ime: "Marko S.", ocjena: 4, kada: "vrijeme.pred3Tjedna", tekst: "recenzija.demo3" },
  { ime: "Lejla H.", ocjena: 5, kada: "vrijeme.pred2Mjeseca", tekst: "recenzija.demo4" },
  { ime: "Tomaž R.", ocjena: 5, kada: "vrijeme.pred5Dana", tekst: "recenzija.demo5" },
]

export function StranicaRecenzija({
  lokal,
  lang,
  glavniSlug,
}: {
  lokal: Lokal
  lang: Lang
  glavniSlug: string
}) {
  const domov = ui("akcija.domov", lang)

  const a = {
    domov: href({ kind: "lokal-home", lang, lokal: glavniSlug }, glavniSlug),
    lokal: href({ kind: "lokal-home", lang, lokal: lokal.slug }, glavniSlug),
    meni: href(
      { kind: "lokal-page", lang, lokal: lokal.slug, page: "meni" },
      glavniSlug,
    ),
    oNas: href({ kind: "shared", lang, page: "o-nas" }, glavniSlug),
  }

  const mrvice: Mrvica[] = [
    { naziv: domov, adresa: a.domov },
    { naziv: lokal.naziv, adresa: a.lokal },
    { naziv: ui("nav.recenzije", lang) },
  ]

  const profil = lokal.googlePlaceId
    ? `https://search.google.com/local/writereview?placeid=${lokal.googlePlaceId}`
    : null

  return (
    <OkvirStranice
      mrvice={mrvice}
      naslov={s2("recenzije.naslovLokala", lang, { ulica: lokal.ulica })}
      uvod={s2("recenzije.uvodLokala", lang, { adresa: lokal.adresa })}
    >
      {lokal.ocjena ? (
        <section className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-white/5 p-6">
          <span className="text-5xl font-black font-poppins text-shere-red">
            {lokal.ocjena.toLocaleString("sl-SI")}
          </span>
          <div>
            <div className="flex text-shere-gold">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star
                  key={i}
                  fill="currentColor"
                  size={20}
                  className={i < Math.floor(lokal.ocjena ?? 0) ? "" : "opacity-40"}
                />
              ))}
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              {lokal.brojRecenzija?.toLocaleString("sl-SI")}{" "}
              {ui("recenzije.ocen", lang)}
            </p>
          </div>
        </section>
      ) : null}

      {DEMO_RECENZIJE.length === 0 ? (
        <PraznoRecenzije
          poruka={ui("recenzije.prazno", lang)}
          dugmeTekst={
            profil ? ui("akcija.oceniNasNaGoogle", lang) : undefined
          }
          dugmeAdresa={profil ?? undefined}
        />
      ) : (
        <section className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-black font-poppins tracking-tight">
            {ui("recenzije.kajPravijo", lang)}
          </h2>
          <ul className="space-y-4">
            {DEMO_RECENZIJE.map((r, i) => (
              <li key={i} className="rounded-2xl border border-border bg-white/5 p-6">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <p className="font-bold text-foreground">{r.ime}</p>
                  <p className="text-sm text-muted-foreground">{ui(r.kada, lang)}</p>
                </div>
                <div className="flex text-shere-gold my-2">
                  {[0, 1, 2, 3, 4].map((z) => (
                    <Star
                      key={z}
                      fill="currentColor"
                      size={16}
                      className={z < r.ocjena ? "" : "opacity-30"}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {s(r.tekst, lang)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-black font-poppins tracking-tight">
          {ui("recenzije.oceniteNas", lang)}
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          {s("recenzije.oceniteOpis", lang)}
        </p>
        {profil && (
          <Dugmad
            stavke={[
              {
                naziv: ui("akcija.oceniNasNaGoogle", lang),
                adresa: profil,
                glavno: true,
                vanjski: true,
              },
            ]}
          />
        )}
        {/* korak 21: QR kod za tiskanje — potrebuje pravi google_place_id */}
      </section>

      <Srodne
        naslov={ui("naslov.poglejteSe", lang)}
        stavke={[
          { naziv: ui("akcija.meniTegaLokala", lang), adresa: a.meni },
          { naziv: ui("nav.oNas", lang), adresa: a.oNas },
        ]}
      />
    </OkvirStranice>
  )
}
