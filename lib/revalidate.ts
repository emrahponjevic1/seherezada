import { revalidatePath, revalidateTag, updateTag } from "next/cache"

import { TAG } from "./repo.postgres"

/**
 * `updateTag` radi SAMO iz serverskih akcija. Obrasci na /chef to jesu,
 * ali ako se ove funkcije ikad pozovu odnekud drugdje — iz rute, iz
 * skripte — poziv bi puknuo POSLIJE uspješnog upisa u bazu. Podaci bi
 * bili snimljeni, a korisnik bi vidio grešku.
 *
 * Zato postoji rezerva: `revalidateTag`, koja radi svugdje. Poništavanje
 * keša ne smije oboriti upis koji je već prošao.
 */
function ponisti(oznaka: string) {
  try {
    updateTag(oznaka)
  } catch {
    revalidateTag(oznaka, "max")
  }
}

/**
 * Poništavanje keša.
 *
 * ADMIN NIKAD NE ZOVE `updateTag` DIREKTNO. Pravilo „šta se poništava
 * kad" drži se na jednom mjestu, pa se ne razlijeva po ekranima i ne
 * zaboravlja se poništiti nešto sporedno.
 *
 * Koristi se `updateTag`, a ne `revalidateTag`: on poništava ODMAH i daje
 * „vidi svoju izmjenu" semantiku, pa vlasnik poslije snimanja odmah vidi
 * novo stanje. Zove se iz serverskih akcija — obrasci na /chef (koraci
 * 14–16) su upravo to.
 */

/** Cijena, dostupnost, izdvojeno, redoslijed — pogađa SAMO taj lokal. */
export function revalidirajMeni(lokalSlug: string) {
  ponisti(TAG.meni(lokalSlug))
}

/**
 * Opis, slika, alergeni ili oznake jela — jelo je isto u svim lokalima,
 * pa se poništavaju meniji SVIH.
 */
export function revalidirajJela() {
  ponisti(TAG.jela)
}

/** Naziv, opis ili redoslijed kategorije — pogađa sve menije. */
export function revalidirajKategorije() {
  ponisti(TAG.kategorije)
}

/**
 * Podaci lokala: adresa, telefon, radno vrijeme, Wolt, Glovo.
 * Pogađa i podnožje na svim stranicama i meni tog lokala.
 */
export function revalidirajLokal(lokalSlug: string) {
  ponisti(TAG.lokali)
  ponisti(TAG.meni(lokalSlug))
}

/**
 * Novi lokal, promjena sluga ili promjena glavnog lokala.
 *
 * Ovo ne mijenja samo SADRŽAJ nego SKUP ADRESA — zato uz oznake ide i
 * poništavanje putanja. Sitemap nosi oznaku `lokali`, pa ga novi lokal
 * poništava sam.
 */
export function revalidirajSkupLokala() {
  ponisti(TAG.lokali)
  ponisti(TAG.preusmjerenja)
  revalidatePath("/", "layout")
}

/** Upisano novo preusmjerenje starog sluga. */
export function revalidirajPreusmjerenja() {
  ponisti(TAG.preusmjerenja)
}
