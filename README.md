# verhoer.werle.app

Promo- und Pflichtseiten für „Das Verhör" (iOS). Statisch: HTML + CSS +
Vanilla JS + GSAP (vendored). Gehostet auf Vercel. Spezifikation: `docs/SPEC.md`.

## Preise ändern

Eine Stelle: `js/site.js`, Konstante `PRICE` ganz oben. Die HTML-Fallbacks in
`index.html` (Suche nach `price-monthly`) passend nachziehen.

## App-Store-Link scharf schalten

Nach dem Release in `index.html` alle `Bald im App Store`-Buttons/Chips auf die
echte App-Store-URL setzen (`https://apps.apple.com/de/app/idXXXXXXXXX`) und den
Text auf „Laden im App Store" ändern.

## Domain verbinden (nach Launch)

1. Vercel: Projekt → Domains → `verhoer.werle.app` hinzufügen.
2. Cloudflare-Zone `werle.app`: CNAME `verhoer` auf das Vercel-Ziel stellen
   (aktuell zeigt der Plan in `Games/alibi/DOMAIN-SETUP.md` noch auf GitHub Pages).
3. In der App `PassStoreView.privacyPolicyURL` auf
   `https://verhoer.werle.app/privacy.html` setzen (Redirect auf `/privacy` ist ok).

## Assets

- Schriften: aus dem App-Repo (`Games/alibi/App/Resources/Fonts`), alle OFL.
- Tusche-Bilder: `scene_l0.webp` der Fälle, auf 840 px verkleinert.
- Screenshots: Simulator (iPhone), Statusbar 9:41. Neue Screenshots nach
  `assets/screens/` legen, Dateinamen in `index.html` beibehalten.
