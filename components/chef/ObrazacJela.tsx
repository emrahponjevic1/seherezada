"use client"

import { useActionState, useState } from "react"
import Link from "next/link"

import type { Jelo, Kategorija } from "@/lib/domain"
import { t } from "@/lib/i18n"
import { spremiJelo, type StanjeObrasca } from "@/lib/chef/jela"
import { OtpremiSliku } from "./OtpremiSliku"
import { ALERGENI, predloziSlug } from "@/lib/chef/provjere"

import {
  DugmeSnimi,
  Izbor,
  Kvacica,
  PoJeziku,
  PorukaGreske,
  Tekst,
  UpozoriNaIzmjene,
} from "./obrazac"

const NAZIV_ALERGENA: Record<string, string> = {
  gluten: "Gluten",
  laktoza: "Laktoza",
  sezam: "Sezam",
  orasasti: "Oreščki",
  jaja: "Jajca",
  riba: "Ribe",
  soja: "Soja",
  gorusica: "Gorčica",
}

/**
 * Obrazac jela.
 *
 * NEMA NIJEDNOG POLJA ZA CIJENU — cijena nije svojstvo jela nego veze
 * lokal↔jelo, i uređuje se u koraku 16. Da je ovdje, isto jelo bi se
 * unosilo onoliko puta koliko ima lokala.
 */
export function ObrazacJela({
  jelo,
  kategorije,
}: {
  jelo?: Jelo
  kategorije: Kategorija[]
}) {
  const [stanje, akcija] = useActionState<StanjeObrasca, FormData>(
    spremiJelo,
    {},
  )
  const greske = stanje.greske
  const [slug, setSlug] = useState(jelo?.slug ?? "")
  const [slikaUrl, setSlikaUrl] = useState(jelo?.slikaUrl ?? "")

  return (
    <form action={akcija} className="space-y-8 max-w-3xl">
      <UpozoriNaIzmjene />
      <PorukaGreske poruka={stanje.poruka} />

      {jelo && <input type="hidden" name="stariSlug" value={jelo.slug} />}

      <section className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-5">
        <h2 className="font-black font-poppins text-lg">Osnovno</h2>

        <PoJeziku
          ime="naziv"
          naslov="Ime jedi"
          vrijednosti={jelo?.naziv}
          greske={greske}
        />

        <Tekst
          ime="slug"
          naslov="Naslov (slug)"
          greske={greske}
          required
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          pomoc="Predlaga se iz slovenskega imena."
        />

        <button
          type="button"
          onClick={() => {
            const polje = document.querySelector<HTMLInputElement>(
              'input[name="naziv.sl"]',
            )
            if (polje?.value) setSlug(predloziSlug(polje.value))
          }}
          className="text-sm font-semibold text-shere-red hover:underline"
        >
          Predlagaj iz imena
        </button>

        <Izbor
          ime="kategorijaId"
          naslov="Kategorija"
          greske={greske}
          defaultValue={jelo?.kategorijaId}
          required
          opcije={[
            { vrijednost: "", naziv: "— izberite —" },
            ...kategorije.map((k) => ({
              vrijednost: k.id,
              naziv: t(k.naziv, "sl"),
            })),
          ]}
        />

        <PoJeziku
          ime="opis"
          naslov="Opis"
          vrijednosti={jelo?.opis}
          greske={greske}
          visina={3}
          obavezanSl={false}
        />

        <PoJeziku
          ime="sastojci"
          naslov="Sestavine — ena na vrstico"
          vrijednosti={jelo?.sastojci}
          greske={greske}
          visina={5}
          obavezanSl={false}
        />
      </section>

      <section className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-5">
        <h2 className="font-black font-poppins text-lg">Oznake</h2>
        <p className="text-sm text-zinc-500">
          Oznake se berejo iz podatka, ne iz kategorije — zato jih nosi vsaka
          jed posebej.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Halal je podrazumijevano uključen — ovdje je podatak, ne pretpostavka. */}
          <Kvacica
            ime="halal"
            naslov="Halal"
            defaultChecked={jelo ? jelo.halal : true}
          />
          <Kvacica
            ime="vegetarijansko"
            naslov="Vegetarijansko"
            defaultChecked={jelo?.vegetarijansko}
          />
          <Kvacica
            ime="vegansko"
            naslov="Vegansko"
            defaultChecked={jelo?.vegansko}
          />
          <Kvacica
            ime="aktivno"
            naslov="Aktivno"
            defaultChecked={jelo ? jelo.aktivno : true}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Izbor
            ime="ljuto"
            naslov="Pikantnost"
            greske={greske}
            defaultValue={String(jelo?.ljuto ?? 0)}
            opcije={[
              { vrijednost: "0", naziv: "0 — ni pikantno" },
              { vrijednost: "1", naziv: "1 — blago 🌶️" },
              { vrijednost: "2", naziv: "2 — srednje 🌶️🌶️" },
              { vrijednost: "3", naziv: "3 — zelo 🌶️🌶️🌶️" },
            ]}
          />
          <Tekst
            ime="kalorije"
            naslov="Kalorije"
            type="number"
            min={0}
            defaultValue={jelo?.kalorije}
          />
        </div>

        <div className="space-y-2">
          <span className="text-sm font-semibold block">Alergeni</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {ALERGENI.map((a) => (
              <Kvacica
                key={a}
                ime={`alergen.${a}`}
                naslov={NAZIV_ALERGENA[a]}
                defaultChecked={jelo?.alergeni.includes(a)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-5">
        <h2 className="font-black font-poppins text-lg">Slika</h2>

        <OtpremiSliku
          mapa="jela"
          ime={slug}
          pocetna={jelo?.slikaUrl}
          naUspjeh={setSlikaUrl}
        />

        <Tekst
          ime="slikaUrl"
          naslov="Naslov slike"
          value={slikaUrl}
          onChange={(e) => setSlikaUrl(e.target.value)}
          pomoc="Izpolni se samodejno po nalaganju. Lahko vpišete tudi zunanji naslov."
        />
        <PoJeziku
          ime="slikaAlt"
          naslov="Opis slike"
          vrijednosti={jelo?.slikaAlt}
          greske={greske}
          obavezanSl={false}
        />
      </section>

      <div className="flex items-center gap-3">
        <DugmeSnimi />
        <Link
          href="/chef/jela"
          className="px-6 py-2.5 rounded-xl border border-zinc-300 font-semibold hover:bg-zinc-100"
        >
          Prekliči
        </Link>
      </div>
    </form>
  )
}
