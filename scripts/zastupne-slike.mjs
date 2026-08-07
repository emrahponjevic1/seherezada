/**
 * Zastupne slike po kategoriji.
 *
 * Zašto postoji: 23 jela su dijelila ČETIRI kupljene fotografije, pa je piće
 * prikazivalo kebab. Gore od toga — adresa koju je koristilo 12 od 23 jela
 * vraćala je 404, tako da je pola menija imalo slomljenu sliku.
 *
 * Ovdje svaka kategorija dobija svoju fotografiju, obrađenu ISTIM postupkom
 * kao otpremanje u /chef (`lib/slike.ts`): obrez na 4:3, tri veličine, WebP
 * ispod 300 KB. Rezultat ide u `public/jela/`, jer su to zadane vrijednosti
 * koje pripadaju kodu — za razliku od `podaci/`, gdje idu prave fotografije
 * koje vlasnik otprema i koje se ne čuvaju u gitu.
 *
 * OVO SU PRIVREMENE SLIKE. Čim stignu prave fotografije hrane, otpremaju se
 * kroz /chef i prepisuju ove. Skripta ostaje da se vidi odakle je koja došla.
 *
 *   node scripts/zastupne-slike.mjs
 *
 * Izvor: Unsplash (besplatna licenca, dozvoljena komercijalna upotreba).
 */

import { mkdir, writeFile } from "node:fs/promises"
import { join } from "node:path"
import sharp from "sharp"

// SVAKA je pregledana okom prije nego je ušla ovdje — kategorija mora
// odgovarati onome što se stvarno vidi, i ništa ne smije prikazivati
// alkohol ni svinjetinu.
//
// Naučeno na svoju štetu: `1529692236671-f1f6cf9683ba` je stajao u kodu kao
// slika kebaba i vraćao je HTTP 200, pa je prošao bez pogleda. Na njemu je
// narezana pečenica sa viljuškom — nikakav kebab. Status 200 ne znači da je
// slika tačna; mora se otvoriti i pogledati.
const KATEGORIJE = {
  kebab: { foto: "1599487488170-d11ec9c172f0", opis: "meso na ražnjićima" },
  pice: { foto: "1513104890138-7c749659a591", opis: "pica iz krušne peći" },
  burgeri: { foto: "1568901346375-23c9450c58cd", opis: "burger s povrćem" },
  falafel: { foto: "1626700051175-6818013e1d4f", opis: "zavitak presječen na pola" },
  ostalo: { foto: "1562967916-eb82221dfb92", opis: "hrskavi zalogaji s umakom" },
  dodatki: { foto: "1573080496219-bb080dd4f877", opis: "pomfrit u korpici" },
  pijaca: { foto: "1581636625402-29b2a704ef13", opis: "gazirano piće s ledom" },
  meniji: { foto: "1594212699903-ec8a3eca50f5", opis: "burger s pomfritom" },
}

const VELICINE = [400, 800, 1600]
const CILJ_BAJTOVA = 300 * 1024
const ODREDISTE = join(process.cwd(), "public", "jela")

async function preuzmi(foto) {
  const odgovor = await fetch(
    `https://images.unsplash.com/photo-${foto}?w=1600&q=85`,
  )
  if (!odgovor.ok) {
    throw new Error(`${foto} → HTTP ${odgovor.status}`)
  }
  return Buffer.from(await odgovor.arrayBuffer())
}

/** Isti postupak kao `obradiIspremi` u lib/slike.ts. */
async function napravi(bajtovi, sirina) {
  let kvalitet = 82
  const obradi = () =>
    sharp(bajtovi)
      .rotate()
      .resize(sirina, Math.round((sirina * 3) / 4), {
        fit: "cover",
        position: "centre",
      })
      .webp({ quality: kvalitet })
      .toBuffer()

  let izlaz = await obradi()
  while (izlaz.byteLength > CILJ_BAJTOVA && kvalitet > 40) {
    kvalitet -= 10
    izlaz = await obradi()
  }
  return izlaz
}

let ukupno = 0

for (const [kategorija, { foto, opis }] of Object.entries(KATEGORIJE)) {
  const bajtovi = await preuzmi(foto)
  const mapa = join(ODREDISTE, kategorija)
  await mkdir(mapa, { recursive: true })

  const redovi = []
  for (const sirina of VELICINE) {
    const izlaz = await napravi(bajtovi, sirina)
    await writeFile(join(mapa, `${sirina}.webp`), izlaz)
    redovi.push(`${sirina}px ${(izlaz.byteLength / 1024).toFixed(0)}KB`)
    ukupno += izlaz.byteLength
  }

  console.log(`✓ ${kategorija.padEnd(9)} ${opis.padEnd(28)} ${redovi.join("  ")}`)
}

console.log(`\nUkupno ${(ukupno / 1024 / 1024).toFixed(2)} MB u public/jela/`)
