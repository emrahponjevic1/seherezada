import { readFile } from "node:fs/promises"
import { join, normalize } from "node:path"

import { MAPA_SLIKA } from "@/lib/slike"

/**
 * Poslužuje otpremljene slike sa diska.
 *
 * Slike stoje izvan `public/` da bi radile i u samostalnoj gradnji, gdje
 * se `public/` kopira pri gradnji i naknadno dodane datoteke se ne bi
 * vidjele.
 */
export async function GET(
  _zahtjev: Request,
  { params }: { params: Promise<{ put: string[] }> },
) {
  const { put } = await params

  // Putanja se sastavlja tek poslije provjere — bez ovoga bi „..“ u
  // adresi vodilo bilo gdje po disku.
  const relativna = normalize(put.join("/"))
  if (relativna.startsWith("..") || relativna.includes("\0")) {
    return new Response("Neveljavna pot", { status: 400 })
  }

  try {
    const podaci = await readFile(join(MAPA_SLIKA, relativna))
    return new Response(new Uint8Array(podaci), {
      headers: {
        "content-type": "image/webp",
        // Nova slika istog jela prepisuje staru pod istim imenom, pa keš
        // mora biti kratak da izmjena stigne do gostiju.
        "cache-control": "public, max-age=300, stale-while-revalidate=86400",
      },
    })
  } catch {
    return new Response("Slika ne obstaja", { status: 404 })
  }
}
