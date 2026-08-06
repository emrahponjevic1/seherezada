import Link from "next/link"
import { notFound } from "next/navigation"

import { lokalPoSlugu, sviLokali } from "@/lib/chef/upiti"
import { ObrazacLokala } from "@/components/chef/ObrazacLokala"
import { KopirajLokal, ObrisiLokal } from "@/components/chef/RadnjeLokala"

export default async function UrediLokal({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const lokal = await lokalPoSlugu(slug)
  if (!lokal) notFound()

  const svi = await sviLokali()
  const ovaj = svi.find((l) => l.slug === slug)

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/chef/lokali"
          className="text-sm text-zinc-500 hover:text-shere-red"
        >
          ← Lokali
        </Link>
        <h1 className="text-3xl font-black font-poppins tracking-tight mt-1 flex items-center gap-2">
          {lokal.glavni && <span title="Glavni lokal">⭐</span>}
          {lokal.naziv}
        </h1>
        <p className="text-zinc-500 mt-1 font-mono text-sm">
          seherezada.net/{lokal.glavni ? "" : lokal.slug}
        </p>
      </div>

      <ObrazacLokala lokal={lokal} />

      <section className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4">
        <h2 className="font-black font-poppins text-lg">Kopiraj</h2>
        <p className="text-sm text-zinc-500">
          Najhitrejši način, da nov lokal dobi cel meni s cenami. Odpiranje
          novega lokala tako traja minute, ne ur.
        </p>
        <KopirajLokal izvor={lokal.slug} brojJela={ovaj?.brojJela ?? 0} />
      </section>

      <section className="bg-white border border-red-200 rounded-2xl p-6 space-y-4">
        <h2 className="font-black font-poppins text-lg text-red-700">
          Nevarno območje
        </h2>
        <ObrisiLokal slug={lokal.slug} glavni={lokal.glavni} />
      </section>
    </div>
  )
}
