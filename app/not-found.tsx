import Link from "next/link"

import { ui } from "@/lib/i18n"
import { DEFAULT_LANG } from "@/lib/domain"
import { href } from "@/lib/route"
import { KONTEJNER, SEKCIJA } from "@/lib/stil"

/**
 * 404 u dizajnu sajta, ne Next.js zadana.
 *
 * Prikazuje se za: nepostojeće adrese, lokal koji ne postoji, lokal u
 * stanju `uskoro` ili `zatvoren`, i uklonjeno jelo.
 *
 * NAMJERNO sinhrona i bez pristupa repozitoriju: async komponenta ovdje
 * otvara Suspense granicu, pa Next isporuči prazno tijelo i sve iscrta
 * tek u pregledniku. Adrese glavnog lokala se ionako izvode iz pravila —
 * glavni lokal nema prefiks, pa su to uvijek "/" i "/meni".
 */
export default function NijeNadjeno() {
  const lang = DEFAULT_LANG
  const kaoGlavni = "glavni"

  const naslovna = href(
    { kind: "lokal-home", lang, lokal: kaoGlavni },
    kaoGlavni,
  )
  const meni = href(
    { kind: "lokal-page", lang, lokal: kaoGlavni, page: "meni" },
    kaoGlavni,
  )

  return (
    <section className={`${KONTEJNER} ${SEKCIJA} min-h-[60vh] flex flex-col items-center justify-center text-center`}>
      <p className="text-8xl md:text-9xl font-black font-poppins tracking-tight text-shere-red/20 leading-none">
        404
      </p>

      <h1 className="mt-4 text-4xl md:text-5xl font-black font-poppins tracking-tight">
        {ui("napaka.404naslov", lang)}
      </h1>

      <p className="mt-4 text-lg text-muted-foreground font-inter max-w-xl">
        {ui("napaka.404opis", lang)}
      </p>

      <div className="mt-10 flex flex-wrap gap-4 justify-center">
        <Link
          href={naslovna}
          className="px-6 py-3 rounded-2xl bg-shere-red text-white font-bold shadow-[0_0_40px_-10px_rgba(230,57,70,0.6)] hover:scale-105 active:scale-95 transition-transform"
        >
          {ui("akcija.domov", lang)}
        </Link>
        <Link
          href={meni}
          className="px-6 py-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm font-bold hover:scale-105 active:scale-95 transition-transform"
        >
          {ui("akcija.prikaziMeni", lang)}
        </Link>
      </div>
    </section>
  )
}
