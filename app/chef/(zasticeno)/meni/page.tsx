import { redirect } from "next/navigation"

import { sviLokali } from "@/lib/chef/upiti"

/** Bez izabranog lokala nema šta da se uređuje — vodi na glavni. */
export default async function Meni() {
  const lokali = await sviLokali()
  const cilj =
    lokali.find((l) => l.glavni) ?? lokali.find((l) => l.stanje !== "zatvoren")

  if (!cilj) redirect("/chef/lokali")
  redirect(`/chef/meni/${cilj.slug}`)
}
