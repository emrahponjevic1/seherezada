/**
 * Pokreće migracije iz baza/migracije/ po redu imena.
 *
 * Vodi evidenciju u tabeli `migracije`, pa se već pokrenute preskaču —
 * naredba se može ponavljati bez straha.
 */

import { readdir, readFile } from "node:fs/promises"
import { join } from "node:path"
import pg from "pg"

// Migracije prave i mijenjaju tabele, pa traže vlasnika baze —
// `seherezada_admin` smije pisati U tabele, ali ih ne smije praviti.
const url = process.env.DATABASE_URL_MIGRACIJE
if (!url) {
  console.error("✗ Nedostaje DATABASE_URL_MIGRACIJE. Popuni .env.local.")
  process.exit(1)
}

const mapa = join(import.meta.dirname, "..", "baza", "migracije")
const klijent = new pg.Client({ connectionString: url })

await klijent.connect()

await klijent.query(`
  create table if not exists migracije (
    ime text primary key,
    pokrenuta timestamptz not null default now()
  )
`)

const { rows } = await klijent.query("select ime from migracije")
const vec = new Set(rows.map((r) => r.ime))

const fajlovi = (await readdir(mapa)).filter((f) => f.endsWith(".sql")).sort()

let novih = 0
for (const ime of fajlovi) {
  if (vec.has(ime)) {
    console.log(`  preskočeno  ${ime}`)
    continue
  }

  const sql = await readFile(join(mapa, ime), "utf8")
  try {
    await klijent.query(sql)
    await klijent.query("insert into migracije (ime) values ($1)", [ime])
    console.log(`  pokrenuto   ${ime}`)
    novih++
  } catch (greska) {
    console.error(`\n✗ ${ime} nije prošla:\n  ${greska.message}`)
    await klijent.end()
    process.exit(1)
  }
}

console.log(novih === 0 ? "\n✓ Baza je već ažurna." : `\n✓ Gotovo — ${novih} novih.`)
await klijent.end()
