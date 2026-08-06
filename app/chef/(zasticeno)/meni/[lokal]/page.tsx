import Link from "next/link"
import { notFound } from "next/navigation"

import { t } from "@/lib/i18n"
import {
  jelaVanMenija,
  lokalPoSlugu,
  meniZaUredjivanje,
  sviLokali,
} from "@/lib/chef/upiti"
import {
  pomjeriStavku,
  postaviCijenu,
  prebaciZastavicu,
  ukloniIzMenija,
} from "@/lib/chef/meni"
import { DodajJela } from "@/components/chef/DodajJela"
import { PoljeCijene } from "@/components/chef/PoljeCijene"

export default async function MeniLokala({
  params,
}: {
  params: Promise<{ lokal: string }>
}) {
  const { lokal: slug } = await params
  const lokal = await lokalPoSlugu(slug)
  if (!lokal) notFound()

  const [stavke, ponuda, svi] = await Promise.all([
    meniZaUredjivanje(slug),
    jelaVanMenija(slug),
    sviLokali(),
  ])

  const glavni = svi.find((l) => l.glavni)
  const drugi = svi
    .filter((l) => l.slug !== slug && l.stanje !== "zatvoren")
    .map((l) => ({ slug: l.slug, naziv: l.naziv }))

  // Grupisanje po kategorijama — redoslijed vrijedi unutar kategorije.
  const grupe: { id: string; naziv: string; stavke: typeof stavke }[] = []
  for (const s of stavke) {
    let g = grupe.find((x) => x.id === s.kategorijaId)
    if (!g) {
      g = { id: s.kategorijaId, naziv: t(s.kategorijaNaziv, "sl"), stavke: [] }
      grupe.push(g)
    }
    g.stavke.push(s)
  }

  const javnaAdresa =
    lokal.slug === glavni?.slug ? "/meni" : `/${lokal.slug}/meni`

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-black font-poppins tracking-tight">
            Meni in cene
          </h1>
          <p className="text-zinc-500 mt-1">
            Cene se urejajo kar v vrstici, brez odpiranja jedi.
          </p>
        </div>
        <div className="flex gap-2">
          {/* Pregled prije objave — otvara javnu stranicu u novoj kartici. */}
          <a
            href={javnaAdresa}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl border border-zinc-300 font-semibold hover:bg-zinc-100"
          >
            Predogled ↗
          </a>
          <Link
            href="/chef/cijene"
            className="px-4 py-2.5 rounded-xl border border-zinc-300 font-semibold hover:bg-zinc-100"
          >
            Vsi lokali naenkrat
          </Link>
        </div>
      </div>

      {/* Prekidač lokala */}
      <div className="flex flex-wrap gap-2">
        {svi
          .filter((l) => l.stanje !== "zatvoren")
          .map((l) => (
            <Link
              key={l.slug}
              href={`/chef/meni/${l.slug}`}
              className={`px-4 py-2 rounded-xl font-semibold border transition-colors ${
                l.slug === slug
                  ? "bg-shere-red text-white border-transparent"
                  : "bg-white border-zinc-300 hover:bg-zinc-100"
              }`}
            >
              {l.naziv}
              <span className="ml-2 text-xs opacity-70">{l.brojJela}</span>
            </Link>
          ))}
      </div>

      <DodajJela lokal={slug} ponuda={ponuda} drugiLokali={drugi} />

      {grupe.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-2xl p-10 text-center">
          <p className="text-lg font-bold">Ta lokal ima prazen meni.</p>
          <p className="text-zinc-500 mt-2">
            Katalog je knjižnica, meni je izbor iz nje — dodajte jedi zgoraj.
          </p>
        </div>
      ) : (
        grupe.map((g) => (
          <section
            key={g.id}
            className="bg-white border border-zinc-200 rounded-2xl overflow-hidden"
          >
            <h2 className="font-black font-poppins text-lg px-4 py-3 bg-zinc-100">
              {g.naziv}
            </h2>
            <ul className="divide-y divide-zinc-200">
              {g.stavke.map((s, i) => (
                <li
                  key={s.jeloId}
                  className={`px-4 py-3 flex flex-wrap items-center gap-3 ${
                    s.aktivno ? "" : "opacity-50"
                  }`}
                >
                  <div className="flex flex-col gap-0.5">
                    <form action={pomjeriStavku}>
                      <input type="hidden" name="lokal" value={slug} />
                      <input type="hidden" name="jeloId" value={s.jeloId} />
                      <input type="hidden" name="smjer" value="gore" />
                      <button
                        disabled={i === 0}
                        aria-label="Navzgor"
                        className="px-1.5 leading-none text-zinc-400 hover:text-zinc-900 disabled:opacity-25"
                      >
                        ▲
                      </button>
                    </form>
                    <form action={pomjeriStavku}>
                      <input type="hidden" name="lokal" value={slug} />
                      <input type="hidden" name="jeloId" value={s.jeloId} />
                      <input type="hidden" name="smjer" value="dolje" />
                      <button
                        disabled={i === g.stavke.length - 1}
                        aria-label="Navzdol"
                        className="px-1.5 leading-none text-zinc-400 hover:text-zinc-900 disabled:opacity-25"
                      >
                        ▼
                      </button>
                    </form>
                  </div>

                  <span className="flex-1 min-w-40 font-semibold">
                    {t(s.naziv, "sl")}
                    {!s.aktivno && (
                      <span className="ml-2 text-xs text-zinc-500">
                        (jed je deaktivirana v katalogu)
                      </span>
                    )}
                  </span>

                  <PoljeCijene
                    pocetna={s.cijena}
                    snimi={async (unos) => {
                      "use server"
                      return postaviCijenu(slug, s.jeloId, unos)
                    }}
                  />

                  <form action={prebaciZastavicu}>
                    <input type="hidden" name="lokal" value={slug} />
                    <input type="hidden" name="jeloId" value={s.jeloId} />
                    <input type="hidden" name="polje" value="dostupno" />
                    <input
                      type="hidden"
                      name="vrijednost"
                      value={s.dostupno ? "0" : "1"}
                    />
                    <button
                      title="Začasno skrije jed s spletišča. Vrstica in cena ostaneta."
                      className={`px-3 py-1.5 rounded-lg border font-semibold text-sm ${
                        s.dostupno
                          ? "border-green-300 bg-green-50 text-green-800"
                          : "border-zinc-300 text-zinc-500"
                      }`}
                    >
                      {s.dostupno ? "na voljo" : "skrito"}
                    </button>
                  </form>

                  <form action={prebaciZastavicu}>
                    <input type="hidden" name="lokal" value={slug} />
                    <input type="hidden" name="jeloId" value={s.jeloId} />
                    <input type="hidden" name="polje" value="izdvojeno" />
                    <input
                      type="hidden"
                      name="vrijednost"
                      value={s.izdvojeno ? "0" : "1"}
                    />
                    <button
                      title="Prikaže jed med Priljubljenimi izbirami na naslovnici."
                      className={`px-3 py-1.5 rounded-lg border font-semibold text-sm ${
                        s.izdvojeno
                          ? "border-amber-300 bg-amber-50 text-amber-800"
                          : "border-zinc-300 text-zinc-500"
                      }`}
                    >
                      {s.izdvojeno ? "★ izpostavljeno" : "☆"}
                    </button>
                  </form>

                  <form action={ukloniIzMenija}>
                    <input type="hidden" name="lokal" value={slug} />
                    <input type="hidden" name="jeloId" value={s.jeloId} />
                    <button
                      title="Odstrani iz menija tega lokala. Jed ostane v katalogu."
                      className="px-3 py-1.5 rounded-lg border border-zinc-300 text-zinc-500 hover:border-red-300 hover:text-red-700 font-semibold text-sm"
                    >
                      Odstrani
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  )
}
