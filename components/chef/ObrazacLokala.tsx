"use client"

import { useActionState, useState } from "react"
import Link from "next/link"

import type { Dan, Lokal } from "@/lib/domain"
import { spremiLokal, type StanjeObrasca } from "@/lib/chef/lokali"
import { predloziSlug } from "@/lib/chef/provjere"

import {
  DugmeSnimi,
  Izbor,
  Kvacica,
  PoJeziku,
  PorukaGreske,
  Tekst,
  UpozoriNaIzmjene,
} from "./obrazac"

const DANI: { kod: Dan; naziv: string }[] = [
  { kod: "pon", naziv: "Ponedeljek" },
  { kod: "uto", naziv: "Torek" },
  { kod: "sri", naziv: "Sreda" },
  { kod: "cet", naziv: "Četrtek" },
  { kod: "pet", naziv: "Petek" },
  { kod: "sub", naziv: "Sobota" },
  { kod: "ned", naziv: "Nedelja" },
]

/** `do` manje od `od` znači da termin prelazi ponoć — to treba reći naglas. */
function prelaziPonoc(od: string, doo: string): boolean {
  if (!od || !doo) return false
  return doo <= od
}

export function ObrazacLokala({ lokal }: { lokal?: Lokal }) {
  const [stanje, akcija] = useActionState<StanjeObrasca, FormData>(
    spremiLokal,
    {},
  )
  const greske = stanje.greske

  const [slug, setSlug] = useState(lokal?.slug ?? "")
  const [vrijeme, setVrijeme] = useState(() => {
    const pocetno: Record<string, { od: string; do: string; zatvoreno: boolean }> =
      {}
    for (const d of DANI) {
      const t = lokal?.radnoVrijeme?.redovno?.[d.kod]
      pocetno[d.kod] = {
        od: t?.od ?? "09:00",
        do: t?.do ?? "22:00",
        zatvoreno: !t,
      }
    }
    return pocetno
  })

  const [izuzeci, setIzuzeci] = useState(
    () => lokal?.radnoVrijeme?.izuzeci ?? [],
  )

  return (
    <form action={akcija} className="space-y-8 max-w-3xl">
      <UpozoriNaIzmjene />
      <PorukaGreske poruka={stanje.poruka} />

      {lokal && <input type="hidden" name="stariSlug" value={lokal.slug} />}
      <input type="hidden" name="redoslijed" value={lokal?.redoslijed ?? 0} />

      {/* ── Osnovno ───────────────────────────────────────── */}
      <section className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-5">
        <h2 className="font-black font-poppins text-lg">Osnovni podatki</h2>

        <Tekst
          ime="slug"
          naslov="Naslov strani"
          greske={greske}
          required
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          pomoc={
            <>
              Nastane naslov{" "}
              <span className="font-mono text-zinc-700">
                seherezada.net/{slug || "…"}
              </span>
              {lokal && lokal.slug !== slug && (
                <span className="block mt-1 font-semibold text-amber-700">
                  Spreminjanje naslova bo pokvarilo obstoječe povezave. Stari
                  naslov bo trajno preusmerjen na novega.
                </span>
              )}
            </>
          }
        />

        <Tekst
          ime="naziv"
          naslov="Ime lokala"
          greske={greske}
          required
          defaultValue={lokal?.naziv}
          onBlur={(e) => {
            if (!slug && e.target.value) setSlug(predloziSlug(e.target.value))
          }}
        />

        <Tekst
          ime="ulica"
          naslov="Ulica"
          greske={greske}
          required
          defaultValue={lokal?.ulica}
          pomoc="Uporabljena je v naslovih strani, da dva lokala nimata enakega."
        />

        <Tekst
          ime="adresa"
          naslov="Polni naslov"
          greske={greske}
          required
          defaultValue={lokal?.adresa}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Tekst
            ime="telefon"
            naslov="Telefon"
            greske={greske}
            required
            defaultValue={lokal?.telefon}
            placeholder="+386 …"
          />
          <Tekst
            ime="email"
            naslov="E-pošta"
            type="email"
            defaultValue={lokal?.email}
          />
        </div>

        <Izbor
          ime="stanje"
          naslov="Stanje"
          greske={greske}
          defaultValue={lokal?.stanje ?? "uskoro"}
          opcije={[
            { vrijednost: "radi", naziv: "Deluje — viden na spletišču" },
            { vrijednost: "uskoro", naziv: "Kmalu — kartica brez povezave" },
            { vrijednost: "zatvoren", naziv: "Zaprt — skrit s spletišča" },
          ]}
        />
      </section>

      {/* ── Uvodni tekst ──────────────────────────────────── */}
      <section className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4">
        <h2 className="font-black font-poppins text-lg">Uvodno besedilo</h2>
        <p className="text-sm text-zinc-500">
          Obvezno in <strong>različno za vsak lokal</strong>. Brez njega so
          naslovnice lokalov skoraj enake in jih Google bere kot prazno vsebino.
        </p>
        <PoJeziku
          ime="uvodniTekst"
          naslov="Besedilo"
          vrijednosti={lokal?.uvodniTekst}
          greske={greske}
          visina={4}
        />
      </section>

      {/* ── Radno vrijeme ─────────────────────────────────── */}
      <section className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4">
        <h2 className="font-black font-poppins text-lg">Delovni čas</h2>

        <div className="space-y-2">
          {DANI.map((d) => {
            const v = vrijeme[d.kod]
            const ponoc = !v.zatvoreno && prelaziPonoc(v.od, v.do)
            return (
              <div
                key={d.kod}
                className="flex flex-wrap items-center gap-3 py-1.5"
              >
                <span className="w-28 text-sm font-semibold">{d.naziv}</span>

                <input
                  type="time"
                  name={`rv.${d.kod}.od`}
                  value={v.od}
                  disabled={v.zatvoreno}
                  onChange={(e) =>
                    setVrijeme((s) => ({
                      ...s,
                      [d.kod]: { ...s[d.kod], od: e.target.value },
                    }))
                  }
                  className="px-2 py-1.5 rounded-lg border border-zinc-300 disabled:bg-zinc-100"
                />
                <span className="text-zinc-400">–</span>
                <input
                  type="time"
                  name={`rv.${d.kod}.do`}
                  value={v.do}
                  disabled={v.zatvoreno}
                  onChange={(e) =>
                    setVrijeme((s) => ({
                      ...s,
                      [d.kod]: { ...s[d.kod], do: e.target.value },
                    }))
                  }
                  className="px-2 py-1.5 rounded-lg border border-zinc-300 disabled:bg-zinc-100"
                />

                <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    name={`rv.${d.kod}.zatvoreno`}
                    checked={v.zatvoreno}
                    onChange={(e) =>
                      setVrijeme((s) => ({
                        ...s,
                        [d.kod]: { ...s[d.kod], zatvoreno: e.target.checked },
                      }))
                    }
                    className="w-4 h-4 accent-shere-red"
                  />
                  zaprto
                </label>

                {ponoc && (
                  <span className="text-xs font-semibold text-amber-700">
                    prehaja polnoč
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {/* ── Izuzeci ─────────────────────────────────────── */}
        <div className="pt-4 border-t border-zinc-200 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">Izjeme po datumu</h3>
            <button
              type="button"
              onClick={() =>
                setIzuzeci((s) => [...s, { datum: "", termin: null }])
              }
              className="text-sm font-semibold px-3 py-1.5 rounded-lg border border-zinc-300 hover:bg-zinc-100"
            >
              + Dodaj
            </button>
          </div>
          <p className="text-xs text-zinc-500">
            Prazniki, kolektivni dopust, ramazan. Izjema ima prednost pred
            rednim časom.
          </p>

          {izuzeci.map((iz, i) => (
            <div key={i} className="flex flex-wrap items-center gap-2">
              <input
                type="date"
                name={`izuzetak.${i}.datum`}
                defaultValue={iz.datum}
                className="px-2 py-1.5 rounded-lg border border-zinc-300"
              />
              <input
                type="time"
                name={`izuzetak.${i}.od`}
                defaultValue={iz.termin?.od ?? ""}
                className="px-2 py-1.5 rounded-lg border border-zinc-300"
              />
              <input
                type="time"
                name={`izuzetak.${i}.do`}
                defaultValue={iz.termin?.do ?? ""}
                className="px-2 py-1.5 rounded-lg border border-zinc-300"
              />
              <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  name={`izuzetak.${i}.zatvoreno`}
                  defaultChecked={iz.termin === null}
                  className="w-4 h-4 accent-shere-red"
                />
                zaprto
              </label>
              <input
                name={`izuzetak.${i}.napomena`}
                defaultValue={iz.napomena?.sl ?? ""}
                placeholder="opomba"
                className="px-2 py-1.5 rounded-lg border border-zinc-300 flex-1 min-w-32"
              />
              <button
                type="button"
                onClick={() =>
                  setIzuzeci((s) => s.filter((_, k) => k !== i))
                }
                className="text-sm text-zinc-500 hover:text-red-600 px-2"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── Dostava i zemljevid ───────────────────────────── */}
      <section className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-5">
        <h2 className="font-black font-poppins text-lg">Dostava in zemljevid</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Tekst ime="woltUrl" naslov="Wolt" defaultValue={lokal?.woltUrl} />
          <Tekst ime="glovoUrl" naslov="Glovo" defaultValue={lokal?.glovoUrl} />
          <Tekst
            ime="googlePlaceId"
            naslov="Google Place ID"
            defaultValue={lokal?.googlePlaceId}
            pomoc="Uporabi ga korak 21 za mnenja."
          />
          <div className="grid grid-cols-2 gap-3">
            <Tekst
              ime="lat"
              naslov="Zemljepisna širina"
              defaultValue={lokal?.lat}
            />
            <Tekst
              ime="lng"
              naslov="Dolžina"
              defaultValue={lokal?.lng}
            />
          </div>
        </div>
      </section>

      <div className="flex items-center gap-3">
        <DugmeSnimi />
        <Link
          href="/chef/lokali"
          className="px-6 py-2.5 rounded-xl border border-zinc-300 font-semibold hover:bg-zinc-100"
        >
          Prekliči
        </Link>
      </div>
    </form>
  )
}

export { Kvacica }
