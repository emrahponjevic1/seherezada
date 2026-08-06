import type { Lang, Lokal } from "@/lib/domain"
import { formatRadnoVrijeme, t } from "@/lib/i18n"
import type { Dan } from "@/lib/domain"
import { href, type SharedPage } from "@/lib/route"

import {
  Dugmad,
  GrupaPitanja,
  Odjeljak,
  OkvirStranice,
  Pitanje,
  Srodne,
  type Mrvica,
} from "./dijelovi"
import { GalerijaFilter } from "./GalerijaFilter"
import {
  CAS_IN_LOKACIJA,
  HALAL_I_SASTOJCI,
  NAROCANJE_IN_CENE,
} from "./sadrzajFaq"

/**
 * Šest zajedničkih stranica — iste za sve lokale.
 *
 * Demo sadržaj je prihvatljiv; bitno je da struktura, hijerarhija naslova
 * i unutrašnje povezivanje rade. Nijedna stranica ne smije ostati siroče.
 */

const DANI_REDOM: Dan[] = ["pon", "uto", "sri", "cet", "pet", "sub", "ned"]

const KRATKI_DAN: Record<Dan, { sl: string; en: string }> = {
  pon: { sl: "Pon", en: "Mon" },
  uto: { sl: "Tor", en: "Tue" },
  sri: { sl: "Sre", en: "Wed" },
  cet: { sl: "Čet", en: "Thu" },
  pet: { sl: "Pet", en: "Fri" },
  sub: { sl: "Sob", en: "Sat" },
  ned: { sl: "Ned", en: "Sun" },
}

/** „Pon–Čet 09:00 – 02:00 · Pet–Sob 09:00 – 05:00 · Ned 10:00 – 05:00" */
export function sazetakVremena(lokal: Lokal, lang: Lang): string {
  const grupe: { od: Dan; do: Dan; vrijeme: string }[] = []

  for (const dan of DANI_REDOM) {
    const vrijeme = formatRadnoVrijeme(lokal.radnoVrijeme, dan, lang)
    const zadnja = grupe[grupe.length - 1]
    if (zadnja && zadnja.vrijeme === vrijeme) zadnja.do = dan
    else grupe.push({ od: dan, do: dan, vrijeme })
  }

  return grupe
    .map((g) => {
      const od = t(KRATKI_DAN[g.od], lang)
      const doo = t(KRATKI_DAN[g.do], lang)
      return `${g.od === g.do ? od : `${od}–${doo}`} ${g.vrijeme}`
    })
    .join(" · ")
}

// ─────────────────────────────────────────────────────────────

export function ZajednickaStranica({
  stranica,
  lokali,
  lang,
  glavniSlug,
}: {
  stranica: SharedPage
  lokali: Lokal[]
  lang: Lang
  glavniSlug: string
}) {
  const a = {
    domov: href({ kind: "lokal-home", lang, lokal: glavniSlug }, glavniSlug),
    meni: href(
      { kind: "lokal-page", lang, lokal: glavniSlug, page: "meni" },
      glavniSlug,
    ),
    halal: href({ kind: "shared", lang, page: "halal" }, glavniSlug),
    oNas: href({ kind: "shared", lang, page: "o-nas" }, glavniSlug),
    galerija: href({ kind: "shared", lang, page: "galerija" }, glavniSlug),
    faq: href({ kind: "shared", lang, page: "pogosta-vprasanja" }, glavniSlug),
    zasebnost: href({ kind: "shared", lang, page: "zasebnost" }, glavniSlug),
    pogoji: href({ kind: "shared", lang, page: "pogoji" }, glavniSlug),
    kebab: href({ kind: "seo", lang, page: "kebab-ljubljana" }, glavniSlug),
    falafel: href({ kind: "seo", lang, page: "falafel-ljubljana" }, glavniSlug),
    halalHrana: href(
      { kind: "seo", lang, page: "halal-hrana-ljubljana" },
      glavniSlug,
    ),
    nocna: href({ kind: "seo", lang, page: "nocna-hrana-ljubljana" }, glavniSlug),
    dostava: href({ kind: "seo", lang, page: "dostava-ljubljana" }, glavniSlug),
  }

  const domov = t({ sl: "Domov", en: "Home" }, lang)
  const uPogonu = lokali.filter((l) => l.stanje === "radi")

  const mrvice = (naziv: string): Mrvica[] => [
    { naziv: domov, adresa: a.domov },
    { naziv },
  ]

  switch (stranica) {
    // ── O nas ────────────────────────────────────────────────
    case "o-nas":
      return (
        <OkvirStranice
          mrvice={mrvice(t({ sl: "O nas", en: "About us" }, lang))}
          naslov={t({ sl: "O nas", en: "About us" }, lang)}
          uvod={t(
            {
              sl: "Šeherezada je družinski lokal, ki od leta 1998 pripravlja halal kebab in fast food v Ljubljani. Začeli smo z eno rezalno napravo na Trubarjevi, danes pa nas najdete na dveh naslovih, tretji pa se pripravlja.",
              en: "Šeherezada is a family-run place that has been serving halal kebab and fast food in Ljubljana since 1998. We started with a single vertical grill on Trubarjeva; today you will find us at two addresses, with a third on the way.",
            },
            lang,
          )}
        >
          <Odjeljak naslov={t({ sl: "Kako se je začelo", en: "How it started" }, lang)}>
            <p>
              {t(
                {
                  sl: "Prvi lokal je bil majhen prostor na Trubarjevi cesti, kjer je bilo prostora za dva človeka za pultom in nikogar več. Recept za marinado je prinesel dedek iz Istanbula in ga ni nikoli zapisal — vnuki so se ga naučili tako, da so gledali.",
                  en: "The first location was a small space on Trubarjeva with room for two people behind the counter and nobody else. The marinade recipe came from our grandfather in Istanbul and he never wrote it down — the grandchildren learned it by watching.",
                },
                lang,
              )}
            </p>
            <p>
              {t(
                {
                  sl: "Prvih nekaj let smo delali samo kebab. Pice so prišle leta 2006, ko smo v sosednji prostor postavili krušno peč, burgerji pa šele deset let kasneje, ko so jih gostje začeli pogosto spraševati.",
                  en: "For the first few years we made only kebab. Pizzas arrived in 2006, when we put a stone oven in the space next door, and burgers only ten years later, when guests started asking for them often.",
                },
                lang,
              )}
            </p>
          </Odjeljak>

          <Odjeljak
            naslov={t({ sl: "Kaj nas loči od drugih", en: "What sets us apart" }, lang)}
          >
            <p>
              {t(
                {
                  sl: "Meso režemo na roko, ne s strojem. To traja dlje in zahteva človeka ob napravi ves čas, a rezine so debelejše in ostanejo sočne. Kruh pečemo vsak dan zjutraj in ga razvozimo po lokalih, tako da nikoli ni od včeraj.",
                  en: "We carve the meat by hand, not with a machine. It takes longer and needs a person at the grill the whole time, but the slices are thicker and stay juicy. We bake the bread every morning and distribute it, so it is never from yesterday.",
                },
                lang,
              )}
            </p>
            <p>
              {t(
                {
                  sl: "Odprti smo dlje kot večina. Ob koncu tedna na Trubarjevi delamo do petih zjutraj, ker verjamemo, da mora biti dobra hrana na voljo tudi takrat, ko je večina kuhinj že zaprtih.",
                  en: "We stay open longer than most. At weekends the Trubarjeva location runs until five in the morning, because we believe good food should be available when most kitchens have long closed.",
                },
                lang,
              )}
            </p>
          </Odjeljak>

          <Odjeljak naslov={t({ sl: "Naša ekipa", en: "Our team" }, lang)}>
            <p>
              {t(
                {
                  sl: "Za pultom je enajst ljudi, od katerih jih je pet pri nas že več kot deset let. Kuhar, ki vodi pripravo mesa, je začel kot študent na počitniškem delu in ostal petnajst let.",
                  en: "There are eleven people behind the counter, five of whom have been with us for more than ten years. The chef who runs the meat preparation started as a student on a summer job and stayed fifteen years.",
                },
                lang,
              )}
            </p>
          </Odjeljak>

          <Odjeljak naslov={t({ sl: "Halal pristop", en: "Our halal approach" }, lang)}>
            <p>
              {t(
                {
                  sl: "Vse meso je halal, brez izjeme, in ga pripravljamo ločeno od vsega ostalega. V kuhinji ni svinjine in ne uporabljamo alkohola. Podrobneje o tem, od kod meso in kako ga obravnavamo, pišemo na svoji strani.",
                  en: "All meat is halal without exception, and we prepare it separately from everything else. There is no pork in the kitchen and we use no alcohol. We write in more detail about the sourcing and handling on its own page.",
                },
                lang,
              )}
            </p>
            <Dugmad
              stavke={[
                {
                  naziv: t({ sl: "Preberi o halalu", en: "Read about halal" }, lang),
                  adresa: a.halal,
                  glavno: true,
                },
              ]}
            />
          </Odjeljak>

          <Dugmad
            stavke={[
              {
                naziv: t({ sl: "Poglej meni", en: "See the menu" }, lang),
                adresa: a.meni,
                glavno: true,
              },
              {
                naziv: t({ sl: "Galerija", en: "Gallery" }, lang),
                adresa: a.galerija,
              },
              {
                naziv: t({ sl: "Pogosta vprašanja", en: "FAQ" }, lang),
                adresa: a.faq,
              },
            ]}
          />
        </OkvirStranice>
      )

    // ── Halal ────────────────────────────────────────────────
    case "halal":
      return (
        <OkvirStranice
          mrvice={mrvice("Halal")}
          naslov={t(
            { sl: "Halal pri Šeherezadi", en: "Halal at Šeherezada" },
            lang,
          )}
          uvod={t(
            {
              sl: "Vse meso pri nas je halal, in to velja za vsako jed na meniju — ne le za kebab, ampak tudi za burgerje in pice. Na tej strani piše, kaj to pomeni v praksi: od kod meso, kako ga obravnavamo in zakaj v kuhinji ni alkohola.",
              en: "All our meat is halal, and that applies to every dish on the menu — not just the kebab, but the burgers and pizzas too. This page explains what that means in practice: where the meat comes from, how we handle it, and why there is no alcohol in the kitchen.",
            },
            lang,
          )}
        >
          <Odjeljak naslov={t({ sl: "Kaj halal pomeni", en: "What halal means" }, lang)}>
            <p>
              {t(
                {
                  sl: "Halal pomeni, da je hrana pripravljena po pravilih, ki jih določa islamsko pravo. Pri mesu to zadeva način zakola in ravnanje z živaljo pred njim, pri vsem ostalem pa odsotnost prepovedanih sestavin — predvsem svinjine in alkohola.",
                  en: "Halal means food prepared according to the rules set out in Islamic law. For meat this concerns the method of slaughter and how the animal is treated beforehand; for everything else it means the absence of forbidden ingredients — above all pork and alcohol.",
                },
                lang,
              )}
            </p>
          </Odjeljak>

          <Odjeljak naslov={t({ sl: "Od kod meso", en: "Where the meat comes from" }, lang)}>
            <p>
              {t(
                {
                  sl: "Govedino in teletino nabavljamo pri dveh dobaviteljih iz Slovenije in Avstrije, oba imata veljaven halal certifikat. Piščanca dobivamo od tretjega. Certifikate preverjamo enkrat letno in ob vsaki menjavi dobavitelja.",
                  en: "We source beef and veal from two suppliers in Slovenia and Austria, both holding a valid halal certificate. Chicken comes from a third. We verify the certificates once a year and whenever we change supplier.",
                },
                lang,
              )}
            </p>
          </Odjeljak>

          <Odjeljak naslov={t({ sl: "Certifikat", en: "The certificate" }, lang)}>
            <p>
              {t(
                {
                  sl: "Certifikat visi na steni ob blagajni v vsakem lokalu, tako da ga lahko preberete, preden naročite. Če želite kopijo, jo osebje pošlje po elektronski pošti.",
                  en: "The certificate hangs on the wall beside the till in every location, so you can read it before ordering. If you would like a copy, the staff will send one by e-mail.",
                },
                lang,
              )}
            </p>
          </Odjeljak>

          <Odjeljak
            naslov={t({ sl: "Ločena priprava", en: "Separate preparation" }, lang)}
          >
            <p>
              {t(
                {
                  sl: "Ker v kuhinji sploh nimamo svinjine, navzkrižni stik ni mogoč. Meso ima svojo delovno površino, svoje deske in svoje nože, ki se ne uporabljajo za nič drugega. Vegetarijanske jedi imajo prav tako svojo pripravo.",
                  en: "Since there is no pork in the kitchen at all, cross-contact is not possible. The meat has its own work surface, its own boards and its own knives, used for nothing else. Vegetarian dishes also have their own preparation area.",
                },
                lang,
              )}
            </p>
          </Odjeljak>

          <Odjeljak naslov={t({ sl: "Brez alkohola", en: "No alcohol" }, lang)}>
            <p>
              {t(
                {
                  sl: "Alkohola ne uporabljamo nikjer — ne v omakah, ne v testu, ne v marinadah. Tudi kis je vinski nadomestek brez alkohola. Alkoholnih pijač ne točimo in jih ni na meniju.",
                  en: "We use no alcohol anywhere — not in sauces, not in dough, not in marinades. Even the vinegar is an alcohol-free substitute. We do not serve alcoholic drinks and they are not on the menu.",
                },
                lang,
              )}
            </p>
          </Odjeljak>

          <Odjeljak naslov={t({ sl: "Pogosta vprašanja", en: "Common questions" }, lang)}>
            <div className="space-y-3">
              {HALAL_I_SASTOJCI.slice(0, 4).map((p, i) => (
                <Pitanje key={i} pitanje={t(p.pitanje, lang)}>
                  {t(p.odgovor, lang)}
                </Pitanje>
              ))}
            </div>
          </Odjeljak>

          <Srodne
            naslov={t({ sl: "Poglejte še", en: "See also" }, lang)}
            stavke={[
              { naziv: t({ sl: "Kebab v Ljubljani", en: "Kebab in Ljubljana" }, lang), adresa: a.kebab },
              { naziv: t({ sl: "Falafel v Ljubljani", en: "Falafel in Ljubljana" }, lang), adresa: a.falafel },
              { naziv: t({ sl: "Halal hrana v Ljubljani", en: "Halal food in Ljubljana" }, lang), adresa: a.halalHrana },
              { naziv: t({ sl: "Cel meni", en: "Full menu" }, lang), adresa: a.meni },
            ]}
          />
        </OkvirStranice>
      )

    // ── Galerija ─────────────────────────────────────────────
    case "galerija": {
      const slike = [
        { grupa: "hrana", url: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&q=80", opis: { sl: "Döner kebab v svežem kruhu", en: "Döner kebab in fresh bread" } },
        { grupa: "hrana", url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80", opis: { sl: "Pica iz kamnite peči", en: "Pizza from the stone oven" } },
        { grupa: "hrana", url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80", opis: { sl: "Šehere burger z dvojno govedino", en: "Shehere burger with double beef" } },
        { grupa: "hrana", url: "https://images.unsplash.com/photo-1593010950930-741fb981f26a?w=800&q=80", opis: { sl: "Falafel plošča s humusom", en: "Falafel plate with hummus" } },
        { grupa: "lokal", url: "/rotisserie_hero.webp", opis: { sl: "Vertikalni žar na Trubarjevi", en: "The vertical grill on Trubarjeva" } },
        { grupa: "lokal", url: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&q=80", opis: { sl: "Pult lokala na Slovenski", en: "The counter at the Slovenska location" } },
        { grupa: "ekipa", url: "https://images.unsplash.com/photo-1593010950930-741fb981f26a?w=800&q=80", opis: { sl: "Priprava mesa pred odprtjem", en: "Preparing the meat before opening" } },
        { grupa: "ekipa", url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80", opis: { sl: "Peka kruha ob petih zjutraj", en: "Baking bread at five in the morning" } },
      ]

      return (
        <OkvirStranice
          mrvice={mrvice(t({ sl: "Galerija", en: "Gallery" }, lang))}
          naslov={t({ sl: "Galerija", en: "Gallery" }, lang)}
          uvod={t(
            {
              sl: "Fotografije jedi, prostorov in ljudi, ki stojijo za pultom. Slike so posnete v obeh lokalih, večina zgodaj zjutraj ali pozno zvečer, ko je najbolj mirno.",
              en: "Photographs of the food, the spaces and the people behind the counter. The pictures were taken in both locations, most of them early in the morning or late at night when it is quietest.",
            },
            lang,
          )}
        >
          <div className="max-w-none">
            <GalerijaFilter
              svi={t({ sl: "Vse", en: "All" }, lang)}
              grupe={[
                { kljuc: "hrana", naziv: t({ sl: "Hrana", en: "Food" }, lang) },
                { kljuc: "lokal", naziv: t({ sl: "Lokal", en: "Location" }, lang) },
                { kljuc: "ekipa", naziv: t({ sl: "Ekipa", en: "Team" }, lang) },
              ]}
            >
              {slike.map((s, i) => (
                <figure
                  key={i}
                  data-grupa={s.grupa}
                  className="rounded-2xl overflow-hidden border border-white/5 bg-white/5"
                >
                  <img
                    src={s.url}
                    alt={t(s.opis, lang)}
                    width={800}
                    height={600}
                    loading={i < 3 ? "eager" : "lazy"}
                    className="w-full aspect-[4/3] object-cover"
                  />
                  <figcaption className="p-4 text-sm text-muted-foreground">
                    {t(s.opis, lang)}
                  </figcaption>
                </figure>
              ))}
            </GalerijaFilter>
          </div>

          <Srodne
            naslov={t({ sl: "Poglejte še", en: "See also" }, lang)}
            stavke={[
              { naziv: t({ sl: "Cel meni", en: "Full menu" }, lang), adresa: a.meni },
              { naziv: t({ sl: "O nas", en: "About us" }, lang), adresa: a.oNas },
            ]}
          />
        </OkvirStranice>
      )
    }

    // ── Pogosta vprašanja ────────────────────────────────────
    case "pogosta-vprasanja": {
      const odgovorOVremenu = uPogonu
        .map((l) => `${l.naziv} — ${sazetakVremena(l, lang)}`)
        .join(" · ")

      return (
        <OkvirStranice
          mrvice={mrvice(t({ sl: "Pogosta vprašanja", en: "FAQ" }, lang))}
          naslov={t(
            { sl: "Pogosta vprašanja", en: "Frequently asked questions" },
            lang,
          )}
          uvod={t(
            {
              sl: "Zbrali smo štiriindvajset vprašanj, ki jih gostje postavljajo najpogosteje — o halalu in sestavinah, o delovnem času in lokacijah ter o naročanju in cenah. Če odgovora ne najdete, nas pokličite.",
              en: "We have collected the twenty-four questions guests ask most often — about halal and ingredients, about opening hours and locations, and about ordering and prices. If you cannot find your answer, give us a call.",
            },
            lang,
          )}
        >
          <GrupaPitanja
            naslov={t({ sl: "Halal in sestavine", en: "Halal and ingredients" }, lang)}
            pitanja={HALAL_I_SASTOJCI}
            lang={lang}
          />

          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-black font-poppins tracking-tight">
              {t(
                { sl: "Delovni čas in lokacija", en: "Opening hours and location" },
                lang,
              )}
            </h2>
            <div className="space-y-3">
              {/* Odgovor se izvodi iz radnog vremena i nabraja SVE lokale. */}
              <Pitanje
                pitanje={t({ sl: "Do kdaj ste odprti?", en: "How late are you open?" }, lang)}
              >
                {odgovorOVremenu}
              </Pitanje>
              {CAS_IN_LOKACIJA.map((p, i) => (
                <Pitanje key={i} pitanje={t(p.pitanje, lang)}>
                  {t(p.odgovor, lang)}
                </Pitanje>
              ))}
            </div>
          </section>

          <GrupaPitanja
            naslov={t({ sl: "Naročanje in cene", en: "Ordering and prices" }, lang)}
            pitanja={NAROCANJE_IN_CENE}
            lang={lang}
          />

          <Srodne
            naslov={t({ sl: "Poglejte še", en: "See also" }, lang)}
            stavke={[
              { naziv: "Halal", adresa: a.halal },
              { naziv: t({ sl: "Cel meni", en: "Full menu" }, lang), adresa: a.meni },
              { naziv: t({ sl: "Dostava", en: "Delivery" }, lang), adresa: a.dostava },
              { naziv: t({ sl: "Nočna hrana", en: "Late-night food" }, lang), adresa: a.nocna },
            ]}
          />
        </OkvirStranice>
      )
    }

    // ── Zasebnost ────────────────────────────────────────────
    case "zasebnost":
      return (
        <OkvirStranice
          mrvice={mrvice(t({ sl: "Zasebnost", en: "Privacy" }, lang))}
          naslov={t(
            { sl: "Varstvo osebnih podatkov", en: "Privacy policy" },
            lang,
          )}
          uvod={t(
            {
              sl: "Ta stran pojasnjuje, katere podatke zbiramo, zakaj jih zbiramo in kako dolgo jih hranimo. Vzorčno besedilo — pred objavo ga mora pregledati pravnik.",
              en: "This page explains which data we collect, why we collect it and how long we keep it. Sample text — it must be reviewed by a lawyer before publication.",
            },
            lang,
          )}
        >
          <Odjeljak naslov={t({ sl: "Upravljavec podatkov", en: "Data controller" }, lang)}>
            <p>
              {t(
                {
                  sl: "Upravljavec je Šeherezada d.o.o., Trubarjeva cesta 31, 1000 Ljubljana. Za vprašanja o osebnih podatkih pišite na naslov, naveden v nogi strani.",
                  en: "The controller is Šeherezada d.o.o., Trubarjeva cesta 31, 1000 Ljubljana. For questions about personal data, write to the address given in the footer.",
                },
                lang,
              )}
            </p>
          </Odjeljak>

          <Odjeljak naslov={t({ sl: "Kaj zbiramo", en: "What we collect" }, lang)}>
            <p>
              {t(
                {
                  sl: "Spletna stran ne zahteva registracije in ne zbira osebnih podatkov. Če nas pokličete ali naročite prek dostave, obdelamo le podatke, potrebne za izvedbo naročila.",
                  en: "The website requires no registration and collects no personal data. If you call us or order through delivery, we process only the data needed to fulfil the order.",
                },
                lang,
              )}
            </p>
          </Odjeljak>

          <Odjeljak naslov={t({ sl: "Piškotki", en: "Cookies" }, lang)}>
            <p>
              {t(
                {
                  sl: "Uporabljamo le tehnične piškotke, ki si zapomnijo izbrano temo in jezik. Sledilnih piškotkov in oglaševalskih orodij ne uporabljamo.",
                  en: "We use only technical cookies that remember your chosen theme and language. We use no tracking cookies and no advertising tools.",
                },
                lang,
              )}
            </p>
          </Odjeljak>

          <Odjeljak naslov={t({ sl: "Vaše pravice", en: "Your rights" }, lang)}>
            <p>
              {t(
                {
                  sl: "Imate pravico do vpogleda, popravka in izbrisa svojih podatkov ter do pritožbe pri Informacijskem pooblaščencu. Zahtevo obravnavamo v tridesetih dneh.",
                  en: "You have the right to access, correct and erase your data, and to lodge a complaint with the Information Commissioner. We handle requests within thirty days.",
                },
                lang,
              )}
            </p>
          </Odjeljak>

          <Srodne
            naslov={t({ sl: "Poglejte še", en: "See also" }, lang)}
            stavke={[
              { naziv: t({ sl: "Pogoji uporabe", en: "Terms of use" }, lang), adresa: a.pogoji },
              { naziv: t({ sl: "Pogosta vprašanja", en: "FAQ" }, lang), adresa: a.faq },
            ]}
          />
        </OkvirStranice>
      )

    // ── Pogoji ───────────────────────────────────────────────
    case "pogoji":
      return (
        <OkvirStranice
          mrvice={mrvice(t({ sl: "Pogoji", en: "Terms" }, lang))}
          naslov={t({ sl: "Pogoji uporabe", en: "Terms of use" }, lang)}
          uvod={t(
            {
              sl: "Pogoji naročanja, prevzema in dostave. Vzorčno besedilo — pred objavo ga mora pregledati pravnik.",
              en: "Terms of ordering, collection and delivery. Sample text — it must be reviewed by a lawyer before publication.",
            },
            lang,
          )}
        >
          <Odjeljak naslov={t({ sl: "Naročanje", en: "Ordering" }, lang)}>
            <p>
              {t(
                {
                  sl: "Naročila sprejemamo po telefonu in pri pultu. Naročilo je potrjeno, ko ga potrdi osebje. Za večje skupine priporočamo klic vsaj dve uri prej.",
                  en: "We take orders by phone and at the counter. An order is confirmed when the staff confirm it. For larger groups we recommend calling at least two hours ahead.",
                },
                lang,
              )}
            </p>
          </Odjeljak>

          <Odjeljak naslov={t({ sl: "Cene", en: "Prices" }, lang)}>
            <p>
              {t(
                {
                  sl: "Cene na spletni strani vključujejo davek in veljajo za lokal, ki je naveden na vrhu menija. Cene se med lokali razlikujejo. Pridržujemo si pravico do spremembe cen brez predhodnega obvestila.",
                  en: "Prices on the website include tax and apply to the location named at the top of the menu. Prices differ between locations. We reserve the right to change prices without prior notice.",
                },
                lang,
              )}
            </p>
          </Odjeljak>

          <Odjeljak naslov={t({ sl: "Dostava", en: "Delivery" }, lang)}>
            <p>
              {t(
                {
                  sl: "Dostava poteka prek Wolta in Glova, ki sta samostojna ponudnika. Za čas dostave in stanje pošiljke veljajo njihovi pogoji. Reklamacije zaradi kakovosti jedi sprejemamo tudi mi.",
                  en: "Delivery runs through Wolt and Glovo, which are independent providers. Their terms govern delivery times and the state of the order. We also accept complaints about food quality directly.",
                },
                lang,
              )}
            </p>
          </Odjeljak>

          <Odjeljak naslov={t({ sl: "Reklamacije", en: "Complaints" }, lang)}>
            <p>
              {t(
                {
                  sl: "Če z naročilom nekaj ni v redu, pokličite lokal, kjer ste naročili. Če je napaka naša, jed zamenjamo brez doplačila.",
                  en: "If something is wrong with your order, call the location where you ordered. If the mistake is ours, we replace the dish at no extra cost.",
                },
                lang,
              )}
            </p>
          </Odjeljak>

          <Srodne
            naslov={t({ sl: "Poglejte še", en: "See also" }, lang)}
            stavke={[
              { naziv: t({ sl: "Zasebnost", en: "Privacy" }, lang), adresa: a.zasebnost },
              { naziv: t({ sl: "Dostava", en: "Delivery" }, lang), adresa: a.dostava },
            ]}
          />
        </OkvirStranice>
      )
  }
}
