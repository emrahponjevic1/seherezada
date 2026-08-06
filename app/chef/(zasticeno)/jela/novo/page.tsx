import Link from "next/link"

import { sveKategorije } from "@/lib/chef/upiti"
import { ObrazacJela } from "@/components/chef/ObrazacJela"

export default async function NovoJelo() {
  const kategorije = await sveKategorije()

  return (
    <div className="space-y-6">
      <div>
        <Link href="/chef/jela" className="text-sm text-zinc-500 hover:text-shere-red">
          ← Jedi
        </Link>
        <h1 className="text-3xl font-black font-poppins tracking-tight mt-1">
          Nova jed
        </h1>
        <p className="text-zinc-500 mt-1">
          Nova jed se pojavi v katalogu, <strong>ne pa še v nobenem meniju</strong> —
          v meni jo dodate pri posameznem lokalu.
        </p>
      </div>

      <ObrazacJela kategorije={kategorije} />
    </div>
  )
}
