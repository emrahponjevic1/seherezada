import { revalidatePath, updateTag } from "next/cache"

import { TAG } from "./repo.postgres"

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
  updateTag(TAG.meni(lokalSlug))
}

/**
 * Opis, slika, alergeni ili oznake jela — jelo je isto u svim lokalima,
 * pa se poništavaju meniji SVIH.
 */
export function revalidirajJela() {
  updateTag(TAG.jela)
}

/** Naziv, opis ili redoslijed kategorije — pogađa sve menije. */
export function revalidirajKategorije() {
  updateTag(TAG.kategorije)
}

/**
 * Podaci lokala: adresa, telefon, radno vrijeme, Wolt, Glovo.
 * Pogađa i podnožje na svim stranicama i meni tog lokala.
 */
export function revalidirajLokal(lokalSlug: string) {
  updateTag(TAG.lokali)
  updateTag(TAG.meni(lokalSlug))
}

/**
 * Novi lokal, promjena sluga ili promjena glavnog lokala.
 *
 * Ovo ne mijenja samo SADRŽAJ nego SKUP ADRESA — zato uz oznake ide i
 * poništavanje putanja. Sitemap nosi oznaku `lokali`, pa ga novi lokal
 * poništava sam.
 */
export function revalidirajSkupLokala() {
  updateTag(TAG.lokali)
  updateTag(TAG.preusmjerenja)
  revalidatePath("/", "layout")
}

/** Upisano novo preusmjerenje starog sluga. */
export function revalidirajPreusmjerenja() {
  updateTag(TAG.preusmjerenja)
}
