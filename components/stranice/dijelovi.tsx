import Link from "next/link"
import { s } from "@/lib/sadrzaj"
import { ChevronDown } from "lucide-react"

import type { Lang } from "@/lib/domain"
import { KONTEJNER, SEKCIJA } from "@/lib/stil"

/**
 * Zajednički dijelovi podstranica: mrvice, okvir, naslovi i accordion.
 *
 * Accordion koristi native <details> — sva pitanja i odgovori ostaju u
 * izvornom HTML-u i rade i sa isključenim JavaScriptom.
 */

// ─────────────────────────────────────────────────────────────

export interface Mrvica {
  naziv: string
  adresa?: string
}

/** `Domov › Meni › Kebab` — pravi linkovi, u postojećem stilu sitnog sivog teksta. */
export function Mrvice({ stavke }: { stavke: Mrvica[] }) {
  return (
    <nav aria-label="Mrvice" className="text-sm text-muted-foreground mb-6">
      <ol className="flex flex-wrap items-center gap-1.5">
        {stavke.map((s, i) => (
          <li key={s.naziv + i} className="flex items-center gap-1.5">
            {s.adresa ? (
              <Link href={s.adresa} className="hover:text-shere-red transition-colors">
                {s.naziv}
              </Link>
            ) : (
              <span aria-current="page" className="text-foreground/80">
                {s.naziv}
              </span>
            )}
            {i < stavke.length - 1 && <span aria-hidden="true">›</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}

// ─────────────────────────────────────────────────────────────

/** Okvir podstranice: mrvice, jedan <h1> i uvodni pasus. */
export function OkvirStranice({
  mrvice,
  naslov,
  uvod,
  children,
}: {
  mrvice: Mrvica[]
  naslov: string
  uvod?: string
  children: React.ReactNode
}) {
  return (
    <div className={`${KONTEJNER} ${SEKCIJA}`}>
      <Mrvice stavke={mrvice} />

      <h1 className="text-4xl md:text-5xl font-black font-poppins tracking-tight">
        {naslov}
      </h1>

      {uvod && (
        <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-3xl">
          {uvod}
        </p>
      )}

      <div className="mt-12 space-y-12 max-w-3xl">{children}</div>
    </div>
  )
}

/** Naslov drugog nivoa sa pasusima ispod. */
export function Odjeljak({
  naslov,
  children,
}: {
  naslov: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl md:text-3xl font-black font-poppins tracking-tight">
        {naslov}
      </h2>
      <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
        {children}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────

/**
 * Pitanje i odgovor drže KLJUČEVE kataloga, ne tekst — vidi sadrzajFaq.ts.
 * Prije su bili `Prevod` sa sl i en, pa je gost na ostalih pet jezika
 * dobijao engleski tekst u svom okviru.
 */
export interface PitanjeOdgovor {
  pitanje: string
  odgovor: string
}

/** Jedno pitanje — otvara se, ali odgovor je uvijek u dokumentu. */
export function Pitanje({
  pitanje,
  children,
}: {
  pitanje: string
  children: React.ReactNode
}) {
  return (
    <details className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-6 py-4">
      <summary className="flex items-center justify-between gap-4 cursor-pointer font-bold text-lg list-none text-foreground">
        {pitanje}
        <ChevronDown
          size={20}
          className="shrink-0 text-shere-red transition-transform group-open:rotate-180"
        />
      </summary>
      <div className="pt-3 text-muted-foreground leading-relaxed">{children}</div>
    </details>
  )
}

/** Grupa pitanja sa svojim naslovom. */
export function GrupaPitanja({
  naslov,
  pitanja,
  lang,
}: {
  naslov: string
  pitanja: PitanjeOdgovor[]
  lang: Lang
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl md:text-3xl font-black font-poppins tracking-tight">
        {naslov}
      </h2>
      <div className="space-y-3">
        {pitanja.map((p, i) => (
          <Pitanje key={i} pitanje={s(p.pitanje, lang)}>
            {s(p.odgovor, lang)}
          </Pitanje>
        ))}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────

const DUGME_GLAVNO =
  "inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-shere-red text-white font-bold shadow-[0_0_40px_-10px_rgba(230,57,70,0.6)] hover:scale-105 active:scale-95 transition-transform"

const DUGME_SPOREDNO =
  "inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm font-bold hover:scale-105 active:scale-95 transition-transform"

export function Dugmad({
  stavke,
}: {
  stavke: { naziv: string; adresa: string; glavno?: boolean; vanjski?: boolean }[]
}) {
  return (
    <div className="flex flex-wrap gap-4">
      {stavke.map((s) =>
        s.vanjski ? (
          <a
            key={s.naziv}
            href={s.adresa}
            target="_blank"
            rel="noreferrer"
            className={s.glavno ? DUGME_GLAVNO : DUGME_SPOREDNO}
          >
            {s.naziv}
          </a>
        ) : (
          <Link
            key={s.naziv}
            href={s.adresa}
            className={s.glavno ? DUGME_GLAVNO : DUGME_SPOREDNO}
          >
            {s.naziv}
          </Link>
        ),
      )}
    </div>
  )
}

/** Srodne stranice — da nijedna stranica ne ostane siroče. */
export function Srodne({
  naslov,
  stavke,
}: {
  naslov: string
  stavke: { naziv: string; adresa: string }[]
}) {
  return (
    <section className="space-y-4 pt-4 border-t border-border">
      <h2 className="text-xl font-black font-poppins tracking-tight">{naslov}</h2>
      <ul className="flex flex-wrap gap-3">
        {stavke.map((s) => (
          <li key={s.adresa + s.naziv}>
            <Link
              href={s.adresa}
              className="inline-block px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-muted-foreground hover:text-shere-red transition-colors"
            >
              {s.naziv}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
