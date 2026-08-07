-- ─────────────────────────────────────────────────────────────────────
--  004 — nove stranice: /kontakt, /blog, /doner-ljubljana
-- ─────────────────────────────────────────────────────────────────────
--
--  Spisak rezervisanih slugova stoji na TRI mjesta: u resolveru
--  (lib/route.ts), u obrascu na /chef i u ovom trigeru. Kod je dopunjen;
--  ovo dopunjava bazu.
--
--  Zašto i u bazi: lokal nazvan „kontakt" oteo bi stranicu kontakta, a
--  greška bi se otkrila tek kad neko otvori sajt. Obrazac se može
--  zaobići — baza ne može.

create or replace function provjeri_slug_lokala() returns trigger as $$
begin
  if new.slug = any (array[
    -- jezici: kodovi i prefiksi
    'sl','en','de','ba','bs','tr','ar','zh',
    -- stranice lokala
    'meni','recenzije',
    -- zajedničke stranice
    'o-nas','halal','galerija','blog','kontakt',
    'pogosta-vprasanja','zasebnost','pogoji',
    -- SEO stranice
    'kebab-ljubljana','doner-ljubljana','pizza-ljubljana','burger-ljubljana',
    'falafel-ljubljana','halal-hrana-ljubljana','nocna-hrana-ljubljana',
    'dostava-ljubljana','studentski-meni-ljubljana',
    -- tehničke adrese
    'chef','api','sitemap.xml','robots.txt','_next','favicon.ico','favicon.svg'
  ]) then
    raise exception 'Slug "%" je rezerviran in ga lokal ne more uporabiti', new.slug
      using errcode = 'check_violation';
  end if;
  return new;
end $$ language plpgsql;

-- Triger već postoji iz 001 i pokazuje na ovu funkciju po imenu,
-- pa ga ne treba ponovo praviti.
