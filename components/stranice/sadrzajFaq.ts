import type { PitanjeOdgovor } from "./dijelovi"

/**
 * Dvadeset i četiri pitanja u tri grupe.
 *
 * Pravilo: odgovor je 40–60 riječi i PRVA REČENICA odgovara direktno.
 * Pitanje „Do kdaj ste odprti?" nema odgovor ovdje — izvodi se iz radnog
 * vremena i nabraja sve lokale, pa ga sastavlja sama stranica.
 *
 * Demo sadržaj; prava ponuda i tekst dolaze kroz /chef.
 */

export const HALAL_I_SASTOJCI: PitanjeOdgovor[] = [
  {
    pitanje: { sl: "Je vse meso res halal?", en: "Is all the meat really halal?" },
    odgovor: {
      sl: "Da, vse meso pri nas je halal. Nabavljamo ga pri dobaviteljih s certifikatom, ki ga preverjamo enkrat letno. To velja za vse tri lokale in za vsako jed na meniju — tudi za burgerje in pice, ne le za kebab.",
      en: "Yes, all our meat is halal. We source it from certified suppliers whose certification we verify once a year. This applies to all three locations and every dish on the menu — burgers and pizzas included, not just the kebab.",
    },
  },
  {
    pitanje: { sl: "Imate v kuhinji svinjino?", en: "Is there pork in your kitchen?" },
    odgovor: {
      sl: "Ne, svinjine v naši kuhinji sploh ni. Ne uporabljamo je v nobeni jedi, niti v omakah ali nadevih. Ker je ni v prostoru, ni možnosti navzkrižnega stika pri pripravi.",
      en: "No, there is no pork in our kitchen at all. We do not use it in any dish, sauce or filling. Since it is not on the premises, cross-contact during preparation is not possible.",
    },
  },
  {
    pitanje: { sl: "Uporabljate alkohol pri kuhanju?", en: "Do you use alcohol in cooking?" },
    odgovor: {
      sl: "Ne uporabljamo ga nikjer. Ne v omakah, ne v testu za pice, ne v marinadah. Tudi kis, ki ga uporabljamo, je vinski nadomestek brez alkohola. Alkoholnih pijač ne točimo.",
      en: "We do not use it anywhere. Not in the sauces, not in the pizza dough, not in the marinades. Even the vinegar we use is an alcohol-free substitute. We do not serve alcoholic drinks.",
    },
  },
  {
    pitanje: { sl: "Kje lahko vidim certifikat?", en: "Where can I see the certificate?" },
    odgovor: {
      sl: "Certifikat visi na steni ob blagajni v vsakem lokalu. Če ga želite pogledati podrobneje, ga osebje z veseljem pokaže. Kopijo lahko pošljemo tudi po elektronski pošti.",
      en: "The certificate hangs on the wall next to the till in every location. If you want a closer look, the staff will gladly show it. We can also send a copy by e-mail.",
    },
  },
  {
    pitanje: { sl: "Imate vegetarijansko ponudbo?", en: "Do you have vegetarian options?" },
    odgovor: {
      sl: "Imamo. Falafel v jufki in falafel plošča sta povsem rastlinska, prav tako pomfri in sezonska solata. Med picami sta vegetarijanski margerita in vegetariana. Vsaka jed na meniju ima oznako, če je vegetarijanska ali veganska.",
      en: "We do. Falafel in yufka and the falafel plate are fully plant-based, as are the fries and the seasonal salad. Among the pizzas, margherita and vegetariana are vegetarian. Every dish on the menu is labelled if it is vegetarian or vegan.",
    },
  },
  {
    pitanje: { sl: "Kje najdem alergene?", en: "Where do I find the allergens?" },
    odgovor: {
      sl: "Pri vsaki jedi na meniju — kliknite nanjo in odpre se seznam sestavin in alergenov. Če imate hujšo alergijo, nam to povejte pri naročilu, da jed pripravimo posebej.",
      en: "With every dish on the menu — click on it and a list of ingredients and allergens opens. If you have a severe allergy, tell us when ordering so we can prepare the dish separately.",
    },
  },
  {
    pitanje: { sl: "Je kruh pečen pri vas?", en: "Is the bread baked in-house?" },
    odgovor: {
      sl: "Da, kruh in lepinje pečemo vsak dan v lokalu na Trubarjevi in jih zjutraj razvozimo. Testo za pice vzhaja štiriindvajset ur, kar mu da tanjšo skorjo in boljši okus.",
      en: "Yes, we bake the bread and flatbreads every day at the Trubarjeva location and distribute them in the morning. The pizza dough proofs for twenty-four hours, which gives it a thinner crust and better flavour.",
    },
  },
  {
    pitanje: { sl: "Kako pikantne so jedi?", en: "How spicy is the food?" },
    odgovor: {
      sl: "Večina jedi ni pikantnih. Tiste, ki so, imajo na meniju oznako s papričicami — ena pomeni blago, tri pomeni zelo. Pikantno omako lahko vedno naročite posebej ali jo izpustite.",
      en: "Most dishes are not spicy. Those that are carry a chilli marker on the menu — one means mild, three means very hot. You can always order the spicy sauce on the side or leave it out.",
    },
  },
]

/**
 * Pet pitanja — šesto je „Do kdaj ste odprti?", koje se izvodi iz radnog
 * vremena i nabraja sve lokale, pa ga sastavlja sama stranica.
 */
export const CAS_IN_LOKACIJA: PitanjeOdgovor[] = [
  {
    pitanje: { sl: "Kateri lokal je odprt najdlje?", en: "Which location is open the longest?" },
    odgovor: {
      sl: "Trubarjeva. Ob petkih in sobotah je odprta do petih zjutraj, čez teden do druge. Lokal na Slovenski zapre ob polnoči, zato za pozno večerjo priporočamo Trubarjevo.",
      en: "Trubarjeva. On Fridays and Saturdays it is open until five in the morning, and until two on weekdays. The Slovenska location closes at midnight, so for a late meal we recommend Trubarjeva.",
    },
  },
  {
    pitanje: { sl: "Ali ste odprti ob praznikih?", en: "Are you open on public holidays?" },
    odgovor: {
      sl: "Večinoma da, a z drugačnim delovnim časom. Na božič smo zaprti, na silvestrovo zapremo ob šestih zvečer, na novo leto pa odpremo šele opoldne. Izjeme sproti objavimo na strani lokala.",
      en: "Mostly yes, but with different hours. We are closed on Christmas Day, we close at six in the evening on New Year's Eve, and open only at noon on New Year's Day. Exceptions are posted on the location page.",
    },
  },
  {
    pitanje: { sl: "Imate sedeže?", en: "Do you have seating?" },
    odgovor: {
      sl: "Lokal na Slovenski ima dvajset sedežev in mize ob oknu, primeren je za daljše kosilo. Trubarjeva je manjša in namenjena predvsem jedi s seboj, ima pa nekaj stojišč.",
      en: "The Slovenska location has twenty seats and tables by the window, suitable for a proper sit-down lunch. Trubarjeva is smaller and mainly for takeaway, though it has some standing room.",
    },
  },
  {
    pitanje: { sl: "Kje lahko parkiram?", en: "Where can I park?" },
    odgovor: {
      sl: "Trubarjeva je v območju za pešce, najbližja garaža je Kongresni trg, pet minut hoje. Pri Slovenski je modra cona ob cesti, ob večerih pa je parkiranje pogosto brezplačno.",
      en: "Trubarjeva is in a pedestrian zone; the nearest garage is Kongresni trg, a five-minute walk. Near Slovenska there is blue-zone street parking, and in the evenings it is often free.",
    },
  },
  {
    pitanje: { sl: "Ste dostopni z invalidskim vozičkom?", en: "Are you wheelchair accessible?" },
    odgovor: {
      sl: "Lokal na Slovenski je v celoti v pritličju in brez praga. Trubarjeva ima eno nizko stopnico ob vhodu; osebje z veseljem pomaga, če pokličete vnaprej.",
      en: "The Slovenska location is entirely at street level and has no threshold. Trubarjeva has one low step at the entrance; the staff will gladly help if you call ahead.",
    },
  },
]

export const NAROCANJE_IN_CENE: PitanjeOdgovor[] = [
  {
    pitanje: { sl: "Kako naročim?", en: "How do I order?" },
    odgovor: {
      sl: "Najhitreje po telefonu ali kar pri pultu. Za dostavo uporabite Wolt ali Glovo. Naročil prek spletne strani zaenkrat ne sprejemamo, ker želimo, da je jed sveža, ko pridete ponjo.",
      en: "The fastest way is by phone or straight at the counter. For delivery use Wolt or Glovo. We do not take orders through the website for now, because we want the food to be fresh when you arrive.",
    },
  },
  {
    pitanje: { sl: "Dostavljate sami?", en: "Do you deliver yourselves?" },
    odgovor: {
      sl: "Ne, dostava poteka prek Wolta in Glova. Njihovi kurirji pokrivajo središče Ljubljane in bližnjo okolico. Čas dostave je običajno med dvajset in petinštirideset minut.",
      en: "No, delivery runs through Wolt and Glovo. Their couriers cover central Ljubljana and the surrounding area. Delivery usually takes between twenty and forty-five minutes.",
    },
  },
  {
    pitanje: { sl: "Sprejemate kartice?", en: "Do you accept cards?" },
    odgovor: {
      sl: "Sprejemamo vse običajne kartice, pa tudi plačila s telefonom. Gotovina je seveda prav tako dobrodošla. Za znesek pod pet evrov kartica deluje brez dodatka.",
      en: "We accept all common cards as well as phone payments. Cash is of course equally welcome. For amounts under five euros the card works with no surcharge.",
    },
  },
  {
    pitanje: { sl: "Sprejemate študentske bone?", en: "Do you accept student meal vouchers?" },
    odgovor: {
      sl: "Da, v obeh odprtih lokalih. Študentski meni vključuje glavno jed po izbiri, juho, solato, jabolko in pijačo. Doplačilo je odvisno od izbrane glavne jedi in je navedeno na meniju.",
      en: "Yes, in both open locations. The student menu includes a main course of your choice, soup, salad, an apple and a drink. Any surcharge depends on the main course chosen and is stated on the menu.",
    },
  },
  {
    pitanje: { sl: "Zakaj so cene po lokalih različne?", en: "Why do prices differ between locations?" },
    odgovor: {
      sl: "Ker se razlikujejo najemnine in stroški. Lokal na Slovenski je večji in ima sedeže, zato so cene tam nekoliko višje. Razlika je pol evra pri glavnih jedeh.",
      en: "Because rent and running costs differ. The Slovenska location is larger and has seating, so prices there are slightly higher. The difference is fifty cents on main dishes.",
    },
  },
  {
    pitanje: { sl: "Lahko naročim za večjo skupino?", en: "Can I order for a large group?" },
    odgovor: {
      sl: "Lahko, a pokličite vsaj dve uri prej, da vam jed pripravimo brez čakanja. Za več kot deset porcij se dogovorimo za točno uro prevzema. Družinski meni je namenjen štirim osebam.",
      en: "You can, but call at least two hours ahead so we can prepare it without a wait. For more than ten portions we agree an exact pick-up time. The family menu is designed for four people.",
    },
  },
  {
    pitanje: { sl: "Koliko časa čakam na jed?", en: "How long do I wait for my food?" },
    odgovor: {
      sl: "Kebab in falafel sta pripravljena v petih minutah, pice potrebujejo približno petnajst. Ob petkih in sobotah pozno zvečer je čakanje lahko daljše, zato je klic vnaprej dobra ideja.",
      en: "Kebab and falafel are ready in five minutes; pizzas need about fifteen. Late on Friday and Saturday evenings the wait can be longer, so calling ahead is a good idea.",
    },
  },
  {
    pitanje: { sl: "Lahko jed prilagodite?", en: "Can you adjust a dish?" },
    odgovor: {
      sl: "Seveda. Sestavine lahko izpustite ali dodate, omako naročite posebej, jed pa naredimo bolj ali manj pikantno. Povejte pri naročilu — po pripravi je težje popraviti.",
      en: "Of course. You can leave ingredients out or add them, order the sauce on the side, and have a dish made more or less spicy. Tell us when ordering — it is harder to fix once prepared.",
    },
  },
  {
    pitanje: { sl: "Imate popuste?", en: "Do you offer discounts?" },
    odgovor: {
      sl: "Družinski meni je ugodnejši od posameznih jedi, študentski bon pa velja ves dan. Občasnih akcij ne oglašujemo na spletni strani, ampak jih objavimo na družbenih omrežjih.",
      en: "The family menu is cheaper than ordering separately, and the student voucher is valid all day. We do not advertise occasional promotions on the website; we post them on social media.",
    },
  },
  {
    pitanje: { sl: "Kaj če z naročilom nekaj ni v redu?", en: "What if something is wrong with my order?" },
    odgovor: {
      sl: "Pokličite lokal, kjer ste naročili, in povedali bomo, kako naprej. Če je napaka naša, jed zamenjamo brez doplačila. Pri naročilih prek dostave se obrnite tudi na Wolt ali Glovo.",
      en: "Call the location where you ordered and we will tell you what happens next. If the mistake is ours, we replace the dish at no extra cost. For delivery orders, also contact Wolt or Glovo.",
    },
  },
]
