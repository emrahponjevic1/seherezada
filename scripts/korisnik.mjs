/**
 * Pravi ili mijenja nalog za /chef.
 *
 *   npm run korisnik -- vlasnik@seherezada.net "lozinka" "Ime Prezime"
 *
 * Registracije kroz sučelje namjerno nema — nalozi se prave ovako, i
 * ovako se mijenja zaboravljena lozinka.
 */

import { randomBytes, scrypt } from "node:crypto"
import { promisify } from "node:util"
import pg from "pg"

const scryptAsync = promisify(scrypt)

const [email, lozinka, ime] = process.argv.slice(2)

if (!email || !lozinka) {
  console.error("Upotreba: npm run korisnik -- <email> <lozinka> [ime]")
  process.exit(1)
}

if (lozinka.length < 10) {
  console.error("✗ Lozinka mora imati bar 10 znakova.")
  process.exit(1)
}

const url = process.env.DATABASE_URL_ADMIN
if (!url) {
  console.error("✗ Nedostaje DATABASE_URL_ADMIN. Popuni .env.local.")
  process.exit(1)
}

const sol = randomBytes(16)
const hes = await scryptAsync(lozinka, sol, 64, { N: 16384 })
const zapis = `scrypt$${sol.toString("hex")}$${hes.toString("hex")}`

const klijent = new pg.Client({ connectionString: url })
await klijent.connect()

const { rows } = await klijent.query(
  `insert into korisnici (email, lozinka_hash, ime)
   values ($1, $2, $3)
   on conflict (email) do update set
     lozinka_hash = excluded.lozinka_hash,
     ime = coalesce(excluded.ime, korisnici.ime),
     aktivan = true
   returning email, (xmax = 0) as nov`,
  [email.trim().toLowerCase(), zapis, ime ?? null],
)

console.log(
  rows[0].nov
    ? `✓ Nalog napravljen: ${rows[0].email}`
    : `✓ Lozinka promijenjena: ${rows[0].email}`,
)

await klijent.end()
