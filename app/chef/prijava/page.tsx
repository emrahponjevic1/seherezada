import { redirect } from "next/navigation"
import { cookies } from "next/headers"

import { prijaviKorisnika, trenutnaSesija } from "@/lib/auth"
import { KOLACIC_SESIJE, napraviSesiju } from "@/lib/sesija"

/**
 * Prijava. Namjerno bez registracije — nalozi se prave naredbom
 * `npm run korisnik`.
 */

export default async function Prijava({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; greska?: string }>
}) {
  const { next, greska } = await searchParams

  // Ko je već prijavljen nema šta tražiti na ovoj stranici.
  if (await trenutnaSesija()) redirect(next || "/chef")

  async function prijava(podaci: FormData) {
    "use server"

    const email = String(podaci.get("email") ?? "")
    const lozinka = String(podaci.get("lozinka") ?? "")
    const kamo = String(podaci.get("next") ?? "") || "/chef"

    const korisnik = await prijaviKorisnika(email, lozinka)

    if (!korisnik) {
      // Poruka NIKAD ne otkriva koje je od dvoje pogrešno.
      redirect(
        `/chef/prijava?greska=1${kamo ? `&next=${encodeURIComponent(kamo)}` : ""}`,
      )
    }

    const { vrijednost, trajanje } = await napraviSesiju(
      korisnik.id,
      korisnik.email,
    )

    const kolacici = await cookies()
    kolacici.set(KOLACIC_SESIJE, vrijednost, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: trajanje,
    })

    redirect(kamo)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 justify-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-tr from-shere-red to-red-500 rounded-2xl flex items-center justify-center text-white font-black text-2xl rotate-3">
            Š
          </div>
          <span className="text-2xl font-black font-poppins tracking-tight">
            Šeherezada
          </span>
        </div>

        <form
          action={prijava}
          className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm space-y-5"
        >
          <div>
            <h1 className="text-2xl font-black font-poppins tracking-tight">
              Prijava
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Urejanje menija in lokalov.
            </p>
          </div>

          {greska && (
            <p
              role="alert"
              className="text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
            >
              Napačen e-poštni naslov ali geslo.
            </p>
          )}

          <input type="hidden" name="next" value={next ?? "/chef"} />

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-semibold">
              E-poštni naslov
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              className="w-full px-4 py-3 rounded-xl border border-zinc-300 bg-white focus:outline-none focus:ring-2 focus:ring-shere-red/40 focus:border-shere-red"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="lozinka" className="text-sm font-semibold">
              Geslo
            </label>
            <input
              id="lozinka"
              name="lozinka"
              type="password"
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 rounded-xl border border-zinc-300 bg-white focus:outline-none focus:ring-2 focus:ring-shere-red/40 focus:border-shere-red"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-shere-red text-white font-bold hover:bg-shere-darkred active:scale-95 transition-all"
          >
            Prijava
          </button>

          {/* Brez Supabasea ni pošiljanja e-pošte — geslo se ponastavi
              z ukazom `npm run korisnik`. */}
          <p className="text-xs text-zinc-500 text-center pt-1">
            Pozabljeno geslo ponastavi skrbnik sistema.
          </p>
        </form>
      </div>
    </div>
  )
}
