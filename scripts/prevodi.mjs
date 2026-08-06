/**
 * Održavanje kataloga poruka (korak 22).
 *
 * Sedam jezika znači sedam fajlova. Dodavanje jednog natpisa ručno traži
 * sedam izmjena, a propust se primijeti tek kad gost vidi goli ključ na
 * stranici. Zato jedan izvor: spec fajl u kojem je ključ napisan jednom,
 * sa svih sedam prijevoda, a skripta ga razdijeli.
 *
 *   node scripts/prevodi.mjs dodaj <spec.json> [--sadrzaj]
 *   node scripts/prevodi.mjs provjeri [--sadrzaj]
 *
 * Bez zastavice radi nad `messages/` (natpisi), sa `--sadrzaj` nad
 * `messages/sadrzaj/` (proza stranica). Razlog za dva kataloga stoji u
 * lib/sadrzaj.ts: natpisi idu u preglednik, proza ne smije.
 *
 * Spec:  { "meni.naslov": { "sl": "...", "en": "...", ... } }
 */

import { readFileSync, writeFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const KORIJEN = join(dirname(fileURLToPath(import.meta.url)), "..")

// Redoslijed je i redoslijed u prekidaču — držimo ga usklađenim s JEZICI.
const JEZICI = ["sl", "en", "de", "bs", "tr", "ar", "zh"]

const SADRZAJ = process.argv.includes("--sadrzaj")
const MAPA = SADRZAJ
  ? join(KORIJEN, "messages", "sadrzaj")
  : join(KORIJEN, "messages")

function putanja(jezik) {
  return join(MAPA, `${jezik}.json`)
}

function ucitaj(jezik) {
  return JSON.parse(readFileSync(putanja(jezik), "utf8"))
}

/** Zapisuje s 2 razmaka i završnim redom — isto kako su fajlovi pisani ručno. */
function spremi(jezik, podaci) {
  writeFileSync(putanja(jezik), JSON.stringify(podaci, null, 2) + "\n", "utf8")
}

function dodaj(specPutanja) {
  const spec = JSON.parse(readFileSync(specPutanja, "utf8"))
  const kljucevi = Object.keys(spec)

  // Prvo provjera pa tek onda pisanje: bolje pasti prije nego ostaviti
  // tri jezika dopunjena a četiri ne.
  const greske = []
  for (const kljuc of kljucevi) {
    for (const jezik of JEZICI) {
      const vrijednost = spec[kljuc][jezik]
      if (typeof vrijednost !== "string" || !vrijednost.trim()) {
        greske.push(`  ${kljuc} → fali ${jezik}`)
      }
    }
  }
  if (greske.length) {
    console.error(`Spec nije potpun (${greske.length}):`)
    console.error(greske.join("\n"))
    process.exit(1)
  }

  for (const jezik of JEZICI) {
    const katalog = ucitaj(jezik)
    let novih = 0
    for (const kljuc of kljucevi) {
      if (!(kljuc in katalog)) novih++
      katalog[kljuc] = spec[kljuc][jezik]
    }
    spremi(jezik, katalog)
    console.log(
      `${jezik}: ${kljucevi.length} upisano (${novih} novih), ukupno ${Object.keys(katalog).length}`,
    )
  }
}

function provjeri() {
  const katalozi = Object.fromEntries(JEZICI.map((j) => [j, ucitaj(j)]))

  // Slovenski je referentni — on je izvorni jezik sajta.
  const referentni = Object.keys(katalozi.sl)
  let problema = 0

  for (const jezik of JEZICI) {
    if (jezik === "sl") continue
    const fale = referentni.filter((k) => !katalozi[jezik][k])
    const visak = Object.keys(katalozi[jezik]).filter(
      (k) => !referentni.includes(k),
    )
    if (fale.length) {
      problema += fale.length
      console.log(`${jezik}: fali ${fale.length} → ${fale.join(", ")}`)
    }
    if (visak.length) {
      problema += visak.length
      console.log(`${jezik}: višak ${visak.length} → ${visak.join(", ")}`)
    }
  }

  // Isti tekst na dva jezika je skoro uvijek zaboravljen prijevod, ali ne
  // uvijek — "Halal" i "Pizza" su namjerno isti. Zato upozorenje, ne greška.
  const sumnjivi = referentni.filter((k) => {
    const razliciti = new Set(JEZICI.map((j) => katalozi[j][k]))
    return razliciti.size === 1
  })
  if (sumnjivi.length) {
    console.log(
      `\nIsti tekst na svih 7 jezika (provjeri je li namjerno): ${sumnjivi.join(", ")}`,
    )
  }

  console.log(
    problema === 0
      ? `\nU redu — ${referentni.length} ključeva, svih ${JEZICI.length} jezika potpuno.`
      : `\n${problema} problema.`,
  )
  process.exit(problema === 0 ? 0 : 1)
}

const [naredba, argument] = process.argv.slice(2)
if (naredba === "dodaj" && argument) dodaj(argument)
else if (naredba === "provjeri") provjeri()
else {
  console.error("node scripts/prevodi.mjs dodaj <spec.json> | provjeri")
  process.exit(1)
}
