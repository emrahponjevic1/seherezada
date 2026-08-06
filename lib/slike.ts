import "server-only"

import { mkdir, writeFile } from "node:fs/promises"
import { join } from "node:path"
import sharp from "sharp"

/**
 * Obrada slika.
 *
 * Fotografija sa telefona ima 3–8 MB. Postavljena kakva jeste, jedna
 * stranica menija sa 23 jela vuče preko 100 MB — sajt postaje neupotrebljiv
 * na mobilnim podacima, baš tamo gdje se najviše koristi. Tražiti od
 * vlasnika da sam smanjuje slike ne radi.
 *
 * Zato SERVER obrađuje: obreže na 4:3 i napravi tri veličine u WebP-u.
 * Telefon bi se na velikoj slici zagušio.
 *
 * Plan je ovdje računao na Supabase Storage. Pošto bazu i server vodimo
 * sami, slike idu na DISK, u mapu izvan `public/` — tako rade i kad se
 * aplikacija gradi u samostalnom obliku, gdje se `public/` kopira pri
 * gradnji i naknadno dodane datoteke se ne bi vidjele.
 */

export const VELICINE = [400, 800, 1600] as const
export const NAJVECA_DATOTEKA = 12 * 1024 * 1024 // 12 MB
export const NAJMANJA_SIRINA = 600
export const NAJMANJA_VISINA = 450
const CILJ_BAJTOVA = 300 * 1024 // svaka veličina ispod 300 KB

/** Mapa sa slikama. Van `public/`; poslužuje ih /api/slike. */
export const MAPA_SLIKA = join(process.cwd(), "podaci", "slike")

export type Greska =
  | "prazno"
  | "prevelika"
  | "nepodrzan-tip"
  | "premala"
  | "neuspjela-obrada"

export const PORUKE: Record<Greska, string> = {
  prazno: "Ni izbrane datoteke.",
  prevelika: "Datoteka je večja od 12 MB.",
  "nepodrzan-tip":
    "Nepodprta datoteka. Dovoljeni so JPEG, PNG, WebP in HEIC.",
  premala: `Slika je premajhna. Najmanj ${NAJMANJA_SIRINA}×${NAJMANJA_VISINA} slikovnih pik.`,
  "neuspjela-obrada": "Slike ni bilo mogoče obdelati.",
}

/**
 * Tip se čita iz ZAGLAVLJA, ne iz nastavka imena.
 *
 * Nastavak laže: PDF preimenovan u `.jpg` prošao bi provjeru po imenu.
 * `sharp` čita stvarni sadržaj, pa se na tome i oslanjamo.
 */
const DOZVOLJENI = new Set(["jpeg", "png", "webp", "heif", "avif"])

export interface Ishod {
  ok: boolean
  greska?: Greska
  poruka?: string
  /** Osnovna adresa bez veličine, npr. /api/slike/jela/doner-kebab */
  osnova?: string
  velicine?: { sirina: number; bajtova: number }[]
}

export async function obradiIspremi(
  datoteka: File,
  mapa: string,
  ime: string,
): Promise<Ishod> {
  if (!datoteka || datoteka.size === 0) {
    return { ok: false, greska: "prazno", poruka: PORUKE.prazno }
  }

  if (datoteka.size > NAJVECA_DATOTEKA) {
    return { ok: false, greska: "prevelika", poruka: PORUKE.prevelika }
  }

  const bajtovi = Buffer.from(await datoteka.arrayBuffer())

  let podaci: Awaited<ReturnType<ReturnType<typeof sharp>["metadata"]>>
  try {
    podaci = await sharp(bajtovi).metadata()
  } catch {
    return {
      ok: false,
      greska: "nepodrzan-tip",
      poruka: PORUKE["nepodrzan-tip"],
    }
  }

  if (!podaci.format || !DOZVOLJENI.has(podaci.format)) {
    return {
      ok: false,
      greska: "nepodrzan-tip",
      poruka: PORUKE["nepodrzan-tip"],
    }
  }

  const sirina = podaci.width ?? 0
  const visina = podaci.height ?? 0
  if (sirina < NAJMANJA_SIRINA || visina < NAJMANJA_VISINA) {
    return { ok: false, greska: "premala", poruka: PORUKE.premala }
  }

  const odrediste = join(MAPA_SLIKA, mapa, ime)
  await mkdir(odrediste, { recursive: true })

  const napravljene: { sirina: number; bajtova: number }[] = []

  try {
    for (const w of VELICINE) {
      // Obrezivanje na 4:3 — sve kartice na sajtu drže taj odnos.
      let kvalitet = 82
      let izlaz = await sharp(bajtovi)
        .rotate() // poštuje EXIF orijentaciju sa telefona
        .resize(w, Math.round((w * 3) / 4), { fit: "cover", position: "centre" })
        .webp({ quality: kvalitet })
        .toBuffer()

      // Spuštaj kvalitet dok ne stane ispod granice.
      while (izlaz.byteLength > CILJ_BAJTOVA && kvalitet > 40) {
        kvalitet -= 10
        izlaz = await sharp(bajtovi)
          .rotate()
          .resize(w, Math.round((w * 3) / 4), { fit: "cover", position: "centre" })
          .webp({ quality: kvalitet })
          .toBuffer()
      }

      // Nova slika istog jela PREPISUJE staru.
      await writeFile(join(odrediste, `${w}.webp`), izlaz)
      napravljene.push({ sirina: w, bajtova: izlaz.byteLength })
    }
  } catch {
    return {
      ok: false,
      greska: "neuspjela-obrada",
      poruka: PORUKE["neuspjela-obrada"],
    }
  }

  return {
    ok: true,
    osnova: `/api/slike/${mapa}/${ime}`,
    velicine: napravljene,
  }
}
