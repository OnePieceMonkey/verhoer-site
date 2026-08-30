# verhoer.werle.app

Promo- und Pflichtseiten für „Das Verhör" (iOS). Statisch: HTML + CSS +
Vanilla JS + GSAP (vendored). Gehostet auf Vercel. Spezifikation: `docs/SPEC.md`.

## Preise ändern

Eine Stelle: `js/site.js`, Konstante `PRICE` ganz oben. Die HTML-Fallbacks in
`index.html` (Suche nach `price-monthly`) passend nachziehen.

## App-Store-Link

**Erledigt.** Alle Store-Verweise in `index.html` zeigen auf
`https://apps.apple.com/de/app/id6797754222` (Kopfzeile, Held, Fusszeile).
Ändert sich die Apple-ID, sind es genau diese drei Stellen.

## Domain

Live unter `verhoer.werle.app` (Vercel). Die Hauptdomain `werle.app`
verlinkt die Seite über die Produktkarte „Das Verhör" (Repo
`OnePieceMonkey/werle-app`), die Fusszeile hier verlinkt zurück.
In der App zeigt `LegalLinks.privacyPolicyURL` auf
`https://verhoer.werle.app/privacy`.

## Assets

- Schriften: aus dem App-Repo (`Games/alibi/App/Resources/Fonts`), alle OFL.
- Tusche-Bilder: `scene_l0.webp` der Fälle, auf 840 px verkleinert.
- Screenshots: Simulator (iPhone), Statusbar 9:41. Neue Screenshots nach
  `assets/screens/` legen, Dateinamen in `index.html` beibehalten.
