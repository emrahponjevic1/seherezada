/**
 * Traži slovenski tekst na stranicama drugih jezika.
 *
 * Izvor istine su KATALOZI i PODACI, ne moj spisak sumnjivih riječi —
 * ranija provjera je koristila dvanaest ručno izabranih fraza i zato
 * propustila opise jela. Ovdje se uzima svaka slovenska niska koja se
 * razlikuje od prijevoda na ciljni jezik; ako se ipak pojavi na stranici
 * tog jezika, to je curenje.
 */

import { readFileSync } from "node:fs"

const JEZICI = [
  { prefiks: "en", kod: "en" },
  { prefiks: "de", kod: "de" },
  { prefiks: "ba", kod: "bs" },
  { prefiks: "tr", kod: "tr" },
  { prefiks: "ar", kod: "ar" },
  { prefiks: "zh", kod: "zh" },
]

const PUTEVI = [
  "", "/meni", "/recenzije", "/o-nas", "/halal", "/galerija",
  "/pogosta-vprasanja", "/zasebnost", "/pogoji",
  "/kebab-ljubljana", "/pizza-ljubljana", "/burger-ljubljana",
  "/falafel-ljubljana", "/halal-hrana-ljubljana",
  "/nocna-hrana-ljubljana", "/dostava-ljubljana",
  "/studentski-meni-ljubljana",
]

/** Parovi sl → prijevod, iz oba kataloga i iz podataka o jelima. */
function parovi(kod) {
  const izlaz = []

  for (const mapa of ["messages", "messages/sadrzaj"]) {
    const sl = JSON.parse(readFileSync(`${mapa}/sl.json`, "utf8"))
    const ciljni = JSON.parse(readFileSync(`${mapa}/${kod}.json`, "utf8"))
    for (const [k, v] of Object.entries(sl)) {
      if (ciljni[k] && ciljni[k] !== v) izlaz.push(v)
    }
  }

  // Podaci o jelima: zapisi u izvoru, ne u katalogu.
  const podaci = readFileSync("lib/repo.static.ts", "utf8")
  const obrazac =
    /\{\s*sl:\s*"((?:[^"\\]|\\.)*)"[\s\S]*?zh:\s*"((?:[^"\\]|\\.)*)"\s*,?\s*\}/g
  let m
  while ((m = obrazac.exec(podaci))) {
    const naCilj = new RegExp(`\\b${kod}:\\s*"((?:[^"\\\\]|\\\\.)*)"`).exec(m[0])
    if (naCilj && naCilj[1] !== m[1]) izlaz.push(m[1])
  }

  // Kratke niske love slučajna poklapanja unutar drugih riječi.
  return [...new Set(izlaz)].filter((sl) => sl.length >= 12)
}

let ukupnoCurenja = 0

for (const jezik of JEZICI) {
  const tabela = parovi(jezik.kod)
  const nadjeno = new Map()

  for (const put of PUTEVI) {
    const odgovor = await fetch(`http://localhost:3000/${jezik.prefiks}${put}`)
    let html = await odgovor.text()

    // Skripte nose serijalizovane propse — nisu vidljiv tekst.
    html = html.replace(/<script[\s\S]*?<\/script>/g, "")

    for (const sl of tabela) {
      if (html.includes(sl)) {
        if (!nadjeno.has(sl)) nadjeno.set(sl, [])
        nadjeno.get(sl).push(put || "/")
      }
    }
  }

  ukupnoCurenja += nadjeno.size
  const oznaka = `/${jezik.prefiks}`.padEnd(5)
  if (nadjeno.size === 0) {
    console.log(`${oznaka} čisto — ${tabela.length} niski × ${PUTEVI.length} stranica`)
  } else {
    console.log(`${oznaka} CURI ${nadjeno.size}:`)
    for (const [sl, gdje] of nadjeno) {
      console.log(`   "${sl.slice(0, 62)}"  →  ${gdje.join(" ")}`)
    }
  }
}

console.log(
  ukupnoCurenja === 0
    ? "\nNijedan slovenski tekst ne curi na ostale jezike."
    : `\n${ukupnoCurenja} curenja.`,
)
