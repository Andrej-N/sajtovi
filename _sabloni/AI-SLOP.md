# AI slop: kako ga prepoznati i izbeći (čitati pre svakog novog šablona)

Istraživanje 29.10.2026. Izvori: 925studios.co/blog/ai-slop-web-design-guide, capitalandcompute.net/blog/fix-ai-slop-design,
prg.sh „Why your AI keeps building the same purple gradient website", superdesign.dev/blog/why-ai-design-looks-generic.

Suština: model popunjava odluke o ukusu koje niko nije doneo i završava u „statističkom proseku". Rešenje nije zabrana
jednog defaulta (onda dođe sledeći default), nego da se **svaka odluka izvede iz konkretnog biznisa i njegovog sveta**.

## Prvi talas (najčešći defaulti)
- Inter / Roboto / system font za sve, bez display fonta.
- Ljubičasto-plavi gradijent, gradijent na tekstu naslova.
- Redosled: centriran hero, pill bedž, dva dugmeta, red logoa, 3 kartice, CTA. → Počni od onoga što je najkarakterističnije za taj svet.
- Iste kartice svuda: isti radius (16px), ista meka senka, kartica u kartici. → Variraj radius/visinu po hijerarhiji; tabele i redovi za tabelarni sadržaj.
- Glassmorphism i glow bez razloga.
- Ista fade-and-slide-up animacija na svakoj sekciji, count-up brojevi, bounce. → Jedan osmišljen trenutak, pokret vezan za akciju.
- Prazan tekst: „Unapredite svoje iskustvo", „Započnite", „vrhunski kvalitet". → Dugme kaže šta radi („Pozovite 063…", „Pitajte za slobodne termine").
- Izmišljeni brojevi i recenzije. → Samo ono što ima izvor (Google ocena, godina osnivanja sa njihovog sajta).

## Drugi talas (kad se prvi zabrani)
- „Warm editorial": krem pozadina ~#F4F1EA + kontrastni serif + terakota ~#D97757 (Claudeova paleta!).
- „Dark signal": skoro crna + jedan acid zeleni ili vermilion akcenat.
- „Broadsheet cosplay": tanke linije, radius 0, novinske kolone na sadržaju koji nije editorijal.
- Template chrome: ALL-CAPS eyebrow nad svakim naslovom, „A · B · C" meta nizovi, mono sitni labeli, strelica na svakom linku.
- Jedna reč u naslovu u italiku/boji. Numeracija 01/02/03 na stvarima koje nisu niz. Labeli koji ponavljaju naslov.
- Emoji kao ikone, pill-ovi i bedževi svuda.

## Pravila za naše šablone
1. Paleta 4–6 boja sa ulogama, izvedena iz mesta/biznisa (npr. Zlatibor: borova zelena, kamen, drvo; banja: voda, kreč, bakar), ne iz alata.
2. Display font bira se po karakteru biznisa; nikad Inter/Roboto kao jedini font. Proveriti latinicu sa č ć š ž đ.
3. Struktura po sadržaju delatnosti, ne po SaaS landing-u. Svaki od 4 šablona mora imati drugačiji kostur, ne samo druge boje.
4. Bez eyebrow-a nad svakim naslovom, bez emoji, bez gradijent teksta, bez glow-a, bez kartica-u-kartici.
5. Tekst konkretan: cene, broj kreveta, udaljenost od centra/staze, parking, šta je uključeno. Ono što ne znamo — ne izmišljamo.
6. Fotografije su sadržaj (pogotovo za smeštaj): stvarne slike biznisa sa njihovog sajta/Maps-a, ne stock ljudi sa laptopom, ne AI ilustracije, ne 3D blobovi.
7. Animacija samo gde nešto znači (hover na dugmetu, otvaranje galerije). Poštovati prefers-reduced-motion.
8. Pre objave proći ovu listu kao checklistu.
9. Četiri šablona ne smeju svi biti svetli i pastelni. Variraj kontrast: jedan tamni, jedan sa jakim zasićenim bojama, jedan koji smenjuje tamne i svetle sekcije, jedan svetli ili pastelni (korisnik je to tražio za smeštaj, 29.10.2026).
9a. Stomatolozi (29.10.2026): korisnik želi **svetle** varijante svih stilova (ne tamne pozadine) i više minimalizma: manje sekcija, kartica, senki i čipova, više praznog prostora, akcenat samo na glavnom dugmetu. Ali ne sve belo: svetla osnova + 1–2 obojene sekcije ili pločice za kontrast (tamna ili zasićena traka, pastelni blok).
10. Uz svaki desktop dizajn odmah napravi i prikaz za telefon (390 px). Veličine fontova preko clamp() i cqi, rasporedi preko flex-wrap i auto-fit, bez tabela koje se skroluju bočno.
