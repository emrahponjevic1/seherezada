"use client"

import { useActionState, useState } from "react"

import { kopirajLokal, obrisiLokal, type StanjeObrasca } from "@/lib/chef/lokali"
import { DugmeSnimi, Kvacica, Polje, PorukaGreske, Tekst } from "./obrazac"

/** Kopiranje lokala — najbrži način da novi lokal dobije cijeli meni. */
export function KopirajLokal({
  izvor,
  brojJela,
}: {
  izvor: string
  brojJela: number
}) {
  const [otvoreno, setOtvoreno] = useState(false)
  const [stanje, akcija] = useActionState<StanjeObrasca, FormData>(
    kopirajLokal,
    {},
  )

  if (!otvoreno) {
    return (
      <button
        onClick={() => setOtvoreno(true)}
        className="px-5 py-2.5 rounded-xl border border-zinc-300 font-semibold hover:bg-zinc-100"
      >
        Kopiraj lokal
      </button>
    )
  }

  return (
    <form action={akcija} className="space-y-4 max-w-lg">
      <PorukaGreske poruka={stanje.poruka} />
      <input type="hidden" name="izvor" value={izvor} />

      <Tekst
        ime="slug"
        naslov="Nov naslov strani"
        greske={stanje.greske}
        required
      />
      <Tekst ime="naziv" naslov="Novo ime" greske={stanje.greske} required />

      <div className="space-y-2">
        <Kvacica
          ime="sMenijem"
          naslov={`Kopiraj meni (${brojJela} jedi s cenami)`}
          defaultChecked
        />
        <Kvacica ime="sVremenom" naslov="Kopiraj delovni čas" defaultChecked />
      </div>

      <p className="text-xs text-zinc-500">
        Se <strong>ne</strong> kopira: glavni lokal, Place ID, Wolt, Glovo in
        uvodno besedilo — to je za vsak lokal svoje. Nov lokal nastane v stanju{" "}
        <strong>kmalu</strong>, da se ne pojavi na spletišču, preden ga
        dokončate.
      </p>

      <div className="flex gap-3">
        <DugmeSnimi naziv="Kopiraj" />
        <button
          type="button"
          onClick={() => setOtvoreno(false)}
          className="px-5 py-2.5 rounded-xl border border-zinc-300 font-semibold hover:bg-zinc-100"
        >
          Prekliči
        </button>
      </div>
    </form>
  )
}

/** Trajno brisanje — traži da se slug upiše rukom. */
export function ObrisiLokal({
  slug,
  glavni,
}: {
  slug: string
  glavni: boolean
}) {
  const [otvoreno, setOtvoreno] = useState(false)
  const [stanje, akcija] = useActionState<StanjeObrasca, FormData>(
    obrisiLokal,
    {},
  )

  if (glavni) {
    return (
      <p className="text-sm text-zinc-500">
        Glavnega lokala ni mogoče izbrisati. Najprej določite drugega za
        glavnega.
      </p>
    )
  }

  if (!otvoreno) {
    return (
      <button
        onClick={() => setOtvoreno(true)}
        className="px-5 py-2.5 rounded-xl border border-red-300 text-red-700 font-semibold hover:bg-red-50"
      >
        Trajno izbriši
      </button>
    )
  }

  return (
    <form action={akcija} className="space-y-4 max-w-lg">
      <PorukaGreske poruka={stanje.poruka} />
      <input type="hidden" name="slug" value={slug} />

      <p className="text-sm text-zinc-600">
        Izbris je trajen. Meni tega lokala bo izbrisan, <strong>jedi pa
        ostanejo</strong> v katalogu. Če želite lokal le skriti s spletišča,
        raje uporabite stanje <strong>zaprt</strong>.
      </p>

      <Polje
        ime="potvrda"
        naslov={`Za potrditev vpišite: ${slug}`}
        greske={stanje.greske}
      >
        <input
          id="potvrda"
          name="potvrda"
          autoComplete="off"
          className="w-full px-3 py-2 rounded-xl border border-zinc-300 bg-white focus:outline-none focus:ring-2 focus:ring-red-400"
        />
      </Polje>

      <div className="flex gap-3">
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 active:scale-95 transition-all"
        >
          Izbriši
        </button>
        <button
          type="button"
          onClick={() => setOtvoreno(false)}
          className="px-5 py-2.5 rounded-xl border border-zinc-300 font-semibold hover:bg-zinc-100"
        >
          Prekliči
        </button>
      </div>
    </form>
  )
}
