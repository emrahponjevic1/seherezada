import type { Prevod } from "@/lib/domain"
import type { SeoPage } from "@/lib/route"

/**
 * Sadržaj osam SEO stranica.
 *
 * Blokovi 3, 4 i 7 imaju STVARNO svoj tekst na svakoj stranici — nisu
 * nastali zamjenom jedne riječi. Blok 5 (ponuda i cijene) se ne piše
 * ovdje nego se čita iz repozitorija, da se cijena nikad ne prepisuje
 * u tekst i ne zastari.
 */

export interface SadrzajSeo {
  naslov: Prevod
  uvod: Prevod
  blok3: { naslov: Prevod; tekst: Prevod }
  blok4: { naslov: Prevod; tekst: Prevod }
  /** Kategorija čija se ponuda prikazuje u bloku 5; `null` = cijeli meni. */
  kategorija: string | null
  /** Ako stranica upućuje na tačno određen lokal (npr. noćna hrana). */
  samoLokal?: string
  pitanja: { pitanje: Prevod; odgovor: Prevod }[]
  srodne: SeoPage[]
}

export const SADRZAJ_SEO: Record<SeoPage, SadrzajSeo> = {
  // ───────────────────────────────────────────────────────────
  "kebab-ljubljana": {
    naslov: { sl: "Kebab v Ljubljani", en: "Kebab in Ljubljana" },
    uvod: {
      sl: "Halal döner kebab v središču Ljubljane, z mesom, ki ga režemo na roko z vertikalnega žara. Odprti smo dlje kot večina — ob koncu tedna na Trubarjevi do petih zjutraj. Kruh pečemo vsak dan sami, meso pa marinira štiriindvajset ur po receptu, ki je v družini od leta 1998.",
      en: "Halal döner kebab in central Ljubljana, with meat carved by hand from the vertical grill. We stay open longer than most — until five in the morning at Trubarjeva on weekends. We bake our bread daily, and the meat marinates for twenty-four hours to a family recipe dating from 1998.",
    },
    blok3: {
      naslov: { sl: "Kaj je döner kebab", en: "What is döner kebab" },
      tekst: {
        sl: "Döner je turška jed, pri kateri se plasti mariniranega mesa nabodejo na navpično os in počasi pečejo ob viru toplote. Ime pomeni „vrteče se“ — os se ves čas obrača, da se meso peče enakomerno. Ko je zunanja plast pečena, se odreže in postreže, notranjost pa se peče naprej.",
        en: "Döner is a Turkish dish in which layers of marinated meat are stacked on a vertical spit and slowly cooked beside a heat source. The name means “turning” — the spit rotates constantly so the meat cooks evenly. Once the outer layer is done it is carved off and served, while the inside keeps cooking.",
      },
    },
    blok4: {
      naslov: { sl: "Kako ga pripravljamo", en: "How we prepare it" },
      tekst: {
        sl: "Meso zložimo na os zvečer, da se marinada vleče čez noč. Zjutraj os postavimo na žar, kjer se peče počasi, ves dan. Režemo na roko in ne s strojem: rezine so debelejše in ostanejo sočne. Kruh gre za trenutek na žar, preden ga napolnimo, da ostane mehak znotraj in hrustljav zunaj.",
        en: "We stack the meat on the spit in the evening so the marinade works through overnight. In the morning the spit goes on the grill, where it cooks slowly all day. We carve by hand rather than by machine: the slices are thicker and stay juicy. The bread goes on the grill for a moment before filling, so it stays soft inside and crisp outside.",
      },
    },
    kategorija: "kebab",
    pitanja: [
      {
        pitanje: { sl: "Kakšno meso je v kebabu?", en: "What meat is in the kebab?" },
        odgovor: {
          sl: "Mešanica govedine in teletine, oboje halal. Piščančji döner pripravimo na posebni osi, da se mesi ne mešata.",
          en: "A mix of beef and veal, both halal. Chicken döner is prepared on a separate spit so the meats do not mix.",
        },
      },
      {
        pitanje: { sl: "Kakšna je razlika med kebabom v kruhu in v jufki?", en: "What is the difference between kebab in bread and in yufka?" },
        odgovor: {
          sl: "V kruhu je porcija večja in bolj sita, jufka pa je tanka in tesno zavita, zato je primernejša za hojo. Vsebina je enaka.",
          en: "In bread the portion is larger and more filling; yufka is thin and tightly rolled, so it travels better. The filling is the same.",
        },
      },
      {
        pitanje: { sl: "Je kebab pikanten?", en: "Is the kebab spicy?" },
        odgovor: {
          sl: "Osnovni ni. Dürüm ima ostrejši preliv, pikantno omako pa lahko pri katerikoli jedi naročite posebej ali izpustite.",
          en: "The standard one is not. The dürüm has a spicier sauce, and with any dish you can order the hot sauce on the side or leave it out.",
        },
      },
    ],
    srodne: ["halal-hrana-ljubljana", "nocna-hrana-ljubljana", "falafel-ljubljana"],
  },

  // ───────────────────────────────────────────────────────────
  "pizza-ljubljana": {
    naslov: { sl: "Pizza v Ljubljani", en: "Pizza in Ljubljana" },
    uvod: {
      sl: "Pice iz testa, ki vzhaja štiriindvajset ur, pečene na kamniti plošči pri visoki temperaturi. Vse sestavine so halal, tudi salame in šunke — kar pomeni, da lahko pri nas naročite pico, ki je drugod pogosto ni na voljo. Ponudba je enaka v obeh lokalih.",
      en: "Pizzas from dough proofed for twenty-four hours, baked on a stone slab at high temperature. All ingredients are halal, including the salamis and hams — which means you can order a pizza here that is often unavailable elsewhere. The offering is the same in both locations.",
    },
    blok3: {
      naslov: { sl: "Zakaj je testo pomembno", en: "Why the dough matters" },
      tekst: {
        sl: "Testo, ki vzhaja dlje, razvije več okusa in je lažje prebavljivo, ker kvasovke porabijo večino sladkorjev. Naše počiva štiriindvajset ur v hladilniku, kar upočasni vzhajanje in da skorji mehurčke, ki se pri peki napihnejo. Hitro testo tega ne zmore, pa naj bo peč še tako vroča.",
        en: "Dough that proofs longer develops more flavour and is easier to digest, because the yeast consumes most of the sugars. Ours rests for twenty-four hours in the fridge, which slows the rise and gives the crust bubbles that puff up in the oven. Fast dough cannot do this, however hot the oven.",
      },
    },
    blok4: {
      naslov: { sl: "Kako jih pečemo", en: "How we bake them" },
      tekst: {
        sl: "Pico raztegnemo z roko, nikoli z valjarjem, da rob ostane zračen. Peče se na kamniti plošči, ki odvzame vlago in da dno hrustljavost. Ker je peč vroča, traja peka le nekaj minut — zato pice pripravljamo sproti in ne vnaprej.",
        en: "We stretch the pizza by hand, never with a rolling pin, so the rim stays airy. It bakes on a stone slab, which draws out moisture and gives the base its crispness. Because the oven is hot, baking takes only a few minutes — which is why we make pizzas to order and never in advance.",
      },
    },
    kategorija: "pice",
    pitanja: [
      {
        pitanje: { sl: "So vse pice halal?", en: "Are all pizzas halal?" },
        odgovor: {
          sl: "Da. Vse mesne obloge so halal, svinjine v kuhinji sploh nimamo, testo pa je brez alkohola.",
          en: "Yes. All meat toppings are halal, there is no pork in the kitchen at all, and the dough contains no alcohol.",
        },
      },
      {
        pitanje: { sl: "Imate vegetarijanske pice?", en: "Do you have vegetarian pizzas?" },
        odgovor: {
          sl: "Margerita in vegetariana sta vegetarijanski. Vsaka pica ima na meniju oznako, če je vegetarijanska.",
          en: "Margherita and vegetariana are vegetarian. Every pizza on the menu is labelled if it is vegetarian.",
        },
      },
      {
        pitanje: { sl: "Koliko časa čakam na pico?", en: "How long is the wait for a pizza?" },
        odgovor: {
          sl: "Približno petnajst minut, ker jo pripravimo šele ob naročilu. Ob koncu tedna zvečer je lahko dlje.",
          en: "About fifteen minutes, because we only start it once you order. Late at weekends it can take longer.",
        },
      },
    ],
    srodne: ["burger-ljubljana", "dostava-ljubljana", "halal-hrana-ljubljana"],
  },

  // ───────────────────────────────────────────────────────────
  "burger-ljubljana": {
    naslov: { sl: "Burger v Ljubljani", en: "Burger in Ljubljana" },
    uvod: {
      sl: "Halal burgerji iz sveže mletega mesa in žemelj, ki jih pečemo sami. Meso meljemo vsak dan in ga ne zamrzujemo — pleskavica gre na žar v nekaj urah po mletju. Prav to je razlog, da burgerjev ne pripravljamo vnaprej in da jih ob največji gneči lahko počakate nekaj minut dlje.",
      en: "Halal burgers from freshly ground meat and buns we bake ourselves. We grind the meat daily and never freeze it — the patty hits the grill within hours of grinding. That is exactly why we do not prepare burgers in advance, and why at peak times you may wait a few minutes longer.",
    },
    blok3: {
      naslov: { sl: "Kaj naredi dober burger", en: "What makes a good burger" },
      tekst: {
        sl: "Razmerje med pustim mesom in maščobo. Premalo maščobe in pleskavica je suha, preveč in se razpade na žaru. Držimo se približno osemdesetih odstotkov pustega mesa, kar je dovolj, da ostane sočna, a se drži skupaj. Meso solimo šele tik pred peko, ker sol prej izvleče vodo.",
        en: "The ratio of lean meat to fat. Too little fat and the patty is dry; too much and it falls apart on the grill. We stay at roughly eighty per cent lean, which is enough to keep it juicy while holding together. We salt the meat only just before cooking, because salt draws out water beforehand.",
      },
    },
    blok4: {
      naslov: { sl: "Kako jih pripravljamo", en: "How we prepare them" },
      tekst: {
        sl: "Pleskavico stisnemo na vroč žar in je ne obračamo več kot enkrat, da se skorja lepo naredi. Žemljo prerežemo in za pol minute položimo na žar, da se navzame maščobe in ne premoči. Sestavljamo po vrsti: omaka, solata, meso, sir — tako spodnji del ostane suh do konca.",
        en: "We press the patty onto a hot grill and turn it no more than once, so the crust forms properly. The bun is halved and laid on the grill for half a minute, so it takes on some fat and does not go soggy. We assemble in order: sauce, lettuce, meat, cheese — that way the base stays dry to the last bite.",
      },
    },
    kategorija: "burgeri",
    pitanja: [
      {
        pitanje: { sl: "So burgerji res halal?", en: "Are the burgers really halal?" },
        odgovor: {
          sl: "Da. Govedina prihaja od istih halal dobaviteljev kot meso za kebab, slanine pa v kuhinji sploh nimamo.",
          en: "Yes. The beef comes from the same halal suppliers as the kebab meat, and there is no bacon in the kitchen at all.",
        },
      },
      {
        pitanje: { sl: "Lahko dobim burger brez sira?", en: "Can I get a burger without cheese?" },
        odgovor: {
          sl: "Seveda. Sestavine lahko izpustite ali dodate, samo povejte pri naročilu.",
          en: "Of course. You can leave ingredients out or add them, just say so when ordering.",
        },
      },
      {
        pitanje: { sl: "Imate vegetarijanski burger?", en: "Do you have a vegetarian burger?" },
        odgovor: {
          sl: "Zaenkrat ne, imamo pa falafel v jufki in falafel ploščo, ki sta povsem rastlinska.",
          en: "Not at the moment, but we do have falafel in yufka and the falafel plate, both fully plant-based.",
        },
      },
    ],
    srodne: ["pizza-ljubljana", "studentski-meni-ljubljana", "halal-hrana-ljubljana"],
  },

  // ───────────────────────────────────────────────────────────
  "falafel-ljubljana": {
    naslov: { sl: "Falafel v Ljubljani", en: "Falafel in Ljubljana" },
    uvod: {
      sl: "Falafel iz čičerike, svežih zelišč in sezama — povsem rastlinski, brez mesa in brez jajc. Kroglice oblikujemo sproti in cvremo šele ob naročilu, ker falafel, ki čaka, izgubi hrustljavost v nekaj minutah. Postrežemo ga v jufki ali kot ploščo s humusom in solato.",
      en: "Falafel from chickpeas, fresh herbs and sesame — fully plant-based, with no meat and no eggs. We shape the balls as we go and fry them only once you order, because falafel that waits loses its crispness within minutes. We serve it in yufka or as a plate with hummus and salad.",
    },
    blok3: {
      naslov: { sl: "Kaj je falafel", en: "What is falafel" },
      tekst: {
        sl: "Falafel je jed z Bližnjega vzhoda iz mlete čičerike, začinjene s česnom, peteršiljem in kumino. Čičerika se ne kuha, ampak se namaka čez noč in nato zmelje surova — prav to da falafelu značilno rahlo sredico. Kuhana čičerika bi dala gladko kašo, ki v olju razpade.",
        en: "Falafel is a Middle Eastern dish of ground chickpeas seasoned with garlic, parsley and cumin. The chickpeas are not boiled but soaked overnight and then ground raw — and that is exactly what gives falafel its characteristically light centre. Boiled chickpeas would give a smooth paste that disintegrates in the oil.",
      },
    },
    blok4: {
      naslov: { sl: "Kako ga pripravljamo", en: "How we prepare it" },
      tekst: {
        sl: "Čičeriko namočimo zvečer in jo zjutraj zmeljemo z zelišči. Maso pustimo počivati eno uro, da se poveže, nato pa oblikujemo kroglice in jih povaljamo v sezamu. Cvremo v olju, ki ga menjamo vsak dan in v katerem se ne cvre nič mesnega — tako falafel ostane primeren tudi za vegane.",
        en: "We soak the chickpeas in the evening and grind them with the herbs in the morning. The mixture rests for an hour to bind, then we shape the balls and roll them in sesame. We fry in oil that is changed daily and in which nothing containing meat is ever fried — so the falafel remains suitable for vegans.",
      },
    },
    kategorija: "falafel",
    pitanja: [
      {
        pitanje: { sl: "Je falafel veganski?", en: "Is the falafel vegan?" },
        odgovor: {
          sl: "Je. Ne vsebuje mesa, jajc ne mleka, cvremo pa ga v ločenem olju, v katerem se ne cvre nič mesnega.",
          en: "It is. It contains no meat, eggs or milk, and we fry it in separate oil in which nothing with meat is fried.",
        },
      },
      {
        pitanje: { sl: "Vsebuje gluten?", en: "Does it contain gluten?" },
        odgovor: {
          sl: "Same kroglice ne, jufka in pita pa da. Če se izogibate glutenu, naročite falafel ploščo brez pite.",
          en: "The balls themselves do not, but the yufka and pita do. If you avoid gluten, order the falafel plate without the pita.",
        },
      },
      {
        pitanje: { sl: "Kaj je tahini?", en: "What is tahini?" },
        odgovor: {
          sl: "Gosta pasta iz mletega sezama, razredčena z vodo in limono. Vsebuje sezam, kar je pomembno pri alergijah.",
          en: "A thick paste of ground sesame, thinned with water and lemon. It contains sesame, which matters if you have allergies.",
        },
      },
    ],
    srodne: ["halal-hrana-ljubljana", "kebab-ljubljana", "studentski-meni-ljubljana"],
  },

  // ───────────────────────────────────────────────────────────
  "halal-hrana-ljubljana": {
    naslov: { sl: "Halal hrana v Ljubljani", en: "Halal food in Ljubljana" },
    uvod: {
      sl: "Pri Šeherezadi je halal vsaka jed na meniju, ne le kebab. To vključuje burgerje, pice, čevapčiče in vse omake. V kuhinji nimamo svinjine in ne uporabljamo alkohola — niti v testu niti v marinadah. Certifikat dobaviteljev preverjamo enkrat letno in visi ob blagajni v vsakem lokalu.",
      en: "At Šeherezada every dish on the menu is halal, not just the kebab. That includes the burgers, pizzas, ćevapčići and all the sauces. There is no pork in our kitchen and we use no alcohol — neither in the dough nor in the marinades. We verify our suppliers' certification annually, and it hangs by the till in every location.",
    },
    blok3: {
      naslov: { sl: "Zakaj cel meni, ne le kebab", en: "Why the whole menu, not just the kebab" },
      tekst: {
        sl: "Ker se gost, ki išče halal hrano, ne želi vsakič spraševati, katera jed je varna in katera ne. Če je halal le del ponudbe, mora vsakič vprašati — in tvegati, da odgovor ni natančen. Ko je halal vse, vprašanje odpade in gost lahko izbira svobodno, kot vsi ostali.",
        en: "Because a guest looking for halal food should not have to work out which dish is safe and which is not every single time. If only part of the offering is halal, they must ask each visit — and risk an imprecise answer. When everything is halal the question disappears, and the guest can choose freely, like everyone else.",
      },
    },
    blok4: {
      naslov: { sl: "Kako to zagotavljamo", en: "How we guarantee it" },
      tekst: {
        sl: "Nabavljamo pri treh dobaviteljih z veljavnim certifikatom in ne kupujemo mesa nikjer drugje, tudi če zmanjka. Svinjine ni v prostoru, zato navzkrižni stik ni mogoč. Sestavine, ki pogosto skrivajo alkohol — kis, aroma vanilje, nekatere omake — nabavljamo v različicah brez njega.",
        en: "We buy from three certified suppliers and never source meat elsewhere, even if we run short. There is no pork on the premises, so cross-contact is impossible. Ingredients that often hide alcohol — vinegar, vanilla flavouring, certain sauces — we buy in alcohol-free versions.",
      },
    },
    kategorija: null,
    pitanja: [
      {
        pitanje: { sl: "Kdo izdaja certifikat?", en: "Who issues the certificate?" },
        odgovor: {
          sl: "Certifikat imajo naši dobavitelji mesa, izdajajo pa ga priznane certifikacijske hiše v Sloveniji in Avstriji.",
          en: "Our meat suppliers hold the certification, issued by recognised certification bodies in Slovenia and Austria.",
        },
      },
      {
        pitanje: { sl: "Ali točite alkohol?", en: "Do you serve alcohol?" },
        odgovor: {
          sl: "Ne. Alkoholnih pijač ni na meniju in alkohola ne uporabljamo pri pripravi nobene jedi.",
          en: "No. There are no alcoholic drinks on the menu and we use no alcohol in preparing any dish.",
        },
      },
      {
        pitanje: { sl: "Je ponudba v vseh lokalih enaka?", en: "Is the offering the same in all locations?" },
        odgovor: {
          sl: "Ponudba je enaka, razlikujejo se le cene in delovni čas. Halal velja povsod brez izjeme.",
          en: "The offering is the same; only prices and opening hours differ. Halal applies everywhere without exception.",
        },
      },
    ],
    srodne: ["kebab-ljubljana", "falafel-ljubljana", "burger-ljubljana"],
  },

  // ───────────────────────────────────────────────────────────
  "nocna-hrana-ljubljana": {
    naslov: { sl: "Nočna hrana v Ljubljani", en: "Late-night food in Ljubljana" },
    uvod: {
      sl: "Lokal na Trubarjevi cesti 31 je ob petkih in sobotah odprt do petih zjutraj, čez teden pa do druge. To je edini naš lokal, ki dela tako pozno — lokal na Slovenski zapre ob polnoči, zato za nočno jed pridite na Trubarjevo, da ne stojite pred zaprtimi vrati.",
      en: "The location at Trubarjeva cesta 31 is open until five in the morning on Fridays and Saturdays, and until two on weekdays. It is our only location open that late — the Slovenska location closes at midnight, so for a late-night meal come to Trubarjeva rather than finding a closed door.",
    },
    blok3: {
      naslov: { sl: "Kaj je na voljo ponoči", en: "What is available at night" },
      tekst: {
        sl: "Ponoči deluje cel meni, ne skrajšana različica. Kebab in falafel sta pripravljena najhitreje, ker meso in kroglice čakajo pripravljeni; pice zahtevajo približno petnajst minut, ker jih pečemo šele ob naročilu. Pijača in prilogi sta na voljo do zaprtja.",
        en: "At night the full menu runs, not a shortened version. Kebab and falafel are fastest, because the meat and the balls are ready and waiting; pizzas need about fifteen minutes, since we bake them only once ordered. Drinks and sides are available until closing.",
      },
    },
    blok4: {
      naslov: { sl: "Kako poteka pozna izmena", en: "How the late shift works" },
      tekst: {
        sl: "Po polnoči ostaneta v lokalu dva človeka, eden ob žaru in eden ob blagajni. Ker je gneča po zaprtju lokalov največja, priporočamo, da naročilo oddate po telefonu, preden pridete. Zadnje naročilo sprejmemo deset minut pred zaprtjem.",
        en: "After midnight two people stay in the shop, one at the grill and one at the till. Since the rush is heaviest once the bars close, we recommend phoning your order in before you arrive. We take the last order ten minutes before closing.",
      },
    },
    kategorija: null,
    samoLokal: "trubarjeva",
    pitanja: [
      {
        pitanje: { sl: "Kateri lokal je odprt ponoči?", en: "Which location is open at night?" },
        odgovor: {
          sl: "Samo Trubarjeva. Slovenska zapre ob polnoči, zato pozno zvečer pridite na Trubarjevo cesto 31.",
          en: "Only Trubarjeva. Slovenska closes at midnight, so late in the evening come to Trubarjeva cesta 31.",
        },
      },
      {
        pitanje: { sl: "Ali dostavljate ponoči?", en: "Do you deliver at night?" },
        odgovor: {
          sl: "Dostava je odvisna od Wolta in Glova, ki ponoči pogosto ne vozita. Prevzem pri nas deluje do zaprtja.",
          en: "Delivery depends on Wolt and Glovo, which often do not operate at night. Collection from us works until closing.",
        },
      },
      {
        pitanje: { sl: "Do kdaj lahko naročim?", en: "How late can I order?" },
        odgovor: {
          sl: "Zadnje naročilo sprejmemo deset minut pred zaprtjem, torej ob petkih in sobotah do 04:50.",
          en: "We take the last order ten minutes before closing, so until 04:50 on Fridays and Saturdays.",
        },
      },
    ],
    srodne: ["kebab-ljubljana", "dostava-ljubljana", "halal-hrana-ljubljana"],
  },

  // ───────────────────────────────────────────────────────────
  "dostava-ljubljana": {
    naslov: { sl: "Dostava v Ljubljani", en: "Delivery in Ljubljana" },
    uvod: {
      sl: "Dostavljamo prek Wolta in Glova, ki pokrivata središče Ljubljane in bližnjo okolico. Dostava običajno traja med dvajset in petinštirideset minut, odvisno od ure in vremena. Če vam je hitreje, naročilo oddajte po telefonu in ga prevzemite pri pultu — takrat je jed najbolj sveža.",
      en: "We deliver through Wolt and Glovo, which cover central Ljubljana and the surrounding area. Delivery usually takes between twenty and forty-five minutes, depending on the hour and the weather. If it is quicker for you, phone the order in and collect it at the counter — that is when the food is freshest.",
    },
    blok3: {
      naslov: { sl: "Kaj potuje dobro in kaj manj", en: "What travels well and what does not" },
      tekst: {
        sl: "Kebab in čevapčiči prenesejo pot brez težav, ker jih kruh ščiti pred hlajenjem. Pomfri in falafel v petnajstih minutah izgubita hrustljavost, zato ju pakiramo v luknjičasto embalažo, da para uhaja. Pice pošiljamo nerazrezane — če jih razrežemo, se sredina do vaših vrat zmehča.",
        en: "Kebab and ćevapčići survive the journey easily, because the bread protects them from cooling. Fries and falafel lose their crispness within fifteen minutes, so we pack them in perforated boxes to let the steam escape. We send pizzas uncut — cutting them makes the middle go soft before they reach your door.",
      },
    },
    blok4: {
      naslov: { sl: "Kako pakiramo", en: "How we pack" },
      tekst: {
        sl: "Vsako jed pakiramo posebej, omake pa ločeno, da se kruh ne premoči. Topla in hladna jed ne gresta v isto vrečko. Če naročite več jedi, jih zložimo tako, da so težje spodaj — kurirji vozijo s kolesi in embalaža se drugače premakne.",
        en: "We pack each dish separately, with the sauces on the side so the bread does not go soggy. Hot and cold items never go in the same bag. If you order several dishes we stack them with the heavier ones at the bottom — the couriers ride bicycles, and otherwise the packaging shifts.",
      },
    },
    kategorija: null,
    pitanja: [
      {
        pitanje: { sl: "Katera območja pokrivate?", en: "Which areas do you cover?" },
        odgovor: {
          sl: "Območje določata Wolt in Glovo, običajno pa pokrivata središče Ljubljane in soseske do približno štirih kilometrov.",
          en: "The area is set by Wolt and Glovo; typically they cover central Ljubljana and neighbourhoods within about four kilometres.",
        },
      },
      {
        pitanje: { sl: "Koliko stane dostava?", en: "How much does delivery cost?" },
        odgovor: {
          sl: "Ceno določata dostavljalca in se spreminja glede na razdaljo in uro. Vidna je v njuni aplikaciji pred plačilom.",
          en: "The price is set by the delivery services and varies by distance and time. You see it in their app before paying.",
        },
      },
      {
        pitanje: { sl: "Kaj če naročilo pride hladno?", en: "What if the order arrives cold?" },
        odgovor: {
          sl: "Pokličite lokal in javite. Če je napaka naša, jed nadomestimo; za čas prevoza se obrnite tudi na dostavljalca.",
          en: "Call the location and let us know. If the fault is ours we replace the dish; for transit time, contact the delivery service too.",
        },
      },
    ],
    srodne: ["nocna-hrana-ljubljana", "pizza-ljubljana", "kebab-ljubljana"],
  },

  // ───────────────────────────────────────────────────────────
  "studentski-meni-ljubljana": {
    naslov: { sl: "Študentski meni v Ljubljani", en: "Student menu in Ljubljana" },
    uvod: {
      sl: "Bon za študentsko prehrano sprejemamo v obeh odprtih lokalih, ves delovni čas. Študentski meni vključuje glavno jed po izbiri, juho, solato, jabolko in pijačo — torej cel obrok, ne le glavne jedi. Doplačilo je odvisno od izbrane glavne jedi in je vedno navedeno na meniju.",
      en: "We accept the student meal voucher in both open locations, throughout our opening hours. The student menu includes a main course of your choice, soup, salad, an apple and a drink — a full meal, not just the main. Any surcharge depends on the main course chosen and is always stated on the menu.",
    },
    blok3: {
      naslov: { sl: "Kaj vključuje obrok", en: "What the meal includes" },
      tekst: {
        sl: "Po pravilih subvencionirane študentske prehrane mora obrok vsebovati glavno jed, prilogo, sadje in napitek. Pri nas to pomeni jed po izbiri z menija, juho ali solato, jabolko in pijačo. Sadja in juhe ni mogoče zamenjati za dodatno glavno jed, ker to pravila ne dovolijo.",
        en: "Under the rules of the subsidised student meal scheme, a meal must include a main course, a side, fruit and a drink. Here that means a dish of your choice from the menu, soup or salad, an apple and a drink. The fruit and soup cannot be swapped for a second main, because the rules do not allow it.",
      },
    },
    blok4: {
      naslov: { sl: "Kako poteka v praksi", en: "How it works in practice" },
      tekst: {
        sl: "Ob naročilu pokažete bon, izberete glavno jed in povete, ali želite juho ali solato. Doplačilo poravnate s kartico ali gotovino. Bon velja enkrat dnevno in ga ni mogoče uporabiti za družinski meni ali za jedi, ki jih naročite prek dostave.",
        en: "When ordering you show the voucher, pick a main course and say whether you want soup or salad. Any surcharge is paid by card or cash. The voucher is valid once a day and cannot be used for the family menu or for dishes ordered through delivery.",
      },
    },
    kategorija: "meniji",
    pitanja: [
      {
        pitanje: { sl: "Ali bon velja ves dan?", en: "Is the voucher valid all day?" },
        odgovor: {
          sl: "Velja ves naš delovni čas, tudi pozno zvečer, a le enkrat dnevno na osebo.",
          en: "It is valid throughout our opening hours, including late at night, but only once per person per day.",
        },
      },
      {
        pitanje: { sl: "Katere glavne jedi lahko izberem?", en: "Which main courses can I choose?" },
        odgovor: {
          sl: "Vse z menija razen družinskega menija. Pri dražjih jedeh je doplačilo večje, kar je navedeno ob ceni.",
          en: "Anything on the menu except the family menu. Pricier dishes carry a larger surcharge, which is stated next to the price.",
        },
      },
      {
        pitanje: { sl: "Lahko bon uporabim za dostavo?", en: "Can I use the voucher for delivery?" },
        odgovor: {
          sl: "Ne. Subvencija velja le pri osebnem prevzemu v lokalu, tako določajo pravila sheme.",
          en: "No. The subsidy applies only to collection in person at the shop; that is set by the scheme's rules.",
        },
      },
    ],
    srodne: ["burger-ljubljana", "falafel-ljubljana", "kebab-ljubljana"],
  },
}
