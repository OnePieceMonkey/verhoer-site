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

## Domain — noch offen

Die Seite läuft unter `verhoer-site.vercel.app`. **`verhoer.werle.app` ist
noch nicht verbunden:** der CNAME `verhoer` zeigt weiterhin auf
`onepiecemonkey.github.io` (GitHub Pages), Stand 30.08.2026 per DNS-Abfrage
bestätigt.

Zwei Handgriffe, beide ausserhalb des Codes:

1. **Vercel** → Projekt `verhoer-site` → Settings → Domains →
   `verhoer.werle.app` hinzufügen. Vercel nennt dann das CNAME-Ziel
   (`cname.vercel-dns.com`).
2. **Cloudflare** → Zone `werle.app` → DNS → Record `verhoer` von
   `onepiecemonkey.github.io` auf dieses Ziel ändern. Wichtig: **DNS only**
   (graue Wolke, nicht proxied) — sonst kann Vercel das Zertifikat nicht
   ausstellen.

Danach prüfen, dass `https://verhoer.werle.app/privacy` wirklich antwortet,
und erst dann in der App `LegalLinks.privacyPolicyURL` umstellen. Die
`.vercel.app`-Adresse bleibt dauerhaft erreichbar, ältere Builds laufen also
nicht ins Leere.

Die Hauptdomain `werle.app` verlinkt die Seite über die Produktkarte
„Das Verhör" (Repo `OnePieceMonkey/werle-app`); die Fusszeile hier
verlinkt zurück.

## Assets

- Schriften: aus dem App-Repo (`Games/alibi/App/Resources/Fonts`), alle OFL.
- Tusche-Bilder: `scene_l0.webp` der Fälle, auf 840 px verkleinert.
- Screenshots: Simulator (iPhone), Statusbar 9:41. Neue Screenshots nach
  `assets/screens/` legen, Dateinamen in `index.html` beibehalten.
