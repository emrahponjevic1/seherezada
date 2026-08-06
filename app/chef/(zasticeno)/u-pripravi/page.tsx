import Link from "next/link"

/** Stavke navigacije koje još nemaju svoj ekran vode ovdje. */
export default function UPripravi() {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-10 text-center">
      <h1 className="text-2xl font-black font-poppins tracking-tight">
        V pripravi
      </h1>
      <p className="text-zinc-500 mt-2">
        Ta zaslon še ni pripravljen. Prihaja v enem od naslednjih korakov.
      </p>
      <Link
        href="/chef"
        className="inline-block mt-6 px-6 py-3 rounded-xl bg-shere-red text-white font-bold hover:bg-shere-darkred active:scale-95 transition-all"
      >
        Nazaj na pregled
      </Link>
    </div>
  )
}
