import { repo } from "@/lib/repo"
import { trenutnaSesija } from "@/lib/auth"

/** Pregled — ekrani za uređivanje stižu u koracima 14–17. */
export default async function Pregled() {
  const sesija = await trenutnaSesija()
  const [lokali, kategorije] = await Promise.all([
    repo.getLokali(),
    repo.getKategorije(),
  ])

  const uPogonu = lokali.filter((l) => l.stanje === "radi")
  const meniji = await Promise.all(uPogonu.map((l) => repo.getMeni(l.slug)))
  const jela = new Set(
    meniji.flatMap((m) => m.flatMap((s) => s.stavke.map((x) => x.jelo.slug))),
  )

  const kartice = [
    { naziv: "Lokali", broj: lokali.length, opis: `${uPogonu.length} v pogonu` },
    { naziv: "Kategorije", broj: kategorije.length, opis: "aktivnih" },
    { naziv: "Jedi v katalogu", broj: jela.size, opis: "na voljo" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black font-poppins tracking-tight">
          Pregled
        </h1>
        <p className="text-zinc-500 mt-1">
          Prijavljeni ste kot {sesija?.email}.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {kartice.map((k) => (
          <div
            key={k.naziv}
            className="bg-white border border-zinc-200 rounded-2xl p-6"
          >
            <p className="text-4xl font-black font-poppins text-shere-red">
              {k.broj}
            </p>
            <p className="font-bold mt-2">{k.naziv}</p>
            <p className="text-sm text-zinc-500">{k.opis}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl p-6">
        <h2 className="font-black font-poppins text-lg">Kaj sledi</h2>
        <p className="text-zinc-600 mt-2 leading-relaxed">
          Urejanje lokalov, jedi in cen prihaja v naslednjih korakih. Do takrat
          se podatki spreminjajo neposredno v bazi, spremembe pa so na strani
          vidne v nekaj sekundah.
        </p>
      </div>
    </div>
  )
}
