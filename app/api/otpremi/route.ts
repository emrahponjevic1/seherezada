import { trenutnaSesija } from "@/lib/auth"
import { obradiIspremi } from "@/lib/slike"

/**
 * Otpremanje slike.
 *
 * Provjera u pregledniku je udobnost — SERVERSKA JE JEDINA KOJA SE RAČUNA,
 * i ona je ovdje. Bez prijave se ne otprema ništa.
 */
export async function POST(zahtjev: Request) {
  if (!(await trenutnaSesija())) {
    return Response.json(
      { ok: false, poruka: "Seja je potekla, prijavite se znova." },
      { status: 401 },
    )
  }

  const obrazac = await zahtjev.formData()
  const datoteka = obrazac.get("datoteka")
  const mapa = String(obrazac.get("mapa") ?? "jela")
  const ime = String(obrazac.get("ime") ?? "").trim()

  if (!(datoteka instanceof File)) {
    return Response.json({ ok: false, poruka: "Ni datoteke." }, { status: 400 })
  }

  // Ime mape se izvodi iz sluga — nikad iz onoga što pošalje preglednik
  // bez provjere, inače bi se moglo pisati izvan predviđene mape.
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(ime)) {
    return Response.json(
      { ok: false, poruka: "Neveljaven naslov." },
      { status: 400 },
    )
  }
  if (mapa !== "jela" && mapa !== "lokali") {
    return Response.json({ ok: false, poruka: "Neveljavna mapa." }, { status: 400 })
  }

  const ishod = await obradiIspremi(datoteka, mapa, ime)
  return Response.json(ishod, { status: ishod.ok ? 200 : 400 })
}
