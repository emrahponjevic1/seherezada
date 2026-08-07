/**
 * Mjere okvira — jedno mjesto za sve sekcije.
 *
 * Zašto postoji: sekcije su svaka nosile svoje vrijednosti, pa se lijeva
 * ivica sadržaja pomjerala pri skrolanju. Hero, zgodba i halal su bili na
 * `px-6 md:px-12`, priljubljene i meni na `px-4 md:px-8`, a recenzije čak na
 * Tailwindovom `container` sa `px-4` — što nije ni ista širina.
 *
 * Na desktopu je razlika 48 px prema 32 px: naslovi sekcija su skakali
 * lijevo-desno dok gost skrola. Nije bila greška migracije — vrijednosti su
 * bile razmimoilazne i prije nje, samo se sa tri nove sekcije to počelo
 * primjećivati.
 *
 * Pravilo: nijedna sekcija ne piše svoje `max-w`, `px` ni `py`. Ako nova
 * sekcija treba drukčiju mjeru, mijenja se OVDJE — inače se razmimoilaženje
 * vraća kroz par mjeseci.
 */

/** Širina i bočni razmak sadržaja. Mjeru diktira hero. */
export const KONTEJNER = "max-w-[1440px] mx-auto px-6 md:px-12"

/** Vertikalni ritam sekcije. */
export const SEKCIJA = "py-20 md:py-24"
