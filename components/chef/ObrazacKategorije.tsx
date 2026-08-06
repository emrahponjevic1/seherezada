"use client"

import { useActionState, useState } from "react"

import type { Kategorija } from "@/lib/domain"
import {
  obrisiKategoriju,
  spremiKategoriju,
  type StanjeObrasca,
} from "@/lib/chef/jela"

import { DugmeSnimi, Kvacica, PoJeziku, PorukaGreske, Tekst } from "./obrazac"

export function ObrazacKategorije({
  kategorija,
  naZatvaranje,
}: {
  kategorija?: Kategorija
  naZatvaranje?: () => void
}) {
  const [stanje, akcija] = useActionState<StanjeObrasca, FormData>(
    spremiKategoriju,
    {},
  )

  return (
    <form
      action={akcija}
      className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-5"
    >
      <PorukaGreske poruka={stanje.poruka} />
      {kategorija && (
        <input type="hidden" name="stariSlug" value={kategorija.slug} />
      )}

      <PoJeziku
        ime="naziv"
        naslov="Ime kategorije"
        vrijednosti={kategorija?.naziv}
        greske={stanje.greske}
      />

      <Tekst
        ime="slug"
        naslov="Naslov (slug)"
        greske={stanje.greske}
        required
        defaultValue={kategorija?.slug}
      />

      <PoJeziku
        ime="opis"
        naslov="Opis"
        vrijednosti={kategorija?.opis}
        greske={stanje.greske}
        visina={2}
        obavezanSl={false}
      />

      <Kvacica
        ime="aktivna"
        naslov="Aktivna — prikazana na spletišču"
        defaultChecked={kategorija ? kategorija.aktivna : true}
      />

      <div className="flex gap-3">
        <DugmeSnimi />
        {naZatvaranje && (
          <button
            type="button"
            onClick={naZatvaranje}
            className="px-5 py-2.5 rounded-xl border border-zinc-300 font-semibold hover:bg-zinc-100"
          >
            Prekliči
          </button>
        )}
      </div>
    </form>
  )
}

/** Brisanje kategorije — baza ga odbija ako ima jela, ovdje poruka kaže koliko. */
export function ObrisiKategoriju({ slug }: { slug: string }) {
  const [stanje, akcija] = useActionState<StanjeObrasca, FormData>(
    obrisiKategoriju,
    {},
  )

  return (
    <form action={akcija} className="inline">
      <input type="hidden" name="slug" value={slug} />
      <button
        type="submit"
        className="px-3 py-1.5 rounded-lg border border-red-300 text-red-700 font-semibold hover:bg-red-50"
      >
        Izbriši
      </button>
      {stanje.greske?.brisanje && (
        <p role="alert" className="text-xs font-semibold text-red-600 mt-1">
          {stanje.greske.brisanje}
        </p>
      )}
    </form>
  )
}

export function DodajKategoriju() {
  const [otvoreno, setOtvoreno] = useState(false)

  if (!otvoreno) {
    return (
      <button
        onClick={() => setOtvoreno(true)}
        className="px-5 py-2.5 rounded-xl bg-shere-red text-white font-bold hover:bg-shere-darkred active:scale-95 transition-all"
      >
        + Dodaj kategorijo
      </button>
    )
  }

  return <ObrazacKategorije naZatvaranje={() => setOtvoreno(false)} />
}
