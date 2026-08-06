import Link from "next/link"
import { MapPin, ArrowRight } from "lucide-react"

import { t } from "@/lib/i18n"
import type { Lang, Lokal } from "@/lib/domain"
import { href } from "@/lib/route"

import { DanasnjeVrijeme } from "./StanjeOtvorenosti"
import { GeoNajblizi, OznakaUdaljenosti } from "./GeoNajblizi"

/**
 * Sekcija 2 — kartice lokala.
 *
 * Preuzima izgled trake koja je dosad stajala na dnu heroja: ikona u
 * crvenom kvadratu, podebljan naslov, siva rečenica. Ništa novo.
 *
 * Raspored podnosi 2, 3 i 4 kartice — `auto-fit`, ne fiksan broj kolona.
 * Nazivi, adrese i linkovi su SERVERSKI HTML; klijentsko je samo današnje
 * vrijeme, zelena tačka i geolokacija — sve troje zavisi od trenutka ili
 * od dozvole.
 *
 * „Navodila" je ZASEBAN link, ne ugniježđen u link kartice — ugniježđeni
 * `<a>` nije dozvoljen i preglednici ga razdvoje na nepredvidiv način.
 */
export function KarticeLokala({
  lokali,
  trenutniSlug,
  lang,
  glavniSlug,
}: {
  lokali: Lokal[]
  trenutniSlug: string
  lang: Lang
  glavniSlug: string
}) {
  const vidljivi = lokali.filter((l) => l.stanje !== "zatvoren")

  return (
    <section className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 mt-16 md:mt-24">
      <h2 className="sr-only">
        {t({ sl: "Naši lokali", en: "Our locations" }, lang)}
      </h2>

      <GeoNajblizi
        lang={lang}
        tacke={vidljivi.map((l) => ({ slug: l.slug, lat: l.lat, lng: l.lng }))}
      >
        <div className="w-full bg-card/40 border border-white/5 dark:border-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 grid gap-6 text-left [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
          {vidljivi.map((lokal) => {
            const jeUskoro = lokal.stanje === "uskoro"
            const jeTrenutni = lokal.slug === trenutniSlug

            const mapa = lokal.lat && lokal.lng
              ? `https://maps.google.com/?q=${lokal.lat},${lokal.lng}`
              : `https://maps.google.com/?q=${encodeURIComponent(lokal.adresa)}`

            return (
              <div
                key={lokal.id}
                className={`rounded-2xl p-4 border transition-colors ${
                  jeTrenutni
                    ? "border-shere-red/40 bg-shere-red/5"
                    : "border-transparent"
                } ${jeUskoro ? "opacity-60" : "hover:border-shere-red/20"}`}
              >
                {/* Lokal 'uskoro' nema link — njegova adresa ne postoji. */}
                {jeUskoro ? (
                  <div className="flex flex-row items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 bg-shere-gold/10 text-shere-gold">
                      <MapPin size={24} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-lg">{lokal.naziv}</h3>
                      <span className="inline-block mt-1 text-xs font-black tracking-wide bg-shere-gold/10 text-shere-gold px-2.5 py-1 rounded-xl">
                        {t({ sl: "Kmalu", en: "Coming soon" }, lang)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    <Link
                      href={href(
                        { kind: "lokal-home", lang, lokal: lokal.slug },
                        glavniSlug,
                      )}
                      className="flex flex-row items-start gap-4 group"
                    >
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 bg-shere-red/10 text-shere-red group-hover:bg-shere-red group-hover:text-white group-hover:scale-110 transition-all duration-300">
                        <MapPin size={24} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-lg group-hover:text-shere-red transition-colors duration-300">
                          {lokal.naziv}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {lokal.adresa}
                        </p>
                        <DanasnjeVrijeme
                          radnoVrijeme={lokal.radnoVrijeme}
                          lang={lang}
                        />
                        <OznakaUdaljenosti slug={lokal.slug} lang={lang} />
                      </div>
                    </Link>

                    <a
                      href={mapa}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 ml-16 inline-flex items-center gap-1 text-sm font-semibold text-shere-red hover:underline"
                    >
                      {t({ sl: "Navodila", en: "Directions" }, lang)}
                      <ArrowRight size={14} />
                    </a>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </GeoNajblizi>
    </section>
  )
}
