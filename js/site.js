/* Das Verhör — Seitenlogik (Startseite).
   Preise: EINE Stelle, hier. HTML-Fallback in index.html passend halten.
   Bewegung: anime.js 4.5 (js/vendor/anime.umd.min.js). Ohne Skript oder mit
   "Bewegung reduzieren" steht die Seite vollständig im Ruhezustand. */

const PRICE = {
  monthly: "4,99 €",
  yearly: "19,99 €",
  yearlyPerMonth: "1,67 €",
};

(function () {
  "use strict";

  const A = window.anime;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const motion = !!A && !reduced;
  // One broken effect must never take the rest of the page down with it.
  const safe = (name, fn) => { try { fn(); } catch (e) { console.error("[" + name + "]", e); } };
  const nb = (s) => s.replace(" ", "&nbsp;");

  // Preise eintragen
  const pm = $("#price-monthly"), py = $("#price-yearly"), pa = $("#price-anchor");
  if (pm) pm.innerHTML = nb(PRICE.monthly);
  if (py) py.innerHTML = nb(PRICE.yearly);
  if (pa) pa.innerHTML = "Jährlich entspricht " + nb(PRICE.yearlyPerMonth) + " im Monat.";

  // Fragenbudget: 14 Segmente. Ruhezustand = Ende der Szene (11 übrig).
  const segs = $("#segs");
  for (let i = 0; i < 14; i++) segs.appendChild(document.createElement("i"));
  const segEls = $$("i", segs);
  const setBudget = (used) => {
    segEls.forEach((el, n) => { el.style.opacity = n >= 14 - used ? ".2" : "1"; });
    $("#count").textContent = (14 - used) + " Fragen übrig";
  };
  const setMood = (hot) => {
    const m = $("#mood");
    m.classList.toggle("hot", hot);
    $("b", m).textContent = hot ? "angespannt" : "gefasst";
  };
  setBudget(3); setMood(true);

  // Faden im Protokoll: von der Aussage zum Fakt an der Tafel
  const layoutVThread = () => {
    const box = $("#proto").getBoundingClientRect();
    const rects = $("#m1").getClientRects();
    const a = rects[rects.length - 1], b = $("#fact").getBoundingClientRect();
    const x1 = a.right - box.left + 6, y1 = a.top - box.top + a.height / 2;
    // Short drop from the end of the statement onto the top edge of the fact card.
    const fl = b.left - box.left, fr = b.right - box.left;
    const x2 = Math.max(fl + 18, fr - 24), y2 = b.top - box.top;
    $("#vthread").setAttribute("d", `M${x1} ${y1} C${x1 + 34} ${y1} ${x2} ${y2 - 30} ${x2} ${y2}`);
    $("#vp1").setAttribute("cx", x1); $("#vp1").setAttribute("cy", y1);
    $("#vp2").setAttribute("cx", x2); $("#vp2").setAttribute("cy", y2);
  };

  // Tafel: Fäden zwischen den Pins
  const board = $("#board"), bsvg = $("svg", board);
  const links = [["c-reiter", "c-a1"], ["c-a1", "c-fact"], ["c-a1", "c-a3"]];
  const paths = links.map(() => {
    const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("pathLength", "1");
    bsvg.appendChild(p);
    return p;
  });
  const pin = (id) => {
    const r = $("#" + id + " .in").getBoundingClientRect(), b = board.getBoundingClientRect();
    return [r.left - b.left + r.width / 2, r.top - b.top + 11];
  };
  const layoutThreads = () => {
    links.forEach((l, n) => {
      const a = pin(l[0]), b = pin(l[1]);
      const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 + 14 + d * 0.07;
      paths[n].setAttribute("d", `M${a[0]} ${a[1]} Q${mx} ${my} ${b[0]} ${b[1]}`);
    });
  };

  // Anklage
  let solved = false;
  $$(".sus").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (solved || btn.disabled) return;
      const ok = btn.dataset.ok === "1", stamp = $(".stamp", btn);
      if (ok) {
        solved = true;
        $$(".sus").forEach((o) => { o.disabled = true; if (o !== btn) o.classList.add("out"); });
        $("#result").innerHTML = "<strong>Reiter ist überführt.</strong> Seine Jacke war nass, bevor der Regen kam. Im Spiel reicht das noch nicht: Für die Anklage brauchst du den entscheidenden Widerspruch, und den findest du nur mit deinen vierzehn Fragen.";
        if (motion) {
          A.animate(stamp, { opacity: [0, 1], scale: [2.6, 1], duration: 520, ease: "outBack(2.2)" });
          A.animate($(".ph", btn), { scale: [1, 0.97, 1], duration: 420, delay: 160, ease: "out(3)" });
        } else { stamp.style.opacity = 1; }
      } else {
        btn.disabled = true; btn.classList.add("out");
        $("#result").innerHTML = "<strong>" + $(".name", btn).textContent + " kannst du so nicht anklagen.</strong> Auf der Tafel zeigt kein Faden auf sie. Schau noch einmal hin.";
        if (motion) {
          A.animate(stamp, { opacity: [0, 1], scale: [1.5, 1], duration: 320, ease: "out(4)" });
          A.animate(btn, { x: [0, -9, 8, -5, 4, 0], duration: 420, ease: "linear" });
        } else { stamp.style.opacity = 1; }
      }
    });
  });

  // Die App gibt jeden Fall um 05:00 UTC frei (publish_at in den Falldateien).
  // In Deutschland ist das 6 Uhr im Winter und 7 Uhr im Sommer, deshalb wird
  // die genannte Uhrzeit berechnet. HTML-Fallback in index.html: "6 Uhr".
  safe("uhrzeit", () => {
    const now = new Date();
    const release = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 5, 0, 0));
    const hour = Number(new Intl.DateTimeFormat("de-DE", { hour: "numeric", hour12: false, timeZone: "Europe/Berlin" }).format(release).replace(/\D/g, ""));
    if (hour >= 0 && hour < 24) $$(".rel-time").forEach((el) => { el.innerHTML = hour + "&nbsp;Uhr"; });
  });

  // Countdown: nächste Akte um 05:00 UTC
  const clock = $("#clock");
  let last = "";
  const pad = (n) => String(n).padStart(2, "0");
  const tick = () => {
    const now = new Date();
    const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 5, 0, 0));
    if (next <= now) next.setUTCDate(next.getUTCDate() + 1);
    const s = Math.floor((next - now) / 1000);
    const str = pad(Math.floor(s / 3600)) + ":" + pad(Math.floor(s / 60) % 60) + ":" + pad(s % 60);
    if (!last) {
      clock.innerHTML = str.split("").map((c) => "<span" + (c === ":" ? ' class="sep"' : "") + ">" + c + "</span>").join("");
    } else {
      const spans = clock.children;
      for (let n = 0; n < str.length; n++) {
        if (str[n] === last[n]) continue;
        spans[n].textContent = str[n];
        if (motion) A.animate(spans[n], { y: ["-.35em", 0], opacity: [0, 1], duration: 380, ease: "out(4)" });
      }
    }
    last = str;
  };
  tick(); setInterval(tick, 1000);

  const relayout = () => { layoutVThread(); layoutThreads(); };
  relayout();
  window.addEventListener("load", relayout);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);

  if (!A) return;

  // Karten ziehen (auch ohne Bewegungseffekte)
  let z = 5;
  safe("drag", () => {
    $$(".pc").forEach((card) => {
      A.createDraggable(card, {
        container: board, containerPadding: 6,
        releaseEase: A.spring({ stiffness: 130, damping: 13 }),
        onGrab: () => { card.style.zIndex = ++z; if (motion) A.animate($(".in", card), { scale: 1.05, duration: 180, ease: "out(3)" }); },
        onRelease: () => { if (motion) A.animate($(".in", card), { scale: 1, duration: 420, ease: "outBack(3)" }); },
        onUpdate: layoutThreads, onSettle: layoutThreads,
      });
    });
  });

  let railAnim = null, resizeT;
  window.addEventListener("resize", () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => { relayout(); if (railAnim && railAnim.refresh) railAnim.refresh(); }, 120);
  });

  if (!motion) return;
  document.documentElement.classList.add("motion");
  layoutVThread();

  // Roter Faden am Rand folgt dem Scrollen
  safe("faden", () => {
    A.animate(".faden", { scaleY: [0, 1], ease: "linear", autoplay: A.onScroll({ target: "main", enter: "top top", leave: "bottom bottom", sync: true }) });
  });

  // Held: Schrift schärft sich (70 → 35 → klar), Schwärzungen fallen, Lampe folgt dem Zeiger
  safe("hero", () => {
    const wm = $("#wordmark");
    wm.innerHTML = wm.textContent.split("").map((c) => (c === " " ? " " : '<span class="ch" data-g="70" aria-hidden="true">' + c + "</span>")).join("");
    const chars = $$(".ch", wm);
    A.animate(chars, { opacity: [0, 1], y: [".18em", 0], duration: 700, delay: A.stagger(55, { start: 150 }), ease: "out(4)" });
    chars.forEach((c, n) => {
      setTimeout(() => { c.dataset.g = "35"; }, 650 + n * 75);
      setTimeout(() => { c.dataset.g = "0"; }, 1050 + n * 75);
    });
    const bars = $$("#tag span").map((s) => { const b = document.createElement("i"); s.appendChild(b); return b; });
    A.utils.set(bars, { scaleX: 1 });
    A.animate(bars, { scaleX: [1, 0], duration: 620, delay: A.stagger(260, { start: 1500 }), ease: "inOut(3)" });
    A.animate(".hero-cta", { opacity: [0, 1], y: [14, 0], duration: 700, delay: 2500, ease: "out(3)" });
    safe("scramble", () => { A.animate("#eyebrow", { innerHTML: A.scrambleText({ chars: "blocks" }), delay: 250 }); });

    const hero = $("#hero"), veil = $(".hero-veil");
    const lamp = A.createAnimatable(veil, { x: 900, y: 900, ease: "out(3)" });
    const rest = () => { const r = hero.getBoundingClientRect(); return [r.width * 0.2, r.height * -0.18]; };
    veil.style.transform = "none";
    const r0 = rest();
    A.utils.set(veil, { x: r0[0], y: r0[1] });
    hero.addEventListener("pointermove", (e) => {
      if (e.pointerType === "touch") return;
      const r = hero.getBoundingClientRect();
      lamp.x(e.clientX - r.left - r.width / 2);
      lamp.y(e.clientY - r.top - r.height / 2);
    });
    hero.addEventListener("pointerleave", () => { const p = rest(); lamp.x(p[0]); lamp.y(p[1]); });
  });

  // Verhör: die Zeitachse hängt am Scrollen
  safe("verhoer", () => {
    const qa = $$("#proto .qa"), fact = $("#fact"), verdict = $("#verdict");
    const mark = $("#m1"), pins = [$("#vp1"), $("#vp2")], thread = $("#vthread");
    A.utils.set(qa, { opacity: 0, y: 26 });
    A.utils.set([fact, verdict], { opacity: 0, y: 18 });
    A.utils.set(mark, { backgroundSize: "0% 2px" });
    A.utils.set(pins, { opacity: 0 });
    A.utils.set(thread, { strokeDashoffset: 1 });
    setBudget(0); setMood(false);
    const tl = A.createTimeline({
      defaults: { ease: "out(3)", duration: 600 },
      autoplay: A.onScroll({ target: "#verhoer", enter: "top top", leave: "bottom bottom", sync: 0.35 }),
      onUpdate: (self) => {
        const t = self.currentTime;
        setBudget((t > 350 ? 1 : 0) + (t > 1450 ? 1 : 0) + (t > 5050 ? 1 : 0));
        setMood(t > 5300);
      },
    });
    tl.add(qa[0], { opacity: 1, y: 0 }, 200)
      .add(qa[1], { opacity: 1, y: 0 }, 1300)
      .add(fact, { opacity: 1, y: 0 }, 2500)
      .add(mark, { backgroundSize: "100% 2px", duration: 500 }, 3100)
      .add(pins, { opacity: 1, duration: 200 }, 3300)
      .add(thread, { strokeDashoffset: 0, duration: 900, ease: "inOut(2)" }, 3400)
      .add(verdict, { opacity: 1, y: 0, scale: [1.5, 1], duration: 400 }, 4200)
      .add(qa[2], { opacity: 1, y: 0 }, 4900)
      .add({}, { duration: 600 }, 5800);
  });

  // Tafel: Karten fallen an ihren Platz, dann spannen sich die Fäden
  safe("tafel", () => {
    const ins = $$(".pc .in");
    A.utils.set(paths, { strokeDashoffset: 1 });
    A.utils.set(ins, { opacity: 0 });
    let played = false;
    A.onScroll({
      target: board, enter: "bottom-=22% top",
      onEnter: () => {
        if (played) return;
        played = true;
        A.animate(ins, { opacity: [0, 1], scale: [1.25, 1], y: [-26, 0], duration: 620, delay: A.stagger(90), ease: "outBack(1.6)", onUpdate: layoutThreads });
        A.animate(paths, { strokeDashoffset: [1, 0], duration: 800, delay: A.stagger(280, { start: 900 }), ease: "inOut(2)" });
      },
    });
  });

  // Fälle: Scrollen schiebt den Filmstreifen
  safe("faelle", () => {
    const track = $("#track");
    railAnim = A.animate(track, {
      x: () => -(track.scrollWidth - document.documentElement.clientWidth),
      ease: "linear",
      autoplay: A.onScroll({ target: "#faelle", enter: "top top", leave: "bottom bottom", sync: 0.3 }),
    });
  });
})();
