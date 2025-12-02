document.addEventListener("DOMContentLoaded", () => {
  // Grab elements after DOM is ready
  const slides = Array.from(document.querySelectorAll(".slide"));
  const copySlides = Array.from(document.querySelectorAll(".copy-slide"));
  const copyWrap = document.getElementById("copySlides");
  const dotsWrap = document.getElementById("dots");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  // Guard: need matching counts
  if (!slides.length || slides.length !== copySlides.length) return;

  let current = 0;
  let timer = null;

  // Build dots once
  dotsWrap.innerHTML = "";
  slides.forEach((_, i) => {
    const d = document.createElement("button");
    d.className =
      "h-3 w-3 rounded-full bg-slate-300/80 transition-all duration-300";

    d.setAttribute("aria-label", "Aller à la diapositive " + (i + 1));
    d.addEventListener("click", () => goTo(i, true));
    dotsWrap.appendChild(d);
  });

  // Lock copy area height to tallest slide (avoid layout shift/CLS)
  function lockCopyHeight() {
    if (!copyWrap) return;
    let maxH = 0;
    copySlides.forEach((el) => {
      const prevPos = el.style.position;
      const prevOp = el.style.opacity;
      const prevVis = el.style.visibility;

      el.style.position = "static";
      el.style.opacity = "1";
      el.style.visibility = "hidden";

      maxH = Math.max(maxH, el.offsetHeight);

      el.style.position = prevPos || "absolute";
      el.style.opacity = prevOp || "0";
      el.style.visibility = prevVis || "visible";
    });
    copyWrap.style.height = maxH + "px";
  }

  function render() {
    // images
    slides.forEach((el, i) => {
      el.style.opacity = i === current ? "1" : "0";
    });
    // copy
    copySlides.forEach((el, i) => {
      el.style.opacity = i === current ? "1" : "0";
      el.style.pointerEvents = i === current ? "auto" : "none";
    });
    // dots
    Array.from(dotsWrap.children).forEach((d, i) => {
      d.className =
        i === current
          ? "h-3 w-10 rounded-full bg-gradient-to-r from-[#C6B2FF] to-[#B0E0FF] transition-all duration-300"
          : "h-3 w-3 rounded-full bg-slate-300/80 transition-all duration-300";
    });
  }

  function goTo(index, userAction = false) {
    current = (index + slides.length) % slides.length;
    render();
    if (userAction) restartAutoplay();
  }

  function next() {
    goTo(current + 1);
  }
  function prev() {
    goTo(current - 1);
  }

  function startAutoplay() {
    timer = setInterval(next, 8000);
  }
  function stopAutoplay() {
    if (timer) clearInterval(timer);
  }
  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  // Controls
  if (prevBtn)
    prevBtn.addEventListener("click", () => {
      prev();
      restartAutoplay();
    });
  if (nextBtn)
    nextBtn.addEventListener("click", () => {
      next();
      restartAutoplay();
    });
  window.addEventListener("resize", lockCopyHeight, { passive: true });

  // Init
  lockCopyHeight();
  goTo(0);
  startAutoplay();
});

document.addEventListener("DOMContentLoaded", () => {
  const mobToggle = document.getElementById("mobToggle");
  const mobMenu = document.getElementById("mobMenu");

  if (!mobToggle || !mobMenu) return;

  // Open/close mobile menu
  mobToggle.addEventListener("click", () => {
    const willOpen = mobMenu.classList.contains("hidden");

    mobMenu.classList.toggle("hidden", !willOpen);
    mobToggle.setAttribute("aria-expanded", String(willOpen));

    // NEW → animate fries ↔ X
    mobToggle.classList.toggle("is-open", willOpen);
  });

  // Close menu after clicking any link inside it
  mobMenu.querySelectorAll("a[href]").forEach((a) => {
    a.addEventListener("click", () => {
      mobMenu.classList.add("hidden");
      mobToggle.setAttribute("aria-expanded", "false");
      mobToggle.classList.remove("is-open");
    });
  });
});

//   <!-- Section 1 -->

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card-wow");

  cards.forEach((card) => {
    const damp = 18;
    const resetMs = 250;

    const setVars = (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const cx = r.width / 2;
      const cy = r.height / 2;
      const rx = ((y - cy) / cy) * -damp;
      const ry = ((x - cx) / cx) * damp;

      card.style.setProperty("--mx", (x / r.width) * 100 + "%");
      card.style.setProperty("--my", (y / r.height) * 100 + "%");

      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
    };

    const reset = () => {
      card.style.transition = `transform ${resetMs}ms ease`;
      card.style.transform =
        "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";
      setTimeout(() => {
        card.style.transition = "";
      }, resetMs);
    };

    card.addEventListener("mousemove", setVars);
    card.addEventListener("mouseenter", setVars);
    card.addEventListener("mouseleave", reset);
  });
});

//   <!-- section 2  -->

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".svc-card");

  // Reveal on scroll
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("svc-in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // Per-card interactions
  cards.forEach((card) => {
    const spot = card.querySelector(".svc-spot");
    const damp = 14; // tilt strength
    const resetMs = 220; // tilt reset duration

    function move(e) {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left,
        y = e.clientY - r.top;
      const cx = r.width / 2,
        cy = r.height / 2;
      const rx = ((y - cy) / cy) * -damp;
      const ry = ((x - cx) / cx) * damp;

      // position halo + gradient edge center
      const px = (x / r.width) * 100 + "%";
      const py = (y / r.height) * 100 + "%";
      card.style.setProperty("--mx", px);
      card.style.setProperty("--my", py);

      if (spot) {
        spot.style.left = px;
        spot.style.top = py;
        spot.style.opacity = "1";
      }

      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.015)`;
    }

    function leave() {
      card.style.transition = `transform ${resetMs}ms ease`;
      card.style.transform =
        "perspective(900px) rotateX(0) rotateY(0) scale(1)";
      setTimeout(() => {
        card.style.transition = "";
      }, resetMs);
      if (spot) spot.style.opacity = "0";
    }

    function clickPop() {
      if (!spot) return;
      spot.classList.remove("svc-pop");
      void spot.offsetWidth; // reflow
      spot.classList.add("svc-pop");
    }

    card.addEventListener("mousemove", move);
    card.addEventListener("mouseenter", move);
    card.addEventListener("mouseleave", leave);
    card.addEventListener("click", clickPop);
  });
});

(function () {
  const el = document.getElementById("cursorDots");
  if (!el) return;

  // Smooth follow (lerp)
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let curX = targetX,
    curY = targetY;

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function onMove(e) {
    targetX = e.clientX;
    targetY = e.clientY;
    document.body.classList.remove("cursor-idle");
  }

  function onLeaveWindow() {
    document.body.classList.add("cursor-idle");
  }

  function onClick() {
    el.classList.remove("pop");
    void el.offsetWidth;
    el.classList.add("pop");
  }

  // Animation loop
  function tick() {
    // 0.18 is a nice smoothing; lower = slower follow
    curX = lerp(curX, targetX, 0.18);
    curY = lerp(curY, targetY, 0.18);
    el.style.left = curX + "px";
    el.style.top = curY + "px";
    requestAnimationFrame(tick);
  }

  // events
  window.addEventListener("mousemove", onMove, { passive: true });
  window.addEventListener("mousedown", onClick, { passive: true });
  window.addEventListener("mouseleave", onLeaveWindow, { passive: true });
  window.addEventListener("blur", onLeaveWindow);

  // start
  tick();
})();

//   <!-- section 3 -->

/* ===== Small helper: lerp ===== */
const lerp = (a, b, t) => a + (b - a) * t;

/* ===== 3D tilt on the glass card ===== */
(() => {
  const wrap = document.querySelector(".wc-wrap");
  if (!wrap) return;
  let rx = 0,
    ry = 0,
    tx = 0,
    ty = 0,
    raf;

  const onMove = (e) => {
    const rect = wrap.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width;
    const my = (e.clientY - rect.top) / rect.height;
    rx = (my - 0.5) * -6; // rotateX
    ry = (mx - 0.5) * 8; // rotateY
    cancelAnimationFrame(raf);
    const animate = () => {
      tx = lerp(tx, rx, 0.12);
      ty = lerp(ty, ry, 0.12);
      wrap.style.transform = `rotateX(${tx}deg) rotateY(${ty}deg)`;
      if (Math.abs(tx - rx) > 0.01 || Math.abs(ty - ry) > 0.01)
        raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
  };

  const reset = () => {
    rx = ry = 0;
  };
  wrap.addEventListener("mousemove", onMove, { passive: true });
  wrap.addEventListener("mouseleave", () => {
    reset();
    onMove({ clientX: 0, clientY: 0 });
  });
})();

/* ===== Metric counters on view ===== */
(() => {
  const els = document.querySelectorAll(".wc-metric__value");
  if (!els.length) return;

  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const animateCount = (el) => {
    const target = Number(el.dataset.count || 0);
    const suffix = el.dataset.suffix || "";
    const plus = el.dataset.plus || "";
    const dur = 1200;
    let start, raf;

    const tick = (ts) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / dur);
      const val = Math.round(ease(p) * target);
      el.textContent = (plus ? val + plus : val) + (suffix ? suffix : "");
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  els.forEach((el) => io.observe(el));
})();

/* ===== Hover light for metric cards (mouse coords) ===== */
(() => {
  document.querySelectorAll(".wc-metric").forEach((card) => {
    card.addEventListener(
      "pointermove",
      (e) => {
        const r = card.getBoundingClientRect();
        const mx = (((e.clientX - r.left) / r.width) * 100).toFixed(2) + "%";
        const my = (((e.clientY - r.top) / r.height) * 100).toFixed(2) + "%";
        card.style.setProperty("--mx", mx);
        card.style.setProperty("--my", my);
      },
      { passive: true }
    );
  });
})();

/* ===== Magnetic hover + confetti on primary button ===== */
(() => {
  const btn = document.querySelector("[data-confetti]");
  if (!btn) return;

  // magnetic hover
  btn.addEventListener("mousemove", (e) => {
    const r = btn.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    btn.style.transform = `translateZ(30px) translate(${dx * 0.08}px, ${dy * 0.08
      }px)`;
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "";
  });

  // confetti burst (tiny canvas particles)
  const confetti = (x, y, count = 36) => {
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d");
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const size = 220;
    c.width = c.height = size * dpr;
    c.style.position = "fixed";
    c.style.left = x - size / 2 + "px";
    c.style.top = y - size / 2 + "px";
    c.style.pointerEvents = "none";
    c.style.width = c.style.height = size + "px";
    c.style.zIndex = 10;
    document.body.appendChild(c);

    const colors = [
      "#1FA2A6",
      "#4bd0cf",
      "#F97D45",
      "#ffd2bf",
      "#b9fff9",
      "#ffffff",
    ];
    const parts = new Array(count).fill().map(() => ({
      x: c.width / 2,
      y: c.height / 2,
      vx: (Math.random() * 2 - 1) * 6 * dpr,
      vy: (Math.random() * 2 - 1) * 6 * dpr - 5 * dpr,
      g: 0.18 * dpr,
      s: Math.random() * 3 * dpr + 2 * dpr,
      a: 1,
      c: colors[(Math.random() * colors.length) | 0],
      r: Math.random() * Math.PI,
    }));
    let t = 0,
      raf;
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      parts.forEach((p) => {
        p.vy += p.g;
        p.x += p.vx;
        p.y += p.vy;
        p.r += 0.1;
        p.a -= 0.015;
        ctx.globalAlpha = Math.max(0, p.a);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s);
        ctx.restore();
      });
      t++;
      if (t < 120) raf = requestAnimationFrame(draw);
      else {
        cancelAnimationFrame(raf);
        c.remove();
      }
    };
    raf = requestAnimationFrame(draw);
  };

  btn.addEventListener("click", (e) => {
    const x = e.clientX,
      y = e.clientY;
    confetti(x, y);
  });
})();

// Révéler les éléments quand ils entrent dans le viewport
document.addEventListener('DOMContentLoaded', () => {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25 }
  );

  reveals.forEach(el => observer.observe(el));
});

//   <!-- footer -->


document.addEventListener('DOMContentLoaded', () => {
  /* ================================
     1) Apparition au scroll (footer)
     ================================ */
  const elems = document.querySelectorAll('.reveal-footer');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  elems.forEach(el => observer.observe(el));

  /* ================================
     2) Bouton "Haut de la page"
     ================================ */
  const backBtn = document.getElementById('backToTop');

  if (backBtn) {
    // Affiche / cache le bouton selon la position de scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backBtn.classList.add('opacity-100', 'backtotop-visible');
        backBtn.classList.remove('opacity-0', 'pointer-events-none');
      } else {
        backBtn.classList.remove('opacity-100', 'backtotop-visible');
        backBtn.classList.add('opacity-0', 'pointer-events-none');
      }
    });

    // Scroll smooth vers le haut au clic
    backBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});


document.addEventListener("DOMContentLoaded", function () {
  const mainCard = document.querySelector(".br3d-main-card");
  const tiltWrap = document.querySelector(".br3d-tilt-wrap");
  const cards = document.querySelectorAll(".br3d-card");

  /* ========= 1) 3D TILT ON MOUSE MOVE ========= */
  if (tiltWrap && mainCard) {
    const maxRotate = 10; // degrees

    tiltWrap.addEventListener("mousemove", (e) => {
      const rect = tiltWrap.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const midX = rect.width / 2;
      const midY = rect.height / 2;

      const rotateY = ((x - midX) / midX) * maxRotate;      // left/right
      const rotateX = ((midY - y) / midY) * maxRotate;      // up/down

      mainCard.style.transform =
        `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
    });

    tiltWrap.addEventListener("mouseleave", () => {
      mainCard.style.transform = "rotateX(0deg) rotateY(0deg) translateZ(0)";
    });
  }

  /* ========= 2) SCROLL REVEAL FOR CARDS ========= */
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("br3d-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.18,
      }
    );

    cards.forEach((card) => observer.observe(card));
  } else {
    // Fallback, just show all
    cards.forEach((card) => card.classList.add("br3d-visible"));
  }
});

(function () {
  const slider = document.querySelector('.crv-slider[data-slider="main"]');
  if (!slider) return;

  const slides = slider.querySelectorAll('.crv-slide');
  const dotsWrap = document.querySelector('.crv-dots[data-dots="main"]');
  if (!dotsWrap) return;
  const dots = dotsWrap.querySelectorAll('.crv-dot');

  let index = 0;

  function showSlide(i) {
    slides.forEach((slide, n) =>
      slide.classList.toggle('crv-slide-active', n === i)
    );
    dots.forEach((dot, n) =>
      dot.classList.toggle('crv-dot-active', n === i)
    );
    index = i;
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => showSlide(i));
  });

  function next() {
    const nextIndex = (index + 1) % slides.length;
    showSlide(nextIndex);
  }

  let timer = setInterval(next, 4500);

  // reset timer when user clicks a dot
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(timer);
      timer = setInterval(next, 4500);
    });
  });
})();

document.querySelectorAll('.acc-item-header').forEach(function (btn) {
  btn.addEventListener('click', function () {
    const item = btn.closest('.acc-item');
    const currentlyActive = item.classList.contains('acc-item-active');

    // close all
    document.querySelectorAll('.acc-item').forEach(function (el) {
      el.classList.remove('acc-item-active');
      const icon = el.querySelector('.acc-toggle-icon');
      if (icon) icon.textContent = '+';
    });

    // reopen clicked if it was not already open
    if (!currentlyActive) {
      item.classList.add('acc-item-active');
      const icon = item.querySelector('.acc-toggle-icon');
      if (icon) icon.textContent = '−';
    }
  });
});


//  <!-- Pack pricing -->

document.addEventListener('DOMContentLoaded', () => {
  /* 1) Reveal on scroll */
  const reveals = document.querySelectorAll('.pricing-reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  reveals.forEach(el => observer.observe(el));

  /* 2) Billing toggle (project / monthly) */
  const toggle = document.getElementById('billingToggle');
  const highlight = document.getElementById('billingHighlight');
  const options = toggle ? toggle.querySelectorAll('.billing-option') : [];
  const prices = document.querySelectorAll('.price');
  const labels = document.querySelectorAll('.price-label');

  let billingMode = 'project'; // 'project' or 'monthly'

  const updatePrices = () => {
    prices.forEach((priceEl) => {
      const project = priceEl.getAttribute('data-project');
      const monthly = priceEl.getAttribute('data-monthly');

      if (billingMode === 'project') {
        priceEl.textContent = formatNumber(project);
      } else {
        priceEl.textContent = formatNumber(monthly);
      }
    });

    labels.forEach((labelEl) => {
      labelEl.textContent = billingMode === 'project' ? '/ projet' : '/ mois';
    });
  };

  function formatNumber(value) {
    return new Intl.NumberFormat('fr-FR').format(value);
  }

  if (toggle && highlight && options.length === 2) {
    const [projectBtn, monthlyBtn] = options;

    const setMode = (mode) => {
      billingMode = mode;
      if (mode === 'project') {
        highlight.style.transform = 'translateX(0%)';
        projectBtn.classList.remove('opacity-70');
        projectBtn.classList.add('text-[#1A1740]');
        monthlyBtn.classList.add('opacity-70');
        monthlyBtn.classList.remove('text-[#1A1740]');
      } else {
        highlight.style.transform = 'translateX(100%)';
        monthlyBtn.classList.remove('opacity-70');
        monthlyBtn.classList.add('text-[#1A1740]');
        projectBtn.classList.add('opacity-70');
        projectBtn.classList.remove('text-[#1A1740]');
      }
      updatePrices();
    };

    projectBtn.addEventListener('click', () => setMode('project'));
    monthlyBtn.addEventListener('click', () => setMode('monthly'));

    // initial state
    setMode('project');
  } else {
    updatePrices();
  }
});



document.addEventListener("DOMContentLoaded", () => {
  // === Elements ===
  const langBtns = Array.from(document.querySelectorAll(".lang-btn"));
  const langLine = document.getElementById("lang-line");
  const previewImg = document.getElementById("lang-preview-img");

  // Text per language
  const langTexts = {
    fr: "🇫🇷 Votre site parle la langue de vos clients, automatiquement.",
    en: "🇬🇧 Your website speaks your customers’ language, automatically.",
    es: "🇪🇸 Tu sitio habla el idioma de tus clientes, automáticamente."
  };

  // Image per language
  const langImages = {
    fr: "assets/img/webDesign.png",
    en: "assets/img/ads.png",
    es: "assets/img/seo.png"
  };

  // Init: make sure FR is active on load
  if (previewImg) {
    previewImg.src = langImages.fr;
    previewImg.alt = "Preview Français";
  }
  if (langLine) {
    langLine.textContent = langTexts.fr;
  }

  // Handle clicks on buttons
  langBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;   // "fr" | "en" | "es"

      // 1) Update active button styling
      langBtns.forEach((b) => {
        if (b === btn) {
          b.classList.add("bg-white", "text-slate-900");
          b.classList.remove("text-slate-100/80");
        } else {
          b.classList.remove("bg-white", "text-slate-900");
          b.classList.add("text-slate-100/80");
        }
      });

      // 2) Update text with small fade
      if (langLine) {
        langLine.style.opacity = 0;
        setTimeout(() => {
          langLine.textContent = langTexts[lang] || langTexts.fr;
          langLine.style.opacity = 1;
        }, 150);
      }

      // 3) Update image
      if (previewImg) {
        const newSrc = langImages[lang] || langImages.fr;
        previewImg.style.opacity = 0;

        setTimeout(() => {
          previewImg.src = newSrc;
          previewImg.alt = "Preview " + (lang === "fr" ? "Français" : lang === "en" ? "English" : "Español");
          previewImg.style.opacity = 1;
        }, 150);
      }
    });
  });
});


// main.js
// document.addEventListener('DOMContentLoaded', () => {
//   /* ============================
//       1. MERGE DICTIONARIES
//   ============================ */
//   const I18N = {
//     en: window.I18N_EN || {},
//     fr: window.I18N_FR || {},
//   };

//   /* ============================
//       2. APPLY LANGUAGE
//   ============================ */
//   const applyLanguage = (lang) => {
//     const dict = I18N[lang] || I18N.en;

//     // HTML lang attribute
//     document.documentElement.setAttribute('lang', lang);

//     // Replace texts
//     document.querySelectorAll('[data-i18n]').forEach((node) => {
//       const key = node.getAttribute('data-i18n');
//       if (dict[key]) node.textContent = dict[key];
//     });

//     // Save choice
//     localStorage.setItem('lang', lang);

//     // Update UI highlight on flag buttons
//     setActiveFlag(lang);
//   };


//   /* ============================
//       3. INLINE FLAG SWITCHER
//   ============================ */
//   const flagBtns = document.querySelectorAll('#langSwitcher [data-lang]');

//   const setActiveFlag = (lang) => {
//     flagBtns.forEach((btn) => {
//       const isActive = btn.dataset.lang === lang;

//       btn.setAttribute('aria-pressed', isActive);

//       // clean then apply style for active
//       btn.classList.remove('ring-2', 'ring-offset-2', 'ring-indigo-500');
//       if (isActive) {
//         btn.classList.add('ring-2', 'ring-offset-2', 'ring-indigo-500');
//       }
//     });
//   };

//   // Click handlers
//   flagBtns.forEach((btn) => {
//     btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
//   });

//   /* ============================
//       4. INIT LANGUAGE
//   ============================ */
//   const saved = localStorage.getItem('lang');
//   const browserDefault =
//     (navigator.language || 'en').toLowerCase().startsWith('fr') ? 'fr' : 'en';

//   applyLanguage(saved || browserDefault);
// });



// Update year in footer
document.querySelectorAll("[data-year]").forEach(el => {
  el.textContent = new Date().getFullYear();
});

// Parallax effect on diagonal lines in the intro section
(function () {
  const hero = document.querySelector('#about-vision');
  if (!hero) return;

  const lines = hero.querySelectorAll('.home-intro-line');

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    lines.forEach((line, index) => {
      const strength = (index + 1) * 10; // intensity
      line.style.transform =
        `translate3d(${x * strength}px, ${y * strength}px, 0) rotate(${index === 0 ? 20 : -22}deg)`;
    });
  });
})();

// Section 2 of a propos page

document.addEventListener("DOMContentLoaded", () => {
  const section = document.getElementById("tpw-agence");
  const visual = section.querySelector(".tpw-visual");
  const counters = section.querySelectorAll("[data-counter]");
  let countersAnimated = false;

  /* ---- Scroll reveal + counter trigger ---- */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        section.classList.add("tpw-visible");
        if (!countersAnimated) {
          animateCounters();
          countersAnimated = true;
        }
      }
    });
  }, { threshold: 0.25 });

  observer.observe(section);

  function animateCounters() {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute("data-counter"), 10);
      let current = 0;
      const duration = 1200;
      const startTime = performance.now();

      function update(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        current = Math.floor(progress * target);
        counter.textContent = current;
        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }
      requestAnimationFrame(update);
    });
  }

  /* ---- Parallax hover on visual ---- */
  if (visual) {
    const desktop = visual.querySelector(".tpw-desktop");
    const phone = visual.querySelector(".tpw-phone");
    const badge = visual.querySelector(".tpw-badge");

    visual.addEventListener("mousemove", (e) => {
      const rect = visual.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      if (desktop) desktop.style.transform =
        `translateX(-50%) translate(${x * -12}px, ${y * -8}px)`;
      if (phone) phone.style.transform =
        `translate(${x * 18}px, ${y * 18}px)`;
      if (badge) badge.style.transform =
        `translateX(-50%) translate(${x * 10}px, ${y * 6}px)`;
    });

    visual.addEventListener("mouseleave", () => {
      if (desktop) desktop.style.transform = "translateX(-50%)";
      if (phone) phone.style.transform = "";
      if (badge) badge.style.transform = "translateX(-50%)";
    });
  }
});

// End page a propos


// Start page services

document.addEventListener('DOMContentLoaded', () => {
  const els = document.querySelectorAll('[data-reveal]');

  const map = {
    'fade-up': { hidden: 'opacity-0 translate-y-6 scale-[0.98]', visible: 'opacity-100 translate-y-0 scale-100' },
    'fade-in': { hidden: 'opacity-0 scale-[0.97]', visible: 'opacity-100 scale-100' },
  };

  els.forEach(el => {
    const type = el.getAttribute('data-reveal');
    const conf = map[type] || map['fade-up'];
    el.classList.add('transition-all', 'duration-700', 'ease-out');
    conf.hidden.split(' ').forEach(c => el.classList.add(c));

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          conf.hidden.split(' ').forEach(c => el.classList.remove(c));
          conf.visible.split(' ').forEach(c => el.classList.add(c));
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(el);
  });
});



document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('[data-tilt]');

  cards.forEach(card => {
    const strength = 10; // angle max

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * strength;
      const rotateX = ((y / rect.height) - 0.5) * -strength;

      card.style.transform = `
          perspective(800px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
          translateY(-4px)
        `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
});

// End page services

// Start page Portfolio
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.js-project-card');

  // 3D tilt (soft)
  cards.forEach((card) => {
    card.classList.add('card-hidden');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotateX = ((y - rect.height / 2) / rect.height) * -7; // softer
      const rotateY = ((x - rect.width / 2) / rect.width) * 7;

      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0)';
    });
  });

  // Scroll reveal with small stagger
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.remove('card-hidden');
          el.classList.add('card-visible');
          el.style.transitionDelay =
            (parseInt(el.dataset.delay || '0', 10)) + 'ms';
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.2 }
  );

  cards.forEach((card, index) => {
    card.dataset.delay = index * 120; // 0, 120, 240ms
    observer.observe(card);
  });
});
// End page Portfolio


// Start Cookies
document.addEventListener('DOMContentLoaded', function () {
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;

  const acceptBtn = banner.querySelector('.cookie-accept');
  const declineBtn = banner.querySelector('.cookie-decline');

  // Check if user already made a choice
  const consent = localStorage.getItem('cookieConsent');
  if (!consent) {
    // No choice yet → show banner
    banner.classList.add('is-visible');
  }

  acceptBtn.addEventListener('click', function () {
    localStorage.setItem('cookieConsent', 'accepted');
    banner.classList.remove('is-visible');
    // here you could enable analytics / extra scripts if needed
  });

  declineBtn.addEventListener('click', function () {
    localStorage.setItem('cookieConsent', 'declined');
    banner.classList.remove('is-visible');
    // here you should avoid loading non-essential cookies/scripts
  });
});
// End Cookies

// Start WhatsApp contact form
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent redirect (no more 405)

    const name = this.name.value.trim();
    const phone = this.phone.value.trim();
    const email = this.email.value.trim();
    const message = this.message.value.trim();

    const waText = `
Hello Technoproweb,

New message from the contact form:

Name: ${name}
Phone: ${phone}
Email: ${email}

Project / Message:
${message}
      `.trim();

    const waUrl = 'https://wa.me/212621691502?text=' + encodeURIComponent(waText);

    window.open(waUrl, '_blank');
  });
});

// End WhatsApp contact form

// WhatsApp Floating Button
document.addEventListener("DOMContentLoaded", () => {
  const waBtn = document.querySelector(".wa-btn");
  const toggle = document.getElementById("wa-toggle");
  const firstLink = document.querySelector(".wa-card");

  // Ripple on main button
  waBtn.addEventListener("click", (e) => {
    const rect = waBtn.getBoundingClientRect();
    const span = document.createElement("span");
    span.className = "ripple";
    span.style.left = e.clientX - rect.left + "px";
    span.style.top = e.clientY - rect.top + "px";
    waBtn.appendChild(span);
    span.addEventListener("animationend", () => span.remove());
  });

  // Confetti burst when panel opens
  const colors = ["#25D366", "#20bd5a", "#0f9f46", "#34e17a", "#b0f0c7"];

  function confettiBurst(originEl) {
    const count = 26;
    const rect = originEl.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    for (let i = 0; i < count; i++) {
      const piece = document.createElement("div");
      piece.className = "confetti";
      piece.style.background =
        colors[Math.floor(Math.random() * colors.length)];
      piece.style.borderRadius = Math.random() > 0.5 ? "2px" : "50%";
      piece.style.left = originX + "px";
      piece.style.top = originY + "px";

      const angle = (Math.random() * 120 - 60) * (Math.PI / 180); // -60..60 deg
      const velocity = 6 + Math.random() * 10;
      const rotate = Math.random() * 720 - 360;
      const duration = 900 + Math.random() * 700;
      const driftX = Math.random() * 160 - 80;

      piece.animate(
        [
          { transform: `translate(0,0) rotate(0deg)`, opacity: 1 },
          {
            transform: `translate(${Math.cos(angle) * velocity * 8 + driftX
              }px, ${-Math.sin(angle) * velocity * 8 - 30
              }px) rotate(${rotate}deg)`,
            opacity: 0.9,
            offset: 0.5,
          },
          {
            transform: `translate(${driftX}px, 160px) rotate(${rotate * 1.6
              }deg)`,
            opacity: 0,
          },
        ],
        { duration, easing: "cubic-bezier(.2,.8,.2,1)", fill: "forwards" }
      );

      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), duration + 60);
    }
  }

  toggle.addEventListener("change", () => {
    if (toggle.checked) {
      confettiBurst(waBtn);
      // Focus first actionable item for keyboard users
      setTimeout(() => firstLink?.focus?.(), 200);
    }
  });
});