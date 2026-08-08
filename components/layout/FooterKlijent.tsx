"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MapPin, Phone, Copy, ArrowRight } from "lucide-react"

import { ui, formatRadnoVrijeme, jeOtvoren } from "@/lib/i18n"
import { DANI_PO_GETDAY, type Dan, type Lokal } from "@/lib/domain"
import { SEO_PAGES, SHARED_PAGES, href, type Route } from "@/lib/route"
import { KLJUC_SEO, KLJUC_ZAJEDNICKE } from "@/lib/naslovi"
import { izPutanje, lokaliUPogonu, trenutniLokal, type OkvirPodaci } from "./okvir"

const DANI_REDOM: Dan[] = ["pon", "uto", "sri", "cet", "pet", "sub", "ned"]

/**
 * Naslov kolone.
 *
 * Na mobitelu centriran, od `md` naviše poravnat uz početak reda. Prije
 * je bio centriran svuda — obrazac koji radi u jednoj koloni na telefonu,
 * a na desktopu razbija četiri kolone u razbacane blokove bez zajedničke
 * ivice za oko.
 */
const NASLOV_KOLONE =
  "text-xl font-bold font-poppins text-shere-red tracking-wide relative pb-2 w-full text-center md:text-start " +
  "before:absolute before:bottom-0 before:w-12 before:h-0.5 before:bg-shere-red " +
  "before:left-1/2 before:-translate-x-1/2 md:before:left-auto md:before:start-0 md:before:translate-x-0"

const VEZA_KOLONE =
  "text-base text-muted-foreground hover:text-shere-red transition-colors"

export function FooterKlijent({ lokali, glavniSlug }: OkvirPodaci) {
  const pathname = usePathname()
  const { lang } = izPutanje(pathname, { lokali, glavniSlug })

  const adresa = (r: Route) => href(r, glavniSlug)
  const uPogonu = lokaliUPogonu(lokali)
  const lokalTrenutni = trenutniLokal(lokali, glavniSlug, glavniSlug)

  // „Otvoreno sada" zavisi od trenutka, pa se NE smije računati na serveru:
  // statični HTML bi zamrznuo status od trenutka gradnje. Računa se poslije
  // montiranja i osvježava svake minute.
  const [sada, setSada] = useState<Date | null>(null)
  useEffect(() => {
    const osvjezi = () => setSada(new Date())
    osvjezi()
    const interval = setInterval(osvjezi, 60000)
    return () => clearInterval(interval)
  }, [])

  const danasIndeks = sada ? DANI_PO_GETDAY[sada.getDay()] : null

  // Potvrda o kopiranju se ispisuje NA DUGMETU, ne kroz `alert()`. Alert
  // zaustavlja stranicu i traži drugi klik da bi se zatvorio — za radnju
  // koja je i sama jedan klik to je više smetnje nego koristi.
  const [kopirano, setKopirano] = useState<string | null>(null)

  const kopirajAdresu = (tekst: string) => {
    navigator.clipboard.writeText(tekst)
    setKopirano(tekst)
    setTimeout(() => setKopirano((p) => (p === tekst ? null : p)), 2000)
  }

  return (
    <footer className="bg-background/95 backdrop-blur-md text-foreground py-20 relative z-20 overflow-hidden">
      <div className="absolute -top-[200px] left-1/4 w-[400px] h-[400px] rounded-full bg-shere-red/10 blur-[120px] pointer-events-none"></div>

      {/*
        Dvanaest kolona, ne četiri jednake.

        Lokali nose naziv, adresu, telefon, sedam redova radnog vremena i
        dva dugmeta; ostale tri kolone su kratki spiskovi veza. U mreži od
        četiri jednake kolone lokali su bili uzak i vrlo visok stub pored
        tri niska — otud utisak nereda. Sada lokali dobiju pola širine i
        stoje jedan pored drugog, a spiskovi po dvije kolone.
      */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 relative z-10">
        {/* ── Lokali ─────────────────────────────────────────── */}
        <div className="md:col-span-2 lg:col-span-6 space-y-6">
          <h3 className={NASLOV_KOLONE}>{ui("nav.lokali", lang)}</h3>

          <div className="grid gap-6 sm:grid-cols-2">
            {uPogonu.map((lokal) => (
              <LokalBlok
                key={lokal.id}
                lokal={lokal}
                lang={lang}
                danas={danasIndeks}
                otvoren={sada ? jeOtvoren(lokal.radnoVrijeme, sada) : null}
                naKopiraj={kopirajAdresu}
                kopirano={kopirano === lokal.adresa}
                kopirajLabel={ui("akcija.kopiraj", lang)}
                kopiranoLabel={ui("poruka.naslovKopiran", lang)}
              />
            ))}
          </div>
        </div>

        {/* ── Naša ponuda ────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6 text-center md:text-start">
          <h3 className={NASLOV_KOLONE}>{ui("footer.ponudba", lang)}</h3>
          <ul className="space-y-2.5">
            {SEO_PAGES.map((stranica) => (
              <li key={stranica}>
                <Link
                  href={adresa({ kind: "seo", lang, page: stranica })}
                  className={VEZA_KOLONE}
                >
                  {ui(KLJUC_SEO[stranica], lang)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Informacije ────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6 text-center md:text-start">
          <h3 className={NASLOV_KOLONE}>{ui("footer.informacije", lang)}</h3>
          <ul className="space-y-2.5">
            {SHARED_PAGES.map((stranica) => (
              <li key={stranica}>
                <Link
                  href={adresa({ kind: "shared", lang, page: stranica })}
                  className={VEZA_KOLONE}
                >
                  {ui(KLJUC_ZAJEDNICKE[stranica], lang)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Pratite nas ────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6 text-center md:text-start">
          <h3 className={NASLOV_KOLONE}>{ui("footer.slediteNam", lang)}</h3>
          <ul className="space-y-2.5">
            {[
              { naziv: "Facebook", adresa: "https://www.facebook.com/" },
              { naziv: "Instagram", adresa: "https://www.instagram.com/" },
              ...(lokalTrenutni?.woltUrl
                ? [{ naziv: "Wolt", adresa: lokalTrenutni.woltUrl }]
                : []),
              ...(lokalTrenutni?.glovoUrl
                ? [{ naziv: "Glovo", adresa: lokalTrenutni.glovoUrl }]
                : []),
            ].map((veza) => (
              <li key={veza.naziv}>
                <a
                  href={veza.adresa}
                  target="_blank"
                  rel="noreferrer"
                  className={VEZA_KOLONE}
                >
                  {veza.naziv}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Brend i autorstvo ────────────────────────────────── */}
      {/*
        Donja traka: na mobitelu složena i centrirana, na desktopu brend
        lijevo a autorstvo desno. Ranije je i ovdje sve bilo centrirano,
        pa je na širokom ekranu stajao usamljen stub nasred praznine.
      */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 mt-16 pt-10 border-t border-border relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6 text-center md:text-start">
        <div className="space-y-3">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-11 h-11 bg-gradient-to-tr from-shere-red to-red-500 rounded-2xl flex items-center justify-center text-white font-black text-2xl rotate-3 shadow-[0_10px_20px_-10px_rgba(230,57,70,0.5)]">
              Š
            </div>
            <div className="text-3xl font-poppins font-black tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Šeherezada
            </div>
          </div>
          <p className="text-muted-foreground max-w-md leading-relaxed mx-auto md:mx-0">
            {ui("footer.opis", lang)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground justify-center md:justify-end shrink-0">
          <span>© {new Date().getFullYear()} Šeherezada d.o.o.</span>
          <span aria-hidden="true">•</span>
          <span>{ui("footer.svaPrava", lang)}</span>
        </div>
      </div>
    </footer>
  )
}

// ─────────────────────────────────────────────────────────────

/**
 * Jedan lokal u podnožju — pločica, ne slobodan blok.
 *
 * Rub i pozadina drže podatke jednog lokala na okupu; bez njih su se
 * naziv, adresa, sedam redova vremena i dva dugmeta prelivali u susjedni
 * lokal i oko nije imalo gdje da ih razdvoji. Sadržaj je poravnat uz
 * početak reda, ne centriran.
 */
function LokalBlok({
  lokal,
  lang,
  danas,
  otvoren,
  naKopiraj,
  kopirano,
  kopirajLabel,
  kopiranoLabel,
}: {
  lokal: Lokal
  lang: Parameters<typeof formatRadnoVrijeme>[2]
  danas: Dan | null
  otvoren: boolean | null
  naKopiraj: (tekst: string) => void
  kopirano: boolean
  kopirajLabel: string
  kopiranoLabel: string
}) {
  return (
    <div className="w-full space-y-3 rounded-2xl border border-white/5 dark:border-white/10 bg-white/5 backdrop-blur-sm p-5 text-start">
      <div className="flex items-center gap-3">
        <p className="font-bold text-lg text-foreground leading-tight">
          {lokal.naziv}
        </p>
        {/* Zelena tačka: null dok se ne montira, da se hidracija ne raziđe */}
        {otvoren !== null && (
          <span className="relative flex h-3 w-3" title={ui(otvoren ? "stanje.odprtoZdaj" : "stanje.zaprto", lang)}>
            {otvoren ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            )}
          </span>
        )}
      </div>

      <div className="flex items-start gap-2.5">
        <MapPin className="text-shere-red shrink-0 mt-0.5" size={18} />
        <p className="text-sm text-muted-foreground leading-snug">
          {lokal.adresa}
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <Phone className="text-shere-red shrink-0" size={18} />
        <a
          href={`tel:${lokal.telefon.replace(/\s/g, "")}`}
          className="hover:text-shere-red transition text-base font-black text-foreground"
        >
          <span dir="ltr">{lokal.telefon}</span>
        </a>
      </div>

      <ul className="space-y-0.5 w-full text-sm">
        {DANI_REDOM.map((dan) => (
          <li
            key={dan}
            className={`flex items-center justify-between gap-3 rounded-lg px-2.5 py-1 ${
              danas === dan
                ? "bg-secondary border border-border text-foreground font-bold"
                : "text-muted-foreground border border-transparent"
            }`}
          >
            <span>{ui(`dan.${dan}`, lang)}</span>
            <span className="tabular-nums whitespace-nowrap">
              {formatRadnoVrijeme(lokal.radnoVrijeme, dan, lang)}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-2 pt-1">
        <button
          onClick={() => naKopiraj(lokal.adresa)}
          className="text-sm font-semibold bg-secondary hover:bg-secondary/80 border border-border transition px-3.5 py-2 rounded-xl flex items-center gap-2 text-foreground"
        >
          <Copy size={14} />
          {kopirano ? kopiranoLabel : kopirajLabel}
        </button>
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(lokal.adresa)}`}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-semibold bg-shere-red hover:bg-shere-darkred border border-shere-red/20 transition px-3.5 py-2 rounded-xl flex items-center gap-2 text-white shadow-lg shadow-shere-red/10"
        >
          Google Maps <ArrowRight size={14} className="rtl:rotate-180" />
        </a>
      </div>
    </div>
  )
}

// Nazivi stranica žive u lib/naslovi.ts — vidi KLJUC_SEO i KLJUC_ZAJEDNICKE.
