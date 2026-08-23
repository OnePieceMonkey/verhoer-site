/* Das Verhör — Seitenlogik.
   Preise: EINE Stelle, hier. HTML-Fallback in index.html passend halten. */

const PRICE = {
  monthly: "4,99 €",
  yearly: "19,99 €",
  yearlyPerMonth: "1,67 €",
};

(function () {
  "use strict";

  document.documentElement.classList.add("js");

  // Preise eintragen
  const pm = document.getElementById("price-monthly");
  const py = document.getElementById("price-yearly");
  const pa = document.getElementById("price-anchor");
  if (pm) pm.innerHTML = PRICE.monthly.replace(" ", "&nbsp;");
  if (py) py.innerHTML = PRICE.yearly.replace(" ", "&nbsp;");
  if (pa) pa.innerHTML = "Jährlich entspricht " + PRICE.yearlyPerMonth.replace(" ", "&nbsp;") + " im Monat.";

  // Countdown: nächste Akte um 05:00 UTC
  const cd = document.getElementById("countdown");
  if (cd) {
    const pad = (n) => String(n).padStart(2, "0");
    const tick = () => {
      const now = new Date();
      const next = new Date(Date.UTC(
        now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 5, 0, 0));
      if (next <= now) next.setUTCDate(next.getUTCDate() + 1);
      let s = Math.floor((next - now) / 1000);
      const h = Math.floor(s / 3600); s -= h * 3600;
      const m = Math.floor(s / 60); s -= m * 60;
      cd.textContent = pad(h) + ":" + pad(m) + ":" + pad(s);
    };
    tick();
    setInterval(tick, 1000);
  }

  // Kaputte Screenshot-Bilder still ausblenden
  document.querySelectorAll(".phone-screen img").forEach((img) => {
    img.addEventListener("error", () => { img.style.display = "none"; });
  });

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";

  // Kopfzeile: beim Runterscrollen weg, beim Hochscrollen da
  const top = document.getElementById("top");
  let lastY = 0;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    if (top) top.classList.toggle("hidden", y > 400 && y > lastY);
    lastY = y;
  }, { passive: true });

  // Wortmarke in Buchstaben zerlegen (für die Auflösung 70 → 35 → klar)
  const wm = document.getElementById("wordmark");
  let letters = [];
  if (wm) {
    const words = wm.textContent.split(/[\s ]+/);
    wm.textContent = "";
    words.forEach((word, wi) => {
      if (wi > 0) wm.appendChild(document.createTextNode(" "));
      const wordEl = document.createElement("span");
      wordEl.className = "word";
      for (const ch of word) {
        const s = document.createElement("span");
        s.className = "w";
        s.textContent = ch;
        wordEl.appendChild(s);
        letters.push(s);
      }
      wm.appendChild(wordEl);
    });
  }

  if (reduced || !hasGsap) {
    document.documentElement.classList.add("no-motion");
    document.querySelectorAll(".rv").forEach((el) => el.classList.add("in"));
    drawHeroThread(1);
    buildPageThread(true);
    initPhone(true);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Held: Auftritt wie der App-Start ---------- */
  const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

  // Buchstaben: erst zerdruckt (Grad 70), dann 35, dann klar
  letters.forEach((s) => s.classList.add("g70"));
  heroTl.from(letters, {
    opacity: 0, y: 24, duration: 0.5, stagger: 0.035,
  });
  heroTl.add(() => {
    letters.forEach((s, i) => {
      gsap.delayedCall(i * 0.03, () => { s.classList.remove("g70"); s.classList.add("g35"); });
      gsap.delayedCall(0.28 + i * 0.03, () => { s.classList.remove("g35"); });
    });
  }, "-=0.1");

  heroTl.from(".hero .eyebrow", { opacity: 0, y: -14, duration: 0.5 }, 0);
  heroTl.from(".hero .claim", { opacity: 0, y: 18, duration: 0.6 }, "-=0.2");
  heroTl.from(".hero-cta .btn", { opacity: 0, y: 18, duration: 0.5, stagger: 0.12 }, "-=0.3");
  heroTl.from(".hero-note", { opacity: 0, duration: 0.6 }, "-=0.2");

  // Zwei Karten fallen ein, Nadeln setzen sich, der Faden spannt sich
  heroTl.from("#pcard-l", { y: -60, opacity: 0, rotation: -10, duration: 0.65, ease: "power2.out" }, "-=0.5");
  heroTl.from("#pcard-r", { y: -60, opacity: 0, rotation: 9, duration: 0.65, ease: "power2.out" }, "-=0.45");
  heroTl.from("#hero-pin-l", { scale: 0, duration: 0.3, ease: "back.out(3)" }, "-=0.25");
  heroTl.from("#hero-pin-r", { scale: 0, duration: 0.3, ease: "back.out(3)" }, "-=0.15");
  heroTl.add(() => drawHeroThread(0));
  heroTl.to({ p: 0 }, {
    p: 1, duration: 0.7, ease: "power2.inOut",
    onUpdate: function () { drawHeroThread(this.targets()[0].p); },
  });
  heroTl.from(".scroll-hint", { opacity: 0, duration: 0.8 }, "-=0.2");

  // Karten-Parallaxe zur Maus — sehr leicht
  const heroCards = document.getElementById("hero-cards");
  if (heroCards && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("mousemove", (e) => {
      const dx = (e.clientX / window.innerWidth - 0.5);
      const dy = (e.clientY / window.innerHeight - 0.5);
      gsap.to("#pcard-l", { x: dx * 12, y: dy * 8, duration: 0.8, overwrite: "auto" });
      gsap.to("#pcard-r", { x: dx * -14, y: dy * -9, duration: 0.8, overwrite: "auto" });
      gsap.delayedCall(0.05, () => drawHeroThread(1));
    }, { passive: true });
  }

  /* ---------- Einblendungen ---------- */
  document.querySelectorAll(".rv").forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 86%", once: true },
      onComplete: () => el.classList.add("in"),
    });
  });

  // Aktenreiter-Karten: Stempel-Moment (kommt groß an, setzt sich)
  gsap.utils.toArray(".tab-card").forEach((card, i) => {
    gsap.from(card, {
      scale: 1.06, duration: 0.5, ease: "power4.out", delay: (i % 2) * 0.08,
      scrollTrigger: { trigger: card, start: "top 88%", once: true },
    });
  });

  // Gründer-Preis-Stempel schlägt auf
  const stamp = document.querySelector(".stamp");
  if (stamp) {
    gsap.from(stamp, {
      scale: 2.2, opacity: 0, rotation: -6, duration: 0.45, ease: "power4.in",
      scrollTrigger: { trigger: stamp, start: "top 85%", once: true },
      clearProps: "scale,rotation",
    });
  }

  // Galerie: Karten treten nacheinander auf
  gsap.from(".case-card", {
    opacity: 0, y: 44, duration: 0.7, ease: "power3.out", stagger: 0.09,
    scrollTrigger: { trigger: "#gallery", start: "top 82%", once: true },
  });

  /* ---------- Klebendes iPhone ---------- */
  initPhone(false);

  /* ---------- Roter Faden über die Seite ---------- */
  window.addEventListener("load", () => {
    buildPageThread(false);
    ScrollTrigger.refresh();
  });
  let rsz;
  window.addEventListener("resize", () => {
    clearTimeout(rsz);
    rsz = setTimeout(() => buildPageThread(false), 250);
  });

  /* ================= Hilfen ================= */

  function drawHeroThread(progress) {
    const svg = document.getElementById("hero-thread");
    const path = document.getElementById("hero-thread-path");
    const a = document.getElementById("hero-pin-l");
    const b = document.getElementById("hero-pin-r");
    if (!svg || !path || !a || !b) return;
    const box = svg.getBoundingClientRect();
    const ra = a.getBoundingClientRect();
    const rb = b.getBoundingClientRect();
    const x1 = ra.left + ra.width / 2 - box.left;
    const y1 = ra.top + ra.height / 2 - box.top;
    const x2 = rb.left + rb.width / 2 - box.left;
    const y2 = rb.top + rb.height / 2 - box.top;
    const sag = 34; // der Faden hängt leicht durch
    path.setAttribute("d",
      "M " + x1 + " " + y1 +
      " Q " + (x1 + x2) / 2 + " " + (Math.max(y1, y2) + sag) + " " + x2 + " " + y2);
    const len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len * (1 - progress);
  }

  function buildPageThread(staticDraw) {
    const layer = document.getElementById("thread-layer");
    const path = document.getElementById("thread-path");
    const page = document.getElementById("page");
    if (!layer || !path || !page) return;

    const pageRect = page.getBoundingClientRect();
    const pageTop = pageRect.top + window.scrollY;
    const w = page.offsetWidth;
    const h = page.offsetHeight;
    layer.setAttribute("width", w);
    layer.setAttribute("height", h);
    layer.setAttribute("viewBox", "0 0 " + w + " " + h);

    // Ankerpunkte: die Vorzeilen der Abschnitte, abwechselnd versetzt
    const anchors = [];
    const start = document.getElementById("hero-cards");
    if (start) {
      const r = start.getBoundingClientRect();
      anchors.push({ x: r.left + r.width / 2, y: r.top + window.scrollY - pageTop + r.height * 0.55 });
    }
    ["#spiel", "#faelle", "#drin", "#countdown-sec", "#preis", "#privatsphaere"].forEach((sel, i) => {
      const s = document.querySelector(sel + " .eyebrow");
      if (!s) return;
      const r = s.getBoundingClientRect();
      const off = (i % 2 === 0) ? -40 : 40;
      anchors.push({
        x: Math.min(Math.max(r.left + off, 30), w - 30),
        y: r.top + window.scrollY - pageTop + 6,
      });
    });
    if (anchors.length < 2) return;

    // Weicher Pfad durch die Anker
    let d = "M " + anchors[0].x + " " + anchors[0].y;
    for (let i = 1; i < anchors.length; i++) {
      const p = anchors[i - 1];
      const c = anchors[i];
      const my = (p.y + c.y) / 2;
      d += " C " + p.x + " " + my + ", " + c.x + " " + my + ", " + c.x + " " + c.y;
    }
    path.setAttribute("d", d);

    // Nadeln an den Ankern
    layer.querySelectorAll("circle").forEach((n) => n.remove());
    anchors.forEach((p) => {
      const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      dot.setAttribute("cx", p.x); dot.setAttribute("cy", p.y); dot.setAttribute("r", 4.5);
      dot.setAttribute("fill", "currentColor");
      dot.style.color = "var(--pin)";
      layer.appendChild(dot);
    });

    const len = path.getTotalLength();
    path.style.strokeDasharray = len;
    if (staticDraw) {
      path.style.strokeDashoffset = 0;
      return;
    }
    path.style.strokeDashoffset = len;
    if (path._st) path._st.kill();
    path._st = ScrollTrigger.create({
      trigger: page,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
      onUpdate: (self) => {
        path.style.strokeDashoffset = len * (1 - self.progress);
      },
    });
  }

  function initPhone(staticMode) {
    const screens = document.querySelectorAll("#phone-screen img");
    if (!screens.length) return;
    const setActive = (idx) => {
      screens.forEach((img, i) => img.classList.toggle("active", i === idx));
    };
    if (staticMode || !hasGsap) { setActive(0); return; }
    document.querySelectorAll("#steps .step").forEach((step) => {
      const idx = parseInt(step.dataset.screen, 10) || 0;
      ScrollTrigger.create({
        trigger: step,
        start: "top 55%",
        end: "bottom 55%",
        onEnter: () => setActive(idx),
        onEnterBack: () => setActive(idx),
      });
    });
  }
})();
