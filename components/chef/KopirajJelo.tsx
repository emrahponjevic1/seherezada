"use client"

import { useActionState, useState } from "react"

import { kopirajJelo, type StanjeObrasca } from "@/lib/chef/jela"
import { DugmeSnimi, PorukaGreske, Tekst } from "./obrazac"

/** Kopiranje jela — za varijante, npr. Doner → Doner XL. */
export function KopirajJelo({ izvor }: { izvor: string }) {
  const [otvoreno, setOtvoreno] = useState(false)
  const [stanje, akcija] = useActionState<StanjeObrasca, FormData>(
    kopirajJelo,
    {},
  )

  if (!otvoreno) {
    return (
      <button
        onClick={() => setOtvoreno(true)}
        className="px-5 py-2.5 rounded-xl border border-zinc-300 font-semibold hover:bg-zinc-100"
      >
        Kopiraj jed
      </button>
    )
  }

  return (
    <form action={akcija} className="space-y-4 max-w-lg">
      <PorukaGreske poruka={stanje.poruka} />
      <input type="hidden" name="izvor" value={izvor} />

      <Tekst
        ime="slug"
        naslov="Naslov nove jedi"
        greske={stanje.greske}
        required
        defaultValue={`${izvor}-kopija`}
      />

      <p className="text-xs text-zinc-500">
        Kopija dobi ime z dodatkom <strong>(kopija)</strong> in{" "}
        <strong>ni v nobenem meniju</strong> — povezave z lokali se ne kopirajo.
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
