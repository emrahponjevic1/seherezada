import { NextResponse, type NextRequest } from "next/server"

import { KOLACIC_SESIJE, procitajSesiju } from "./lib/sesija"

/**
 * Zaštita /chef.
 *
 * Postavlja se NA OKVIR, ne na pojedinačne ekrane — tako je sve unutar
 * njega pokriveno automatski i ne može se zaboraviti jedna ruta.
 *
 * Middleware provjerava potpis sesije (Web Crypto radi i ovdje), ali to
 * nije jedina brana: `app/chef/layout.tsx` provjerava još jednom na
 * serveru. Pojas i tregeri.
 */
export async function proxy(zahtjev: NextRequest) {
  const { pathname, search } = zahtjev.nextUrl

  // Sama prijava mora ostati dostupna, inače nema kuda.
  if (pathname === "/chef/prijava") {
    return NextResponse.next()
  }

  const sesija = await procitajSesiju(
    zahtjev.cookies.get(KOLACIC_SESIJE)?.value,
  )

  if (!sesija) {
    const cilj = zahtjev.nextUrl.clone()
    cilj.pathname = "/chef/prijava"
    cilj.search = ""
    // Da poslije prijave vrati tamo gdje je korisnik i krenuo.
    cilj.searchParams.set("next", pathname + search)
    return NextResponse.redirect(cilj)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/chef", "/chef/:path*"],
}
