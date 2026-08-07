import Link from "next/link"
import { s2 } from "@/lib/sadrzaj"
import { ArrowRight, Phone } from "lucide-react"

import type { Lang, Lokal, MenuSekcija } from "@/lib/domain"
import { ui } from "@/lib/i18n"
import { href } from "@/lib/route"
import { PraznMeni } from "@/components/stanja/PraznoStanje"

import { MeniInteraktivni } from "./sekcije/MeniInteraktivni"
import { KONTEJNER, SEKCIJA } from "@/lib/stil"

/**
 * Meni — JEDNA komponenta, dva prikaza.
 *
 *   'puna'  → stranica /{lokal}/meni: <h1>, uvodni pasus, tabovi, kategorije,
 *             i dugmad za naručivanje sa podacima TOG lokala
 *   'izvod' → sekcija 5 naslovne: tabovi i kartice, bez <h1> i uvoda,
 *             sa dugmetom „Poglej cel meni"
 *
 * Ne dvije kopije nego jedna komponenta sa varijantom.
 */
export function Menu({
  sekcije,
  lokal,
  lang,
  glavniSlug,
  varijanta,
  drugiLokal,
}: {
  sekcije: MenuSekcija[]
  lokal: Lokal
  lang: Lang
  glavniSlug: string
  varijanta: "puna" | "izvod"
  drugiLokal?: Lokal
}) {
  const puna = varijanta === "puna"

  const meniAdresa = href(
    { kind: "lokal-page", lang, lokal: lokal.slug, page: "meni" },
    glavniSlug,
  )

  // Lokal bez ijednog jela — nije greška, meni se tek priprema.
  if (sekcije.length === 0) {
    return (
      <section
        id="menu"
        className={`${SEKCIJA} w-full relative`}
      >
        <div className={`${KONTEJNER} w-full relative z-10`}>
          {puna && (
            <h1 className="text-4xl md:text-5xl font-black font-poppins tracking-tight mb-8">
              {s2("meni.naslovLokala", lang, { ulica: lokal.ulica })}
            </h1>
          )}
          <PraznMeni
            poruka={ui("meni.praznMeni", lang)}
            drugiLokal={
              drugiLokal
                ? {
                    naziv: ui("meni.poglejDrugLokal", lang),
                    adresa: href(
                      {
                        kind: "lokal-page",
                        lang,
                        lokal: drugiLokal.slug,
                        page: "meni",
                      },
                      glavniSlug,
                    ),
                  }
                : undefined
            }
          />
        </div>
      </section>
    )
  }

  return (
    <section
      id="menu"
      className={`${SEKCIJA} w-full relative`}
    >
      <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] rounded-full bg-shere-red/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[10%] w-[300px] h-[300px] rounded-full bg-orange-500/5 blur-[100px] pointer-events-none"></div>

      <div className={`${KONTEJNER} w-full flex flex-col gap-8 md:gap-12 relative z-10`}>
        <div>
          {puna ? (
            <>
              <h1 className="text-4xl md:text-5xl font-black font-poppins mb-4 tracking-tight">
                {s2("meni.naslovLokala", lang, { ulica: lokal.ulica })}
              </h1>
              <p className="text-muted-foreground text-lg max-w-3xl leading-relaxed">
                {s2("meni.uvodLokala", lang, { adresa: lokal.adresa })}
              </p>
            </>
          ) : (
            <>
              <h2 className="text-4xl md:text-5xl font-black font-poppins mb-3 tracking-tight">
                {ui("meni.nasMeni", lang)}
              </h2>
              <p className="text-muted-foreground text-lg">
                {ui("meni.izberiNajljubso", lang)}
              </p>
            </>
          )}
        </div>

        <MeniInteraktivni sekcije={sekcije} lokal={lokal} lang={lang} />

        {puna ? (
          <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
            {lokal.woltUrl && (
              <a
                href={lokal.woltUrl}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-2xl bg-shere-red text-white font-bold shadow-[0_0_40px_-10px_rgba(230,57,70,0.6)] hover:scale-105 active:scale-95 transition-transform"
              >
                {ui("akcija.narociWolt", lang)}
              </a>
            )}
            {lokal.glovoUrl && (
              <a
                href={lokal.glovoUrl}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-2xl bg-shere-red text-white font-bold shadow-[0_0_40px_-10px_rgba(230,57,70,0.6)] hover:scale-105 active:scale-95 transition-transform"
              >
                {ui("akcija.narociGlovo", lang)}
              </a>
            )}
            <a
              href={`tel:${lokal.telefon.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm font-bold hover:scale-105 active:scale-95 transition-transform"
            >
              <Phone size={18} />
              <span dir="ltr">{lokal.telefon}</span>
            </a>
          </div>
        ) : (
          <div>
            <Link
              href={meniAdresa}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-shere-red text-white font-bold shadow-[0_0_40px_-10px_rgba(230,57,70,0.6)] hover:scale-105 active:scale-95 transition-transform"
            >
              {ui("akcija.pogledajCelMeni", lang)}
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
