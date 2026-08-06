import Link from "next/link"

import { ObrazacLokala } from "@/components/chef/ObrazacLokala"

export default function NoviLokal() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/chef/lokali" className="text-sm text-zinc-500 hover:text-shere-red">
          ← Lokali
        </Link>
        <h1 className="text-3xl font-black font-poppins tracking-tight mt-1">
          Nov lokal
        </h1>
        <p className="text-zinc-500 mt-1">
          Nastane v stanju <strong>kmalu</strong> — na spletišču se pokaže kot
          kartica brez povezave, dokler ga ne postavite na <strong>deluje</strong>.
        </p>
      </div>

      <ObrazacLokala />
    </div>
  )
}
