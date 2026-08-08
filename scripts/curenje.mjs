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

// Spisak mora pratiti SHARED_PAGES i SEO_PAGES iz lib/route.ts. Nova
// stranica koja se ovdje ne doda ne biva provjerena, a skener i dalje
// javlja „čisto" — pa izgleda kao da je sve u redu.
const PUTEVI = [
  "", "/meni", "/recenzije", "/o-nas", "/halal", "/galerija",
  "/blog", "/kontakt",
  "/pogosta-vprasanja", "/zasebnost", "/pogoji",
  "/kebab-ljubljana", "/doner-ljubljana", "/pizza-ljubljana",
  "/burger-ljubljana", "/falafel-ljubljana", "/halal-hrana-ljubljana",
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

/**
 * Koji server se provjerava.
 *
 * Bio je ukucan `localhost:3000`, a to je port na kojem obično stoji
 * `next dev`. Skener je tako provjeravao razvojni server umjesto gradnje
 * koja se upravo pravi — i znao je javiti curenje koje u gradnji ne
 * postoji, ili prećutati ono koje postoji. Rezultat je izgledao
 * mjerodavno, a nije bio.
 *
 *   PORT=3100 npm run curenje
 */
const PORT = process.env.PORT ?? "3000"
const OSNOVA = `http://localhost:${PORT}`

let ukupnoCurenja = 0

for (const jezik of JEZICI) {
  const tabela = parovi(jezik.kod)
  const nadjeno = new Map()

  for (const put of PUTEVI) {
    const odgovor = await fetch(`${OSNOVA}/${jezik.prefiks}${put}`)
    if (!odgovor.ok) {
      console.error(
        `  ✗ ${OSNOVA}/${jezik.prefiks}${put} → HTTP ${odgovor.status}`,
      )
      process.exitCode = 1
      continue
    }
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
