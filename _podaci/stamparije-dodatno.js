// Extra content per business for the multi-page sites, merged into stamparije.js by key.
// types: service type per entry of `services` (same order), see _sabloni/kopirnice/katalog.js
// Images: 'stock:<name>' (sajtovi/_slike/stock) or '<file>' (sajtovi/_slike/<key>/). svcImg: index -> image.
// story / why: facts from each business's own site. Anything not set falls back to defaults in build.js.
module.exports = {
  arena: {
    types: ['kopiranje', 'koricenje', 'plastifikacija', 'skeniranje', 'stampa'],
    hero: 'stock:stampac-sto',
  },
  electra: {
    types: ['stampa', 'koricenje', 'plot', 'flajeri', 'knjige', 'plastifikacija', 'foto'],
    hero: 'stock:stampa-masina', about: 'e02.jpg',
    svcImg: { 0: 'e11.jpg', 2: 'e10.jpg', 4: 'e08.jpg' },
    story: ['Electra Copy & Print Studio od 2000. godine pomaže širenju ideja. Postoji mnogo načina za to, a jedan od njih je štampani medij.', 'Radimo za pojedince, za mala i srednja preduzeća i za korporativne klijente: od postera i pozivnica do brošura, kataloga i materijala za predstavljanje kompanije.', 'Naše dugogodišnje iskustvo nas je naučilo da ne postoji posao previše veliki, mali ili nepoznat koji ne možemo da uradimo.'],
    why: [['Od 2000. godine', 'Više od dve decenije štampamo za Novi Sad.'], ['Od dizajna do dostave', 'Sve vaše copy & print potrebe na jednom mestu.'], ['Copy & Print klub', 'Pogodnosti za stalne klijente, kao zahvalnost za poverenje.'], ['Za svakoga', 'Studenti, profesionalci, male firme i kompanije.']],
  },
  leptiric: {
    types: ['kopiranje', 'koricenje', 'plot', 'skeniranje', 'vizit'],
    hero: 'stock:veliki-format',
    story: ['Fotokopirnica Leptirić je kuća kvalitetnih kopija i dobrih cena, sa dve lokacije u centru Beograda.', 'U pasažu u Zmaj Jovinoj i u Kneginje Zorke radimo digitalno kopiranje i štampu u boji i crno-belo, koričenje, skeniranje i plotovanje velikih formata.'],
    why: [['Dve lokacije', 'Zmaj Jovina 7 i Kneginje Zorke 104, izaberite bližu.'], ['Kvalitet i dobre cene', 'Kuća kvalitetnih kopija i dobrih cena.'], ['Veliki formati', 'Tehnički crteži, planovi, mape i projekti.']],
  },
  uveric: {
    types: ['kopiranje', 'kopiranje', 'skeniranje', 'koricenje', 'koricenje'],
    hero: 'radnja-c.jpg', about: 'radnja-c.jpg',
    story: ['Fotokopirnica Uverić je u Jevrejskoj 23 i u Augusta Cesarca 15 u Novom Sadu.', 'Fotokopiramo do A3 formata na papiru, kartonu, nalepnicama i grafofoliji, radimo grupno kopiranje za studente i koričimo maturske, seminarske i diplomske radove.', 'Posetite nas i uverite se zašto su nam klijenti ukazali dugogodišnje poverenje.'],
    why: [['Popust za studente medicine', '10% uz karticu Studentskog saveza.'], ['Dve lokacije', 'Jevrejska 23 i Augusta Cesarca 15.'], ['Grupno kopiranje', 'Skripte za celu grupu, odjednom.'], ['Radimo i subotom', 'U Jevrejskoj od 9 do 15h.']],
  },
  aeroton: {
    types: ['majice', 'sito', 'galanterija', 'tampon', 'kopiranje'],
    hero: 'stock:sito-zuta',
    story: ['Mi smo grafički studio iz Novog Sada, u Milenka Grčića 1a. Specijalizovani smo za štampu na raznim materijalima, gotovo svim tehnikama štampe.', 'Štampamo na tekstilu, plastici, drvetu, metalu, staklu i aluminijumu, transfer flok i flex tehnikom, sublimacijom i digitalnom štampom na tekstilu.'],
  },
  copystudio: {
    types: ['flajeri', 'stampa', 'koricenje', 'veliki', 'plot', 'dorada', 'solje', 'foto'],
    hero: 'stock:baner-stampa',
    story: ['Copy Studio je vaš svet digitalne štampe na Vračaru, u Kumanovskoj 2.', 'Štampamo sve od vizit karte i flajera do knjiga, canvas slika, podne grafike i brendiranja izloga i vozila.', 'Štampu na canvas slikarskom platnu radimo isključivo latex tehnologijom, jer se slike najčešće drže u prostoru u kome provodite najviše vremena.'],
    why: [['Mali i veliki formati', 'Od vizit karte do foto tapeta i podne grafike.'], ['Latex canvas', 'Zdravstveno ispravna štampa za slike u enterijeru.'], ['Kreativni studio', 'Šolje, tekstil, slagalice i bedževi po vašem dizajnu.'], ['Radimo i subotom', 'Od 9 do 16h.']],
  },
  grafobogdanov: {
    types: ['dizajn', 'digitalna', 'ofset', 'sito', 'blindruk', 'dorada'],
    hero: 'stock:ofset-masina',
    story: ['Štamparija Grafo Bogdanov nastala je 1989. godine kao zanatska radnja.', 'Danas je to brzi grafički servis za manje i srednje poslove širokog spektra, po principu „sve na jednom mestu", sa zaokruženim ciklusima proizvodnje i raznolikim tehnikama štampe.', 'Sito štampu nudimo u vrhunskom kvalitetu, na različitim materijalima i uz najkraće rokove isporuke.'],
    why: [['Od 1989.', 'Više od tri decenije u Futoškoj ulici.'], ['Sve na jednom mestu', 'Od pripreme preko štampe do knjigoveznice.'], ['Više tehnika štampe', 'Digitalna, ofset, sito, blindruk i zlatotisak.']],
  },
  adverto: {
    types: ['digitalna', 'dizajn', 'flajeri'],
    hero: 'stock:stampa-masina',
  },
  byzart: {
    types: ['digitalna', 'veliki', 'dorada', 'dizajn'],
    hero: 'stock:veliki-format',
    story: ['Mi smo digitalna štamparija Byzart. Od 1997. godine uspešno napredujemo u poslu pripreme, štampe i dorade različitih materijala.', 'Štampamo za male i velike: agencije, kompanije, institucije i pojedince. Bez obzira da li je vaš biznis umetnost ili je umetnost vaš biznis, podržaćemo vas u realizaciji vaših ideja.'],
    why: [['Od 1997.', 'Skoro tri decenije digitalne štampe.'], ['Za male i velike', 'Agencije, kompanije, institucije i pojedinci.'], ['Uputstva za pripremu', 'Pomažemo da fajl bude spreman za štampu.']],
  },
  matija: {
    types: ['knjige', 'flajeri', 'ambalaza', 'kalendari', 'materijal', 'dorada', 'galanterija'],
    hero: 'stock:ofset-masina', about: 'kocka.jpg',
    svcImg: { 4: 'blok.jpg', 6: 'maramice.jpg' },
    gallery: ['maramice.jpg', 'kocka.jpg', 'blok.jpg'], galleryTitle: 'Specijalni proizvodi',
    story: ['Visokim kvalitetom i konkurentnim cenama štamparija Matija osvaja tržište štamparskih usluga kao partner mnogim domaćim i svetskim kompanijama.', 'Pored usluga štampe nudimo i veliki izbor reklamnog materijala za firme: od sticky note blokova i blok kocki sa bočnom štampom do brendiranih maramica.'],
    why: [['Partner kompanijama', 'Domaćim i svetskim.'], ['Rokovi', 'Poštujemo precizirane rokove isporuke.'], ['Specijalni proizvodi', 'PopUp štampa, blok kocke, brendirane maramice.']],
  },
  copycentarns: {
    types: ['digitalna', 'veliki', 'kopiranje', 'skeniranje', 'koricenje', 'vizit'],
    hero: 'stock:veliki-format',
    story: ['U okviru DOO „Bilans-Micon" Novi Sad postoje dve poslovne jedinice: CopyCentar kopirnica u Stražilovskoj 33 i CopyShop papirnica u Stražilovskoj 35.', 'Kopiramo u boji i crno-belo na svim vrstama papira, do A0 formata, i štampamo iz većine programa za grafički dizajn, kancelarijski rad i tehničko crtanje, od AutoCAD-a do Worda.'],
    why: [['Od 7 ujutru', 'Radnim danom od 07 do 21h.'], ['Do 15 m dužine', 'Štampa i kopiranje velikih formata.'], ['Kopirnica i papirnica', 'Jedna do druge u Stražilovskoj.'], ['Svi programi', 'AutoCAD, Corel, Photoshop, InDesign, Word…']],
  },
  izradaflajera: {
    types: ['flajeri', 'vizit', 'nalepnice', 'veliki', 'majice', 'dizajn'],
    hero: 'stock:baner-stampa',
    gallery: ['f09.jpg', 'f11.jpg', 'f13.png', 'f14.png', 'f17.png', 'f18.png', 'f24.png'], galleryKicker: 'Portfolio', galleryTitle: 'Flajeri koje smo dizajnirali',
    story: ['Dizajniramo i štampamo flajere, vizit karte, plakate, samolepljive nalepnice, vaučere, etikete, deklaracije, podmetače i kompletan kancelarijski i reklamni materijal.', 'Naši dizajneri prave brošure, kataloge, nalepnice, postere, pozivnice, knjige i časopise prema savremenim trendovima u grafičkom dizajnu.'],
    why: [['Dizajn uključen', 'Grafička priprema za vaš flajer ili vizit kartu.'], ['Sve za promociju', 'Flajeri, plakati, nalepnice, majice.'], ['Jedan poziv', 'Kompletna usluga od ideje do štampe.']],
  },
  kreatika: {
    types: ['identitet', 'ambalaza', 'ofset', 'veliki', 'galanterija', 'galanterija'],
    hero: 'boca.jpg', about: 'kampanja.jpg',
    svcImg: { 0: 'roastery.jpg', 1: 'plantaze.jpg' },
    gallery: ['method.jpg', 'plantaze.jpg', 'ilustracija.jpg', 'roastery.jpg', 'kampanja.jpg'], galleryKicker: 'Portfolio', galleryTitle: 'Naši radovi',
    story: ['Design studio Kreatika iz Novog Sada spaja dizajn, štampu i reklamnu galanteriju.', 'Kreiramo grafički i vizuelni identitet firmi, manifestacija i događaja, dizajniramo ambalažu, štampamo reklamni materijal i brendiramo galanteriju sito i tampon štampom ili laserskom gravurom.'],
    why: [['Dizajn i štampa', 'Jedan studio od ideje do gotovog proizvoda.'], ['Galanterija', 'Uvozna i domaća, tekstil, plastika, koža.'], ['Brendiranje', 'Sito, tampon i laserska gravura.']],
  },
  ris: {
    types: ['kopiranje', 'digitalna', 'ofset', 'veliki', 'majice', 'nalepnice', 'dorada', 'foto'],
    hero: 'stock:lepeza-boja',
    story: ['Fotokopirnica RIS osnovana je 2000. godine u Beogradu. Prvobitna delatnost bila nam je fotokopiranje i štampanje, a ubrzo smo proširili delatnost na dve lokacije u gradu.', 'U našim fotokopirnicama trudimo se da štampanje bude prijatno iskustvo i da klijenta nikada ne odbijemo, bez obzira koliko je njegov zahtev specifičan. Naš je zadatak, i zadovoljstvo, da nađemo rešenje.', 'U Foto Studiju RIS u Dobračinoj vaše fotografije pretvaramo u prelepe albume.'],
    why: [['Od 2000. godine', 'Dve lokacije u centru Beograda.'], ['Nijedan zahtev ne odbijamo', 'Za svaki specifičan posao nađemo rešenje.'], ['Sve na jednom mestu', 'Kopiranje, štampa, majice, katovanje, foto.']],
  },
  zebra: {
    types: ['dizajn', 'ofset', 'vizit', 'flajeri', 'dorada', 'ambalaza'],
    hero: 'stock:secenje-papira',
    story: ['Štamparija Zebra je u Zanatskom centru Voždovac, u Kumodraškoj 172.', 'Radimo ideje, pripremu za štampu, visoku, ofset i digitalnu štampu: vizit karte, memorandume, blokovsku robu, pozivnice, flajere, plakate, nalepnice, fascikle i koverte, i svu doradu.'],
  },
  simbol: {
    types: ['ofset', 'digitalna', 'sito', 'tampon', 'vizit', 'dorada'],
    hero: 's20.jpg', about: 's18.jpg',
    svcImg: { 0: 's21.jpg', 1: 's11.jpg', 4: 's03.jpg', 5: 's12.jpg' },
    gallery: ['s13.jpg', 's04.png', 's19.jpg', 's05.jpg', 's14.jpg', 's09.jpg', 's22.jpg'], galleryTitle: 'Iz naše štamparije',
    story: ['Simbol print radi ofset, sito, tampon i digitalnu štampu na velikom izboru materijala, u različitim formatima i tiražima.', 'Po vašoj specifikaciji pravimo ponudu koja u najkraćem roku postaje porudžbina i gotov proizvod, od vizit karte do kataloga, blokova i kutija.'],
    why: [['Četiri tehnike štampe', 'Ofset, sito, tampon i digitalna.'], ['Posebne pogodnosti', 'Za veće tiraže ofset štampe.'], ['Do gotovog proizvoda', 'Sve vrste dorada: blokovi, kutije, katalozi.']],
  },
  indexcopy: {
    types: ['kopiranje', 'digitalna', 'koricenje', 'skeniranje', 'plastifikacija', 'veliki', 'pecati'],
    hero: 'stock:stampac-sto',
    story: ['Fotokopirnica Index osnovana je 1998. godine kao Copy Key Centar, a od 2008. nosi današnji naziv.', 'Na početku je osnovna delatnost bila fotokopiranje. Vremenom smo asortiman proširili na digitalnu štampu, štampu velikih formata, izradu ključeva i pečata, graviranje i grafički dizajn.', 'Na 50 metara smo od Studentskog grada, pa smo od starta stekli poverenje studenata.'],
    why: [['Brza usluga kopiranja', 'Popust na veći broj kopija.'], ['Kratak rok štampanja', 'Digitalna štampa SRA3 i A4.'], ['Veliki asortiman pečata', 'Za firme i preduzetnike.'], ['Ključevi na licu mesta', 'Dok sačekate.']],
  },
  copyline: {
    types: ['kopiranje', 'koricenje', 'dizajn', 'materijal', 'majice', 'servis'],
    hero: 'stock:lupa',
    svcImg: { 0: 'kopir.png' },
    story: ['Prva fotokopirnica Copy Line osnovana je 2013. godine, sa osnovnom delatnošću fotokopiranja i štampanja.', 'Za kratko vreme proširili smo usluge: pored kopiranja, štampe, koričenja i skeniranja, kod nas štampate plakate, postere, flajere, vizit karte, memorandume i knjige. Ako nemate pripremu za štampu, uradimo je za vas.', 'Crno-belo kopiramo na Ricoh mašinama, a kolor na Konica Minolta i Ricoh, na papiru A klase.'],
    why: [['Tvrdi povez za 24 h', 'I sa zlatotiskom ili srebrotiskom.'], ['Vizit karte i na komad', 'Ne morate da naručite celu kutiju.'], ['Kancelarijski materijal', 'Sve na istom mestu.'], ['Kod okretnice 77', 'I trola 28 i 40.']],
  },
  copycentarbg: {
    types: ['kopiranje', 'veliki', 'koricenje', 'plastifikacija', 'solje', 'kalendari'],
    hero: 'sala.jpg', about: 'fasada.jpg',
    svcImg: { 0: 'prostor-1.jpg', 1: 'ploter.jpg', 5: 'rokovnici.jpg' },
    gallery: ['radnja.jpg', 'ulaz.jpg', 'pult.jpg', 'ploter.jpg', 'prostor-1.jpg', 'rokovnici.jpg'], galleryTitle: 'Naše radnje',
    story: ['Copy Centar je osnovan 1990. godine i danas je kuća digitalne štampe sa više lokacija u Beogradu: TC Sremska, Belvil i digitalna štamparija na Dimitrijali.', 'Fotokopiramo i štampamo crno-belo i u boji, štampamo velike formate i CAD crteže, koričimo, plastifikujemo i pravimo personalizovane poklone u Kreativnom centru.', 'Fajlove možete poslati i preko online obrasca, a plaćanje je gotovinom, karticom, m-bankingom ili virmanom.'],
    why: [['Od 1990.', 'Originalni Copy Centar.'], ['Više lokacija', 'Stari Grad, Novi Beograd i Dimitrijala.'], ['Online naručivanje', 'Pošaljite fajl i preuzmite gotovo.'], ['Plaćanje karticom', 'Visa, Master, Dina i m-banking.']],
  },
  staze: {
    types: ['flajeri', 'veliki', 'knjige', 'nalepnice', 'knjige', 'materijal', 'majice'],
    hero: 'stock:boje-police', about: 'stock:ofset-masina',
    story: ['Štamparija Staze osnovana je 1995. godine.', 'Uvek vam možemo ponuditi najbolje rešenje za bilo koju fazu izrade štamparskog materijala: od saveta pri izboru forme i medija, preko idejnog rešenja i pripreme, do finalnog proizvoda.'],
  },
  grafotin: {
    types: ['sito', 'tampon', 'blindruk', 'ofset', 'solje', 'veliki'],
    hero: 'g16.jpg', about: 'g04.jpg',
    svcImg: { 0: 'g04.jpg', 2: 'g12.jpg', 4: 'g08.jpg', 5: 'g19.jpg' },
    gallery: ['g05.jpg', 'g06.jpg', 'g09.jpg', 'g10.jpg', 'g14.jpg', 'g20.jpg'], galleryTitle: 'Tehnike i materijali',
    story: ['Štamparija GrafoTin nastala je 1989. godine pod imenom TinŠtampa, a od 2000. godine posluje kao GrafoTin.', 'Naša delatnost je tampon, ofset i sito štampa, a u saradnji sa kooperantima i digitalna, solventna i štampa velikih formata.', 'Zahvaljujući upornosti, marljivom radu i korektnim odnosima opstali smo i u najtežim vremenima, i danas ponosno kažemo da iza nas stoje kvalitet i pouzdanost.'],
    why: [['Kvalitet', 'Visokokvalitetni materijali i dugogodišnje iskustvo.'], ['Garancija', 'Puna podrška i nakon realizovanog posla.'], ['Poštovanje rokova', 'Uvek poštujemo dogovorene rokove.'], ['Fleksibilnost', 'Moguć je svaki dogovor u obimu i dinamici posla.']],
  },
};
