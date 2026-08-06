import type { Metadata, Viewport } from "next"
import { Poppins, Inter } from "next/font/google"
import "./globals.css"

import { JEZICI } from "@/lib/domain"
import { ThemeProvider } from "@/providers/ThemeProvider"
import { BackgroundPattern } from "@/components/BackgroundPattern"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { MobileCTA } from "@/components/layout/MobileCTA"

const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700", "800", "900"],
  display: "swap",
  variable: "--font-poppins",
})

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Šeherezada | Najboljši Kebab & Fast Food v Ljubljani",
  description:
    "Avtentični turški kebab, pice, burgerji in falafel v srcu Ljubljane. Naruči odmah!",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Šeherezada | Najboljši Kebab v Ljubljani",
    description: "Avtentični turški kebab, pice in burgerji v srcu Ljubljane.",
    images: [
      "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=1200&q=80",
    ],
  },
}

// Bez maximum-scale — zumiranje prstima mora ostati moguće.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

// Blokirajuća skripta: postavlja klasu teme prije prvog iscrtavanja,
// da nema bljeska pogrešne teme pri osvježavanju.
const temaSkripta = `
(function(){try{
  var t=localStorage.getItem('shere-theme')||'dark';
  if(t==='system')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
  document.documentElement.classList.add(t);
}catch(e){document.documentElement.classList.add('dark')}
})()`

/**
 * Jezik i smjer pisma na <html> (korak 22).
 *
 * ZAŠTO SKRIPTOM: `<html>` smije iscrtati samo korijenski raspored, a on
 * ne vidi rutu — sve adrese idu kroz jedan catch-all, pa `app/layout.tsx`
 * nema `params`. Jedina alternativa je `headers()`, ali on cijelu
 * aplikaciju prebacuje na dinamičko iscrtavanje i gubi svih 140 unaprijed
 * izgrađenih stranica. Skripta je blokirajuća i stoji prije stilova, pa
 * arapski `dir="rtl"` stigne PRIJE prvog iscrtavanja — nema bljeska.
 *
 * Sadržaj stranice svejedno nosi ispravan `lang` u serverskom HTML-u
 * (vidi `app/[[...slug]]/page.tsx`), a ciljanje jezika Googleu daje
 * `hreflang`, ne ovaj atribut.
 */
const MAPA_JEZIKA = Object.fromEntries(
  JEZICI.filter((j) => j.prefiks).map((j) => [
    j.prefiks as string,
    { lang: j.kod, dir: (j as { smjer?: string }).smjer === "rtl" ? "rtl" : "ltr" },
  ]),
)

const jezikSkripta = `
(function(){try{
  var m=${JSON.stringify(MAPA_JEZIKA)};
  var j=m[location.pathname.split('/')[1]]||{lang:'sl',dir:'ltr'};
  document.documentElement.lang=j.lang;
  document.documentElement.dir=j.dir;
}catch(e){}})()`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="sl"
      dir="ltr"
      suppressHydrationWarning
      className={`${poppins.variable} ${inter.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: temaSkripta }} />
        <script dangerouslySetInnerHTML={{ __html: jezikSkripta }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Restaurant",
              name: "Šeherezada",
              image:
                "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=1200&q=80",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Trubarjeva cesta 31",
                addressLocality: "Ljubljana",
                postalCode: "1000",
                addressCountry: "SI",
              },
              telephone: "+38669444812",
              servesCuisine: "Turkish, Fast Food",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.5",
                reviewCount: "1914",
              },
            }),
          }}
        />
      </head>
      <body>
        <ThemeProvider defaultTheme="dark" storageKey="shere-theme">
            <div className="min-h-screen flex flex-col relative w-full selection:bg-shere-red selection:text-white bg-background">
              {/* Sadržaj: leži iznad podnožja i pri kraju skrolanja ga otkriva */}
              <div className="relative z-20 flex flex-col w-full bg-background rounded-b-none lg:rounded-b-[4rem] shadow-[0_30px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden">
                {/* Pozadina: animirani SVG na desktopu, laka statična slika na mobitelu */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-10 invert dark:invert-0 lg:hidden bg-[url('/fast_food_pattern.webp')] bg-repeat bg-[length:180px_180px]" />
                <div className="absolute inset-0 z-0 pointer-events-none hidden lg:block">
                  <BackgroundPattern />
                </div>

                {/* Zrnasti sloj — mix-blend isključen na mobitelu zbog GPU-a */}
                <div className="absolute inset-0 z-0 pointer-events-none bg-noise opacity-[0.03] lg:mix-blend-overlay lg:opacity-50" />

                <Navbar />

                <main className="w-full relative z-10">{children}</main>
              </div>

              {/* Podnožje — jedna instanca. Na desktopu ga sticky drži pri dnu,
                  pa ga sadržaj otkriva na kraju skrolanja (bez JS mjerenja). */}
              <div className="w-full pb-5 lg:pb-0 lg:sticky lg:bottom-0 z-10">
                <Footer />
              </div>

              <div className="relative z-50">
                <MobileCTA />
              </div>
            </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
