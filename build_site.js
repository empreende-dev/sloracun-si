/**
 * EUROPAY — FASE 3: BUILDER DA PLATAFORMA + 30 PÁGINAS DE SEO PROGRAMÁTICO (/p/) + SITEMAP
 * Gera o portal completo em Esloveno nativo (sl-SI) pronto para GitHub Pages / Cloudflare Pages.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE_DIR = __dirname;
const DATA_DIR = path.join(ROOT, 'data');

const config = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'monetization_config.json'), 'utf8'));
const BASE_URL = (config.platform_live_url || 'https://empreende-dev.github.io/sloracun-si/').replace(/\/+$/, '');

// 30 Programmatic Slovenian SEO Pages (Professions, Income Brackets, Document Types & Tax Rules)
const PROGRAMMATIC_30_PAGES = [
  {
    slug: 'izdaja-racuna-brezplacno',
    title: 'Izdaja računa brezplačno in brez registracije v PDF (UPN QR 2026)',
    h1: 'Brezplačna izdaja računa v PDF z UPN/SEPA QR kodo v 10 sekundah',
    desc: 'Izdelajte pravilen slovenski račun brez registracije. Samodejni sklic SI12, klavzula 94. člen ZDDV-1 in QR koda za takojšnje mobilno plačilo.',
    answer: 'Za izdajo brezplačnega računa v Sloveniji ne potrebujete plačljivega programa ali prijave. Če stranka plača račun z nakazilom na vaš poslovni TRR (preko UPN QR naloga), davčno potrjevanje računov pri FURS ni obvezno. Spodaj vnesite podatke in takoj prenesite PDF račun.',
    preset: { defaultTab: 'invoice', defaultService: 'Opravljene storitve po dogovoru', defaultAmount: 850, defaultVat: 0, defaultAnnualRev: 36000 }
  },
  {
    slug: 'predracun-vzorec-pdf',
    title: 'Predračun vzorec PDF brezplačno — Spletni generator predračunov',
    h1: 'Spletni generator za predračun (vzorec v PDF z UPN QR kodo)',
    desc: 'Pripravite profesionalen predračun (proforma račun) v PDF obliki brez registracije. Vključena SEPA/UPN QR koda za hitro plačilo po predračunu.',
    answer: 'Predračun (proforma račun) ni knjigovodska listina in ne ustvarja davčne obveznosti za DDV, dokler plačilo ni prejeto. Z našim generatorjem ustvarite brezhiben predračun s kodo QR v manj kot 10 sekundah.',
    preset: { defaultTab: 'invoice', defaultService: 'Predračun za izvedbo projekta', defaultAmount: 1400, defaultVat: 0, defaultAnnualRev: 42000 }
  },
  {
    slug: 'izdelava-ponudbe-pdf',
    title: 'Izdelava poslovne ponudbe za stranko v PDF — Brezplačno orodje',
    h1: 'Izdelava poslovne ponudbe v PDF za samostojne podjetnike in d.o.o.',
    desc: 'Hitro pripravite pregledno ponudbo za stranko v PDF formatu z izračunom popustov, DDV in veljavnostjo ponudbe.',
    answer: 'Jasna in vizualno urejena ponudba poveča verjetnost potrditve naročila za več kot 35 %. V obrazcu izberite vrsto dokumenta »PONUDBA«, dodajte postavke in stranki pošljite urejen PDF dokument.',
    preset: { defaultTab: 'invoice', defaultService: 'Celostna izvedba storitve po specifikaciji', defaultAmount: 2100, defaultVat: 0, defaultAnnualRev: 48000 }
  },
  {
    slug: 'kalkulator-normiranec-sp-2026',
    title: 'Kalkulator Normiranec s.p. 2026 — Izračun davka, prispevkov in neto zaslužka',
    h1: 'Kalkulator Normiranec s.p. 2026 (Polni in popoldanski s.p.)',
    desc: 'Natančen izračun za normirani s.p. v letu 2026: meja 60.000 € / 120.000 €, prispevki ZPIZ, OZP 39,36 € in prispevek za dolgotrajno oskrbo.',
    answer: 'V letu 2026 polni normirani s.p. do 60.000 € letnih prihodkov uveljavlja 80 % normiranih odhodkov, kar pomeni le 4 % efektivno dohodnino, poleg minimalnih mesečnih prispevkov v višini približno 651,04 €.',
    preset: { defaultTab: 'calc', defaultAnnualRev: 48000, defaultSpStatus: 'polni' }
  },
  {
    slug: 'prispevki-polni-sp-2026',
    title: 'Prispevki za polni s.p. 2026 — Mesečni izračun (ZPIZ, ZZZS, OZP, DO)',
    h1: 'Minimalni prispevki za polni s.p. v letu 2026 (651,04 €/mesec)',
    desc: 'Preverite točne prispevke za polni s.p. v letu 2026 vključno z OZP (39,36 €), prispevkom za dolgotrajno oskrbo (2 %) in oprostitvijo za 1. leto.',
    answer: 'Minimalni mesečni prispevki za polni s.p. v letu 2026 znašajo 651,04 € (7.812,48 € letno). Podjetniki ob prvem vpisu v poslovni register prvo leto plačujejo 50 % nižji prispevek za PIZ (skupaj približno 465,80 €/mesec).',
    preset: { defaultTab: 'calc', defaultAnnualRev: 36000, defaultSpStatus: 'polni' }
  },
  {
    slug: 'prispevki-popoldanski-sp-2026',
    title: 'Prispevki za popoldanski s.p. 2026 — Pavšalni prispevki in davek',
    h1: 'Popoldanski s.p. 2026: Izračun pavšalnih prispevkov (113,01 €) in davka',
    desc: 'Koliko znašajo prispevki za popoldanski s.p. v letu 2026 in kakšna je meja prihodkov (50.000 €) za popoldanskega normiranca.',
    answer: 'Pavšalni mesečni prispevki za popoldanski s.p. od aprila 2026 znašajo 113,01 € na mesec. Zgornja meja prihodkov za popoldanski normirani s.p. znaša 50.000 € letno, pri čemer se do 12.500 € prizna 80 % normiranih odhodkov.',
    preset: { defaultTab: 'calc', defaultAnnualRev: 18000, defaultSpStatus: 'popoldanski' }
  },
  {
    slug: 'normiranec-prvo-leto-prispevki',
    title: 'Prvo leto s.p. 2026: Oprostitev 50 % PIZ prispevkov — Kalkulator',
    h1: 'Odprtje prvega s.p. v letu 2026: Izračun znižanih prispevkov (-50 % PIZ)',
    desc: 'Izračunajte čisti zaslužek v prvem in drugem letu poslovanja s.p. z uveljavljanjem 50 % in 30 % oprostitve prispevkov za pokojninsko zavarovanje.',
    answer: 'Ob prvem odprtju polnega s.p. ste prvih 12 mesecev oproščeni plačila 50 % prispevka za PIZ, naslednjih 12 mesecev pa 30 %. To vam v prvem letu prihrani več kot 2.200 € pri obveznih prispevkih.',
    preset: { defaultTab: 'calc', defaultAnnualRev: 35000, defaultSpStatus: 'polni_y1' }
  },
  {
    slug: 'vzorec-racuna-nezavezanec-ddv',
    title: 'Vzorec računa za nezavezanca za DDV (94. člen ZDDV-1) — PDF Generator',
    h1: 'Vzorec računa za nezavezanca za DDV s samodejno klavzulo 94. člena ZDDV-1',
    desc: 'Brezplačen spletni obrazec za mali davčni zavezanec (do 60.000 € prometa). Samodejno vključena zakonska klavzula ZDDV-1.',
    answer: 'Če v zadnjih 12 mesecih niste presegli 60.000 € obdavčljivega prometa v Sloveniji, ste mali davčni zavezanec. Na računu ne obračunate DDV in obvezno navedete klavzulo po 1. odstavku 94. člena ZDDV-1.',
    preset: { defaultTab: 'invoice', defaultService: 'Svetovalne storitve', defaultAmount: 680, defaultVat: 0, defaultAnnualRev: 32000 }
  },
  {
    slug: 'izdaja-racuna-v-tujino-eu',
    title: 'Kako izdati račun v tujino (EU Reverse Charge) — Generator SL/EN',
    h1: 'Izdaja računa davčnemu zavezancu v EU (Obrnjena davčna obveznost)',
    desc: 'Pripravite pravilen račun za naročnika v EU (Nemčija, Avstrija, Nizozemska) s klavzulo Reverse Charge po 25. členu ZDDV-1.',
    answer: 'Pred izdajo računa podjetju v drugi državi EU morate pridobiti t. i. atipično ID številko za DDV in preveriti VIES številko kupca. Na računu ne obračunate slovenskega DDV, temveč vpišete klavzulo o obrnjeni davčni obveznosti.',
    preset: { defaultTab: 'invoice', defaultService: 'Software Engineering & IT Consulting Services', defaultAmount: 4200, defaultVat: 0, defaultAnnualRev: 58000 }
  },
  {
    slug: 'upn-qr-generator-racun',
    title: 'UPN QR in SEPA QR koda na računu — Spletni generator brez registracije',
    h1: 'Generator računa s QR kodo za takojšnje skeniranje v mobilni banki',
    desc: 'Ustvarite račun s QR kodo združljivo z NLB Klik, OTP mBank@Net, Intesa, Revolut in N26 brez ročnega prepisovanja TRR in sklica.',
    answer: 'QR koda na računu zmanjša zamude pri plačilih in odpravi napake pri vnosu sklica SI12 ali številke TRR. Naš generator samodejno zakodira znesek, IBAN in referenco v vsak ustvarjen dokument.',
    preset: { defaultTab: 'invoice', defaultService: 'Mesečno vzdrževanje sistema', defaultAmount: 390, defaultVat: 0, defaultAnnualRev: 30000 }
  },
  {
    slug: 'kalkulator-it-programer-sp',
    title: 'Kalkulator za IT programerja (Normiranec s.p. 2026) + Angleški račun',
    h1: 'Izračun neto zaslužka in izdaja računa za IT razvijalce in programerje',
    desc: 'Simulacija davka in prispevkov za slovenske razvijalce programske opreme (50.000 € – 110.000 € prihodkov) ter hitra izdaja EU/ZDA računa.',
    answer: 'Pri letnih prihodkih 60.000 € polnemu normiranemu IT podjetniku po plačilu 4 % dohodnine (2.400 €) in letnih prispevkov (7.812,48 €) ostane čisto 49.787,52 € oziroma 4.148,96 € neto na mesec.',
    preset: { defaultTab: 'calc', defaultService: 'Razvoj spletne aplikacije (Full-Stack Development)', defaultAmount: 5000, defaultAnnualRev: 60000, defaultSpStatus: 'polni' }
  },
  {
    slug: 'racun-gradbena-dela-9-5-ddv',
    title: 'Račun za gradbena in obrtniška dela (9,5 % DDV ali nezavezanec) — PDF',
    h1: 'Generator računa in ponudbe za gradbenike, monterje in obrtnike',
    desc: 'Pripravite ponudbo ali račun za adaptacijo, montažo ali gradbena dela z znižano stopnjo 9,5 % DDV za stanovanjske objekte.',
    answer: 'Za obnovo, popravila in gradbena dela na stanovanjskih objektih (če vrednost materiala ne presega 50 % vrednosti storitve) zavezanci za DDV v Sloveniji uporabljajo znižano stopnjo 9,5 % DDV.',
    preset: { defaultTab: 'invoice', defaultService: 'Slikopleskarska in zaključna gradbena dela v stanovanju', defaultAmount: 1850, defaultVat: 9.5, defaultAnnualRev: 52000 }
  },
  {
    slug: 'racun-graficno-oblikovanje-sp',
    title: 'Račun in ponudba za grafično oblikovanje ter digitalni marketing (PDF)',
    h1: 'Generator ponudb in računov za oblikovalce, agencije in ustvarjalce',
    desc: 'Hitro ustvarite estetski PDF račun ali ponudbo za izdelavo logotipa, spletne strani ali vodenje družbenih omrežij.',
    answer: 'Oblikovalci in marketinški svetovalci v Sloveniji najpogosteje poslujejo prek normiranega s.p. Spodaj v 10 sekundah pripravite ponudbo za naročnika in preverite svoj neto izkupiček.',
    preset: { defaultTab: 'invoice', defaultService: 'Oblikovanje celostne grafične podobe (CGP) in spletne strani', defaultAmount: 1350, defaultVat: 0, defaultAnnualRev: 40000 }
  },
  {
    slug: 'kalkulator-dostavljalec-wolt-sp',
    title: 'Kalkulator Wolt / Glovo dostavljalec s.p. 2026 — Polni ali popoldanski?',
    h1: 'Izračun čistega zaslužka za Wolt in Glovo dostavljalce preko s.p. (2026)',
    desc: 'Preverite, koliko vam ostane čisto na mesec pri dostavi hrane prek polnega ali popoldanskega normiranega s.p. v letu 2026.',
    answer: 'Za študente ali redno zaposlene je popoldanski s.p. (113,01 €/mesec prispevkov) najugodnejša oblika za dostavo. Pri polnem s.p. z 2.200 € mesečnih prihodkov (26.400 € letno) po prispevkih in 4 % davku ostane približno 1.460 € neto mesečno (1.645 € v prvem letu s.p.).',
    preset: { defaultTab: 'calc', defaultAnnualRev: 26400, defaultSpStatus: 'polni_y1' }
  },
  {
    slug: 'racun-poslovno-svetovanje-sp',
    title: 'Vzorec računa za poslovno, finančno in kadrovsko svetovanje (PDF)',
    h1: 'Izdaja računa in ponudbe za poslovno svetovanje brez registracije',
    desc: 'Profesionalen PDF obrazec za svetovalce, mentorje in projektne vodje v Sloveniji z avtomatsko QR kodo za plačilo.',
    answer: 'Svetovalne storitve B2B naročnikom zahtevajo natančen opis storitve, obdobje opravljanja in pravilen sklic SI12. Izpolnite spodnji obrazec in takoj natisnite dokument.',
    preset: { defaultTab: 'invoice', defaultService: 'Poslovno svetovanje in optimizacija procesov', defaultAmount: 1600, defaultVat: 0, defaultAnnualRev: 54000 }
  },
  {
    slug: 'racun-prevajanje-in-lektoriranje',
    title: 'Račun za prevajanje, lektoriranje in pisanje besedil — PDF Generator',
    h1: 'Brezplačen generator računa za prevajalce, lektorje in tekstopisce',
    desc: 'Obračunajte avtorske strani, besede ali ure lektoriranja in takoj ustvarite slovenski ali dvojezični PDF račun.',
    answer: 'Prevajalci in lektorji lahko postavke obračunajo na število strani, besed ali ur. V generatorju preprosto prilagodite količino in ceno na enoto.',
    preset: { defaultTab: 'invoice', defaultService: 'Strokovni prevod in lektura dokumentacije', defaultAmount: 420, defaultVat: 0, defaultAnnualRev: 28000 }
  },
  {
    slug: 'racun-fotograf-video-sp',
    title: 'Račun in predračun za fotografa ter video produkcijo — PDF Vzorec',
    h1: 'Izdaja predračuna (are) in računa za fotografe ter snemalce',
    desc: 'Pripravite predračun za rezervacijo termina fotografiranja ali končni račun s QR kodo brez uporabe Worda.',
    answer: 'Pri fotografiranju dogodkov in komercialni produkciji je priporočljivo izdati predračun za rezervacijo termina (npr. 30 % zneska) ter po oddaji gradiva še končni račun.',
    preset: { defaultTab: 'invoice', defaultService: 'Fotografiranje dogodka in postprodukcija fotografij', defaultAmount: 950, defaultVat: 0, defaultAnnualRev: 34000 }
  },
  {
    slug: 'racun-arhitekt-projektiranje-sp',
    title: 'Račun in ponudba za arhitekta ter inženirsko projektiranje (PDF)',
    h1: 'Generator ponudb in situacij za arhitekte, projektante in geodete',
    desc: 'Urejena projektantska ponudba in račun po fazah (IDZ, DGD, PZI, notranje oblikovanje) v PDF formatu.',
    answer: 'Razdelite arhitekturni projekt po fazah (idejna zasnova, projekt za izvedbo, nadzor) neposredno v tabeli postavk in naročniku pošljite pregleden PDF.',
    preset: { defaultTab: 'invoice', defaultService: 'Izdelava idejne zasnove (IDZ) in načrta notranje opreme', defaultAmount: 2800, defaultVat: 22, defaultAnnualRev: 65000 }
  },
  {
    slug: 'racun-cistilni-servis-sp',
    title: 'Račun za čistilni servis in vzdrževanje objektov — Brezplačen PDF',
    h1: 'Hitra izdaja mesečnega računa za čistilni servis in hišniška dela',
    desc: 'Izdajte redni mesečni račun za čiščenje poslovnih prostorov ali stanovanj s QR kodo za hitro nakazilo.',
    answer: 'Podatki vašega čistilnega servisa ostanejo shranjeni v vašem brskalniku, zato naslednji mesec samo spremenite zaporedno številko računa in datum.',
    preset: { defaultTab: 'invoice', defaultService: 'Redno mesečno čiščenje poslovnih prostorov', defaultAmount: 480, defaultVat: 0, defaultAnnualRev: 29000 }
  },
  {
    slug: 'racun-osebni-trener-sp',
    title: 'Račun za osebnega trenerja, fizioterapijo in vadbe — PDF Vzorec',
    h1: 'Generator računov za osebne trenerje, športne vaditelje in terapevte',
    desc: 'Izdajte brezhiben PDF račun za paket osebnih treningov, spletno trenerstvo ali terapevtske storitve.',
    answer: 'Če stranka poravna paket vadb z nakazilom na vaš TRR (prek UPN QR kode na računu), ne potrebujete davčne blagajne.',
    preset: { defaultTab: 'invoice', defaultService: 'Mesečni paket individualnih vadb in prehranskega svetovanja', defaultAmount: 320, defaultVat: 0, defaultAnnualRev: 31000 }
  },
  {
    slug: 'racun-elektricar-vodovodar-sp',
    title: 'Račun in ponudba za električarja, vodovodarja in serviserja (PDF)',
    h1: 'Spletni obrazec za ponudbo in račun — Elektroinštalacije in strojne inštalacije',
    desc: 'Pripravite ponudbo ali račun na telefonu ali računalniku takoj po opravljeni montaži ali servisu.',
    answer: 'Obrtniki na terenu lahko s telefonom v 10 sekundah vpišejo material in uro dela ter stranki takoj pokažejo QR kodo za plačilo ali pošljejo PDF.',
    preset: { defaultTab: 'invoice', defaultService: 'Elektroinštalacijska dela in montaža opreme', defaultAmount: 740, defaultVat: 9.5, defaultAnnualRev: 49000 }
  },
  {
    slug: 'racun-sobodajalec-booking-airbnb',
    title: 'Račun za sobodajalce (Booking / Airbnb) in turistično oddajanje — PDF',
    h1: 'Generator računa za sobodajalce in oddajanje apartmajev v Sloveniji',
    desc: 'Izdelajte račun za nočitev in turistično takso (9,5 % DDV ali mali zavezanec) za goste prek Bookinga, Airbnb ali direktno.',
    answer: 'Sobodajalci in manjši ponudniki nastanitev morajo na računu ločeno izkazati storitev nočitve in obračunano turistično ter promocijsko takso občine.',
    preset: { defaultTab: 'invoice', defaultService: 'Nastanitev v apartmaju (4 nočitve)', defaultAmount: 520, defaultVat: 9.5, defaultAnnualRev: 24000 }
  },
  {
    slug: 'normiranec-30000-eur-neto',
    title: 'Normiranec 30.000 € letno (2.500 €/mesec) — Koliko ostane čisto v 2026?',
    h1: 'Izračun za 30.000 € letnih prihodkov: Polni in popoldanski normirani s.p. 2026',
    desc: 'Natančen razrez prispevkov in dohodnine pri 30.000 € letnega prometa (2.500 € mesečno) v letu 2026.',
    answer: 'Pri 30.000 € letnih prihodkov polni normirani s.p. plača 1.200 € letne dohodnine (4 %) in 7.812,48 € minimalnih prispevkov. Čisti letni zaslužek znaša 20.987,52 € oziroma 1.748,96 € neto na mesec (v 1. letu s.p. pa kar 1.934,20 € na mesec).',
    preset: { defaultTab: 'calc', defaultAnnualRev: 30000, defaultSpStatus: 'polni' }
  },
  {
    slug: 'normiranec-50000-eur-neto',
    title: 'Normiranec 50.000 € letno — Izračun davka za polni in popoldanski s.p. 2026',
    h1: 'Izračun neto zaslužka pri 50.000 € prihodkov (Meja za popoldanski s.p.)',
    desc: 'Primerjava obdavčitve pri 50.000 € letnih prihodkov med polnim in popoldanskim normiranim s.p. v letu 2026.',
    answer: 'Pri 50.000 € letnega prometa polnemu normiranemu s.p. po 2.000 € dohodnine in 7.812,48 € prispevkov ostane 40.187,52 € letno (3.348,96 € mesečno). Za popoldanski s.p. 50.000 € predstavlja zgornjo zakonsko mejo prihodkov.',
    preset: { defaultTab: 'calc', defaultAnnualRev: 50000, defaultSpStatus: 'polni' }
  },
  {
    slug: 'normiranec-meja-60000-izracun',
    title: 'Normirani s.p. meja 60.000 € in vstop v DDV — Kaj se zgodi nad 60.000 €?',
    h1: 'Zlata točka 60.000 € za normirani s.p. v letu 2026 (Izračun in DDV prag)',
    desc: 'Zakaj je 60.000 € ključna meja za 80 % normirane odhodke in obvezno identifikacijo za DDV v Sloveniji.',
    answer: 'Do 60.000 € letnih prihodkov polni normirani s.p. koristi polnih 80 % normiranih odhodkov (4 % efektivni davek) in hkrati ostaja pod pragom 60.000 € za obvezni vstop v sistem DDV za domači promet.',
    preset: { defaultTab: 'calc', defaultAnnualRev: 60000, defaultSpStatus: 'polni' }
  },
  {
    slug: 'normiranec-80000-eur-neto',
    title: 'Normiranec 80.000 € letno v 2026 — Izračun davka nad mejo 60.000 €',
    h1: 'Izračun za normirani s.p. pri 80.000 € prihodkov (Presežek nad 60.000 €)',
    desc: 'Koliko davka plača polni normirani s.p. pri 80.000 € letnega prometa v letu 2026 in ali se še splača ostati normiranec.',
    answer: 'Pri 80.000 € prihodkov polni normiranec uveljavlja 48.000 € normiranih odhodkov (80 % od prvih 60.000 €). Davčna osnova znaša 32.000 €, davek (20 %) pa 6.400 €. Po prispevkih vam ostane 65.787,52 € čisto (5.482,29 €/mesec).',
    preset: { defaultTab: 'calc', defaultAnnualRev: 80000, defaultSpStatus: 'polni' }
  },
  {
    slug: 'normiranec-100000-eur-neto',
    title: 'Normiranec 100.000 € letno v 2026 — Izračun in primerjava z d.o.o.',
    h1: 'Izračun obdavčitve pri 100.000 € letnih prihodkov (Polni normirani s.p.)',
    desc: 'Natančen izračun davčne osnove, dohodnine in prispevkov pri 100.000 € prometa pod zgornjim pragom 120.000 €.',
    answer: 'Pri 100.000 € letnih prihodkov priznani normirani odhodki znašajo 48.000 €, davčna osnova je 52.000 €, davek (20 %) pa 10.400 €. Skupaj z minimalnimi prispevki celotna obremenitev znaša le 18,2 %, čisti neto pa 81.787,52 €.',
    preset: { defaultTab: 'calc', defaultAnnualRev: 100000, defaultSpStatus: 'polni' }
  },
  {
    slug: 'popoldanski-sp-20000-eur-neto',
    title: 'Popoldanski s.p. 20.000 € letno — Koliko ostane po davku in prispevkih?',
    h1: 'Izračun za popoldanski s.p. pri 20.000 € letnih prihodkov (2026)',
    desc: 'Simulacija neto zaslužka za dopolnilno dejavnost ob redni zaposlitvi pri 20.000 € letnih prihodkov.',
    answer: 'Pri 20.000 € prihodkov prek popoldanskega normiranega s.p. priznani odhodki znašajo 13.000 € (80 % do 12.500 € in 40 % nad tem), letni davek 1.400 €, pavšalni prispevki pa 1.356,12 €. Čisti letni izkupiček je 17.243,88 €.',
    preset: { defaultTab: 'calc', defaultAnnualRev: 20000, defaultSpStatus: 'popoldanski' }
  },
  {
    slug: 'ddv-kalkulator-slovenija',
    title: 'DDV Kalkulator Slovenija (22 %, 9,5 % in 5 %) — Izračun iz bruto v neto',
    h1: 'Slovenski DDV kalkulator: Pretvorba neto v bruto in izračun DDV iz bruto zneska',
    desc: 'Hiter spletni DDV pretvornik za vse slovenske davčne stopnje: splošna 22 %, znižana 9,5 % in posebna znižana 5 %.',
    answer: 'Za preračun slovenskega 22 % DDV iz bruto zneska delite končni znesek z 1,22 (pri 9,5 % stopnji pa z 1,095). Uporabite spodnji pretvornik za takojšen izračun na cent natančno.',
    preset: { defaultTab: 'tools', defaultAnnualRev: 45000 }
  },
  {
    slug: 'izracun-sklica-si12',
    title: 'Izračun sklica SI12 (Mod-11 kontrolna številka) — Spletni kalkulator',
    h1: 'Generator pravilnega sklica SI12 po modulu 11 za slovenske UPN račune',
    desc: 'Brezplačno izračunajte 13-mestni sklic in kontrolno številko po standardu Združenja bank Slovenije (model SI12).',
    answer: 'Model sklica SI12 na zadnjem mestu vsebuje kontrolno številko, izračunano po ponderiranem modulu 11. S tem preprečite napačen vnos reference ob plačilu računa v spletni banki.',
    preset: { defaultTab: 'tools', defaultAnnualRev: 40000 }
  }
];

function renderAffiliateSection() {
  const cards = (config.affiliates || []).map((a) => `
    <div class="b2b-card">
      <div>
        <span class="b2b-badge">${a.badge_sl}</span>
        <h3 style="margin-top:8px;">${a.name}</h3>
        <p style="margin-top:6px;">${a.headline_sl}</p>
      </div>
      <a href="${a.url}" target="_blank" rel="noopener sponsored" class="b2b-cta" data-affiliate="${a.id}">${a.cta_sl}</a>
    </div>
  `).join('');

  return `
    <section class="b2b-section no-print" id="priporocena-orodja">
      <div class="card-title">
        <span>Priporočeni poslovni računi in orodja za slovenske s.p. in d.o.o. (2026)</span>
        <span style="font-size:0.76rem;color:#64748b;font-weight:600;">Preverjeni EU ponudniki v €</span>
      </div>
      <div class="b2b-grid">${cards}</div>
    </section>
  `;
}

function renderInteractiveCoreHTML() {
  const priceLabel = (config.micro_paywall?.price_eur || 3.90).toFixed(2).replace('.', ',') + ' €';
  return `
    <div class="tabs-bar no-print">
      <button type="button" class="tab-btn active" data-tab="invoice">1. Generator Računa / Predračuna (PDF + QR)</button>
      <button type="button" class="tab-btn" data-tab="calc">2. Kalkulator Normiranec s.p. 2026</button>
      <button type="button" class="tab-btn" data-tab="tools">3. DDV &amp; Sklic SI12 Orodja</button>
    </div>

    <div class="workspace">
      <!-- TAB 1: INVOICE & QUOTE GENERATOR -->
      <div class="tab-panel active" id="panel-invoice">
        <div class="invoice-grid">
          <div class="card no-print">
            <div class="card-title">
              <span>Podatki dokumenta (brez registracije)</span>
              <span style="font-size:0.75rem;color:#059669;font-weight:700;">100% v vašem brskalniku</span>
            </div>

            <div class="form-section">
              <div class="field-grid three">
                <div class="field">
                  <label for="invDocType">Vrsta dokumenta</label>
                  <select id="invDocType">
                    <option value="RACUN">Račun</option>
                    <option value="PREDRACUN">Predračun (Proforma)</option>
                    <option value="PONUDBA">Ponudba</option>
                  </select>
                </div>
                <div class="field">
                  <label for="invNumber">Številka dokumenta</label>
                  <input type="text" id="invNumber" value="2026-001">
                </div>
                <div class="field">
                  <label for="invTaxMode">Status DDV (ZDDV-1)</label>
                  <select id="invTaxMode">
                    <option value="norm_no_vat">Nezavezanec (94. čl. ZDDV-1)</option>
                    <option value="vat_payer">Zavezanec za DDV (SI...)</option>
                    <option value="eu_reverse">Tujina EU (Reverse Charge)</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="form-section">
              <div class="section-label">Izdajatelj (Vaš s.p. ali d.o.o.)</div>
              <div class="field-grid">
                <div class="field">
                  <label for="issuerName">Naziv podjetja / s.p.</label>
                  <input type="text" id="issuerName" value="Janez Novak s.p.">
                </div>
                <div class="field">
                  <label for="issuerTax">Davčna številka / ID za DDV</label>
                  <input type="text" id="issuerTax" value="12345678">
                </div>
                <div class="field full">
                  <label for="issuerAddr">Ulica, poštna številka in kraj</label>
                  <input type="text" id="issuerAddr" value="Slovenska cesta 12, 1000 Ljubljana">
                </div>
                <div class="field">
                  <label for="issuerIban">Poslovni TRR (IBAN za UPN QR)</label>
                  <input type="text" id="issuerIban" value="SI56 0201 0001 2345 678">
                </div>
                <div class="field">
                  <label for="issuerCity">Kraj izdaje</label>
                  <input type="text" id="issuerCity" value="Ljubljana">
                </div>
                <div class="field" id="proLogoWrap" style="display:none;">
                  <label for="invLogoInput">Logotip podjetja (PRO)</label>
                  <input type="file" id="invLogoInput" accept="image/*">
                </div>
                <div class="field" id="proBilingualWrap" style="display:none;justify-content:center;">
                  <label><input type="checkbox" id="invBilingual"> Dvojezični izpis (SL / EN)</label>
                </div>
              </div>
            </div>

            <div class="form-section">
              <div class="section-label">Naročnik / Kupec</div>
              <div class="field-grid">
                <div class="field">
                  <label for="clientName">Naziv kupca / podjetja</label>
                  <input type="text" id="clientName" value="Inovacija d.o.o.">
                </div>
                <div class="field">
                  <label for="clientTax">Davčna / ID za DDV kupca</label>
                  <input type="text" id="clientTax" value="SI87654321">
                </div>
                <div class="field full">
                  <label for="clientAddr">Naslov kupca</label>
                  <input type="text" id="clientAddr" value="Dunajska cesta 50, 1000 Ljubljana">
                </div>
              </div>
            </div>

            <div class="form-section">
              <div class="section-label">Datumi in sklic (SI12)</div>
              <div class="field-grid three">
                <div class="field">
                  <label for="invDateIssue">Datum izdaje</label>
                  <input type="date" id="invDateIssue">
                </div>
                <div class="field">
                  <label for="invDateService">Datum storitve</label>
                  <input type="date" id="invDateService">
                </div>
                <div class="field">
                  <label for="invDateDue">Rok plačila (valuta)</label>
                  <input type="date" id="invDateDue">
                </div>
                <div class="field full">
                  <label for="invReference">Sklic / Referenca (samodejni izračun SI12 Mod-11)</label>
                  <input type="text" id="invReference">
                </div>
              </div>
            </div>

            <div class="form-section">
              <div class="section-label">Postavke na računu / ponudbi</div>
              <div id="itemsContainer" class="items-list"></div>
              <button type="button" id="addItemBtn" class="btn-secondary" style="margin-top:10px;">+ Dodaj postavko</button>
            </div>

            <div class="cta-stack">
              <button type="button" class="btn-pro-main js-open-pro">
                <span>Prenesi PRO PDF brez vodnega žiga (Vrednost 3,90 €)</span>
                <span class="price-chip">0,00 € (Danes Brezplačno!)</span>
              </button>
              <button type="button" id="freePrintBtn" class="btn-free-print">
                Natisni / Shrani PDF (Brez vodnega žiga)
              </button>
            </div>
          </div>

          <!-- LIVE A4 PREVIEW -->
          <div>
            <div class="pocket-net-banner no-print">
              <span>Informativni neto izkupiček od tega računa (polni normiranec, 4 % davek):</span>
              <strong id="pocketNetValue">1.200,00 €</strong>
            </div>

            <div class="invoice-paper" id="invoicePaper">
              <div class="inv-header">
                <div>
                  <div class="inv-doc-title" id="pvDocTitle">RAČUN št. 2026-001</div>
                  <div style="font-size:0.78rem;color:#64748b;margin-top:2px;">Veljavna listina po ZDDV-1 in SRS</div>
                </div>
                <div id="pvLogoBox"></div>
              </div>

              <div class="inv-parties">
                <div class="inv-party-box">
                  <div class="inv-party-label">Izdajatelj</div>
                  <div id="pvIssuer"></div>
                </div>
                <div class="inv-party-box">
                  <div class="inv-party-label">Prejemnik / Plačnik</div>
                  <div id="pvClient"></div>
                </div>
              </div>

              <div class="inv-meta-row">
                <div><strong>Kraj in datum:</strong><br><span id="pvMetaPlace"></span></div>
                <div><strong>Opravljena storitev:</strong><br><span id="pvMetaService"></span></div>
                <div><strong>Rok plačila:</strong><br><span id="pvMetaDue"></span></div>
                <div><strong>Sklic (Referenca):</strong><br><span id="pvMetaRef"></span></div>
              </div>

              <table class="inv-table">
                <thead>
                  <tr>
                    <th>Opis storitve / blaga</th>
                    <th class="num">Kol.</th>
                    <th class="num">Cena brez DDV</th>
                    <th class="num">DDV</th>
                    <th class="num">Vrednost</th>
                  </tr>
                </thead>
                <tbody id="pvItemsBody"></tbody>
              </table>

              <div class="inv-bottom-grid">
                <div class="qr-payment-box">
                  <div id="pvQrBox"></div>
                  <div class="qr-meta">
                    <strong>Slikaj in plačaj (UPN / SEPA QR)</strong><br>
                    IBAN: <span id="pvQrMetaIban"></span><br>
                    Sklic: <span id="pvQrMetaRef"></span><br>
                    Znesek: <strong id="pvQrMetaAmt"></strong><br>
                    <span style="color:#64748b;">Deluje v NLB Klik, OTP, Revolut, N26</span>
                  </div>
                </div>

                <div class="inv-totals-box">
                  <div class="tot-line"><span>Osnova brez DDV:</span><strong id="pvNetTotal">0,00 €</strong></div>
                  <div class="tot-line"><span>Znesek DDV:</span><strong id="pvVatTotal">0,00 €</strong></div>
                  <div class="tot-line grand"><span>ZA PLAČILO:</span><span id="pvGrandTotal">0,00 €</span></div>
                </div>
              </div>

              <div class="inv-clause" id="pvLegalClause"></div>
              <div style="margin-top:16px;display:flex;justify-content:space-between;font-size:0.75rem;color:#64748b;">
                <span>Dokument je veljaven brez žiga in podpisa.</span>
                <span>Hvala za zaupanje in sodelovanje!</span>
              </div>
              <div class="inv-watermark" id="invWatermark">
                Ustvarjeno z brezplačnim generatorjem SloRačun.si — Odstranite to vrstico in dodajte svoj logotip s PRO paketom (${priceLabel}).
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 2: NORMIRANEC S.P. 2026 CALCULATOR -->
      <div class="tab-panel no-print" id="panel-calc">
        <div class="calc-grid">
          <div class="card">
            <div class="card-title">Parametri poslovanja v letu 2026</div>
            <div class="field" style="margin-bottom:14px;">
              <label for="calcAnnualRev">Letni prihodki (brez DDV) v €</label>
              <input type="number" id="calcAnnualRev" value="48000" min="0" max="150000" step="500">
              <input type="range" id="calcRevSlider" min="3000" max="130000" step="1000" value="48000" style="margin-top:8px;">
            </div>
            <div class="field" style="margin-bottom:16px;">
              <label for="calcSpStatus">Vrsta s.p. in oprostitve prispevkov (2026)</label>
              <select id="calcSpStatus">
                <option value="polni">Polni normirani s.p. (polni prispevki ~651,04 €/mesec)</option>
                <option value="polni_y1">Polni normirani s.p. — 1. leto poslovanja (-50 % PIZ ~465,80 €/mesec)</option>
                <option value="polni_y2">Polni normirani s.p. — 2. leto poslovanja (-30 % PIZ ~539,90 €/mesec)</option>
                <option value="popoldanski">Popoldanski normirani s.p. (pavšalni prispevki 113,01 €/mesec)</option>
              </select>
            </div>
            <div id="resCapWarning" style="display:none;background:#fef2f2;color:#b91c1c;border:1px solid #fecaca;padding:10px 12px;border-radius:8px;font-size:0.84rem;font-weight:700;margin-bottom:12px;"></div>
            <p style="font-size:0.81rem;color:#475569;margin-bottom:14px;">
              Izračun upošteva zakonske spremembe za leto 2026: mejo 60.000 € za 80 % normirane odhodke (zgornji prag 120.000 € za polni s.p. in 50.000 € za popoldanski s.p.), usklajeni OZP (39,36 €) ter 2 % prispevek za dolgotrajno oskrbo.
            </p>
            <button type="button" id="jumpToInvoiceBtn" class="btn-pro-main" style="width:100%;justify-content:center;">
              Ustvari brezplačen račun z UPN QR kodo →
            </button>
          </div>

          <div class="card">
            <div class="card-title">Rezultat izračuna (Leto 2026)</div>
            <div class="kpi-cards">
              <div class="kpi-box highlight">
                <div class="kpi-label">Čisti mesečni neto zaslužek</div>
                <div class="kpi-val" id="resMonthlyNet">3.182,29 €</div>
              </div>
              <div class="kpi-box highlight">
                <div class="kpi-label">Čisti letni neto zaslužek</div>
                <div class="kpi-val" id="resAnnualNet">38.187,52 €</div>
              </div>
              <div class="kpi-box">
                <div class="kpi-label">Letna dohodnina (FURS)</div>
                <div class="kpi-val" id="resAnnualTax">1.920,00 €</div>
              </div>
              <div class="kpi-box">
                <div class="kpi-label">Letni prispevki skupaj</div>
                <div class="kpi-val" id="resAnnualContrib">7.812,48 €</div>
              </div>
            </div>

            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px;font-size:0.86rem;">
              <div class="tot-line"><span>Priznani normirani odhodki:</span><strong id="resNormExp">38.400,00 €</strong></div>
              <div class="tot-line"><span>Davčna osnova:</span><strong id="resTaxBase">9.600,00 €</strong></div>
              <div class="tot-line"><span>Mesečni prispevki (ZPIZ + ZZZS + OZP + DO):</span><strong id="resMonthlyContrib">651,04 €</strong></div>
              <div class="tot-line"><span>Skupna efektivna obremenitev (davek + prispevki):</span><strong id="resEffRate">20,3 %</strong></div>
              <div class="tot-line" style="border-top:1px solid #cbd5e1;margin-top:8px;padding-top:8px;">
                <span>Primerjava letnega neto (Polni vs. Popoldanski s.p.):</span>
                <span><strong id="cmpPolniNet">38.187,52 €</strong> vs. <strong id="cmpPopNet">43.143,88 €</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 3: DDV & SI12 UTILITIES -->
      <div class="tab-panel no-print" id="panel-tools">
        <div class="calc-grid">
          <div class="card">
            <div class="card-title">Slovenski DDV Kalkulator (22 %, 9,5 %, 5 %)</div>
            <div class="field-grid three" style="margin-bottom:16px;">
              <div class="field">
                <label for="utilDdvAmount">Znesek v €</label>
                <input type="number" id="utilDdvAmount" value="1000" step="10">
              </div>
              <div class="field">
                <label for="utilDdvRate">Stopnja DDV</label>
                <select id="utilDdvRate">
                  <option value="22">22 % (Splošna stopnja)</option>
                  <option value="9.5">9,5 % (Znižana stopnja)</option>
                  <option value="5">5 % (Posebna znižana — knjige)</option>
                </select>
              </div>
              <div class="field">
                <label for="utilDdvDir">Smer izračuna</label>
                <select id="utilDdvDir">
                  <option value="from_net">Osnova brez DDV → Z DDV</option>
                  <option value="from_gross">Bruto z DDV → Osnova</option>
                </select>
              </div>
            </div>
            <div class="inv-totals-box">
              <div class="tot-line"><span>Neto osnova brez DDV:</span><strong id="utilResNet">1.000,00 €</strong></div>
              <div class="tot-line"><span>Znesek DDV:</span><strong id="utilResVat">220,00 €</strong></div>
              <div class="tot-line grand"><span>Bruto znesek z DDV:</span><span id="utilResGross">1.220,00 €</span></div>
            </div>
          </div>

          <div class="card">
            <div class="card-title">Generator Sklica SI12 (Kontrolna številka po Modulu 11)</div>
            <div class="field" style="margin-bottom:14px;">
              <label for="utilSi12Raw">Vnesite osnovno številko računa ali kupca (samo števke)</label>
              <input type="text" id="utilSi12Raw" value="20260015">
            </div>
            <div class="kpi-box highlight">
              <div class="kpi-label">Veljaven bančni sklic po standardu ZBS</div>
              <div class="kpi-val" id="utilSi12Result">SI12 202600154</div>
            </div>
          </div>
        </div>
      </div>

      <!-- STRATEGIC PROGRAMMATIC AD SLOT -->
      <div class="ad-slot no-print" aria-label="Sponzorirano obvestilo">
        <div>
          <div class="ad-tag">Pokrovitelj orodja za podjetnike • Poslovne finance v EU</div>
          <div style="font-weight:700;font-size:0.93rem;margin-top:2px;">
            Prejemate plačila iz tujine ali plačujete provizije domači banki? Odprite brezplačen EU IBAN račun za s.p. v 5 minutah.
          </div>
        </div>
        <a href="${config.affiliates[0]?.url || '#'}" target="_blank" rel="noopener sponsored" class="b2b-cta" data-affiliate="ad_banner_wise">Preveri ugodnost v € →</a>
      </div>

      ${renderAffiliateSection()}
    </div>

    <!-- MICRO-PAYWALL PROMO MODAL (€3,90 -> 0,00 €) -->
    <div class="modal-backdrop no-print" id="proModal">
      <div class="modal-box">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span class="hero-badge" style="margin:0;background:#ecfdf5;color:#047857;border-color:#6ee7b7;">🎁 Promocijska ugodnost 2026</span>
          <button type="button" id="closeProModal" style="background:none;border:none;font-size:1.4rem;cursor:pointer;">×</button>
        </div>
        <h2 style="margin-top:12px;font-size:1.35rem;">Profesionalni PDF paket brez vodnega žiga</h2>
        <p style="color:#475569;font-size:0.9rem;margin-top:6px;">
          Redna cena PRO paketa je <strong>${priceLabel}</strong>, vendar vam v promocijskem obdobju doživljenjski PRO dostop omogočamo <strong>100% BREZPLAČNO</strong>:
        </p>
        <ul class="modal-list">
          <li>✅ <strong>100% čist PDF izpis</strong> — brez spodnje oznake SloRačun.si</li>
          <li>✅ <strong>Lasten logotip podjetja</strong> v glavi računa, predračuna in ponudbe</li>
          <li>✅ <strong>Dvojezični EU izpis (SL / EN)</strong> za tuje naročnike</li>
          <li>✅ <strong>UPN / SEPA QR koda</strong> za takojšnje mobilno plačilo naročnikov</li>
        </ul>
        <button type="button" id="promoUnlockBtn" class="btn-pro-main" style="width:100%;justify-content:center;font-size:1rem;background:linear-gradient(135deg,#059669,#047857);">
          ⚡ Brezplačno aktiviraj PRO in prenesi PDF (0,00 €) →
        </button>
        <div id="promoSuccessNotice" style="display:none;margin-top:10px;background:#ecfdf5;border:1px solid #6ee7b7;color:#065f46;padding:10px;border-radius:8px;font-size:0.84rem;font-weight:700;">
          ✓ PRO paket uspešno aktiviran! Vodni žig je odstranjen in PDF je pripravljen za tisk.
        </div>
      </div>
    </div>
  `;
}

function renderDirectoryLinks(prefix) {
  return PROGRAMMATIC_30_PAGES.map((p) => `<a href="${prefix}p/${p.slug}/">${p.h1}</a>`).join('\n');
}

function renderFullPage({ relRoot, canonicalUrl, title, desc, h1, subtitle, answerBox, presetObj, extraContentHtml }) {
  const schemaJson = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'SloRačun Pro — Računi, Predračuni & Kalkulator Normiranec 2026',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    inLanguage: 'sl-SI',
    url: canonicalUrl,
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'EUR',
      description: 'Brezplačen spletni generator računov z UPN QR in kalkulator normiranec s.p. 2026'
    }
  });

  return `<!DOCTYPE html>
<html lang="sl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <link rel="canonical" href="${canonicalUrl}">
  <meta property="og:locale" content="sl_SI">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:url" content="${canonicalUrl}">
  <link rel="stylesheet" href="${relRoot}assets/styles.css">
  <script type="application/ld+json">${schemaJson}</script>
</head>
<body>
  <header class="topbar no-print">
    <div class="container topbar-inner">
      <a href="${relRoot}index.html" class="brand">
        <span>🇸🇮 SloRačun.si</span>
        <span class="brand-badge">EU 2026</span>
      </a>
      <nav class="nav-links">
        <a href="${relRoot}index.html">Generator Računov</a>
        <a href="${relRoot}p/kalkulator-normiranec-sp-2026/">Kalkulator s.p. 2026</a>
        <a href="${relRoot}vodici/">Vodniki in Primerjave</a>
        <a href="#priporocena-orodja">Poslovni TRR (0 €)</a>
        <button type="button" id="proTopBtn" class="pro-pill-btn js-open-pro">PRO Paket (3,90 €)</button>
      </nav>
    </div>
  </header>

  <section class="hero no-print">
    <div class="container">
      <div class="hero-badge">⚡ Brez registracije • UPN / SEPA QR • Zakonodaja FURS 2026</div>
      <h1>${h1}</h1>
      <p class="subtitle">${subtitle}</p>
      ${answerBox ? `<div style="margin-top:14px;background:#ffffff;border-left:4px solid #0f52ba;padding:12px 16px;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,0.05);font-size:0.92rem;color:#1e293b;max-width:920px;"><strong>Hiter odgovor (2026):</strong> ${answerBox}</div>` : ''}
    </div>
  </section>

  <main class="container">
    ${renderInteractiveCoreHTML()}
    ${extraContentHtml || ''}
  </main>

  <section class="seo-directory no-print">
    <div class="container">
      <h2 style="font-size:1.15rem;font-weight:800;">Specializirani kalkulatorji in vzorci računov po dejavnostih v Sloveniji (2026)</h2>
      <div class="seo-links-grid">
        ${renderDirectoryLinks(relRoot)}
      </div>
    </div>
  </section>

  <footer class="site-footer no-print">
    <div class="container" style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;">
      <div>© 2026 <strong>SloRačun.si</strong> — Neodvisno spletno orodje za samostojne podjetnike in mala podjetja v Sloveniji.</div>
      <div>Vsi podatki v obrazcu ostanejo izključno v vašem brskalniku (100 % zasebnost po GDPR). • <a href="${relRoot}vodici/" style="color:#cbd5e1;">Davčni vodniki 2026</a> • <a href="${relRoot}sitemap.xml" style="color:#cbd5e1;">Sitemap</a></div>
    </div>
  </footer>

  <script>window.PAGE_PRESET = ${JSON.stringify(presetObj || {})};</script>
  <script src="${relRoot}assets/config.js"></script>
  <script src="${relRoot}assets/qr-mini.js"></script>
  <script src="${relRoot}assets/app.js"></script>
</body>
</html>`;
}

function buildAll() {
  // 1. Sync config.js
  const cfgJs = `window.SLORACUN_CONFIG = ${JSON.stringify({
    brand_name: config.brand_name,
    price_eur: config.micro_paywall?.price_eur || 3.90,
    stripe_payment_link: config.micro_paywall?.stripe_payment_link || '',
    affiliates: config.affiliates || []
  }, null, 2)};\n`;
  fs.mkdirSync(path.join(SITE_DIR, 'assets'), { recursive: true });
  fs.writeFileSync(path.join(SITE_DIR, 'assets', 'config.js'), cfgJs, 'utf8');

  // 2. Build Home Page
  const faqHtml = `
    <section class="card no-print" style="margin-bottom:28px;">
      <h2 style="font-size:1.2rem;font-weight:800;margin-bottom:12px;">Pogosta vprašanja slovenskih podjetnikov (FURS &amp; ZDDV-1 v letu 2026)</h2>
      <div style="display:grid;gap:14px;font-size:0.9rem;">
        <div>
          <strong>1. Ali moram račun davčno potrditi pri FURS, če ga ustvarim tukaj v PDF?</strong>
          <p style="color:#475569;margin-top:3px;">Ne, če kupec račun plača z nakazilom na vaš poslovni TRR (npr. prek UPN naloga ali s skeniranjem QR kode na računu). Davčno potrjevanje računov je v Sloveniji obvezno le pri gotovinskem poslovanju (bankovci, kartice, kriptovalute).</p>
        </div>
        <div>
          <strong>2. Kakšni so minimalni prispevki in meje za normirani s.p. v letu 2026?</strong>
          <p style="color:#475569;margin-top:3px;">Minimalni prispevki za polni s.p. v letu 2026 znašajo približno 651,04 €/mesec (v 1. letu s.p. okoli 465,80 €/mesec zaradi 50 % oprostitve PIZ), za popoldanski s.p. pa 113,01 €/mesec. Do 60.000 € prihodkov pri polnem normiranem s.p. velja 80 % normiranih odhodkov (4 % efektivna dohodnina).</p>
        </div>
        <div>
          <strong>3. Ali se podatki mojih strank shranjujejo na strežnik?</strong>
          <p style="color:#475569;margin-top:3px;">Ne. SloRačun deluje 100 % neposredno v vašem spletnem brskalniku. Noben podatek o vaših strankah ali zneskih se ne pošilja na zunanji strežnik.</p>
        </div>
      </div>
    </section>
  `;

  const homeHtml = renderFullPage({
    relRoot: './',
    canonicalUrl: `${BASE_URL}/`,
    title: 'SloRačun.si — Brezplačna izdaja računa z UPN QR v PDF & Kalkulator Normiranec s.p. 2026',
    desc: 'Izdajte pravilen slovenski račun, predračun ali ponudbo z UPN/SEPA QR kodo v PDF v 10 sekundah brez registracije + natančen kalkulator za normirani s.p. 2026.',
    h1: 'Izdajte račun ali predračun z UPN QR kodo v 10 sekundah — brez registracije',
    subtitle: 'Sodobno slovensko orodje za samostojne podjetnike (polni in popoldanski s.p.) ter d.o.o.: takojšen PDF izpis s sklicem SI12, klavzulo ZDDV-1 in kalkulatorjem prispevkov ter davka za leto 2026.',
    answerBox: '',
    presetObj: {},
    extraContentHtml: faqHtml
  });
  fs.writeFileSync(path.join(SITE_DIR, 'index.html'), homeHtml, 'utf8');

  // 3. Build 30 Programmatic SEO Pages (/platform-site/p/<slug>/index.html)
  const urlsForSitemap = [`${BASE_URL}/`];

  PROGRAMMATIC_30_PAGES.forEach((pg) => {
    const dir = path.join(SITE_DIR, 'p', pg.slug);
    fs.mkdirSync(dir, { recursive: true });
    const canonical = `${BASE_URL}/p/${pg.slug}/`;
    urlsForSitemap.push(canonical);

    const html = renderFullPage({
      relRoot: '../../',
      canonicalUrl: canonical,
      title: `${pg.title} | SloRačun.si`,
      desc: pg.desc,
      h1: pg.h1,
      subtitle: pg.desc,
      answerBox: pg.answer,
      presetObj: pg.preset,
      extraContentHtml: ''
    });
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  });

  // 4. Build /vodici/ Hub from publications.json
  const pubPath = path.join(DATA_DIR, 'publications.json');
  const pubData = fs.existsSync(pubPath)
    ? JSON.parse(fs.readFileSync(pubPath, 'utf8'))
    : { publications: [] };

  const vodiciDir = path.join(SITE_DIR, 'vodici');
  fs.mkdirSync(vodiciDir, { recursive: true });
  urlsForSitemap.push(`${BASE_URL}/vodici/`);

  const articlesCards = (pubData.publications || []).map((art) => {
    if (art.slug) urlsForSitemap.push(`${BASE_URL}/vodici/${art.slug}/`);
    return `
      <article class="card" style="margin-bottom:16px;">
        <div style="font-size:0.76rem;color:#64748b;font-weight:700;">${(art.published_at || '').slice(0, 10)} • Davčni in podjetniški vodnik 2026</div>
        <h2 style="font-size:1.2rem;margin-top:6px;"><a href="./${art.slug}/">${art.title_local}</a></h2>
        <p style="color:#475569;font-size:0.9rem;margin-top:6px;">${art.excerpt_sl || ''}</p>
        <div style="margin-top:10px;"><a href="./${art.slug}/" style="font-weight:700;font-size:0.88rem;">Preberi celoten vodnik in primerjavo →</a></div>
      </article>
    `;
  }).join('\n') || '<p>Novi vodniki se pripravljajo...</p>';

  const vodiciIndexHtml = `<!DOCTYPE html>
<html lang="sl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Podjetniški in davčni vodniki za s.p. 2026 | SloRačun.si</title>
  <meta name="description" content="Praktični vodniki, primerjave in izračuni za normirani s.p., izdajo računov, UPN QR in poslovanje v Sloveniji v letu 2026.">
  <link rel="canonical" href="${BASE_URL}/vodici/">
  <link rel="stylesheet" href="../assets/styles.css">
</head>
<body>
  <header class="topbar">
    <div class="container topbar-inner">
      <a href="../index.html" class="brand"><span>🇸🇮 SloRačun.si</span><span class="brand-badge">Vodniki 2026</span></a>
      <nav class="nav-links">
        <a href="../index.html">Generator Računov</a>
        <a href="../p/kalkulator-normiranec-sp-2026/">Kalkulator s.p. 2026</a>
      </nav>
    </div>
  </header>
  <section class="hero">
    <div class="container">
      <h1>Praktični vodniki in primerjave za samostojne podjetnike v Sloveniji (2026)</h1>
      <p class="subtitle">Neposredni odgovori, izračuni v evrih (€) in zakonska pravila za brezskrbno poslovanje.</p>
    </div>
  </section>
  <main class="container" style="padding:28px 20px 48px;">
    ${articlesCards}
  </main>
</body>
</html>`;
  fs.writeFileSync(path.join(vodiciDir, 'index.html'), vodiciIndexHtml, 'utf8');

  // 5. Build sitemap.xml, robots.txt, .nojekyll
  const todayIso = new Date().toISOString().slice(0, 10);
  const uniqueUrls = Array.from(new Set(urlsForSitemap));
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueUrls.map((u) => `  <url>\n    <loc>${u}</loc>\n    <lastmod>${todayIso}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${u === BASE_URL + '/' ? '1.0' : '0.8'}</priority>\n  </url>`).join('\n')}
</urlset>\n`;

  fs.writeFileSync(path.join(SITE_DIR, 'sitemap.xml'), sitemapXml, 'utf8');
  fs.writeFileSync(path.join(SITE_DIR, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${BASE_URL}/sitemap.xml\n`, 'utf8');
  fs.writeFileSync(path.join(SITE_DIR, '.nojekyll'), '', 'utf8');

  console.log(`[FASE 3 OK] Plataforma construída com sucesso!`);
  console.log(`-> 1 Home + ${PROGRAMMATIC_30_PAGES.length} páginas programáticas (/p/) + Hub /vodici/ + ${uniqueUrls.length} URLs no sitemap.xml.`);
}

if (require.main === module) {
  buildAll();
}
module.exports = { buildAll, PROGRAMMATIC_30_PAGES };
