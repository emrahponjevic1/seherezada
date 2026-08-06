import { Star } from "lucide-react"

import type { Lang, Lokal } from "@/lib/domain"
import { t } from "@/lib/i18n"
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

const DEMO_RECENZIJE = [
  {
    ime: "Nejc P.",
    ocjena: 5,
    kada: { sl: "pred 2 tednoma", en: "2 weeks ago" },
    tekst: {
      sl: "Najboljši kebab v mestu, pa še ob treh zjutraj je bil enako dober kot opoldne. Meso rezano na roko se res pozna.",
      en: "The best kebab in town, and at three in the morning it was just as good as at noon. Hand-carved meat really does make a difference.",
    },
  },
  {
    ime: "Ana K.",
    ocjena: 5,
    kada: { sl: "pred mesecem", en: "a month ago" },
    tekst: {
      sl: "Falafel plošča je ogromna in povsem veganska. Osebje je potrpežljivo razložilo, kaj vsebuje kaj — to pri fast foodu ni samoumevno.",
      en: "The falafel plate is huge and completely vegan. The staff patiently explained what contains what — not something you take for granted at a fast-food place.",
    },
  },
  {
    ime: "Marko S.",
    ocjena: 4,
    kada: { sl: "pred 3 tedni", en: "3 weeks ago" },
    tekst: {
      sl: "Pica odlična, testo res drugačno od običajnega. Edino čakanje je bilo malo daljše, ker je bilo v petek zvečer polno.",
      en: "Excellent pizza, the dough really is different from the usual. The only downside was a slightly longer wait, as it was packed on a Friday night.",
    },
  },
  {
    ime: "Lejla H.",
    ocjena: 5,
    kada: { sl: "pred 2 mesecema", en: "2 months ago" },
    tekst: {
      sl: "Končno mesto, kjer je cel meni halal in ni treba vsakič spraševati. Burger je bil izvrsten, žemlja pečena pri njih.",
      en: "Finally a place where the whole menu is halal and you do not have to ask every time. The burger was excellent, and the bun is baked in-house.",
    },
  },
  {
    ime: "Tomaž R.",
    ocjena: 5,
    kada: { sl: "pred 5 dnevi", en: "5 days ago" },
    tekst: {
      sl: "Študentski bon sprejmejo brez težav, porcija pa je večja kot marsikje. Juha in solata sta vključeni, kar je redkost.",
      en: "They take the student voucher without any fuss, and the portion is bigger than in most places. Soup and salad are included, which is rare.",
    },
  },
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
  const domov = t({ sl: "Domov", en: "Home" }, lang)

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
    { naziv: t({ sl: "Mnenja", en: "Reviews" }, lang) },
  ]

  const profil = lokal.googlePlaceId
    ? `https://search.google.com/local/writereview?placeid=${lokal.googlePlaceId}`
    : null

  return (
    <OkvirStranice
      mrvice={mrvice}
      naslov={t(
        {
          sl: `Mnenja gostov — Šeherezada ${lokal.ulica}`,
          en: `Guest reviews — Šeherezada ${lokal.ulica}`,
        },
        lang,
      )}
      uvod={t(
        {
          sl: `Kaj gostje pravijo o lokalu na naslovu ${lokal.adresa}. Ocene se med lokali ne seštevajo — vsak ima svojo.`,
          en: `What guests say about the location at ${lokal.adresa}. Ratings are not combined between locations — each has its own.`,
        },
        lang,
      )}
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
              {t({ sl: "ocen", en: "ratings" }, lang)}
            </p>
          </div>
        </section>
      ) : null}

      {DEMO_RECENZIJE.length === 0 ? (
        <PraznoRecenzije
          poruka={t({ sl: "Še ni mnenj.", en: "No reviews yet." }, lang)}
          dugmeTekst={
            profil ? t({ sl: "Ocenite nas na Google", en: "Rate us on Google" }, lang) : undefined
          }
          dugmeAdresa={profil ?? undefined}
        />
      ) : (
        <section className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-black font-poppins tracking-tight">
            {t({ sl: "Kaj pravijo gostje", en: "What guests say" }, lang)}
          </h2>
          <ul className="space-y-4">
            {DEMO_RECENZIJE.map((r, i) => (
              <li key={i} className="rounded-2xl border border-border bg-white/5 p-6">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <p className="font-bold text-foreground">{r.ime}</p>
                  <p className="text-sm text-muted-foreground">{t(r.kada, lang)}</p>
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
                  {t(r.tekst, lang)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-black font-poppins tracking-tight">
          {t({ sl: "Ocenite nas", en: "Rate us" }, lang)}
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          {t(
            {
              sl: "Če ste bili pri nas, nam mnenje veliko pomeni. Oddate ga lahko na Googlu v pol minute.",
              en: "If you have been in, your opinion means a lot to us. You can leave one on Google in half a minute.",
            },
            lang,
          )}
        </p>
        {profil && (
          <Dugmad
            stavke={[
              {
                naziv: t({ sl: "Ocenite nas na Google", en: "Rate us on Google" }, lang),
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
        naslov={t({ sl: "Poglejte še", en: "See also" }, lang)}
        stavke={[
          { naziv: t({ sl: "Meni tega lokala", en: "This location's menu" }, lang), adresa: a.meni },
          { naziv: t({ sl: "O nas", en: "About us" }, lang), adresa: a.oNas },
        ]}
      />
    </OkvirStranice>
  )
}
