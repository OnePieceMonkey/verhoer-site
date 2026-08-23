# verhoer.werle.app — Spezifikation

Stand: 2026-08-23. Freigegeben von Patrick (Chat, gleicher Tag).

## Zweck

Promo- und Pflichtseiten-Website für „Das Verhör" (iOS, Bundle `de.patrickwerle.alibi`).
Ersetzt die schlichte `store/site/`-Fassung aus dem App-Repo als öffentliche Präsenz.
Hosting: Vercel, Repo `OnePieceMonkey/verhoer-site`. Domain `verhoer.werle.app`
wird **erst nach App-Launch** verbunden (Cloudflare-CNAME dann auf Vercel umstellen —
aktuell zeigt der DNS-Plan noch auf GitHub Pages, siehe `Games/alibi/DOMAIN-SETUP.md`).

## Entscheidungen (mit Patrick geklärt)

- Subdomain: `verhoer.werle.app` (nicht `das-verhoer`).
- Preise: 4,99 €/Monat, 19,99 €/Jahr — als **eine** Variable im Code, leicht tauschbar.
  Die $-Preise im Simulator sind nur die US-Sandbox, kein Handlungsbedarf.
- Bilder: echte App-Screenshots (Simulator) + Tusche-Art aus den App-Ressourcen.
  Generierung neuer Assets falls nötig über Magnific MCP (nicht Mobbin — Mobbin ist nur Referenz-Recherche).
- Impressum: Inhalt aus `werle-app/app/impressum/page.tsx` (echte Anschrift, USt-ID DE463711023).
- Kontakt: verhoer@werle.app (Routing läuft bereits).

## Seiten

| Datei | Inhalt |
|---|---|
| `index.html` | Lange Scroll-Promo-Seite (Abschnitte unten) |
| `privacy.html` | Datenschutzerklärung — Inhalt aus `Games/alibi/store/site/privacy.html`, neu gestaltet |
| `impressum.html` | Anbieterkennzeichnung § 5 DDG — Inhalt aus werle-app |

## index.html — Abschnitte

1. **Hero:** Wortmarke „DAS VERHÖR" (Redaction), Aufbau-Animation wie der App-Start
   (Karten, Nadeln, roter Faden spannt sich). Claim: „Ein Fall pro Tag. Drei Verdächtige.
   Vierzehn Fragen." App-Store-Badge (Platzhalter-Link `#`). Wandernder Lichtstreifen, Papierkorn.
2. **Roter Faden:** SVG-Pfad, zeichnet sich beim Scrollen durch die ganze Seite (Scroll-Progress).
3. **So spielt es sich:** Sticky iPhone-Frame, Screenshots wechseln beim Scrollen:
   Briefing → Verhör → Tafel → Anklage. Begleittext blendet seitlich ein.
4. **Die Fälle:** Galerie der Tusche-Szenen (scene_l0.webp diverser Fälle). Hover: Karte hebt
   sich, Lichtstreifen. Keine Spoiler (keine reveal-Bilder, keine Täternennung).
5. **Was drin steckt:** 4 Akten-Karten im Themenreiter-Look, Stempel-Einblendung:
   täglich ein Fall / alles auf dem Gerät / Archiv, Serie, Statistik / Game Center.
6. **Countdown:** live bis 07:00 Europe/Berlin (05:00 UTC) — „Nächster Fall in HH:MM:SS".
7. **Preis:** „Der Fall des Tages ist immer gratis." + Detective Pass (Monat/Jahr, Stempel
   „Gründer-Preis", ehrlicher Anker „entspricht 1,67 €/Monat"). UX-Gate: ehrlich ankern, kein Fake.
8. **Datenschutz-Satz:** „Deine Verhöre verlassen dein iPhone nie." → Link privacy.html.
9. **Footer:** Kontakt, Datenschutz, Impressum, © 2026 Werle Technologies.

## Design

- Token 1:1 aus `DesignTokens.swift`: paper/sunk/edge/ink/inkMuted/inkFaint, thread
  (#8C1F14 hell / #B03A2C dunkel), Riso-Akzente. Hell + Dunkel via `prefers-color-scheme`.
- Schriften aus dem App-Repo (alle OFL): Redaction (Display, Grade 20/35/70 als Effekt),
  Literata (Fließtext), IBM Plex Mono (Daten/Eyebrows). Self-hosted, `font-display: swap`.
- Kanten fast eckig (2px), 4px-Raster, Seitenrand 20px. Papierkorn als CSS/SVG-Overlay.
- Der Fallakzent gehört den Widersprüchen — auf der Website trägt **kein** Button einen
  Riso-Akzent; Interaktion läuft über ink/thread. (Regel §3.1 der App gilt sinngemäß.)

## Technik

- Statisch: HTML + CSS + Vanilla JS + GSAP/ScrollTrigger (vendored in `js/vendor/`).
- `prefers-reduced-motion` wird respektiert (Animationen aus, Inhalte sofort sichtbar).
- Keine Cookies, kein Tracking, keine externen Requests (Fonts/JS self-hosted) —
  das hält die Datenschutzerklärung trivial wahr.
- Preis-Variablen an einer Stelle in `js/site.js` (`PRICE_MONTHLY`, `PRICE_YEARLY`).
- Responsive: mobile-first, iPhone-Sektion degradiert auf Stapel ohne Sticky.
- OG-Meta + Favicon (App-Icon-Motiv).

## Nicht in diesem Schritt

- Domain-Verbindung (erst nach Launch, Patrick entscheidet den Zeitpunkt).
- Presskit, EN-Fassung, App-Store-Live-Link (kommen nach Release).
