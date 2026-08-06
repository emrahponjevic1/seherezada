import Link from "next/link"
import { redirect } from "next/navigation"

import { trenutnaSesija } from "@/lib/auth"
import { odjaviSe } from "../odjava"

/**
 * Zaštićeni dio /chef.
 *
 * Prijava je NAMJERNO izvan ove grupe — da nije, i ona bi tražila
 * prijavu i nastao bi krug bez izlaza.
 *
 * Ovdje se sesija provjerava DRUGI put, poslije middlewarea. Ako se
 * middleware ikad promijeni ili zaobiđe, ekrani i dalje ostaju zatvoreni.
 */

const STAVKE = [
  { adresa: "/chef", naziv: "Pregled", spremno: true },
  { adresa: "/chef/lokali", naziv: "Lokali", spremno: true },
  { adresa: "/chef/jela", naziv: "Jedi", spremno: false },
  { adresa: "/chef/meni", naziv: "Meni in cene", spremno: false },
  { adresa: "/chef/nastavitve", naziv: "Nastavitve", spremno: false },
]

export default async function ZasticenoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const sesija = await trenutnaSesija()
  if (!sesija) redirect("/chef/prijava")

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-zinc-200 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <Link href="/chef" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-tr from-shere-red to-red-500 rounded-xl flex items-center justify-center text-white font-black rotate-3">
              Š
            </div>
            <span className="font-black font-poppins tracking-tight">
              Šeherezada
            </span>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">
              chef
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-500 hidden sm:inline">
              {sesija.email}
            </span>
            <form action={odjaviSe}>
              <button
                type="submit"
                className="text-sm font-semibold px-4 py-2 rounded-xl border border-zinc-300 hover:bg-zinc-100 active:scale-95 transition-all"
              >
                Odjava
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-6 py-8 flex gap-8 w-full flex-1">
        <nav className="w-48 shrink-0 hidden md:block">
          <ul className="space-y-1">
            {STAVKE.map((s) => (
              <li key={s.adresa}>
                <Link
                  href={s.spremno ? s.adresa : "/chef/u-pripravi"}
                  className="flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl hover:bg-zinc-200/60 font-semibold text-sm transition-colors"
                >
                  {s.naziv}
                  {!s.spremno && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      kmalu
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  )
}
