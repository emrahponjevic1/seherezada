"use client"

import { useRef, useState } from "react"

/**
 * Otpremanje slike sa stanjima: prazno · odabrano · šalje se · gotovo · greška.
 *
 * Provjere ovdje su UDOBNOST — korisnik vidi grešku bez čekanja na server.
 * Serverska provjera je jedina koja se računa i ona se svejedno izvršava.
 */

const NAJVECA = 12 * 1024 * 1024
const DOZVOLJENI = /^image\/(jpeg|png|webp|heic|heif)$/i

type Stanje = "prazno" | "odabrano" | "salje" | "gotovo" | "greska"

export function OtpremiSliku({
  mapa,
  ime,
  pocetna,
  naUspjeh,
}: {
  mapa: "jela" | "lokali"
  /** Slug — određuje mapu na disku. */
  ime: string
  pocetna?: string
  naUspjeh: (osnova: string) => void
}) {
  const [stanje, setStanje] = useState<Stanje>(pocetna ? "gotovo" : "prazno")
  const [poruka, setPoruka] = useState<string>()
  const [pregled, setPregled] = useState<string | undefined>(pocetna)
  const [napredak, setNapredak] = useState(0)
  const unos = useRef<HTMLInputElement>(null)

  const naOdabir = (datoteka: File | undefined) => {
    if (!datoteka) return

    if (!DOZVOLJENI.test(datoteka.type)) {
      setStanje("greska")
      setPoruka("Dovoljeni so JPEG, PNG, WebP in HEIC.")
      return
    }
    if (datoteka.size > NAJVECA) {
      setStanje("greska")
      setPoruka("Datoteka je večja od 12 MB.")
      return
    }

    setPoruka(undefined)
    setPregled(URL.createObjectURL(datoteka))
    setStanje("odabrano")
    posalji(datoteka)
  }

  const posalji = (datoteka: File) => {
    if (!ime) {
      setStanje("greska")
      setPoruka("Najprej vpišite naslov (slug) jedi.")
      return
    }

    setStanje("salje")
    setNapredak(0)

    const obrazac = new FormData()
    obrazac.set("datoteka", datoteka)
    obrazac.set("mapa", mapa)
    obrazac.set("ime", ime)

    // XHR, a ne fetch — samo on javlja napredak slanja.
    const zahtjev = new XMLHttpRequest()
    zahtjev.open("POST", "/api/otpremi")

    zahtjev.upload.onprogress = (e) => {
      if (e.lengthComputable) setNapredak(Math.round((e.loaded / e.total) * 100))
    }

    zahtjev.onload = () => {
      try {
        const odgovor = JSON.parse(zahtjev.responseText)
        if (odgovor.ok) {
          setStanje("gotovo")
          setPregled(`${odgovor.osnova}/800.webp`)
          naUspjeh(odgovor.osnova)
        } else {
          setStanje("greska")
          setPoruka(odgovor.poruka ?? "Nalaganje ni uspelo.")
        }
      } catch {
        setStanje("greska")
        setPoruka("Nalaganje ni uspelo.")
      }
    }

    zahtjev.onerror = () => {
      setStanje("greska")
      setPoruka("Povezava je prekinjena.")
    }

    zahtjev.send(obrazac)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-4 flex-wrap">
        {pregled ? (
          <img
            src={pregled}
            alt="Predogled"
            width={160}
            height={120}
            className="w-40 aspect-[4/3] object-cover rounded-xl border border-zinc-300"
          />
        ) : (
          <div className="w-40 aspect-[4/3] rounded-xl border border-dashed border-zinc-300 flex items-center justify-center text-zinc-400 text-sm">
            brez slike
          </div>
        )}

        <div className="space-y-2">
          <input
            ref={unos}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
            onChange={(e) => naOdabir(e.target.files?.[0])}
            className="block text-sm file:mr-3 file:px-4 file:py-2 file:rounded-xl file:border-0 file:bg-shere-red file:text-white file:font-bold file:cursor-pointer"
          />
          <p className="text-xs text-zinc-500">
            Slika s telefona je v redu — strežnik jo sam obreže na 4:3 in
            pretvori v tri velikosti pod 300 KB.
          </p>
        </div>
      </div>

      {stanje === "salje" && (
        <div className="space-y-1">
          <div className="h-2 rounded-full bg-zinc-200 overflow-hidden">
            <div
              className="h-full bg-shere-red transition-all"
              style={{ width: `${napredak}%` }}
            />
          </div>
          <p className="text-xs text-zinc-500">Nalagam… {napredak}%</p>
        </div>
      )}

      {stanje === "gotovo" && (
        <p className="text-xs font-semibold text-green-700">
          Slika naložena — nastale so tri velikosti.
        </p>
      )}

      {stanje === "greska" && (
        <p role="alert" className="text-xs font-semibold text-red-600">
          {poruka}
        </p>
      )}
    </div>
  )
}
