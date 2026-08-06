/**
 * Prazna stanja — NISU greške. Sistem radi ispravno, samo podataka nema.
 * Zato izgledaju mirno i uvijek nude sljedeći korak, bez crvene boje.
 *
 * Kategorija bez jela nema svoju komponentu namjerno: ona se ne prikazuje
 * uopšte, ni kao tab ni kao naslov — izostavlja je `repo.getMeni()`.
 */

import Link from "next/link"
import { UtensilsCrossed, MessageSquare } from "lucide-react"

function Okvir({
  ikona,
  poruka,
  children,
}: {
  ikona: React.ReactNode
  poruka: string
  children?: React.ReactNode
}) {
  return (
    <div className="w-full rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm px-6 py-16 flex flex-col items-center text-center gap-5">
      <div className="text-muted-foreground/60">{ikona}</div>
      <p className="text-lg text-muted-foreground font-inter max-w-md">
        {poruka}
      </p>
      {children}
    </div>
  )
}

const DUGME =
  "inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-shere-red text-white font-bold shadow-[0_0_40px_-10px_rgba(230,57,70,0.6)] hover:scale-105 active:scale-95 transition-transform"

/** Lokal koji još nema nijedno jelo u meniju. */
export function PraznMeni({
  poruka,
  drugiLokal,
}: {
  poruka: string
  drugiLokal?: { adresa: string; naziv: string }
}) {
  return (
    <Okvir ikona={<UtensilsCrossed size={40} strokeWidth={1.5} />} poruka={poruka}>
      {drugiLokal && (
        <Link href={drugiLokal.adresa} className={DUGME}>
          {drugiLokal.naziv}
        </Link>
      )}
    </Okvir>
  )
}

/** Lokal bez ijedne recenzije. */
export function PraznoRecenzije({
  poruka,
  dugmeTekst,
  dugmeAdresa,
}: {
  poruka: string
  dugmeTekst?: string
  dugmeAdresa?: string
}) {
  return (
    <Okvir ikona={<MessageSquare size={40} strokeWidth={1.5} />} poruka={poruka}>
      {dugmeTekst && dugmeAdresa && (
        <a href={dugmeAdresa} target="_blank" rel="noreferrer" className={DUGME}>
          {dugmeTekst}
        </a>
      )}
    </Okvir>
  )
}
