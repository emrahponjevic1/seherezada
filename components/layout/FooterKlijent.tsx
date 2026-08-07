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

const NASLOV_KOLONE =
  "text-2xl font-bold font-poppins text-shere-red tracking-wide relative pb-2 before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-12 before:h-0.5 before:bg-shere-red w-full text-center"

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

  const kopirajAdresu = (tekst: string) => {
    navigator.clipboard.writeText(tekst)
    alert(ui("poruka.naslovKopiran", lang))
  }

  return (
    <footer className="bg-background/95 backdrop-blur-md text-foreground py-20 relative z-20 overflow-hidden">
      <div className="absolute -top-[200px] left-1/4 w-[400px] h-[400px] rounded-full bg-shere-red/10 blur-[120px] pointer-events-none"></div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 relative z-10">
        {/* ── Lokali ─────────────────────────────────────────── */}
        <div className="space-y-6 flex flex-col items-center text-center md:col-span-2 lg:col-span-1">
          <h3 className={NASLOV_KOLONE}>{ui("nav.lokali", lang)}</h3>

          <div className="w-full space-y-8">
            {uPogonu.map((lokal) => (
              <LokalBlok
                key={lokal.id}
                lokal={lokal}
                lang={lang}
                danas={danasIndeks}
                otvoren={sada ? jeOtvoren(lokal.radnoVrijeme, sada) : null}
                naKopiraj={kopirajAdresu}
                kopirajLabel={ui("akcija.kopiraj", lang)}
              />
            ))}
          </div>
        </div>

        {/* ── Naša ponuda ────────────────────────────────────── */}
        <div className="space-y-6 flex flex-col items-center text-center">
          <h3 className={NASLOV_KOLONE}>{ui("footer.ponudba", lang)}</h3>
          <ul className="space-y-3 w-full">
            {SEO_PAGES.map((stranica) => (
              <li key={stranica}>
                <Link
                  href={adresa({ kind: "seo", lang, page: stranica })}
                  className="text-lg text-muted-foreground hover:text-shere-red transition-colors"
                >
                  {ui(KLJUC_SEO[stranica], lang)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Informacije ────────────────────────────────────── */}
        <div className="space-y-6 flex flex-col items-center text-center">
          <h3 className={NASLOV_KOLONE}>{ui("footer.informacije", lang)}</h3>
          <ul className="space-y-3 w-full">
            {SHARED_PAGES.map((stranica) => (
              <li key={stranica}>
                <Link
                  href={adresa({ kind: "shared", lang, page: stranica })}
                  className="text-lg text-muted-foreground hover:text-shere-red transition-colors"
                >
                  {ui(KLJUC_ZAJEDNICKE[stranica], lang)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Pratite nas ────────────────────────────────────── */}
        <div className="space-y-6 flex flex-col items-center text-center">
          <h3 className={NASLOV_KOLONE}>{ui("footer.slediteNam", lang)}</h3>
          <ul className="space-y-3 w-full">
            <li>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                className="text-lg text-muted-foreground hover:text-shere-red transition-colors"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                className="text-lg text-muted-foreground hover:text-shere-red transition-colors"
              >
                Instagram
              </a>
            </li>
            {lokalTrenutni?.woltUrl && (
              <li>
                <a
                  href={lokalTrenutni.woltUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-lg text-muted-foreground hover:text-shere-red transition-colors"
                >
                  Wolt
                </a>
              </li>
            )}
            {lokalTrenutni?.glovoUrl && (
              <li>
                <a
                  href={lokalTrenutni.glovoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-lg text-muted-foreground hover:text-shere-red transition-colors"
                >
                  Glovo
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* ── Brend i autorstvo ────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 mt-16 pt-10 border-t border-border relative z-10 flex flex-col items-center text-center gap-4">
        <div className="flex items-center gap-3 justify-center">
          <div className="w-14 h-14 bg-gradient-to-tr from-shere-red to-red-500 rounded-2xl flex items-center justify-center text-white font-black text-3xl rotate-3 shadow-[0_10px_20px_-10px_rgba(230,57,70,0.5)]">
            Š
          </div>
          <div className="text-4xl font-poppins font-black tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Šeherezada
          </div>
        </div>
        <p className="text-muted-foreground max-w-md text-lg leading-relaxed mx-auto">
          {ui("footer.opis", lang)}
        </p>
        <div className="flex gap-4 text-sm text-muted-foreground justify-center">
          <span>© {new Date().getFullYear()} Šeherezada d.o.o.</span>
          <span>•</span>
          <span>{ui("footer.svaPrava", lang)}</span>
        </div>
      </div>
    </footer>
  )
}

// ─────────────────────────────────────────────────────────────

function LokalBlok({
  lokal,
  lang,
  danas,
  otvoren,
  naKopiraj,
  kopirajLabel,
}: {
  lokal: Lokal
  lang: Parameters<typeof formatRadnoVrijeme>[2]
  danas: Dan | null
  otvoren: boolean | null
  naKopiraj: (tekst: string) => void
  kopirajLabel: string
}) {
  return (
    <div className="w-full space-y-3">
      <div className="flex items-center gap-3 justify-center">
        <p className="font-bold text-xl text-foreground leading-tight">
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

      <div className="flex items-center gap-3 justify-center">
        <MapPin className="text-shere-red shrink-0" size={20} />
        <p className="text-muted-foreground leading-tight text-start">
          {lokal.adresa}
        </p>
      </div>

      <div className="flex items-center gap-3 justify-center">
        <Phone className="text-shere-red shrink-0" size={18} />
        <a
          href={`tel:${lokal.telefon.replace(/\s/g, "")}`}
          className="hover:text-shere-red transition text-lg font-black text-foreground"
        >
          {lokal.telefon}
        </a>
      </div>

      <ul className="space-y-1 w-full text-sm">
        {DANI_REDOM.map((dan) => (
          <li
            key={dan}
            className={`flex items-center justify-between rounded-lg px-3 py-1.5 ${
              danas === dan
                ? "bg-secondary border border-border text-foreground font-bold"
                : "text-muted-foreground border border-transparent"
            }`}
          >
            <span>{ui(`dan.${dan}`, lang)}</span>
            <span>{formatRadnoVrijeme(lokal.radnoVrijeme, dan, lang)}</span>
          </li>
        ))}
      </ul>

      <div className="flex gap-3 justify-center pt-1">
        <button
          onClick={() => naKopiraj(lokal.adresa)}
          className="text-sm font-semibold bg-secondary hover:bg-secondary/80 border border-border transition px-4 py-2 rounded-xl flex items-center gap-2 text-foreground"
        >
          <Copy size={14} /> {kopirajLabel}
        </button>
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(lokal.adresa)}`}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-semibold bg-shere-red hover:bg-shere-darkred border border-shere-red/20 transition px-4 py-2 rounded-xl flex items-center gap-2 text-white shadow-lg shadow-shere-red/10"
        >
          Google Maps <ArrowRight size={14} />
        </a>
      </div>
    </div>
  )
}

// Nazivi stranica žive u lib/naslovi.ts — vidi KLJUC_SEO i KLJUC_ZAJEDNICKE.
