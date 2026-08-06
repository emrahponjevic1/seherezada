"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { KOLACIC_SESIJE } from "@/lib/sesija"

/** Briše sesiju i vraća na prijavu. */
export async function odjaviSe() {
  const kolacici = await cookies()
  kolacici.delete(KOLACIC_SESIJE)
  redirect("/chef/prijava")
}
