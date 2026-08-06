import { Pool } from "pg"

/**
 * Veze prema bazi.
 *
 * DVIJE, namjerno:
 *   `baza`      — uloga koja SAMO ČITA. Njome radi javni sajt.
 *   `bazaAdmin` — uloga koja i piše. Njome radi /chef i seed.
 *
 * Ako javni dio sajta ikad pokuša pisati, baza odbije upit. Zaštita
 * ostaje i onda kad kod zataji. Admin veza NIKAD ne smije doći u kod
 * koji stiže u preglednik.
 *
 * Na serveru se mijenja samo `DATABASE_URL` — nijedna linija koda.
 */

declare global {
  // U razvoju se moduli ponovo učitavaju pri svakoj izmjeni; bez ovoga
  // bi svaki put nastao nov bazen veza dok se baza ne uguši.
  var _bazaPool: Pool | undefined
  var _bazaAdminPool: Pool | undefined
}

function napraviPool(url: string | undefined, koja: string): Pool {
  if (!url) {
    throw new Error(
      `Nedostaje ${koja}. Kopiraj .env.example u .env.local i popuni ga.`,
    )
  }
  return new Pool({
    connectionString: url,
    max: 10,
    idleTimeoutMillis: 30_000,
  })
}

export function baza(): Pool {
  if (!globalThis._bazaPool) {
    globalThis._bazaPool = napraviPool(process.env.DATABASE_URL, "DATABASE_URL")
  }
  return globalThis._bazaPool
}

export function bazaAdmin(): Pool {
  if (!globalThis._bazaAdminPool) {
    globalThis._bazaAdminPool = napraviPool(
      process.env.DATABASE_URL_ADMIN,
      "DATABASE_URL_ADMIN",
    )
  }
  return globalThis._bazaAdminPool
}

/** Upit nad vezom za čitanje. */
export async function upit<T extends Record<string, unknown>>(
  sql: string,
  parametri: unknown[] = [],
): Promise<T[]> {
  const rezultat = await baza().query(sql, parametri)
  return rezultat.rows as T[]
}

/** Upit nad vezom koja smije pisati. */
export async function upitAdmin<T extends Record<string, unknown>>(
  sql: string,
  parametri: unknown[] = [],
): Promise<T[]> {
  const rezultat = await bazaAdmin().query(sql, parametri)
  return rezultat.rows as T[]
}
