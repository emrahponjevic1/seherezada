/**
 * Ugovor repozitorija.
 *
 * Komponente nikad ne znaju odakle podaci dolaze — traže „meni lokala X"
 * i dobiju ga. Zato je prelazak sa koda na bazu (korak 11) izmjena JEDNE
 * linije na dnu ovog fajla, a ne dvadesetak fajlova.
 *
 * Sve metode su `async` iako statička implementacija ne ide nigdje. Da nisu,
 * korak 11 bi morao prepraviti svaki poziv u projektu.
 */

import type {
  Jelo,
  Kategorija,
  Lokal,
  MenuSekcija,
  MenuStavka,
} from "./domain"

import { staticRepo } from "./repo.static"

export interface Repo {
  /** Lokali u stanju 'radi' i 'uskoro', poredani po `redoslijed`. */
  getLokali(): Promise<Lokal[]>

  getLokal(slug: string): Promise<Lokal | null>

  /** Lokal bez prefiksa u adresi. Tačno jedan takav postoji. */
  getGlavniLokal(): Promise<Lokal>

  getKategorije(): Promise<Kategorija[]>

  /** Meni jednog lokala. Prazne kategorije se izostavljaju u cjelini. */
  getMeni(lokalSlug: string): Promise<MenuSekcija[]>

  /** Jela označena kao `izdvojeno` — sekcija „Priljubljene izbire". */
  getIzdvojena(lokalSlug: string): Promise<MenuStavka[]>

  getJelo(slug: string): Promise<Jelo | null>

  /** Stari slug → novi slug, za trajno preusmjerenje (korak 14 ga puni). */
  getPreusmjerenje(stariSlug: string): Promise<string | null>
}

// Korak 11 mijenja SAMO ovu liniju: staticRepo → supabaseRepo
export const repo: Repo = staticRepo
