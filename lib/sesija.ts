/**
 * Sesija u potpisanom kolačiću.
 *
 * Nema tabele sesija: kolačić nosi sam podatak i HMAC potpis. Ako iko
 * promijeni sadržaj, potpis se ne poklapa i sesija pada.
 *
 * Koristi se Web Crypto, ne `node:crypto`, jer isti kod mora raditi i u
 * middlewareu (koji se izvršava na Edge okruženju) i na serveru.
 */

export const KOLACIC_SESIJE = "shere-sesija"

/** Sedam dana. Duže bi značilo da ukraden kolačić dugo vrijedi. */
const TRAJANJE_S = 7 * 24 * 60 * 60

export interface Sesija {
  id: string
  email: string
  /** Istek, u sekundama od epohe. */
  exp: number
}

function tajna(): string {
  const t = process.env.AUTH_SECRET
  if (!t || t.length < 32) {
    throw new Error(
      "AUTH_SECRET nedostaje ili je kraći od 32 znaka. Popuni .env.local.",
    )
  }
  return t
}

// ── base64url, bez oslanjanja na Buffer ─────────────────────

function uBase64Url(bajtovi: Uint8Array): string {
  let s = ""
  for (const b of bajtovi) s += String.fromCharCode(b)
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function izBase64Url(tekst: string): Uint8Array<ArrayBuffer> {
  const s = atob(tekst.replace(/-/g, "+").replace(/_/g, "/"))
  // Izričito nad ArrayBufferom: Web Crypto ne prima SharedArrayBuffer.
  const bajtovi = new Uint8Array(new ArrayBuffer(s.length))
  for (let i = 0; i < s.length; i++) bajtovi[i] = s.charCodeAt(i)
  return bajtovi
}

/** TextEncoder vraća pogled nad ArrayBufferLike — Web Crypto traži uži tip. */
function uBajtove(tekst: string): Uint8Array<ArrayBuffer> {
  const izvor = new TextEncoder().encode(tekst)
  const bajtovi = new Uint8Array(new ArrayBuffer(izvor.length))
  bajtovi.set(izvor)
  return bajtovi
}

async function kljuc(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    uBajtove(tajna()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  )
}

// ── Pravljenje i provjera ───────────────────────────────────

export async function napraviSesiju(
  id: string,
  email: string,
): Promise<{ vrijednost: string; trajanje: number }> {
  const sesija: Sesija = {
    id,
    email,
    exp: Math.floor(Date.now() / 1000) + TRAJANJE_S,
  }

  const tijelo = uBase64Url(uBajtove(JSON.stringify(sesija)))
  const potpis = await crypto.subtle.sign(
    "HMAC",
    await kljuc(),
    uBajtove(tijelo),
  )

  return {
    vrijednost: `${tijelo}.${uBase64Url(new Uint8Array(potpis))}`,
    trajanje: TRAJANJE_S,
  }
}

/** Vraća sesiju ako je potpis ispravan i nije istekla, inače `null`. */
export async function procitajSesiju(
  vrijednost: string | undefined,
): Promise<Sesija | null> {
  if (!vrijednost) return null

  const [tijelo, potpis] = vrijednost.split(".")
  if (!tijelo || !potpis) return null

  try {
    const valjan = await crypto.subtle.verify(
      "HMAC",
      await kljuc(),
      izBase64Url(potpis),
      uBajtove(tijelo),
    )
    if (!valjan) return null

    const sesija = JSON.parse(
      new TextDecoder().decode(izBase64Url(tijelo)),
    ) as Sesija

    if (!sesija.exp || sesija.exp < Math.floor(Date.now() / 1000)) return null
    return sesija
  } catch {
    return null
  }
}
