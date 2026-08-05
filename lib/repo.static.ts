/**
 * Statička implementacija repozitorija nad DEMO podacima.
 *
 * Podaci su izmišljeni i služe da se sistem popuni u cjelini — tri lokala,
 * osam kategorija, dvadeset i tri jela, sva polja popunjena. Prava ponuda
 * dolazi kroz /chef (koraci 14–16), a baza u koraku 11.
 *
 * Ovaj fajl ostaje u projektu i poslije prelaska na bazu: koristan je za
 * rad bez baze i kao živa dokumentacija ugovora `Repo`.
 */

import type {
  Jelo,
  Kategorija,
  Lokal,
  MenuSekcija,
  MenuStavka,
  Preusmjerenje,
  RadnoVrijeme,
} from "./domain"

// ─────────────────────────────────────────────────────────────
//  Slike — zastupne, do pravih fotografija (korak 17)
// ─────────────────────────────────────────────────────────────

const SLIKA = {
  kebab:
    "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&q=80",
  pica: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
  burger:
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
  ostalo:
    "https://images.unsplash.com/photo-1593010950930-741fb981f26a?w=800&q=80",
} as const

// ─────────────────────────────────────────────────────────────
//  Kategorije
// ─────────────────────────────────────────────────────────────

const KATEGORIJE: Kategorija[] = [
  {
    id: "kat-kebab",
    slug: "kebab",
    naziv: { sl: "Kebab", en: "Kebab" },
    opis: {
      sl: "Meso z vertikalnega žara, rezano na roko in postreženo v svežem kruhu.",
      en: "Meat from the vertical grill, hand-carved and served in fresh bread.",
    },
    redoslijed: 1,
    aktivna: true,
  },
  {
    id: "kat-pice",
    slug: "pice",
    naziv: { sl: "Pice", en: "Pizza" },
    opis: {
      sl: "Testo, ki vzhaja 24 ur, pečeno na kamniti plošči.",
      en: "Dough proofed for 24 hours, baked on a stone slab.",
    },
    redoslijed: 2,
    aktivna: true,
  },
  {
    id: "kat-burgeri",
    slug: "burgeri",
    naziv: { sl: "Burgerji", en: "Burgers" },
    opis: {
      sl: "Sveže mleto meso in doma pečene žemlje.",
      en: "Freshly ground meat and house-baked buns.",
    },
    redoslijed: 3,
    aktivna: true,
  },
  {
    id: "kat-falafel",
    slug: "falafel",
    naziv: { sl: "Falafel", en: "Falafel" },
    opis: {
      sl: "Čičerika, sveža zelišča in sezam — brez mesa.",
      en: "Chickpeas, fresh herbs and sesame — meat free.",
    },
    redoslijed: 4,
    aktivna: true,
  },
  {
    id: "kat-ostalo",
    slug: "ostalo",
    naziv: { sl: "Ostalo", en: "Other" },
    redoslijed: 5,
    aktivna: true,
  },
  {
    id: "kat-dodatki",
    slug: "dodatki",
    naziv: { sl: "Dodatki", en: "Sides" },
    redoslijed: 6,
    aktivna: true,
  },
  {
    id: "kat-pijaca",
    slug: "pijaca",
    naziv: { sl: "Pijača", en: "Drinks" },
    redoslijed: 7,
    aktivna: true,
  },
  {
    id: "kat-meniji",
    slug: "meniji",
    naziv: { sl: "Meniji", en: "Combo meals" },
    opis: {
      sl: "Glavna jed, priloga in pijača po ugodnejši ceni.",
      en: "Main course, side and a drink at a better price.",
    },
    redoslijed: 8,
    aktivna: true,
  },
]

// ─────────────────────────────────────────────────────────────
//  Jela — katalog brenda, BEZ cijena
// ─────────────────────────────────────────────────────────────

const JELA: Jelo[] = [
  // ── Kebab ──────────────────────────────────────────────────
  {
    id: "jelo-doner-kebab",
    slug: "doner-kebab",
    kategorijaId: "kat-kebab",
    naziv: { sl: "Döner Kebab", en: "Döner Kebab" },
    opis: {
      sl: "Tradicionalni turški döner v svežem kruhu, z jogurtovim prelivom.",
      en: "Traditional Turkish döner in fresh bread with yogurt sauce.",
    },
    sastojci: {
      sl: ["Govedina in teletina", "Zelje", "Paradižnik", "Čebula", "Jogurtov preliv"],
      en: ["Beef and veal", "Cabbage", "Tomato", "Onion", "Yogurt sauce"],
    },
    alergeni: ["gluten", "laktoza", "sezam"],
    slikaUrl: SLIKA.kebab,
    slikaAlt: {
      sl: "Döner kebab v svežem kruhu",
      en: "Döner kebab in fresh bread",
    },
    halal: true,
    vegetarijansko: false,
    vegansko: false,
    ljuto: 0,
    kalorije: 620,
    aktivno: true,
  },
  {
    id: "jelo-kebab-jufka",
    slug: "kebab-jufka",
    kategorijaId: "kat-kebab",
    naziv: { sl: "Kebab v jufki", en: "Kebab in yufka" },
    opis: {
      sl: "Tanka jufka, zavita okrog mesa in sveže zelenjave.",
      en: "Thin yufka flatbread wrapped around meat and fresh vegetables.",
    },
    sastojci: {
      sl: ["Govedina in teletina", "Jufka", "Solata", "Paradižnik", "Česnov preliv"],
      en: ["Beef and veal", "Yufka", "Lettuce", "Tomato", "Garlic sauce"],
    },
    alergeni: ["gluten", "laktoza"],
    slikaUrl: SLIKA.kebab,
    slikaAlt: { sl: "Kebab v tanki jufki", en: "Kebab in thin yufka" },
    halal: true,
    vegetarijansko: false,
    vegansko: false,
    ljuto: 0,
    kalorije: 680,
    aktivno: true,
  },
  {
    id: "jelo-durum-kebab",
    slug: "durum-kebab",
    kategorijaId: "kat-kebab",
    naziv: { sl: "Dürüm Kebab", en: "Dürüm Kebab" },
    opis: {
      sl: "Tesno zavit dürüm z ostrejšim prelivom in pečeno papriko.",
      en: "Tightly rolled dürüm with a spicier sauce and roasted pepper.",
    },
    sastojci: {
      sl: ["Govedina in teletina", "Pečena paprika", "Čebula", "Pikantni preliv"],
      en: ["Beef and veal", "Roasted pepper", "Onion", "Spicy sauce"],
    },
    alergeni: ["gluten", "laktoza"],
    slikaUrl: SLIKA.kebab,
    slikaAlt: { sl: "Zavit dürüm kebab", en: "Rolled dürüm kebab" },
    halal: true,
    vegetarijansko: false,
    vegansko: false,
    ljuto: 1,
    kalorije: 700,
    aktivno: true,
  },
  {
    id: "jelo-kebab-plosca",
    slug: "kebab-plosca",
    kategorijaId: "kat-kebab",
    naziv: { sl: "Kebab plošča", en: "Kebab plate" },
    opis: {
      sl: "Večja porcija mesa s pomfrijem, solato in dvema prelivoma.",
      en: "A larger portion of meat with fries, salad and two sauces.",
    },
    sastojci: {
      sl: ["Govedina in teletina", "Pomfri", "Sezonska solata", "Dva preliva"],
      en: ["Beef and veal", "Fries", "Seasonal salad", "Two sauces"],
    },
    alergeni: ["laktoza", "sezam"],
    slikaUrl: SLIKA.kebab,
    slikaAlt: { sl: "Kebab plošča s prilogami", en: "Kebab plate with sides" },
    halal: true,
    vegetarijansko: false,
    vegansko: false,
    ljuto: 0,
    kalorije: 950,
    aktivno: true,
  },

  // ── Pice ───────────────────────────────────────────────────
  {
    id: "jelo-margerita",
    slug: "margerita",
    kategorijaId: "kat-pice",
    naziv: { sl: "Margerita", en: "Margherita" },
    opis: {
      sl: "Paradižnikova osnova, mocarela in sveža bazilika.",
      en: "Tomato base, mozzarella and fresh basil.",
    },
    sastojci: {
      sl: ["Paradižnikova omaka", "Mocarela", "Bazilika", "Oljčno olje"],
      en: ["Tomato sauce", "Mozzarella", "Basil", "Olive oil"],
    },
    alergeni: ["gluten", "laktoza"],
    slikaUrl: SLIKA.pica,
    slikaAlt: { sl: "Pica margerita", en: "Margherita pizza" },
    halal: true,
    vegetarijansko: true,
    vegansko: false,
    ljuto: 0,
    kalorije: 780,
    aktivno: true,
  },
  {
    id: "jelo-capricciosa",
    slug: "capricciosa",
    kategorijaId: "kat-pice",
    naziv: { sl: "Capricciosa", en: "Capricciosa" },
    opis: {
      sl: "Piščančja šunka, šampinjoni in mocarela.",
      en: "Chicken ham, mushrooms and mozzarella.",
    },
    sastojci: {
      sl: ["Paradižnikova omaka", "Mocarela", "Piščančja šunka", "Šampinjoni"],
      en: ["Tomato sauce", "Mozzarella", "Chicken ham", "Mushrooms"],
    },
    alergeni: ["gluten", "laktoza"],
    slikaUrl: SLIKA.pica,
    slikaAlt: { sl: "Pica capricciosa", en: "Capricciosa pizza" },
    halal: true,
    vegetarijansko: false,
    vegansko: false,
    ljuto: 0,
    kalorije: 860,
    aktivno: true,
  },
  {
    id: "jelo-vegetariana",
    slug: "vegetariana",
    kategorijaId: "kat-pice",
    naziv: { sl: "Vegetariana", en: "Vegetariana" },
    opis: {
      sl: "Sezonska zelenjava z žara na paradižnikovi osnovi.",
      en: "Grilled seasonal vegetables on a tomato base.",
    },
    sastojci: {
      sl: ["Paradižnikova omaka", "Mocarela", "Bučke", "Paprika", "Melanzane"],
      en: ["Tomato sauce", "Mozzarella", "Courgette", "Pepper", "Aubergine"],
    },
    alergeni: ["gluten", "laktoza"],
    slikaUrl: SLIKA.pica,
    slikaAlt: { sl: "Vegetarijanska pica", en: "Vegetarian pizza" },
    halal: true,
    vegetarijansko: true,
    vegansko: false,
    ljuto: 0,
    kalorije: 720,
    aktivno: true,
  },
  {
    id: "jelo-pikantna-piscancja",
    slug: "pikantna-piscancja",
    kategorijaId: "kat-pice",
    naziv: { sl: "Pikantna piščančja", en: "Spicy chicken" },
    opis: {
      sl: "Piščanec, čili in rdeča čebula — za tiste, ki imajo radi ostro.",
      en: "Chicken, chilli and red onion — for those who like it hot.",
    },
    sastojci: {
      sl: ["Paradižnikova omaka", "Mocarela", "Piščanec", "Čili", "Rdeča čebula"],
      en: ["Tomato sauce", "Mozzarella", "Chicken", "Chilli", "Red onion"],
    },
    alergeni: ["gluten", "laktoza"],
    slikaUrl: SLIKA.pica,
    slikaAlt: { sl: "Pikantna piščančja pica", en: "Spicy chicken pizza" },
    halal: true,
    vegetarijansko: false,
    vegansko: false,
    ljuto: 2,
    kalorije: 890,
    aktivno: true,
  },

  // ── Burgeri ────────────────────────────────────────────────
  {
    id: "jelo-shere-burger",
    slug: "shere-burger",
    kategorijaId: "kat-burgeri",
    naziv: { sl: "Šehere burger", en: "Shehere burger" },
    opis: {
      sl: "Dvojna govedina, karamelizirana čebula in hišni preliv.",
      en: "Double beef patty, caramelised onion and house sauce.",
    },
    sastojci: {
      sl: ["Govedina 2×100 g", "Karamelizirana čebula", "Solata", "Hišni preliv"],
      en: ["Beef 2×100 g", "Caramelised onion", "Lettuce", "House sauce"],
    },
    alergeni: ["gluten", "laktoza", "jaja", "gorusica"],
    slikaUrl: SLIKA.burger,
    slikaAlt: { sl: "Šehere burger z dvojno govedino", en: "Double beef burger" },
    halal: true,
    vegetarijansko: false,
    vegansko: false,
    ljuto: 0,
    kalorije: 940,
    aktivno: true,
  },
  {
    id: "jelo-cheeseburger",
    slug: "cheeseburger",
    kategorijaId: "kat-burgeri",
    naziv: { sl: "Cheeseburger", en: "Cheeseburger" },
    opis: {
      sl: "Govedina, čedar in kisle kumarice v mehki žemlji.",
      en: "Beef, cheddar and pickles in a soft bun.",
    },
    sastojci: {
      sl: ["Govedina 150 g", "Čedar", "Kisle kumarice", "Ketchup", "Gorčica"],
      en: ["Beef 150 g", "Cheddar", "Pickles", "Ketchup", "Mustard"],
    },
    alergeni: ["gluten", "laktoza", "gorusica"],
    slikaUrl: SLIKA.burger,
    slikaAlt: { sl: "Cheeseburger s čedarjem", en: "Cheeseburger with cheddar" },
    halal: true,
    vegetarijansko: false,
    vegansko: false,
    ljuto: 0,
    kalorije: 810,
    aktivno: true,
  },
  {
    id: "jelo-piscancji-burger",
    slug: "piscancji-burger",
    kategorijaId: "kat-burgeri",
    naziv: { sl: "Piščančji burger", en: "Chicken burger" },
    opis: {
      sl: "Hrustljav piščančji file s solato in majonezo.",
      en: "Crispy chicken fillet with lettuce and mayonnaise.",
    },
    sastojci: {
      sl: ["Piščančji file", "Solata", "Paradižnik", "Majoneza"],
      en: ["Chicken fillet", "Lettuce", "Tomato", "Mayonnaise"],
    },
    alergeni: ["gluten", "jaja"],
    slikaUrl: SLIKA.burger,
    slikaAlt: { sl: "Piščančji burger", en: "Chicken burger" },
    halal: true,
    vegetarijansko: false,
    vegansko: false,
    ljuto: 0,
    kalorije: 730,
    aktivno: true,
  },

  // ── Falafel ────────────────────────────────────────────────
  {
    id: "jelo-falafel-jufka",
    slug: "falafel-jufka",
    kategorijaId: "kat-falafel",
    naziv: { sl: "Falafel v jufki", en: "Falafel in yufka" },
    opis: {
      sl: "Ocvrte kroglice iz čičerike s sezamovim prelivom.",
      en: "Fried chickpea balls with sesame sauce.",
    },
    sastojci: {
      sl: ["Čičerika", "Peteršilj", "Jufka", "Tahini preliv", "Solata"],
      en: ["Chickpeas", "Parsley", "Yufka", "Tahini sauce", "Lettuce"],
    },
    alergeni: ["gluten", "sezam"],
    slikaUrl: SLIKA.ostalo,
    slikaAlt: { sl: "Falafel v jufki", en: "Falafel in yufka" },
    halal: true,
    vegetarijansko: true,
    vegansko: true,
    ljuto: 0,
    kalorije: 540,
    aktivno: true,
  },
  {
    id: "jelo-falafel-plosca",
    slug: "falafel-plosca",
    kategorijaId: "kat-falafel",
    naziv: { sl: "Falafel plošča", en: "Falafel plate" },
    opis: {
      sl: "Falafel s humusom, solato in toplo pito.",
      en: "Falafel with hummus, salad and warm pita.",
    },
    sastojci: {
      sl: ["Falafel", "Humus", "Sezonska solata", "Pita", "Tahini preliv"],
      en: ["Falafel", "Hummus", "Seasonal salad", "Pita", "Tahini sauce"],
    },
    alergeni: ["gluten", "sezam"],
    slikaUrl: SLIKA.ostalo,
    slikaAlt: { sl: "Falafel plošča s humusom", en: "Falafel plate with hummus" },
    halal: true,
    vegetarijansko: true,
    vegansko: true,
    ljuto: 0,
    kalorije: 660,
    aktivno: true,
  },

  // ── Ostalo ─────────────────────────────────────────────────
  {
    id: "jelo-cevapcici",
    slug: "cevapcici",
    kategorijaId: "kat-ostalo",
    naziv: { sl: "Čevapčiči", en: "Ćevapčići" },
    opis: {
      sl: "Deset kosov v lepinji, s čebulo in ajvarjem.",
      en: "Ten pieces in flatbread, with onion and ajvar.",
    },
    sastojci: {
      sl: ["Mleta govedina", "Lepinja", "Čebula", "Ajvar", "Kajmak"],
      en: ["Minced beef", "Flatbread", "Onion", "Ajvar", "Kajmak"],
    },
    alergeni: ["gluten", "laktoza"],
    slikaUrl: SLIKA.ostalo,
    slikaAlt: { sl: "Čevapčiči v lepinji", en: "Ćevapčići in flatbread" },
    halal: true,
    vegetarijansko: false,
    vegansko: false,
    ljuto: 1,
    kalorije: 870,
    aktivno: true,
  },
  {
    id: "jelo-piscancji-file",
    slug: "piscancji-file",
    kategorijaId: "kat-ostalo",
    naziv: { sl: "Piščančji file z žara", en: "Grilled chicken fillet" },
    opis: {
      sl: "File z žara s pečeno zelenjavo in rižem.",
      en: "Grilled fillet with roasted vegetables and rice.",
    },
    sastojci: {
      sl: ["Piščančji file", "Riž", "Pečena zelenjava", "Limona"],
      en: ["Chicken fillet", "Rice", "Roasted vegetables", "Lemon"],
    },
    alergeni: [],
    slikaUrl: SLIKA.ostalo,
    slikaAlt: { sl: "Piščančji file z žara", en: "Grilled chicken fillet" },
    halal: true,
    vegetarijansko: false,
    vegansko: false,
    ljuto: 0,
    kalorije: 590,
    aktivno: true,
  },

  // ── Dodatki ────────────────────────────────────────────────
  {
    id: "jelo-pomfri",
    slug: "pomfri",
    kategorijaId: "kat-dodatki",
    naziv: { sl: "Pomfri", en: "Fries" },
    opis: {
      sl: "Hrustljav pomfri z morsko soljo.",
      en: "Crispy fries with sea salt.",
    },
    sastojci: { sl: ["Krompir", "Morska sol"], en: ["Potato", "Sea salt"] },
    alergeni: [],
    slikaUrl: SLIKA.ostalo,
    slikaAlt: { sl: "Porcija pomfrija", en: "Portion of fries" },
    halal: true,
    vegetarijansko: true,
    vegansko: true,
    ljuto: 0,
    kalorije: 380,
    aktivno: true,
  },
  {
    id: "jelo-cesnov-kruh",
    slug: "cesnov-kruh",
    kategorijaId: "kat-dodatki",
    naziv: { sl: "Česnov kruh", en: "Garlic bread" },
    opis: {
      sl: "Topel kruh s česnovim maslom in peteršiljem.",
      en: "Warm bread with garlic butter and parsley.",
    },
    sastojci: {
      sl: ["Kruh", "Česnovo maslo", "Peteršilj"],
      en: ["Bread", "Garlic butter", "Parsley"],
    },
    alergeni: ["gluten", "laktoza"],
    slikaUrl: SLIKA.ostalo,
    slikaAlt: { sl: "Topel česnov kruh", en: "Warm garlic bread" },
    halal: true,
    vegetarijansko: true,
    vegansko: false,
    ljuto: 0,
    kalorije: 310,
    aktivno: true,
  },
  {
    id: "jelo-sezonska-solata",
    slug: "sezonska-solata",
    kategorijaId: "kat-dodatki",
    naziv: { sl: "Sezonska solata", en: "Seasonal salad" },
    opis: {
      sl: "Sveža zelenjava z oljčnim oljem in limono.",
      en: "Fresh vegetables with olive oil and lemon.",
    },
    sastojci: {
      sl: ["Solata", "Paradižnik", "Kumare", "Oljčno olje", "Limona"],
      en: ["Lettuce", "Tomato", "Cucumber", "Olive oil", "Lemon"],
    },
    alergeni: [],
    slikaUrl: SLIKA.ostalo,
    slikaAlt: { sl: "Sezonska solata", en: "Seasonal salad" },
    halal: true,
    vegetarijansko: true,
    vegansko: true,
    ljuto: 0,
    kalorije: 120,
    aktivno: true,
  },

  // ── Pijača ─────────────────────────────────────────────────
  {
    id: "jelo-coca-cola",
    slug: "coca-cola",
    kategorijaId: "kat-pijaca",
    naziv: { sl: "Coca-Cola 0,5 l", en: "Coca-Cola 0.5 l" },
    opis: { sl: "Ohlajena, v steklenici.", en: "Chilled, in a bottle." },
    sastojci: { sl: ["Gazirana pijača"], en: ["Carbonated drink"] },
    alergeni: [],
    slikaUrl: SLIKA.ostalo,
    slikaAlt: { sl: "Steklenica Coca-Cole", en: "Bottle of Coca-Cola" },
    halal: true,
    vegetarijansko: true,
    vegansko: true,
    ljuto: 0,
    kalorije: 210,
    aktivno: true,
  },
  {
    id: "jelo-ayran",
    slug: "ayran",
    kategorijaId: "kat-pijaca",
    naziv: { sl: "Ayran 0,3 l", en: "Ayran 0.3 l" },
    opis: {
      sl: "Slan jogurtov napitek — klasika ob kebabu.",
      en: "Salted yogurt drink — the classic alongside kebab.",
    },
    sastojci: { sl: ["Jogurt", "Voda", "Sol"], en: ["Yogurt", "Water", "Salt"] },
    alergeni: ["laktoza"],
    slikaUrl: SLIKA.ostalo,
    slikaAlt: { sl: "Kozarec ayrana", en: "Glass of ayran" },
    halal: true,
    vegetarijansko: true,
    vegansko: false,
    ljuto: 0,
    kalorije: 90,
    aktivno: true,
  },
  {
    id: "jelo-naravna-voda",
    slug: "naravna-voda",
    kategorijaId: "kat-pijaca",
    naziv: { sl: "Naravna voda 0,5 l", en: "Still water 0.5 l" },
    opis: { sl: "Negazirana izvirska voda.", en: "Still spring water." },
    sastojci: { sl: ["Izvirska voda"], en: ["Spring water"] },
    alergeni: [],
    slikaUrl: SLIKA.ostalo,
    slikaAlt: { sl: "Steklenica vode", en: "Bottle of water" },
    halal: true,
    vegetarijansko: true,
    vegansko: true,
    ljuto: 0,
    kalorije: 0,
    aktivno: true,
  },

  // ── Meniji ─────────────────────────────────────────────────
  {
    id: "jelo-studentski-meni",
    slug: "studentski-meni",
    kategorijaId: "kat-meniji",
    naziv: { sl: "Študentski meni", en: "Student menu" },
    opis: {
      sl: "Glavna jed po izbiri, juha, solata, jabolko in pijača.",
      en: "Main course of choice, soup, salad, apple and a drink.",
    },
    sastojci: {
      sl: ["Glavna jed po izbiri", "Juha", "Solata", "Jabolko", "Pijača"],
      en: ["Main course of choice", "Soup", "Salad", "Apple", "Drink"],
    },
    alergeni: ["gluten", "laktoza"],
    slikaUrl: SLIKA.ostalo,
    slikaAlt: { sl: "Študentski meni", en: "Student menu" },
    halal: true,
    vegetarijansko: false,
    vegansko: false,
    ljuto: 0,
    aktivno: true,
  },
  {
    id: "jelo-druzinski-meni",
    slug: "druzinski-meni",
    kategorijaId: "kat-meniji",
    naziv: { sl: "Družinski meni", en: "Family menu" },
    opis: {
      sl: "Štiri glavne jedi, dve veliki prilogi in štiri pijače.",
      en: "Four main courses, two large sides and four drinks.",
    },
    sastojci: {
      sl: ["4× glavna jed", "2× velika priloga", "4× pijača"],
      en: ["4× main course", "2× large side", "4× drink"],
    },
    alergeni: ["gluten", "laktoza", "sezam"],
    slikaUrl: SLIKA.ostalo,
    slikaAlt: { sl: "Družinski meni za štiri", en: "Family menu for four" },
    halal: true,
    vegetarijansko: false,
    vegansko: false,
    ljuto: 0,
    aktivno: true,
  },
]

// ─────────────────────────────────────────────────────────────
//  Cijene po lokalu
// ─────────────────────────────────────────────────────────────

/** Osnovne cijene — lokal 1. Lokal 2 ih preuzima uvećane za 0,50 €. */
const CIJENE_TRUBARJEVA: Record<string, number> = {
  "doner-kebab": 8.5,
  "kebab-jufka": 9.5,
  "durum-kebab": 9.0,
  "kebab-plosca": 12.0,
  margerita: 9.5,
  capricciosa: 11.0,
  vegetariana: 10.5,
  "pikantna-piscancja": 11.5,
  "shere-burger": 10.0,
  cheeseburger: 9.0,
  "piscancji-burger": 9.5,
  "falafel-jufka": 8.0,
  "falafel-plosca": 10.5,
  cevapcici: 9.5,
  "piscancji-file": 10.0,
  pomfri: 3.0,
  "cesnov-kruh": 3.5,
  "sezonska-solata": 4.0,
  "coca-cola": 2.5,
  ayran: 2.0,
  "naravna-voda": 1.5,
  "studentski-meni": 3.0,
  "druzinski-meni": 24.0,
}

/** Jela koja se pojavljuju u sekciji „Priljubljene izbire". */
const IZDVOJENA = new Set([
  "doner-kebab",
  "margerita",
  "shere-burger",
  "falafel-jufka",
])

/** Razlika u cijeni lokala 2 u odnosu na glavni. */
const DOPLATA_SEHEREZADA2 = 0.5

// ─────────────────────────────────────────────────────────────
//  Radno vrijeme
// ─────────────────────────────────────────────────────────────

const RV_TRUBARJEVA: RadnoVrijeme = {
  redovno: {
    pon: { od: "09:00", do: "02:00" },
    uto: { od: "09:00", do: "02:00" },
    sri: { od: "09:00", do: "02:00" },
    cet: { od: "09:00", do: "02:00" },
    pet: { od: "09:00", do: "05:00" },
    sub: { od: "09:00", do: "05:00" },
    ned: { od: "10:00", do: "05:00" },
  },
  izuzeci: [
    { datum: "2026-12-25", termin: null, napomena: { sl: "Božič", en: "Christmas" } },
    { datum: "2026-12-31", termin: { od: "09:00", do: "18:00" } },
    { datum: "2027-01-01", termin: { od: "12:00", do: "05:00" } },
  ],
}

const RV_SEHEREZADA2: RadnoVrijeme = {
  redovno: {
    pon: { od: "08:00", do: "23:59" },
    uto: { od: "08:00", do: "23:59" },
    sri: { od: "08:00", do: "23:59" },
    cet: { od: "08:00", do: "23:59" },
    pet: { od: "08:00", do: "23:59" },
    sub: { od: "09:00", do: "23:59" },
    ned: { od: "09:00", do: "23:59" },
  },
  izuzeci: [
    { datum: "2026-12-25", termin: null, napomena: { sl: "Božič", en: "Christmas" } },
  ],
}

const RV_PRAZNO: RadnoVrijeme = {
  redovno: {
    pon: null,
    uto: null,
    sri: null,
    cet: null,
    pet: null,
    sub: null,
    ned: null,
  },
  izuzeci: [],
}

// ─────────────────────────────────────────────────────────────
//  Lokali
// ─────────────────────────────────────────────────────────────

const LOKALI: Lokal[] = [
  {
    id: "lokal-trubarjeva",
    slug: "trubarjeva",
    naziv: "Šeherezada",
    ulica: "Trubarjeva",
    adresa: "Trubarjeva cesta 31, 1000 Ljubljana",
    telefon: "+386 69 444 812",
    email: "trubarjeva@seherezada.net",
    lat: 46.0533,
    lng: 14.5122,
    radnoVrijeme: RV_TRUBARJEVA,
    woltUrl: "https://wolt.com/sl/svn/ljubljana/restaurant/seherezada",
    glovoUrl: "https://glovoapp.com/si/sl/ljubljana/seherezada-lju/",
    googlePlaceId: "DEMO_PLACE_ID_TRUBARJEVA",
    uvodniTekst: {
      sl: "Prvi lokal Šeherezade stoji na Trubarjevi od leta 2009. Odprti smo najdlje v mestu — ob koncu tedna do petih zjutraj, ko je večina kuhinj že zaprtih.",
      en: "The first Šeherezada opened on Trubarjeva in 2009. We stay open the longest in town — until five in the morning at weekends, when most kitchens have long closed.",
    },
    ocjena: 4.5,
    brojRecenzija: 1914,
    recenzijeAzurirano: "2026-08-01T09:00:00.000Z",
    glavni: true,
    stanje: "radi",
    redoslijed: 1,
  },
  {
    id: "lokal-seherezada2",
    slug: "seherezada2",
    naziv: "Šeherezada 2",
    ulica: "Slovenska",
    adresa: "Slovenska cesta 55, 1000 Ljubljana",
    telefon: "+386 64 183 155",
    email: "slovenska@seherezada.net",
    lat: 46.0569,
    lng: 14.5058,
    radnoVrijeme: RV_SEHEREZADA2,
    woltUrl: "https://wolt.com/sl/svn/ljubljana/restaurant/seherezada-2",
    googlePlaceId: "DEMO_PLACE_ID_SLOVENSKA",
    uvodniTekst: {
      sl: "Lokal na Slovenski je večji in svetlejši, z dvajsetimi sedeži in mizami ob oknu. Primeren za daljše kosilo, ne le za jed s seboj.",
      en: "The Slovenska location is larger and brighter, with twenty seats and tables by the window. Made for a proper sit-down lunch, not just takeaway.",
    },
    ocjena: 4.3,
    brojRecenzija: 412,
    recenzijeAzurirano: "2026-08-01T09:00:00.000Z",
    glavni: false,
    stanje: "radi",
    redoslijed: 2,
  },
  {
    id: "lokal-bezigrad",
    slug: "bezigrad",
    naziv: "Šeherezada Bežigrad",
    ulica: "Dunajska",
    adresa: "Dunajska cesta 101, 1000 Ljubljana",
    telefon: "+386 69 444 812",
    radnoVrijeme: RV_PRAZNO,
    uvodniTekst: {
      sl: "Tretji lokal se pripravlja na Dunajski cesti. Odprtje načrtujemo v prihodnjih mesecih.",
      en: "Our third location is being prepared on Dunajska cesta. We plan to open in the coming months.",
    },
    glavni: false,
    stanje: "uskoro",
    redoslijed: 3,
  },
]

const PREUSMJERENJA: Preusmjerenje[] = []

// ─────────────────────────────────────────────────────────────
//  Sklapanje menija
// ─────────────────────────────────────────────────────────────

/** Cijene lokala. Lokal bez unosa nema meni — počinje prazan. */
function cijeneZaLokal(lokalSlug: string): Record<string, number> | null {
  if (lokalSlug === "trubarjeva") return CIJENE_TRUBARJEVA

  if (lokalSlug === "seherezada2") {
    const uvecane: Record<string, number> = {}
    for (const [slug, cijena] of Object.entries(CIJENE_TRUBARJEVA)) {
      uvecane[slug] = Number((cijena + DOPLATA_SEHEREZADA2).toFixed(2))
    }
    return uvecane
  }

  return null
}

function stavkeZaLokal(lokalSlug: string): MenuStavka[] {
  const cijene = cijeneZaLokal(lokalSlug)
  if (!cijene) return []

  return JELA.filter((jelo) => jelo.aktivno && jelo.slug in cijene).map(
    (jelo, indeks) => ({
      jelo,
      cijena: cijene[jelo.slug],
      dostupno: true,
      izdvojeno: IZDVOJENA.has(jelo.slug),
      redoslijed: indeks,
    }),
  )
}

// ─────────────────────────────────────────────────────────────
//  Implementacija ugovora
// ─────────────────────────────────────────────────────────────

export const staticRepo = {
  async getLokali(): Promise<Lokal[]> {
    return LOKALI.filter((l) => l.stanje !== "zatvoren").sort(
      (a, b) => a.redoslijed - b.redoslijed,
    )
  },

  async getLokal(slug: string): Promise<Lokal | null> {
    return LOKALI.find((l) => l.slug === slug) ?? null
  },

  async getGlavniLokal(): Promise<Lokal> {
    const glavni = LOKALI.find((l) => l.glavni)
    if (!glavni) throw new Error("Nijedan lokal nije označen kao glavni")
    return glavni
  },

  async getKategorije(): Promise<Kategorija[]> {
    return KATEGORIJE.filter((k) => k.aktivna).sort(
      (a, b) => a.redoslijed - b.redoslijed,
    )
  },

  async getMeni(lokalSlug: string): Promise<MenuSekcija[]> {
    const stavke = stavkeZaLokal(lokalSlug)
    const kategorije = KATEGORIJE.filter((k) => k.aktivna).sort(
      (a, b) => a.redoslijed - b.redoslijed,
    )

    return kategorije
      .map((kategorija) => ({
        kategorija,
        stavke: stavke
          .filter((s) => s.jelo.kategorijaId === kategorija.id)
          .sort((a, b) => a.redoslijed - b.redoslijed),
      }))
      // Prazna kategorija se ne prikazuje uopšte — ni tab ni naslov.
      .filter((sekcija) => sekcija.stavke.length > 0)
  },

  async getIzdvojena(lokalSlug: string): Promise<MenuStavka[]> {
    return stavkeZaLokal(lokalSlug).filter((s) => s.izdvojeno && s.dostupno)
  },

  async getJelo(slug: string): Promise<Jelo | null> {
    return JELA.find((j) => j.slug === slug && j.aktivno) ?? null
  },

  async getPreusmjerenje(stariSlug: string): Promise<string | null> {
    return PREUSMJERENJA.find((p) => p.stariSlug === stariSlug)?.noviSlug ?? null
  },
}
