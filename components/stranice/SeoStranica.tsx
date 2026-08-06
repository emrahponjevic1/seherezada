import Link from "next/link"
import { s } from "@/lib/sadrzaj"

import type { Lang, Lokal, MenuSekcija } from "@/lib/domain"
import { formatCijena, t, ui } from "@/lib/i18n"
import { href, type SeoPage } from "@/lib/route"

import {
  Dugmad,
  Odjeljak,
  OkvirStranice,
  Pitanje,
  Srodne,
  type Mrvica,
} from "./dijelovi"
import { sazetakVremena } from "./ZajednickeStranice"
import { SADRZAJ_SEO } from "./sadrzajSeo"

/**
 * Osam SEO stranica, jedan kostur od devet blokova.
 *
 * BLOK 5 SE ČITA IZ REPOZITORIJA — cijene se nikad ne prepisuju u tekst,
 * pa ne mogu zastariti. Blokovi 3, 4 i 7 imaju svoj tekst po stranici
 * (vidi `sadrzajSeo.ts`).
 */
export function SeoStranica({
  stranica,
  lokali,
  sekcije,
  lang,
  glavniSlug,
}: {
  stranica: SeoPage
  lokali: Lokal[]
  sekcije: MenuSekcija[]
  lang: Lang
  glavniSlug: string
}) {
  const podaci = SADRZAJ_SEO[stranica]
  const domov = ui("akcija.domov", lang)

  const a = {
    domov: href({ kind: "lokal-home", lang, lokal: glavniSlug }, glavniSlug),
    meni: href(
      { kind: "lokal-page", lang, lokal: glavniSlug, page: "meni" },
      glavniSlug,
    ),
  }

  const mrvice: Mrvica[] = [
    { naziv: domov, adresa: a.domov },
    { naziv: ui("nav.meni", lang), adresa: a.meni },
    { naziv: t(podaci.naslov, lang) },
  ]

  // Blok 5 — ponuda te kategorije, ili cijeli meni ako kategorije nema.
  const zaPrikaz = podaci.kategorija
    ? sekcije.filter((sek) => sek.kategorija.slug === podaci.kategorija)
    : sekcije

  // Blok 6 — lokali; neke stranice upućuju na tačno određen lokal.
  const uPogonu = lokali.filter((l) => l.stanje === "radi")
  const zaLokacije = podaci.samoLokal
    ? uPogonu.filter((l) => l.slug === podaci.samoLokal)
    : uPogonu
  const kontaktni = zaLokacije[0] ?? uPogonu[0]

  return (
    <OkvirStranice
      mrvice={mrvice}
      naslov={t(podaci.naslov, lang)}
      uvod={t(podaci.uvod, lang)}
    >
      <Odjeljak naslov={t(podaci.blok3.naslov, lang)}>
        <p>{t(podaci.blok3.tekst, lang)}</p>
      </Odjeljak>

      <Odjeljak naslov={t(podaci.blok4.naslov, lang)}>
        <p>{t(podaci.blok4.tekst, lang)}</p>
      </Odjeljak>

      {/* Blok 5 — cijene iz repozitorija */}
      <Odjeljak naslov={ui("meni.ponudbaInCene", lang)}>
        {zaPrikaz.length === 0 ? (
          <p>{ui("meni.ponudbaSePripravlja", lang)}</p>
        ) : (
          <div className="space-y-6 not-prose">
            {zaPrikaz.map((sek) => (
              <div key={sek.kategorija.id}>
                {!podaci.kategorija && (
                  <h3 className="font-black font-poppins text-lg mb-2 text-foreground">
                    {t(sek.kategorija.naziv, lang)}
                  </h3>
                )}
                <ul className="divide-y divide-border rounded-2xl border border-border overflow-hidden">
                  {sek.stavke.map((stavka) => (
                    <li
                      key={stavka.jelo.id}
                      className="flex items-baseline justify-between gap-4 px-4 py-3 bg-white/5"
                    >
                      <span className="text-foreground font-semibold">
                        {t(stavka.jelo.naziv, lang)}
                      </span>
                      <span className="font-black text-shere-red whitespace-nowrap">
                        {formatCijena(stavka.cijena, lang)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <p className="text-sm">
              {s("meni.ceneVeljajo", lang)}{" "}
              <Link href={a.meni} className="text-shere-red hover:underline">
                {ui("akcija.pogledajCelMeni", lang)}
              </Link>
            </p>
          </div>
        )}
      </Odjeljak>

      {/* Blok 6 — lokacije i radno vrijeme */}
      <Odjeljak naslov={ui("seo.kjeSmo", lang)}>
        <ul className="space-y-4 not-prose">
          {zaLokacije.map((lokal) => (
            <li key={lokal.id} className="rounded-2xl border border-border p-4 bg-white/5">
              <p className="font-black text-foreground">{lokal.naziv}</p>
              <p>{lokal.adresa}</p>
              <p className="text-sm mt-1">{sazetakVremena(lokal, lang)}</p>
              <a
                href={`tel:${lokal.telefon.replace(/\s/g, "")}`}
                className="text-shere-red hover:underline text-sm"
              >
                {lokal.telefon}
              </a>
            </li>
          ))}
        </ul>
        {podaci.samoLokal && (
          <p className="text-sm">
            {s("seo.samoTajLokal", lang)}
          </p>
        )}
      </Odjeljak>

      {/* Blok 7 — pitanja */}
      <Odjeljak naslov={ui("nav.faq", lang)}>
        <div className="space-y-3 not-prose">
          {podaci.pitanja.map((p, i) => (
            <Pitanje key={i} pitanje={t(p.pitanje, lang)}>
              {t(p.odgovor, lang)}
            </Pitanje>
          ))}
        </div>
      </Odjeljak>

      {/* Blok 8 — akcije */}
      <Dugmad
        stavke={[
          ...(kontaktni?.woltUrl
            ? [
                {
                  naziv: ui("akcija.naroci", lang),
                  adresa: kontaktni.woltUrl,
                  glavno: true,
                  vanjski: true,
                },
              ]
            : []),
          {
            naziv: `${ui("akcija.poklici", lang)} ${kontaktni?.telefon ?? ""}`,
            adresa: `tel:${(kontaktni?.telefon ?? "").replace(/\s/g, "")}`,
            vanjski: true,
          },
          { naziv: ui("nav.celMeni", lang), adresa: a.meni },
        ]}
      />

      {/* Blok 9 — srodne stranice */}
      <Srodne
        naslov={ui("naslov.sorodneStrani", lang)}
        stavke={podaci.srodne.map((slug) => ({
          naziv: t(SADRZAJ_SEO[slug].naslov, lang),
          adresa: href({ kind: "seo", lang, page: slug }, glavniSlug),
        }))}
      />
    </OkvirStranice>
  )
}
