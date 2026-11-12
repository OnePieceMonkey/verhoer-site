# verhoer.werle.app

Promo- und Pflichtseiten für „Das Verhör" (iOS). Statisch: HTML + CSS +
Vanilla JS + anime.js 4.5 (vendored, MIT, `js/vendor/`). Gehostet auf Vercel.
Spezifikation: `docs/SPEC.md`.

## Aufbau (seit 12.11.2026)

- `index.html` + `css/home.css` + `js/site.js`: die Startseite. Sie spielt
  Akte 412 beim Scrollen einmal durch: Verhör (Zeitachse am Scrollrad),
  Tafel (ziehbare Karten, der Faden folgt), Anklage (antippen), Filmstreifen
  der Fälle. Aussagen, Namen und Fakten stammen aus
  `Games/alibi/App/Resources/CaseFiles/case-412.json`, gekürzt.
- `privacy.html` + `impressum.html` nutzen weiter `css/site.css` und kein Skript.
- Schriften und Skripte kommen nur von dieser Domain (so steht es in der
  Datenschutzerklärung). Keine CDN-Links einbauen.
- Ohne Skript oder mit „Bewegung reduzieren" steht die Seite vollständig im
  Ruhezustand. Jeder Effekt läuft in `safe(...)`, ein Fehler reißt die anderen
  nicht mit.

## Preise ändern

Eine Stelle: `js/site.js`, Konstante `PRICE` ganz oben. Die HTML-Fallbacks in
`index.html` (Suche nach `price-monthly`) passend nachziehen.

## App-Store-Link

**Erledigt.** Alle Store-Verweise in `index.html` zeigen auf
`https://apps.apple.com/de/app/id6797754222` (Kopfzeile, Held, Preisblock,
Fusszeile, dazu `installUrl` im JSON-LD). Ändert sich die Apple-ID: nach
`id6797754222` suchen.

## Domain

Live unter **`verhoer.werle.app`** (seit 30.08.2026). Der Cloudflare-CNAME
`verhoer` zeigt auf das Vercel-Ziel dieses Projekts, **DNS only** — proxied
(orange Wolke) verhindert, dass Vercel das Zertifikat ausstellen kann.

Die Deployment-Adresse `verhoer-site.vercel.app` bleibt daneben erreichbar;
ältere App-Builds, die noch darauf zeigen, laufen also nicht ins Leere.

In der App zeigt `LegalLinks.privacyPolicyURL` auf
`https://verhoer.werle.app/privacy` — ohne `.html`, das löst `cleanUrls`
in der `vercel.json` auf.

Die Hauptdomain `werle.app` verlinkt die Seite über die Produktkarte
„Das Verhör" (Repo `OnePieceMonkey/werle-app`); die Fusszeile hier
verlinkt zurück.

## Assets

- Schriften: aus dem App-Repo (`Games/alibi/App/Resources/Fonts`), alle OFL.
- Tusche-Bilder: `scene_l0.webp` der Fälle, auf 840 px verkleinert. Der Held
  nutzt `scene_412_hero.webp` in Originalbreite (1086 px).
- Screenshots: Simulator (iPhone), Statusbar 9:41. Neue Screenshots nach
  `assets/screens/` legen, Dateinamen in `index.html` beibehalten.
