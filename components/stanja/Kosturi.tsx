import { KONTEJNER, SEKCIJA } from "@/lib/stil"
/**
 * Kosturi koji stoje umjesto sadržaja dok se učitava.
 *
 * Moraju imati ISTE dimenzije kao ono što zamjenjuju — inače sadržaj
 * poskoči kad stigne. Koriste se samo `bg-muted/40` i `animate-pulse`
 * koji već postoje; nijedna nova boja ni animacija.
 */

export function KosturKartice() {
  return (
    <div className="rounded-2xl border border-white/5 overflow-hidden">
      <div className="w-full aspect-[4/3] bg-muted/40 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-5 w-3/4 rounded-lg bg-muted/40 animate-pulse" />
        <div className="h-4 w-full rounded-lg bg-muted/40 animate-pulse" />
        <div className="h-4 w-2/3 rounded-lg bg-muted/40 animate-pulse" />
        <div className="h-6 w-20 rounded-lg bg-muted/40 animate-pulse" />
      </div>
    </div>
  )
}

export function KosturSekcije({ kartica = 4 }: { kartica?: number }) {
  return (
    <section className={`${KONTEJNER} ${SEKCIJA}`}>
      <div className="h-10 w-64 rounded-xl bg-muted/40 animate-pulse mb-4" />
      <div className="h-5 w-96 max-w-full rounded-lg bg-muted/40 animate-pulse mb-10" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: kartica }).map((_, i) => (
          <KosturKartice key={i} />
        ))}
      </div>
    </section>
  )
}

export function KosturRecenzija({ koliko = 3 }: { koliko?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: koliko }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-white/5 p-6 space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted/40 animate-pulse" />
            <div className="h-4 w-28 rounded-lg bg-muted/40 animate-pulse" />
          </div>
          <div className="h-4 w-24 rounded-lg bg-muted/40 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded-lg bg-muted/40 animate-pulse" />
            <div className="h-4 w-full rounded-lg bg-muted/40 animate-pulse" />
            <div className="h-4 w-1/2 rounded-lg bg-muted/40 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}
