import type { PitanjeOdgovor } from "./dijelovi"

/**
 * Dvadeset i tri pitanja u tri grupe.
 *
 * Ovdje stoje KLJUČEVI, a tekstovi u `messages/sadrzaj/*.json` — inače bi
 * gost na `/tr` čitao slovenska pitanja. Pravilo za pisanje odgovora se
 * nije promijenilo: 40–60 riječi i PRVA REČENICA odgovara direktno.
 *
 * Pitanje „Do kdaj ste odprti?" nema odgovor ovdje — izvodi se iz radnog
 * vremena i nabraja sve lokale, pa ga sastavlja sama stranica.
 *
 * Demo sadržaj; prava ponuda i tekst dolaze kroz /chef.
 */

export const HALAL_I_SASTOJCI: PitanjeOdgovor[] = [
  { pitanje: "faqH.meso.pitanje", odgovor: "faqH.meso.odgovor" },
  { pitanje: "faqH.svinjina.pitanje", odgovor: "faqH.svinjina.odgovor" },
  { pitanje: "faqH.alkohol.pitanje", odgovor: "faqH.alkohol.odgovor" },
  { pitanje: "faqH.certifikat.pitanje", odgovor: "faqH.certifikat.odgovor" },
  { pitanje: "faqH.vegetarijansko.pitanje", odgovor: "faqH.vegetarijansko.odgovor" },
  { pitanje: "faqH.alergeni.pitanje", odgovor: "faqH.alergeni.odgovor" },
  { pitanje: "faqH.kruh.pitanje", odgovor: "faqH.kruh.odgovor" },
  { pitanje: "faqH.pikantno.pitanje", odgovor: "faqH.pikantno.odgovor" },
]

/**
 * Pet pitanja — šesto je „Do kdaj ste odprti?", koje se izvodi iz radnog
 * vremena i nabraja sve lokale, pa ga sastavlja sama stranica.
 */
export const CAS_IN_LOKACIJA: PitanjeOdgovor[] = [
  { pitanje: "faqC.najdlje.pitanje", odgovor: "faqC.najdlje.odgovor" },
  { pitanje: "faqC.prazniki.pitanje", odgovor: "faqC.prazniki.odgovor" },
  { pitanje: "faqC.sedezi.pitanje", odgovor: "faqC.sedezi.odgovor" },
  { pitanje: "faqC.parking.pitanje", odgovor: "faqC.parking.odgovor" },
  { pitanje: "faqC.dostopnost.pitanje", odgovor: "faqC.dostopnost.odgovor" },
]

export const NAROCANJE_IN_CENE: PitanjeOdgovor[] = [
  { pitanje: "faqN.kako.pitanje", odgovor: "faqN.kako.odgovor" },
  { pitanje: "faqN.dostava.pitanje", odgovor: "faqN.dostava.odgovor" },
  { pitanje: "faqN.kartice.pitanje", odgovor: "faqN.kartice.odgovor" },
  { pitanje: "faqN.boni.pitanje", odgovor: "faqN.boni.odgovor" },
  { pitanje: "faqN.cene.pitanje", odgovor: "faqN.cene.odgovor" },
  { pitanje: "faqN.skupina.pitanje", odgovor: "faqN.skupina.odgovor" },
  { pitanje: "faqN.cakanje.pitanje", odgovor: "faqN.cakanje.odgovor" },
  { pitanje: "faqN.prilagoditi.pitanje", odgovor: "faqN.prilagoditi.odgovor" },
  { pitanje: "faqN.popusti.pitanje", odgovor: "faqN.popusti.odgovor" },
  { pitanje: "faqN.reklamacija.pitanje", odgovor: "faqN.reklamacija.odgovor" },
]
