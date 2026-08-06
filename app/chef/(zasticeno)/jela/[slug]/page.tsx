import Link from "next/link"
import { notFound } from "next/navigation"

import { jeloPoSlugu, svaJela, sveKategorije } from "@/lib/chef/upiti"
import { t } from "@/lib/i18n"
import { ObrazacJela } from "@/components/chef/ObrazacJela"
import { KopirajJelo } from "@/components/chef/KopirajJelo"

export default async function UrediJelo({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [jelo, kategorije, sva] = await Promise.all([
    jeloPoSlugu(slug),
    sveKategorije(),
    svaJela(),
  ])
  if (!jelo) notFound()

  const uLokala = sva.find((j) => j.slug === slug)?.uLokala ?? 0

  return (
    <div className="space-y-8">
      <div>
        <Link href="/chef/jela" className="text-sm text-zinc-500 hover:text-shere-red">
          ← Jedi
        </Link>
        <h1 className="text-3xl font-black font-poppins tracking-tight mt-1">
          {t(jelo.naziv, "sl")}
        </h1>
        <p className="text-zinc-500 mt-1">
          {uLokala === 0 ? (
            <span className="text-amber-700 font-semibold">
              Ta jed ni v nobenem meniju.
            </span>
          ) : (
            <>
              V meniju <strong>{uLokala}</strong>{" "}
              {uLokala === 1 ? "lokala" : "lokalov"}. Sprememba opisa velja
              povsod.
            </>
          )}
        </p>
      </div>

      <ObrazacJela jelo={jelo} kategorije={kategorije} />

      <section className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4">
        <h2 className="font-black font-poppins text-lg">Kopiraj</h2>
        <KopirajJelo izvor={jelo.slug} />
      </section>
    </div>
  )
}
