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
    naziv: { sl: "Kebab", en: "Kebab", de: "Kebab", bs: "Kebab", tr: "Kebap", ar: "كباب", zh: "烤肉卷" },
    opis: {
      sl: "Meso z vertikalnega žara, rezano na roko in postreženo v svežem kruhu.",
      en: "Meat from the vertical grill, hand-carved and served in fresh bread.",
      de: "Fleisch vom Drehspieß, von Hand geschnitten und in frischem Brot serviert.",
      bs: "Meso s vertikalnog ražnja, rezano rukom i posluženo u svježem hljebu.",
      tr: "Döner ocağından, elle kesilmiş ve taze ekmek arasında sunulan et.",
      ar: "لحم من السيخ الدوّار، مقطّع يدوياً ويُقدَّم في خبز طازج.",
      zh: "立式烤炉上的肉，手工切片，夹在新鲜面包中。",
    },
    redoslijed: 1,
    aktivna: true,
  },
  {
    id: "kat-pice",
    slug: "pice",
    naziv: { sl: "Pice", en: "Pizza", de: "Pizza", bs: "Pizze", tr: "Pizzalar", ar: "بيتزا", zh: "披萨" },
    opis: {
      sl: "Testo, ki vzhaja 24 ur, pečeno na kamniti plošči.",
      en: "Dough proofed for 24 hours, baked on a stone slab.",
      de: "Teig, der 24 Stunden geht, auf Stein gebacken.",
      bs: "Tijesto koje odstoji 24 sata, pečeno na kamenoj ploči.",
      tr: "24 saat dinlendirilmiş hamur, taş üzerinde pişirilir.",
      ar: "عجين يختمر 24 ساعة، يُخبز على لوح حجري.",
      zh: "发酵 24 小时的面团，在石板上烤制。",
    },
    redoslijed: 2,
    aktivna: true,
  },
  {
    id: "kat-burgeri",
    slug: "burgeri",
    naziv: { sl: "Burgerji", en: "Burgers", de: "Burger", bs: "Burgeri", tr: "Burgerler", ar: "برغر", zh: "汉堡" },
    opis: {
      sl: "Sveže mleto meso in doma pečene žemlje.",
      en: "Freshly ground meat and house-baked buns.",
      de: "Frisch gewolftes Fleisch und hausgebackene Brötchen.",
      bs: "Svježe mljeveno meso i doma pečena peciva.",
      tr: "Taze çekilmiş et ve evde pişirilmiş ekmekler.",
      ar: "لحم مفروم طازج وخبز مخبوز عندنا.",
      zh: "新鲜绞制的肉与自制面包。",
    },
    redoslijed: 3,
    aktivna: true,
  },
  {
    id: "kat-falafel",
    slug: "falafel",
    naziv: { sl: "Falafel", en: "Falafel", de: "Falafel", bs: "Falafel", tr: "Falafel", ar: "فلافل", zh: "沙拉三明治" },
    opis: {
      sl: "Čičerika, sveža zelišča in sezam — brez mesa.",
      en: "Chickpeas, fresh herbs and sesame — meat free.",
      de: "Kichererbsen, frische Kräuter und Sesam — ohne Fleisch.",
      bs: "Slanutak, svježe bilje i sezam — bez mesa.",
      tr: "Nohut, taze otlar ve susam — etsiz.",
      ar: "حمّص وأعشاب طازجة وسمسم — بلا لحم.",
      zh: "鹰嘴豆、新鲜香草和芝麻——不含肉。",
    },
    redoslijed: 4,
    aktivna: true,
  },
  {
    id: "kat-ostalo",
    slug: "ostalo",
    naziv: { sl: "Ostalo", en: "Other", de: "Sonstiges", bs: "Ostalo", tr: "Diğer", ar: "أصناف أخرى", zh: "其他" },
    redoslijed: 5,
    aktivna: true,
  },
  {
    id: "kat-dodatki",
    slug: "dodatki",
    naziv: { sl: "Dodatki", en: "Sides", de: "Beilagen", bs: "Prilozi", tr: "Yan ürünler", ar: "إضافات", zh: "配菜" },
    redoslijed: 6,
    aktivna: true,
  },
  {
    id: "kat-pijaca",
    slug: "pijaca",
    naziv: { sl: "Pijača", en: "Drinks", de: "Getränke", bs: "Piće", tr: "İçecekler", ar: "مشروبات", zh: "饮料" },
    redoslijed: 7,
    aktivna: true,
  },
  {
    id: "kat-meniji",
    slug: "meniji",
    naziv: { sl: "Meniji", en: "Combo meals", de: "Menüs", bs: "Meniji", tr: "Menüler", ar: "وجبات", zh: "套餐" },
    opis: {
      sl: "Glavna jed, priloga in pijača po ugodnejši ceni.",
      en: "Main course, side and a drink at a better price.",
      de: "Hauptgericht, Beilage und Getränk zum günstigeren Preis.",
      bs: "Glavno jelo, prilog i piće po povoljnijoj cijeni.",
      tr: "Ana yemek, garnitür ve içecek daha uygun fiyata.",
      ar: "طبق رئيسي وطبق جانبي ومشروب بسعر أوفر.",
      zh: "主菜、配菜和饮料，价格更优惠。",
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
    naziv: { sl: "Döner Kebab", en: "Döner Kebab", de: "Döner Kebab", bs: "Döner kebab", tr: "Döner Kebap", ar: "دونر كباب", zh: "旋转烤肉卷" },
    opis: {
      sl: "Tradicionalni turški döner v svežem kruhu, z jogurtovim prelivom.",
      en: "Traditional Turkish döner in fresh bread with yogurt sauce.",
      de: "Traditioneller türkischer Döner in frischem Brot, mit Joghurtsauce.",
      bs: "Tradicionalni turski döner u svježem hljebu, s jogurt prelivom.",
      tr: "Taze ekmek arasında geleneksel Türk döneri, yoğurt soslu.",
      ar: "دونر تركي تقليدي في خبز طازج، مع صلصة اللبن.",
      zh: "传统土耳其旋转烤肉，夹新鲜面包，佐酸奶酱。",
    },
    sastojci: {
          sl: ["Govedina in teletina", "Zelje", "Paradižnik", "Čebula", "Jogurtov preliv"],
          en: ["Beef and veal", "Cabbage", "Tomato", "Onion", "Yogurt sauce"],
          de: ["Rind- und Kalbfleisch", "Kraut", "Tomate", "Zwiebel", "Joghurtsauce"],
          bs: ["Govedina i teletina", "Kupus", "Paradajz", "Luk", "Jogurt preliv"],
          tr: ["Dana ve buzağı eti", "Lahana", "Domates", "Soğan", "Yoğurt sosu"],
          ar: ["لحم بقر وعجل", "ملفوف", "طماطم", "بصل", "صلصة لبن"],
          zh: ["牛肉与小牛肉", "卷心菜", "番茄", "洋葱", "酸奶酱"],
        },
    alergeni: ["gluten", "laktoza", "sezam"],
    slikaUrl: SLIKA.kebab,
    slikaAlt: {
      sl: "Döner kebab v svežem kruhu",
      en: "Döner kebab in fresh bread",
      de: "Döner Kebab in frischem Brot",
      bs: "Döner kebab u svježem hljebu",
      tr: "Taze ekmekte döner kebap",
      ar: "دونر كباب في خبز طازج",
      zh: "新鲜面包夹旋转烤肉",
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
    naziv: { sl: "Kebab v jufki", en: "Kebab in yufka", de: "Kebab im Yufka", bs: "Kebab u jufki", tr: "Yufkada kebap", ar: "كباب في الرقاق", zh: "卷饼烤肉" },
    opis: {
      sl: "Tanka jufka, zavita okrog mesa in sveže zelenjave.",
      en: "Thin yufka flatbread wrapped around meat and fresh vegetables.",
      de: "Dünnes Yufka, um Fleisch und frisches Gemüse gewickelt.",
      bs: "Tanka jufka, zamotana oko mesa i svježeg povrća.",
      tr: "Etin ve taze sebzelerin etrafına sarılmış ince yufka.",
      ar: "رقاق رقيق ملفوف حول اللحم والخضار الطازجة.",
      zh: "薄卷饼裹着肉和新鲜蔬菜。",
    },
    sastojci: {
          sl: ["Govedina in teletina", "Jufka", "Solata", "Paradižnik", "Česnov preliv"],
          en: ["Beef and veal", "Yufka", "Lettuce", "Tomato", "Garlic sauce"],
          de: ["Rind- und Kalbfleisch", "Yufka", "Salat", "Tomate", "Knoblauchsauce"],
          bs: ["Govedina i teletina", "Jufka", "Salata", "Paradajz", "Preliv od češnjaka"],
          tr: ["Dana ve buzağı eti", "Yufka", "Salata", "Domates", "Sarımsak sosu"],
          ar: ["لحم بقر وعجل", "رقاق", "سلطة", "طماطم", "صلصة ثوم"],
          zh: ["牛肉与小牛肉", "卷饼皮", "生菜", "番茄", "蒜酱"],
        },
    alergeni: ["gluten", "laktoza"],
    slikaUrl: SLIKA.kebab,
    slikaAlt: { sl: "Kebab v tanki jufki", en: "Kebab in thin yufka", de: "Kebab im dünnen Yufka", bs: "Kebab u tankoj jufki", tr: "İnce yufkada kebap", ar: "كباب في رقاق رقيق", zh: "薄卷饼烤肉" },
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
    naziv: { sl: "Dürüm Kebab", en: "Dürüm Kebab", de: "Dürüm Kebab", bs: "Dürüm kebab", tr: "Dürüm Kebap", ar: "دوروم كباب", zh: "杜鲁姆烤肉卷" },
    opis: {
      sl: "Tesno zavit dürüm z ostrejšim prelivom in pečeno papriko.",
      en: "Tightly rolled dürüm with a spicier sauce and roasted pepper.",
      de: "Eng gewickelter Dürüm mit schärferer Sauce und gegrillter Paprika.",
      bs: "Čvrsto zamotan dürüm s oštrijim prelivom i pečenom paprikom.",
      tr: "Daha keskin soslu ve közlenmiş biberli, sıkı sarılmış dürüm.",
      ar: "دوروم ملفوف بإحكام مع صلصة أكثر حدّة وفلفل مشوي.",
      zh: "裹得紧实的杜鲁姆卷，佐较辣酱汁和烤甜椒。",
    },
    sastojci: {
          sl: ["Govedina in teletina", "Pečena paprika", "Čebula", "Pikantni preliv"],
          en: ["Beef and veal", "Roasted pepper", "Onion", "Spicy sauce"],
          de: ["Rind- und Kalbfleisch", "Gegrillte Paprika", "Zwiebel", "Scharfe Sauce"],
          bs: ["Govedina i teletina", "Pečena paprika", "Luk", "Ljuti preliv"],
          tr: ["Dana ve buzağı eti", "Közlenmiş biber", "Soğan", "Acı sos"],
          ar: ["لحم بقر وعجل", "فلفل مشوي", "بصل", "صلصة حارّة"],
          zh: ["牛肉与小牛肉", "烤甜椒", "洋葱", "辣酱"],
        },
    alergeni: ["gluten", "laktoza"],
    slikaUrl: SLIKA.kebab,
    slikaAlt: { sl: "Zavit dürüm kebab", en: "Rolled dürüm kebab", de: "Gewickelter Dürüm Kebab", bs: "Zamotan dürüm kebab", tr: "Sarılmış dürüm kebap", ar: "دوروم كباب ملفوف", zh: "卷好的杜鲁姆烤肉" },
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
    naziv: { sl: "Kebab plošča", en: "Kebab plate", de: "Kebab-Teller", bs: "Kebab tanjur", tr: "Kebap tabağı", ar: "طبق كباب", zh: "烤肉拼盘" },
    opis: {
      sl: "Večja porcija mesa s pomfrijem, solato in dvema prelivoma.",
      en: "A larger portion of meat with fries, salad and two sauces.",
      de: "Größere Fleischportion mit Pommes, Salat und zwei Saucen.",
      bs: "Veća porcija mesa s pomfritom, salatom i dva preliva.",
      tr: "Patates kızartması, salata ve iki soslu daha büyük et porsiyonu.",
      ar: "حصة أكبر من اللحم مع البطاطس المقلية والسلطة وصلصتين.",
      zh: "更大份的肉，配薯条、沙拉和两种酱汁。",
    },
    sastojci: {
          sl: ["Govedina in teletina", "Pomfri", "Sezonska solata", "Dva preliva"],
          en: ["Beef and veal", "Fries", "Seasonal salad", "Two sauces"],
          de: ["Rind- und Kalbfleisch", "Pommes", "Saisonsalat", "Zwei Saucen"],
          bs: ["Govedina i teletina", "Pomfrit", "Sezonska salata", "Dva preliva"],
          tr: ["Dana ve buzağı eti", "Patates kızartması", "Mevsim salatası", "İki sos"],
          ar: ["لحم بقر وعجل", "بطاطس مقلية", "سلطة الموسم", "صلصتان"],
          zh: ["牛肉与小牛肉", "薯条", "时令沙拉", "两种酱汁"],
        },
    alergeni: ["laktoza", "sezam"],
    slikaUrl: SLIKA.kebab,
    slikaAlt: { sl: "Kebab plošča s prilogami", en: "Kebab plate with sides", de: "Kebab-Teller mit Beilagen", bs: "Kebab tanjur s prilozima", tr: "Garnitürlü kebap tabağı", ar: "طبق كباب مع الأطباق الجانبية", zh: "配菜烤肉拼盘" },
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
    naziv: { sl: "Margerita", en: "Margherita", de: "Margherita", bs: "Margarita", tr: "Margherita", ar: "مارغريتا", zh: "玛格丽特" },
    opis: {
      sl: "Paradižnikova osnova, mocarela in sveža bazilika.",
      en: "Tomato base, mozzarella and fresh basil.",
      de: "Tomatensauce, Mozzarella und frisches Basilikum.",
      bs: "Podloga od paradajza, mocarela i svježi bosiljak.",
      tr: "Domates sosu, mozzarella ve taze fesleğen.",
      ar: "قاعدة طماطم وجبن موتزاريلا وريحان طازج.",
      zh: "番茄底酱、马苏里拉与新鲜罗勒。",
    },
    sastojci: {
          sl: ["Paradižnikova omaka", "Mocarela", "Bazilika", "Oljčno olje"],
          en: ["Tomato sauce", "Mozzarella", "Basil", "Olive oil"],
          de: ["Tomatensauce", "Mozzarella", "Basilikum", "Olivenöl"],
          bs: ["Umak od paradajza", "Mocarela", "Bosiljak", "Maslinovo ulje"],
          tr: ["Domates sosu", "Mozzarella", "Fesleğen", "Zeytinyağı"],
          ar: ["صلصة طماطم", "موتزاريلا", "ريحان", "زيت زيتون"],
          zh: ["番茄酱", "马苏里拉", "罗勒", "橄榄油"],
        },
    alergeni: ["gluten", "laktoza"],
    slikaUrl: SLIKA.pica,
    slikaAlt: { sl: "Pica margerita", en: "Margherita pizza", de: "Pizza Margherita", bs: "Pizza margarita", tr: "Margherita pizza", ar: "بيتزا مارغريتا", zh: "玛格丽特披萨" },
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
    naziv: { sl: "Capricciosa", en: "Capricciosa", de: "Capricciosa", bs: "Capricciosa", tr: "Capricciosa", ar: "كابريتشوزا", zh: "卡布里乔萨" },
    opis: {
      sl: "Piščančja šunka, šampinjoni in mocarela.",
      en: "Chicken ham, mushrooms and mozzarella.",
      de: "Hähnchenschinken, Champignons und Mozzarella.",
      bs: "Pileća šunka, šampinjoni i mocarela.",
      tr: "Tavuk jambonu, mantar ve mozzarella.",
      ar: "مرتديلا دجاج وفطر وموتزاريلا.",
      zh: "鸡肉火腿、蘑菇与马苏里拉。",
    },
    sastojci: {
          sl: ["Paradižnikova omaka", "Mocarela", "Piščančja šunka", "Šampinjoni"],
          en: ["Tomato sauce", "Mozzarella", "Chicken ham", "Mushrooms"],
          de: ["Tomatensauce", "Mozzarella", "Hähnchenschinken", "Champignons"],
          bs: ["Umak od paradajza", "Mocarela", "Pileća šunka", "Šampinjoni"],
          tr: ["Domates sosu", "Mozzarella", "Tavuk jambonu", "Mantar"],
          ar: ["صلصة طماطم", "موتزاريلا", "مرتديلا دجاج", "فطر"],
          zh: ["番茄酱", "马苏里拉", "鸡肉火腿", "蘑菇"],
        },
    alergeni: ["gluten", "laktoza"],
    slikaUrl: SLIKA.pica,
    slikaAlt: { sl: "Pica capricciosa", en: "Capricciosa pizza", de: "Pizza Capricciosa", bs: "Pizza capricciosa", tr: "Capricciosa pizza", ar: "بيتزا كابريتشوزا", zh: "卡布里乔萨披萨" },
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
    naziv: { sl: "Vegetariana", en: "Vegetariana", de: "Vegetariana", bs: "Vegetariana", tr: "Vegetariana", ar: "فيجيتاريانا", zh: "素食披萨" },
    opis: {
      sl: "Sezonska zelenjava z žara na paradižnikovi osnovi.",
      en: "Grilled seasonal vegetables on a tomato base.",
      de: "Gegrilltes Saisongemüse auf Tomatensauce.",
      bs: "Sezonsko povrće s žara na podlozi od paradajza.",
      tr: "Domates sosu üzerine ızgara mevsim sebzeleri.",
      ar: "خضار الموسم المشوية على قاعدة طماطم.",
      zh: "番茄底酱上铺时令烤蔬菜。",
    },
    sastojci: {
          sl: ["Paradižnikova omaka", "Mocarela", "Bučke", "Paprika", "Melanzane"],
          en: ["Tomato sauce", "Mozzarella", "Courgette", "Pepper", "Aubergine"],
          de: ["Tomatensauce", "Mozzarella", "Zucchini", "Paprika", "Auberginen"],
          bs: ["Umak od paradajza", "Mocarela", "Tikvice", "Paprika", "Patlidžan"],
          tr: ["Domates sosu", "Mozzarella", "Kabak", "Biber", "Patlıcan"],
          ar: ["صلصة طماطم", "موتزاريلا", "كوسا", "فلفل", "باذنجان"],
          zh: ["番茄酱", "马苏里拉", "西葫芦", "甜椒", "茄子"],
        },
    alergeni: ["gluten", "laktoza"],
    slikaUrl: SLIKA.pica,
    slikaAlt: { sl: "Vegetarijanska pica", en: "Vegetarian pizza", de: "Vegetarische Pizza", bs: "Vegetarijanska pizza", tr: "Vejetaryen pizza", ar: "بيتزا نباتية", zh: "素食披萨" },
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
    naziv: { sl: "Pikantna piščančja", en: "Spicy chicken", de: "Scharfe Hähnchen-Pizza", bs: "Ljuta pileća", tr: "Acılı tavuklu", ar: "دجاج حارّ", zh: "香辣鸡肉" },
    opis: {
      sl: "Piščanec, čili in rdeča čebula — za tiste, ki imajo radi ostro.",
      en: "Chicken, chilli and red onion — for those who like it hot.",
      de: "Hähnchen, Chili und rote Zwiebel — für alle, die es scharf mögen.",
      bs: "Piletina, čili i crveni luk — za one koji vole ljuto.",
      tr: "Tavuk, acı biber ve kırmızı soğan — acı sevenlere.",
      ar: "دجاج وفلفل حارّ وبصل أحمر — لمن يحبّون الحرارة.",
      zh: "鸡肉、辣椒和红洋葱——献给爱吃辣的人。",
    },
    sastojci: {
          sl: ["Paradižnikova omaka", "Mocarela", "Piščanec", "Čili", "Rdeča čebula"],
          en: ["Tomato sauce", "Mozzarella", "Chicken", "Chilli", "Red onion"],
          de: ["Tomatensauce", "Mozzarella", "Hähnchen", "Chili", "Rote Zwiebel"],
          bs: ["Umak od paradajza", "Mocarela", "Piletina", "Čili", "Crveni luk"],
          tr: ["Domates sosu", "Mozzarella", "Tavuk", "Acı biber", "Kırmızı soğan"],
          ar: ["صلصة طماطم", "موتزاريلا", "دجاج", "فلفل حارّ", "بصل أحمر"],
          zh: ["番茄酱", "马苏里拉", "鸡肉", "辣椒", "红洋葱"],
        },
    alergeni: ["gluten", "laktoza"],
    slikaUrl: SLIKA.pica,
    slikaAlt: { sl: "Pikantna piščančja pica", en: "Spicy chicken pizza", de: "Scharfe Hähnchen-Pizza", bs: "Ljuta pileća pizza", tr: "Acılı tavuklu pizza", ar: "بيتزا دجاج حارّة", zh: "香辣鸡肉披萨" },
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
    naziv: { sl: "Šehere burger", en: "Shehere burger", de: "Šehere Burger", bs: "Šehere burger", tr: "Šehere burger", ar: "برغر شهيري", zh: "Šehere 汉堡" },
    opis: {
      sl: "Dvojna govedina, karamelizirana čebula in hišni preliv.",
      en: "Double beef patty, caramelised onion and house sauce.",
      de: "Doppeltes Rindfleisch, karamellisierte Zwiebeln und Hausdressing.",
      bs: "Dupla govedina, karamelizirani luk i kućni preliv.",
      tr: "Çift dana köftesi, karamelize soğan ve ev yapımı sos.",
      ar: "قطعتا لحم بقري وبصل مكرمل وصلصة البيت.",
      zh: "双层牛肉、焦糖洋葱与本店特调酱。",
    },
    sastojci: {
          sl: ["Govedina 2×100 g", "Karamelizirana čebula", "Solata", "Hišni preliv"],
          en: ["Beef 2×100 g", "Caramelised onion", "Lettuce", "House sauce"],
          de: ["Rindfleisch 2×100 g", "Karamellisierte Zwiebeln", "Salat", "Hausdressing"],
          bs: ["Govedina 2×100 g", "Karamelizirani luk", "Salata", "Kućni preliv"],
          tr: ["Dana eti 2×100 g", "Karamelize soğan", "Salata", "Ev yapımı sos"],
          ar: ["لحم بقري 2×100 غ", "بصل مكرمل", "سلطة", "صلصة البيت"],
          zh: ["牛肉 2×100 克", "焦糖洋葱", "生菜", "本店特调酱"],
        },
    alergeni: ["gluten", "laktoza", "jaja", "gorusica"],
    slikaUrl: SLIKA.burger,
    slikaAlt: { sl: "Šehere burger z dvojno govedino", en: "Double beef burger", de: "Šehere Burger mit doppeltem Rindfleisch", bs: "Šehere burger s duplom govedinom", tr: "Çift dana köfteli Šehere burger", ar: "برغر شهيري بقطعتَي لحم بقري", zh: "双层牛肉 Šehere 汉堡" },
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
    naziv: { sl: "Cheeseburger", en: "Cheeseburger", de: "Cheeseburger", bs: "Cheeseburger", tr: "Cheeseburger", ar: "تشيزبرغر", zh: "芝士汉堡" },
    opis: {
      sl: "Govedina, čedar in kisle kumarice v mehki žemlji.",
      en: "Beef, cheddar and pickles in a soft bun.",
      de: "Rindfleisch, Cheddar und Essiggurken im weichen Brötchen.",
      bs: "Govedina, čedar i kiseli krastavci u mekanom pecivu.",
      tr: "Yumuşak ekmekte dana köftesi, cheddar ve turşu.",
      ar: "لحم بقري وجبن شيدر ومخلّل خيار في خبزة طرية.",
      zh: "松软面包夹牛肉、切达芝士与酸黄瓜。",
    },
    sastojci: {
          sl: ["Govedina 150 g", "Čedar", "Kisle kumarice", "Ketchup", "Gorčica"],
          en: ["Beef 150 g", "Cheddar", "Pickles", "Ketchup", "Mustard"],
          de: ["Rindfleisch 150 g", "Cheddar", "Essiggurken", "Ketchup", "Senf"],
          bs: ["Govedina 150 g", "Čedar", "Kiseli krastavci", "Kečap", "Senf"],
          tr: ["Dana eti 150 g", "Cheddar", "Turşu", "Ketçap", "Hardal"],
          ar: ["لحم بقري 150 غ", "شيدر", "مخلّل خيار", "كاتشب", "خردل"],
          zh: ["牛肉 150 克", "切达芝士", "酸黄瓜", "番茄酱", "芥末"],
        },
    alergeni: ["gluten", "laktoza", "gorusica"],
    slikaUrl: SLIKA.burger,
    slikaAlt: { sl: "Cheeseburger s čedarjem", en: "Cheeseburger with cheddar", de: "Cheeseburger mit Cheddar", bs: "Cheeseburger s čedarom", tr: "Cheddar'lı cheeseburger", ar: "تشيزبرغر بالشيدر", zh: "切达芝士汉堡" },
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
    naziv: { sl: "Piščančji burger", en: "Chicken burger", de: "Hähnchenburger", bs: "Pileći burger", tr: "Tavuk burger", ar: "برغر دجاج", zh: "鸡肉汉堡" },
    opis: {
      sl: "Hrustljav piščančji file s solato in majonezo.",
      en: "Crispy chicken fillet with lettuce and mayonnaise.",
      de: "Knuspriges Hähnchenfilet mit Salat und Mayonnaise.",
      bs: "Hrskavi pileći file sa salatom i majonezom.",
      tr: "Salata ve mayonezle çıtır tavuk fileto.",
      ar: "شريحة دجاج مقرمشة مع السلطة والمايونيز.",
      zh: "酥脆鸡排配生菜与蛋黄酱。",
    },
    sastojci: {
          sl: ["Piščančji file", "Solata", "Paradižnik", "Majoneza"],
          en: ["Chicken fillet", "Lettuce", "Tomato", "Mayonnaise"],
          de: ["Hähnchenfilet", "Salat", "Tomate", "Mayonnaise"],
          bs: ["Pileći file", "Salata", "Paradajz", "Majoneza"],
          tr: ["Tavuk fileto", "Salata", "Domates", "Mayonez"],
          ar: ["شريحة دجاج", "سلطة", "طماطم", "مايونيز"],
          zh: ["鸡排", "生菜", "番茄", "蛋黄酱"],
        },
    alergeni: ["gluten", "jaja"],
    slikaUrl: SLIKA.burger,
    slikaAlt: { sl: "Piščančji burger", en: "Chicken burger", de: "Hähnchenburger", bs: "Pileći burger", tr: "Tavuk burger", ar: "برغر دجاج", zh: "鸡肉汉堡" },
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
    naziv: { sl: "Falafel v jufki", en: "Falafel in yufka", de: "Falafel im Yufka", bs: "Falafel u jufki", tr: "Yufkada falafel", ar: "فلافل في الرقاق", zh: "卷饼沙拉三明治" },
    opis: {
      sl: "Ocvrte kroglice iz čičerike s sezamovim prelivom.",
      en: "Fried chickpea balls with sesame sauce.",
      de: "Frittierte Kichererbsenbällchen mit Sesamsauce.",
      bs: "Pržene kuglice od slanutka sa sezam prelivom.",
      tr: "Susam soslu kızarmış nohut topları.",
      ar: "أقراص حمّص مقلية مع صلصة السمسم.",
      zh: "炸鹰嘴豆丸子配芝麻酱。",
    },
    sastojci: {
          sl: ["Čičerika", "Peteršilj", "Jufka", "Tahini preliv", "Solata"],
          en: ["Chickpeas", "Parsley", "Yufka", "Tahini sauce", "Lettuce"],
          de: ["Kichererbsen", "Petersilie", "Yufka", "Tahini-Sauce", "Salat"],
          bs: ["Slanutak", "Peršin", "Jufka", "Tahini preliv", "Salata"],
          tr: ["Nohut", "Maydanoz", "Yufka", "Tahin sosu", "Salata"],
          ar: ["حمّص", "بقدونس", "رقاق", "صلصة طحينة", "سلطة"],
          zh: ["鹰嘴豆", "欧芹", "卷饼皮", "芝麻酱", "生菜"],
        },
    alergeni: ["gluten", "sezam"],
    slikaUrl: SLIKA.ostalo,
    slikaAlt: { sl: "Falafel v jufki", en: "Falafel in yufka", de: "Falafel im Yufka", bs: "Falafel u jufki", tr: "Yufkada falafel", ar: "فلافل في الرقاق", zh: "卷饼沙拉三明治" },
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
    naziv: { sl: "Falafel plošča", en: "Falafel plate", de: "Falafel-Teller", bs: "Falafel tanjur", tr: "Falafel tabağı", ar: "طبق فلافل", zh: "沙拉三明治拼盘" },
    opis: {
      sl: "Falafel s humusom, solato in toplo pito.",
      en: "Falafel with hummus, salad and warm pita.",
      de: "Falafel mit Hummus, Salat und warmem Pitabrot.",
      bs: "Falafel s humusom, salatom i toplom pitom.",
      tr: "Humus, salata ve sıcak pide ile falafel.",
      ar: "فلافل مع الحمّص والسلطة وخبز دافئ.",
      zh: "沙拉三明治配鹰嘴豆泥、沙拉和温热皮塔饼。",
    },
    sastojci: {
          sl: ["Falafel", "Humus", "Sezonska solata", "Pita", "Tahini preliv"],
          en: ["Falafel", "Hummus", "Seasonal salad", "Pita", "Tahini sauce"],
          de: ["Falafel", "Hummus", "Saisonsalat", "Pita", "Tahini-Sauce"],
          bs: ["Falafel", "Humus", "Sezonska salata", "Pita", "Tahini preliv"],
          tr: ["Falafel", "Humus", "Mevsim salatası", "Pide", "Tahin sosu"],
          ar: ["فلافل", "حمّص", "سلطة الموسم", "خبز", "صلصة طحينة"],
          zh: ["沙拉三明治", "鹰嘴豆泥", "时令沙拉", "皮塔饼", "芝麻酱"],
        },
    alergeni: ["gluten", "sezam"],
    slikaUrl: SLIKA.ostalo,
    slikaAlt: { sl: "Falafel plošča s humusom", en: "Falafel plate with hummus", de: "Falafel-Teller mit Hummus", bs: "Falafel tanjur s humusom", tr: "Humuslu falafel tabağı", ar: "طبق فلافل مع الحمّص", zh: "鹰嘴豆泥沙拉三明治拼盘" },
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
    naziv: { sl: "Čevapčiči", en: "Ćevapčići", de: "Ćevapčići", bs: "Ćevapčići", tr: "Köfte", ar: "تشيفابتشيتشي", zh: "巴尔干烤肉肠" },
    opis: {
      sl: "Deset kosov v lepinji, s čebulo in ajvarjem.",
      en: "Ten pieces in flatbread, with onion and ajvar.",
      de: "Zehn Stück im Fladenbrot, mit Zwiebeln und Ajvar.",
      bs: "Deset komada u lepinji, s lukom i ajvarom.",
      tr: "Pide ekmeğinde on adet, soğan ve ajvar ile.",
      ar: "عشر قطع في خبز مسطّح، مع البصل والأيفار.",
      zh: "十条烤肉肠夹在薄饼中，配洋葱和红椒酱。",
    },
    sastojci: {
          sl: ["Mleta govedina", "Lepinja", "Čebula", "Ajvar", "Kajmak"],
          en: ["Minced beef", "Flatbread", "Onion", "Ajvar", "Kajmak"],
          de: ["Rinderhackfleisch", "Fladenbrot", "Zwiebel", "Ajvar", "Kajmak"],
          bs: ["Mljevena govedina", "Lepinja", "Luk", "Ajvar", "Kajmak"],
          tr: ["Dana kıyma", "Pide ekmeği", "Soğan", "Ajvar", "Kaymak"],
          ar: ["لحم بقري مفروم", "خبز مسطّح", "بصل", "أيفار", "قيمق"],
          zh: ["牛肉馅", "薄饼", "洋葱", "红椒酱", "奶油奶酪"],
        },
    alergeni: ["gluten", "laktoza"],
    slikaUrl: SLIKA.ostalo,
    slikaAlt: { sl: "Čevapčiči v lepinji", en: "Ćevapčići in flatbread", de: "Ćevapčići im Fladenbrot", bs: "Ćevapčići u lepinji", tr: "Pide ekmeğinde köfte", ar: "تشيفابتشيتشي في خبز مسطّح", zh: "薄饼夹烤肉肠" },
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
    naziv: { sl: "Piščančji file z žara", en: "Grilled chicken fillet", de: "Hähnchenfilet vom Grill", bs: "Pileći file s žara", tr: "Izgara tavuk fileto", ar: "شريحة دجاج مشوية", zh: "炭烤鸡排" },
    opis: {
      sl: "File z žara s pečeno zelenjavo in rižem.",
      en: "Grilled fillet with roasted vegetables and rice.",
      de: "Gegrilltes Filet mit Röstgemüse und Reis.",
      bs: "File s žara s pečenim povrćem i rižom.",
      tr: "Izgara fileto, közlenmiş sebze ve pilav ile.",
      ar: "شريحة مشوية مع خضار مشوية وأرز.",
      zh: "炭烤鸡排配烤蔬菜和米饭。",
    },
    sastojci: {
          sl: ["Piščančji file", "Riž", "Pečena zelenjava", "Limona"],
          en: ["Chicken fillet", "Rice", "Roasted vegetables", "Lemon"],
          de: ["Hähnchenfilet", "Reis", "Röstgemüse", "Zitrone"],
          bs: ["Pileći file", "Riža", "Pečeno povrće", "Limun"],
          tr: ["Tavuk fileto", "Pilav", "Közlenmiş sebze", "Limon"],
          ar: ["شريحة دجاج", "أرز", "خضار مشوية", "ليمون"],
          zh: ["鸡排", "米饭", "烤蔬菜", "柠檬"],
        },
    alergeni: [],
    slikaUrl: SLIKA.ostalo,
    slikaAlt: { sl: "Piščančji file z žara", en: "Grilled chicken fillet", de: "Hähnchenfilet vom Grill", bs: "Pileći file s žara", tr: "Izgara tavuk fileto", ar: "شريحة دجاج مشوية", zh: "炭烤鸡排" },
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
    naziv: { sl: "Pomfri", en: "Fries", de: "Pommes frites", bs: "Pomfrit", tr: "Patates kızartması", ar: "بطاطس مقلية", zh: "薯条" },
    opis: {
      sl: "Hrustljav pomfri z morsko soljo.",
      en: "Crispy fries with sea salt.",
      de: "Knusprige Pommes mit Meersalz.",
      bs: "Hrskavi pomfrit s morskom soli.",
      tr: "Deniz tuzlu çıtır patates.",
      ar: "بطاطس مقرمشة بملح البحر.",
      zh: "香脆薯条配海盐。",
    },
    sastojci: {
          sl: ["Krompir", "Morska sol"],
          en: ["Potato", "Sea salt"],
          de: ["Kartoffeln", "Meersalz"],
          bs: ["Krompir", "Morska so"],
          tr: ["Patates", "Deniz tuzu"],
          ar: ["بطاطس", "ملح بحر"],
          zh: ["土豆", "海盐"],
        },
    alergeni: [],
    slikaUrl: SLIKA.ostalo,
    slikaAlt: { sl: "Porcija pomfrija", en: "Portion of fries", de: "Portion Pommes", bs: "Porcija pomfrita", tr: "Patates porsiyonu", ar: "حصة بطاطس مقلية", zh: "一份薯条" },
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
    naziv: { sl: "Česnov kruh", en: "Garlic bread", de: "Knoblauchbrot", bs: "Hljeb s češnjakom", tr: "Sarımsaklı ekmek", ar: "خبز بالثوم", zh: "蒜香面包" },
    opis: {
      sl: "Topel kruh s česnovim maslom in peteršiljem.",
      en: "Warm bread with garlic butter and parsley.",
      de: "Warmes Brot mit Knoblauchbutter und Petersilie.",
      bs: "Topli hljeb s maslacem od češnjaka i peršinom.",
      tr: "Sarımsaklı tereyağı ve maydanozlu sıcak ekmek.",
      ar: "خبز دافئ بزبدة الثوم والبقدونس.",
      zh: "温热面包配蒜香黄油与欧芹。",
    },
    sastojci: {
          sl: ["Kruh", "Česnovo maslo", "Peteršilj"],
          en: ["Bread", "Garlic butter", "Parsley"],
          de: ["Brot", "Knoblauchbutter", "Petersilie"],
          bs: ["Hljeb", "Maslac od češnjaka", "Peršin"],
          tr: ["Ekmek", "Sarımsaklı tereyağı", "Maydanoz"],
          ar: ["خبز", "زبدة ثوم", "بقدونس"],
          zh: ["面包", "蒜香黄油", "欧芹"],
        },
    alergeni: ["gluten", "laktoza"],
    slikaUrl: SLIKA.ostalo,
    slikaAlt: { sl: "Topel česnov kruh", en: "Warm garlic bread", de: "Warmes Knoblauchbrot", bs: "Topli hljeb s češnjakom", tr: "Sıcak sarımsaklı ekmek", ar: "خبز بالثوم دافئ", zh: "温热蒜香面包" },
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
    naziv: { sl: "Sezonska solata", en: "Seasonal salad", de: "Saisonsalat", bs: "Sezonska salata", tr: "Mevsim salatası", ar: "سلطة الموسم", zh: "时令沙拉" },
    opis: {
      sl: "Sveža zelenjava z oljčnim oljem in limono.",
      en: "Fresh vegetables with olive oil and lemon.",
      de: "Frisches Gemüse mit Olivenöl und Zitrone.",
      bs: "Svježe povrće s maslinovim uljem i limunom.",
      tr: "Zeytinyağı ve limonlu taze sebzeler.",
      ar: "خضار طازجة بزيت الزيتون والليمون.",
      zh: "新鲜蔬菜佐橄榄油与柠檬。",
    },
    sastojci: {
          sl: ["Solata", "Paradižnik", "Kumare", "Oljčno olje", "Limona"],
          en: ["Lettuce", "Tomato", "Cucumber", "Olive oil", "Lemon"],
          de: ["Salat", "Tomate", "Gurke", "Olivenöl", "Zitrone"],
          bs: ["Salata", "Paradajz", "Krastavci", "Maslinovo ulje", "Limun"],
          tr: ["Salata", "Domates", "Salatalık", "Zeytinyağı", "Limon"],
          ar: ["سلطة", "طماطم", "خيار", "زيت زيتون", "ليمون"],
          zh: ["生菜", "番茄", "黄瓜", "橄榄油", "柠檬"],
        },
    alergeni: [],
    slikaUrl: SLIKA.ostalo,
    slikaAlt: { sl: "Sezonska solata", en: "Seasonal salad", de: "Saisonsalat", bs: "Sezonska salata", tr: "Mevsim salatası", ar: "سلطة الموسم", zh: "时令沙拉" },
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
    naziv: { sl: "Coca-Cola 0,5 l", en: "Coca-Cola 0.5 l", de: "Coca-Cola 0,5 l", bs: "Coca-Cola 0,5 l", tr: "Coca-Cola 0,5 l", ar: "كوكا كولا 0,5 لتر", zh: "可口可乐 0.5 升" },
    opis: { sl: "Ohlajena, v steklenici.", en: "Chilled, in a bottle.", de: "Gekühlt, in der Flasche.", bs: "Ohlađena, u boci.", tr: "Soğutulmuş, şişede.", ar: "مبرّدة، في زجاجة.", zh: "冰镇瓶装。" },
    sastojci: {
          sl: ["Gazirana pijača"],
          en: ["Carbonated drink"],
          de: ["Kohlensäurehaltiges Getränk"],
          bs: ["Gazirano piće"],
          tr: ["Gazlı içecek"],
          ar: ["مشروب غازي"],
          zh: ["碳酸饮料"],
        },
    alergeni: [],
    slikaUrl: SLIKA.ostalo,
    slikaAlt: { sl: "Steklenica Coca-Cole", en: "Bottle of Coca-Cola", de: "Flasche Coca-Cola", bs: "Boca Coca-Cole", tr: "Şişe Coca-Cola", ar: "زجاجة كوكا كولا", zh: "一瓶可口可乐" },
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
    naziv: { sl: "Ayran 0,3 l", en: "Ayran 0.3 l", de: "Ayran 0,3 l", bs: "Ajran 0,3 l", tr: "Ayran 0,3 l", ar: "عيران 0,3 لتر", zh: "咸酸奶 0.3 升" },
    opis: {
      sl: "Slan jogurtov napitek — klasika ob kebabu.",
      en: "Salted yogurt drink — the classic alongside kebab.",
      de: "Salziges Joghurtgetränk — der Klassiker zum Kebab.",
      bs: "Slani jogurt napitak — klasika uz kebab.",
      tr: "Tuzlu yoğurt içeceği — kebabın klasiği.",
      ar: "مشروب لبن مالح — رفيق الكباب التقليدي.",
      zh: "咸味酸奶饮品——配烤肉的经典搭档。",
    },
    sastojci: {
          sl: ["Jogurt", "Voda", "Sol"],
          en: ["Yogurt", "Water", "Salt"],
          de: ["Joghurt", "Wasser", "Salz"],
          bs: ["Jogurt", "Voda", "So"],
          tr: ["Yoğurt", "Su", "Tuz"],
          ar: ["لبن", "ماء", "ملح"],
          zh: ["酸奶", "水", "盐"],
        },
    alergeni: ["laktoza"],
    slikaUrl: SLIKA.ostalo,
    slikaAlt: { sl: "Kozarec ayrana", en: "Glass of ayran", de: "Glas Ayran", bs: "Čaša ajrana", tr: "Bir bardak ayran", ar: "كأس عيران", zh: "一杯咸酸奶" },
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
    naziv: { sl: "Naravna voda 0,5 l", en: "Still water 0.5 l", de: "Stilles Wasser 0,5 l", bs: "Prirodna voda 0,5 l", tr: "Doğal su 0,5 l", ar: "مياه طبيعية 0,5 لتر", zh: "天然水 0.5 升" },
    opis: { sl: "Negazirana izvirska voda.", en: "Still spring water.", de: "Stilles Quellwasser.", bs: "Negazirana izvorska voda.", tr: "Gazsız kaynak suyu.", ar: "مياه ينابيع غير غازية.", zh: "无气泉水。" },
    sastojci: {
          sl: ["Izvirska voda"],
          en: ["Spring water"],
          de: ["Quellwasser"],
          bs: ["Izvorska voda"],
          tr: ["Kaynak suyu"],
          ar: ["مياه ينابيع"],
          zh: ["泉水"],
        },
    alergeni: [],
    slikaUrl: SLIKA.ostalo,
    slikaAlt: { sl: "Steklenica vode", en: "Bottle of water", de: "Flasche Wasser", bs: "Boca vode", tr: "Şişe su", ar: "زجاجة ماء", zh: "一瓶水" },
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
    naziv: { sl: "Študentski meni", en: "Student menu", de: "Studentenmenü", bs: "Studentski meni", tr: "Öğrenci menüsü", ar: "قائمة الطلاب", zh: "学生套餐" },
    opis: {
      sl: "Glavna jed po izbiri, juha, solata, jabolko in pijača.",
      en: "Main course of choice, soup, salad, apple and a drink.",
      de: "Hauptgericht nach Wahl, Suppe, Salat, Apfel und Getränk.",
      bs: "Glavno jelo po izboru, juha, salata, jabuka i piće.",
      tr: "Seçtiğiniz ana yemek, çorba, salata, elma ve içecek.",
      ar: "طبق رئيسي من اختياركم، وحساء، وسلطة، وتفاحة، ومشروب.",
      zh: "自选主菜、汤、沙拉、一个苹果和一份饮料。",
    },
    sastojci: {
          sl: ["Glavna jed po izbiri", "Juha", "Solata", "Jabolko", "Pijača"],
          en: ["Main course of choice", "Soup", "Salad", "Apple", "Drink"],
          de: ["Hauptgericht nach Wahl", "Suppe", "Salat", "Apfel", "Getränk"],
          bs: ["Glavno jelo po izboru", "Juha", "Salata", "Jabuka", "Piće"],
          tr: ["Seçtiğiniz ana yemek", "Çorba", "Salata", "Elma", "İçecek"],
          ar: ["طبق رئيسي من اختياركم", "حساء", "سلطة", "تفاحة", "مشروب"],
          zh: ["自选主菜", "汤", "沙拉", "苹果", "饮料"],
        },
    alergeni: ["gluten", "laktoza"],
    slikaUrl: SLIKA.ostalo,
    slikaAlt: { sl: "Študentski meni", en: "Student menu", de: "Studentenmenü", bs: "Studentski meni", tr: "Öğrenci menüsü", ar: "قائمة الطلاب", zh: "学生套餐" },
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
    naziv: { sl: "Družinski meni", en: "Family menu", de: "Familienmenü", bs: "Porodični meni", tr: "Aile menüsü", ar: "قائمة العائلة", zh: "家庭套餐" },
    opis: {
      sl: "Štiri glavne jedi, dve veliki prilogi in štiri pijače.",
      en: "Four main courses, two large sides and four drinks.",
      de: "Vier Hauptgerichte, zwei große Beilagen und vier Getränke.",
      bs: "Četiri glavna jela, dva velika priloga i četiri pića.",
      tr: "Dört ana yemek, iki büyük garnitür ve dört içecek.",
      ar: "أربعة أطباق رئيسية، وطبقان جانبيان كبيران، وأربعة مشروبات.",
      zh: "四份主菜、两份大配菜和四杯饮料。",
    },
    sastojci: {
          sl: ["4× glavna jed", "2× velika priloga", "4× pijača"],
          en: ["4× main course", "2× large side", "4× drink"],
          de: ["4× Hauptgericht", "2× große Beilage", "4× Getränk"],
          bs: ["4× glavno jelo", "2× veliki prilog", "4× piće"],
          tr: ["4× ana yemek", "2× büyük garnitür", "4× içecek"],
          ar: ["4× طبق رئيسي", "2× طبق جانبي كبير", "4× مشروب"],
          zh: ["4× 主菜", "2× 大份配菜", "4× 饮料"],
        },
    alergeni: ["gluten", "laktoza", "sezam"],
    slikaUrl: SLIKA.ostalo,
    slikaAlt: { sl: "Družinski meni za štiri", en: "Family menu for four", de: "Familienmenü für vier", bs: "Porodični meni za četvero", tr: "Dört kişilik aile menüsü", ar: "قائمة عائلية لأربعة أشخاص", zh: "四人家庭套餐" },
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
    { datum: "2026-12-25", termin: null, napomena: { sl: "Božič", en: "Christmas", de: "Weihnachten", bs: "Božić", tr: "Noel", ar: "عيد الميلاد", zh: "圣诞节" } },
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
    { datum: "2026-12-25", termin: null, napomena: { sl: "Božič", en: "Christmas", de: "Weihnachten", bs: "Božić", tr: "Noel", ar: "عيد الميلاد", zh: "圣诞节" } },
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
      de: "Das erste Lokal von Šeherezada steht seit 2009 in der Trubarjeva. Wir haben am längsten in der Stadt geöffnet — am Wochenende bis fünf Uhr morgens, wenn die meisten Küchen längst zu sind.",
      bs: "Prvi lokal Šeherezade stoji u Trubarjevoj od 2009. godine. Otvoreni smo najduže u gradu — vikendom do pet ujutro, kada je većina kuhinja odavno zatvorena.",
      tr: "Šeherezada'nın ilk şubesi 2009'dan beri Trubarjeva'da. Şehirde en geç saate kadar açık olan biziz — hafta sonları sabahın beşine kadar, mutfakların çoğu çoktan kapandığında.",
      ar: "أول فرع لشهرزاد قائم في تروبارييفا منذ عام 2009. ونحن الأطول عملاً في المدينة — في عطلة نهاية الأسبوع حتى الخامسة فجراً، حين تكون معظم المطابخ قد أُغلقت.",
      zh: "Šeherezada 的第一家店自 2009 年起坐落在 Trubarjeva。我们是全城营业最晚的——周末到凌晨五点，那时大多数厨房早已打烊。",
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
      de: "Das Lokal in der Slovenska ist größer und heller, mit zwanzig Sitzplätzen und Tischen am Fenster. Geeignet für ein längeres Mittagessen, nicht nur zum Mitnehmen.",
      bs: "Lokal u Slovenskoj je veći i svjetliji, s dvadeset sjedećih mjesta i stolovima uz prozor. Prikladan za duži ručak, ne samo za hranu za ponijeti.",
      tr: "Slovenska şubesi daha büyük ve daha aydınlık; yirmi oturma yeri ve pencere kenarında masaları var. Yalnızca paket servis için değil, uzun bir öğle yemeği için de uygun.",
      ar: "فرع سلوفينسكا أكبر وأكثر إضاءة، وفيه عشرون مقعداً وطاولات بجانب النافذة. يصلح لغداء متأنٍّ، لا للطلبات الخارجية وحدها.",
      zh: "Slovenska 店更大也更明亮，有二十个座位和靠窗的餐桌。适合坐下来慢慢吃午饭，而不只是外带。",
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
      de: "Das dritte Lokal entsteht an der Dunajska cesta. Die Eröffnung planen wir für die kommenden Monate.",
      bs: "Treći lokal se priprema u Dunajskoj cesti. Otvorenje planiramo u narednim mjesecima.",
      tr: "Üçüncü şube Dunajska caddesinde hazırlanıyor. Açılışı önümüzdeki aylarda planlıyoruz.",
      ar: "الفرع الثالث قيد التحضير في شارع دوناييسكا. ونخطّط لافتتاحه في الأشهر المقبلة.",
      zh: "第三家门店正在 Dunajska cesta 筹备中。我们计划在未来几个月内开业。",
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
