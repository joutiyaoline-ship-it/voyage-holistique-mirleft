const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyDKkpHSq5SnDfMMQQfVof6SAJkr6KEhaqQkxgKBaPnC_9R-GHyoYvAL1VtFaCPunkz/exec";
const META_PIXEL_ID = "PASTE_META_PIXEL_ID_HERE";
const WHATSAPP_URL =
  "https://wa.me/31625375673?text=Bonjour%20je%20souhaite%20obtenir%20plus%20d'informations%20concernant%20le%20Voyage%20Holistique%20du%2010%20au%2017%20ao%C3%BBt%202026%20%C3%A0%20Mirleft.";

const header = document.querySelector(".site-header");
const hero = document.querySelector(".hero");
const progress = document.getElementById("scrollProgress");
const revealItems = document.querySelectorAll(".reveal");
const lightbox = document.getElementById("lightbox");
const lightboxImage = lightbox?.querySelector("img");
const closeLightbox = document.getElementById("closeLightbox");
const exitModal = document.getElementById("exitModal");
const closeModal = document.getElementById("closeModal");
const legalModals = document.querySelectorAll(".legal-modal");
const legalModalTriggers = document.querySelectorAll("[data-legal-modal]");
const reservationForm = document.getElementById("reservationForm");
const formFeedback = document.getElementById("formFeedback");

let ctaLocation = sessionStorage.getItem("voyageCtaLocation") || "direct";
let isSubmitting = false;
let formStarted = false;
const trackedOnce = new Set();
let activeLegalTrigger = null;

function syncModalOpenState() {
  const hasOpenModal = document.querySelector(".lightbox.open, .exit-modal.open, .legal-modal.open");
  document.body.classList.toggle("modal-open", Boolean(hasOpenModal));
}

window.dataLayer = window.dataLayer || [];

function isConfigured(value, placeholder) {
  return Boolean(value && value !== placeholder);
}

function initMetaPixel() {
  if (!isConfigured(META_PIXEL_ID, "PASTE_META_PIXEL_ID_HERE") || window.fbq) return;

  window.fbq = function fbqShim() {
    window.fbq.callMethod
      ? window.fbq.callMethod.apply(window.fbq, arguments)
      : window.fbq.queue.push(arguments);
  };
  window.fbq.push = window.fbq;
  window.fbq.loaded = true;
  window.fbq.version = "2.0";
  window.fbq.queue = [];

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  window.fbq("init", META_PIXEL_ID);
}

function trackEvent(eventName, parameters = {}, options = {}) {
  const payload = {
    event: eventName,
    ...parameters,
  };

  if (options.once) {
    const key = `${eventName}:${JSON.stringify(parameters)}`;
    if (trackedOnce.has(key)) return;
    trackedOnce.add(key);
  }

  window.dataLayer.push(payload);

  if (window.fbq && isConfigured(META_PIXEL_ID, "PASTE_META_PIXEL_ID_HERE")) {
    const standardEvents = ["PageView", "Lead"];
    const method = standardEvents.includes(eventName) ? "track" : "trackCustom";
    window.fbq(method, eventName, parameters);
  }
}

initMetaPixel();
trackEvent("PageView", { page_url: window.location.href }, { once: true });

if (window.lucide) {
  window.lucide.createIcons();
}

function updateScrollState() {
  const scrolled = window.scrollY > 40;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? (window.scrollY / max) * 100 : 0;

  header?.classList.toggle("scrolled", scrolled);
  if (progress) progress.style.width = `${ratio}%`;
  if (hero) hero.style.setProperty("--hero-parallax", Math.min(window.scrollY * -0.08, 0).toFixed(2));
}

window.addEventListener("scroll", updateScrollState, { passive: true });
updateScrollState();

const revealObserver = "IntersectionObserver" in window
  ? new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    )
  : null;

revealItems.forEach((item) => {
  if (revealObserver) {
    revealObserver.observe(item);
  } else {
    item.classList.add("visible");
  }
});

function storeCtaLocation(cta) {
  const value = cta.dataset.cta || "unknown";
  ctaLocation = value;
  sessionStorage.setItem("voyageCtaLocation", value);
  trackEvent("CTA Click", {
    cta_location: value,
    cta_text: cta.textContent.trim() || cta.getAttribute("aria-label") || "icon",
    cta_href: cta.getAttribute("href") || "",
  });
}

document.querySelectorAll("[data-cta]").forEach((cta) => {
  cta.addEventListener("click", () => {
    storeCtaLocation(cta);

    if ((cta.getAttribute("href") || "").startsWith("https://wa.me/31625375673")) {
      trackEvent("WhatsApp Click", {
        cta_location: cta.dataset.cta || "unknown",
      });
    }
  });
});

document.querySelectorAll(".gallery-item").forEach((button) => {
  button.addEventListener("click", () => {
    const fullImage = button.dataset.full;
    const alt = button.querySelector("img")?.alt || "Image de galerie";

    if (!lightbox || !lightboxImage || !fullImage) return;
    lightboxImage.src = fullImage;
    lightboxImage.alt = alt;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  });
});


function hideLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  syncModalOpenState();
}

closeLightbox?.addEventListener("click", hideLightbox);
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) hideLightbox();
});

let exitShown = sessionStorage.getItem("voyageExitShown") === "true";

function showExitModal() {
  if (exitShown || !exitModal) return;
  exitShown = true;
  sessionStorage.setItem("voyageExitShown", "true");
  exitModal.classList.add("open");
  exitModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function hideExitModal() {
  if (!exitModal) return;
  exitModal.classList.remove("open");
  exitModal.setAttribute("aria-hidden", "true");
  syncModalOpenState();
}

document.addEventListener("mouseout", (event) => {
  if (event.clientY <= 0) showExitModal();
});

setTimeout(() => {
  if (window.scrollY > window.innerHeight * 0.7) showExitModal();
}, 45000);

closeModal?.addEventListener("click", hideExitModal);
exitModal?.addEventListener("click", (event) => {
  if (event.target === exitModal) hideExitModal();
});
function openLegalModal(modal, trigger) {
  if (!modal) return;
  activeLegalTrigger = trigger || null;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modal.querySelector(".legal-card")?.focus({ preventScroll: true });
}

function closeLegalModal(modal, restoreFocus = true) {
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  syncModalOpenState();
  if (restoreFocus) activeLegalTrigger?.focus({ preventScroll: true });
  activeLegalTrigger = null;
}

function closeAllLegalModals() {
  legalModals.forEach((modal) => closeLegalModal(modal, false));
}

legalModalTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const modal = document.getElementById(trigger.dataset.legalModal);
    openLegalModal(modal, trigger);
  });
});

legalModals.forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal || event.target.closest("[data-close-legal]")) {
      closeLegalModal(modal);
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    hideLightbox();
    hideExitModal();
    closeAllLegalModals();
  }
});

function getTrackingParams() {
  const params = new URLSearchParams(window.location.search);

  return {
    page_url: window.location.href,
    utm_source: params.get("utm_source") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_adset: params.get("utm_adset") || "",
    utm_ad: params.get("utm_ad") || "",
    fbclid: params.get("fbclid") || "",
  };
}

function setFeedback(message, type = "") {
  if (!formFeedback) return;
  formFeedback.textContent = message;
  formFeedback.classList.toggle("is-error", type === "error");
  formFeedback.classList.toggle("is-success", type === "success");
}

function setFieldValidity(form) {
  form.querySelectorAll("input, select, textarea").forEach((field) => {
    const missingRequiredValue = field.required && !String(field.value || "").trim();
    const invalid = missingRequiredValue || !field.checkValidity();
    field.setAttribute("aria-invalid", invalid ? "true" : "false");
  });
}

function clearFieldValidity(form) {
  form.querySelectorAll("input, select, textarea").forEach((field) => {
    field.setAttribute("aria-invalid", "false");
  });
}

function getFormPayload(form) {
  const formData = new FormData(form);
  const timestamp = new Date().toISOString();

  return {
    name: String(formData.get("name") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    city: String(formData.get("city") || "").trim(),
    guests: String(formData.get("guests") || "").trim(),
    status: "new",
    message: String(formData.get("message") || "").trim(),
    cta_location: ctaLocation,
    timestamp,
    ...getTrackingParams(),
  };
}

async function submitLead(payload) {
  if (!GOOGLE_SCRIPT_URL || !GOOGLE_SCRIPT_URL.startsWith("https://script.google.com/macros/s/")) {
    throw new Error("L'URL du Web App Google Apps Script est invalide.");
  }

  const response = await fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || "L'enregistrement a echoue.");
  }

  return result;
}

reservationForm?.addEventListener("input", () => {
  if (!formStarted) {
    formStarted = true;
    trackEvent("Form Start", { cta_location: ctaLocation }, { once: true });
  }
  clearFieldValidity(reservationForm);
});

reservationForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (isSubmitting) return;

  if (!reservationForm.checkValidity()) {
    setFieldValidity(reservationForm);
    reservationForm.reportValidity();
    setFeedback("Merci de completer les champs obligatoires.", "error");
    return;
  }

  const button = reservationForm.querySelector("button[type='submit']");
  const originalText = button?.textContent || "Reserver ma place";
  const payload = getFormPayload(reservationForm);

  isSubmitting = true;
  button?.setAttribute("disabled", "true");
  button?.setAttribute("aria-busy", "true");
  if (button) button.textContent = "Enregistrement...";
  setFeedback("Enregistrement de votre demande...", "");
  trackEvent("Form Submit", { cta_location: payload.cta_location }, { once: true });

  try {
    await submitLead(payload);
    setFeedback("Votre demande est enregistree. Redirection vers WhatsApp...", "success");
    trackEvent("Lead", {
      cta_location: payload.cta_location,
      guests: payload.guests,
    }, { once: true });
    setTimeout(() => {
      window.location.href = WHATSAPP_URL;
    }, 800);
  } catch (error) {
    isSubmitting = false;
    setFeedback(error.message || "Une erreur est survenue. Merci de reessayer.", "error");
    button?.removeAttribute("disabled");
    button?.setAttribute("aria-busy", "false");
    if (button) button.textContent = originalText;
  }
});





/* -------------------------------------------------------
   Sticky Reserve — hide when reservation section visible
------------------------------------------------------- */
(function initStickyObserver() {
  const reservationSection = document.getElementById('reservation');
  const stickyReserve = document.querySelector('.sticky-reserve');
  if (!reservationSection || !stickyReserve || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      stickyReserve.classList.toggle('sticky-hidden', entry.isIntersecting);
    },
    { threshold: 0.15 }
  );
  observer.observe(reservationSection);
})();

/* -------------------------------------------------------
   Custom Accordion (FAQ)
------------------------------------------------------- */
(function initAccordion() {
  const accordionItems = document.querySelectorAll('.accordion-item');
  if (!accordionItems.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function closeItem(item) {
    const btn = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    item.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    content.setAttribute('aria-hidden', 'true');
  }

  function openItem(item) {
    const btn = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    item.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    content.setAttribute('aria-hidden', 'false');
  }

  accordionItems.forEach(function(item) {
    const btn = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    const contentId = btn.getAttribute('aria-controls');

    content.setAttribute('id', contentId);
    content.setAttribute('aria-hidden', 'true');
    btn.setAttribute('aria-expanded', 'false');

    if (prefersReduced) {
      content.style.transition = 'none';
    }

    btn.addEventListener('click', function() {
      const isOpen = item.classList.contains('open');
      accordionItems.forEach(function(other) {
        if (other !== item) closeItem(other);
      });
      if (isOpen) {
        closeItem(item);
      } else {
        openItem(item);
      }
    });
  });
})();

/* ── ALBUM DU VOYAGE — CAROUSEL ─────────────────────────── */
(function () {
  'use strict';

  var albumSection = document.getElementById('album');
  if (!albumSection) return;

  var wrapper  = albumSection.querySelector('.album-track-wrapper');
  var track    = albumSection.querySelector('#albumTrack');
  var dotsWrap = albumSection.querySelector('#albumDots');
  var prevBtn  = albumSection.querySelector('.album-prev');
  var nextBtn  = albumSection.querySelector('.album-next');
  var carousel = albumSection.querySelector('.album-carousel');
  if (!wrapper || !track || !dotsWrap) return;

  var slides = Array.from(track.querySelectorAll('.album-slide'));
  var total  = slides.length;
  if (total === 0) return;

  var current      = 0;
  var autoTimer    = null;
  var resumeTimer  = null;
  var INTERVAL     = 3500;
  var RESUME_DELAY = 2000;
  var isDragging   = false;
  var isTouching   = false;

  /* Two transitions: desktop keeps its original curve, mobile uses ease */
  var TR_DESKTOP = 'transform 0.52s cubic-bezier(0.4, 0, 0.2, 1)';
  var TR_MOBILE  = 'transform 0.45s ease';

  function mob()   { return window.innerWidth < 768; }
  function sw()    { return wrapper.offsetWidth || wrapper.getBoundingClientRect().width || 600; }
  function wrap(i) { return ((i % total) + total) % total; }

  function enableTransition()  { track.style.transition = mob() ? TR_MOBILE : TR_DESKTOP; }
  function disableTransition() { track.style.transition = 'none'; }

  /*
   * setPos — the only place transform is written.
   *
   * Mobile:  translateX(-n * 100%)
   *   100% = track's own width = wrapper width. This is invariant:
   *   it doesn't depend on offsetWidth, layout timing, or image size.
   *
   * Desktop: translateX(-n * wrapper.offsetWidth + px)
   *   Pixel mode works fine on desktop where aspect-ratio locks the wrapper.
   */
  function setPos(n, animate) {
    if (animate === false) disableTransition(); else enableTransition();
    track.style.transform = mob()
      ? 'translateX(-' + (n * 100) + '%)'
      : 'translateX(-' + (n * sw()) + 'px)';
  }

  function snapTo(idx) {
    current = wrap(idx);
    setPos(current, false);
    requestAnimationFrame(function () { requestAnimationFrame(enableTransition); });
  }

  function goTo(idx) {
    var n = wrap(idx);
    syncDots(n);
    current = n;
    setPos(n, true);
  }

  /* ── Dots ── */
  slides.forEach(function (_, i) {
    var dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'album-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', 'Image ' + (i + 1) + ' sur ' + total);
    dot.setAttribute('aria-selected', String(i === 0));
    dot.addEventListener('click', function () { goTo(i); stopAuto(); scheduleResume(); });
    dotsWrap.appendChild(dot);
  });

  function syncDots(n) {
    var dots = dotsWrap.querySelectorAll('.album-dot');
    if (!dots[current] || !dots[n]) return;
    dots[current].classList.remove('active');
    dots[current].setAttribute('aria-selected', 'false');
    dots[n].classList.add('active');
    dots[n].setAttribute('aria-selected', 'true');
  }

  /* ── Autoplay ── */
  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(function () {
      if (!isDragging && !isTouching) goTo(current + 1);
    }, INTERVAL);
  }
  function stopAuto()      { clearInterval(autoTimer); autoTimer = null; }
  function scheduleResume() {
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(startAuto, RESUME_DELAY);
  }

  /* ── Arrows ── */
  if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); stopAuto(); scheduleResume(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); stopAuto(); scheduleResume(); });

  /* ── Keyboard ── */
  if (carousel) {
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft')  { goTo(current - 1); stopAuto(); scheduleResume(); e.preventDefault(); }
      if (e.key === 'ArrowRight') { goTo(current + 1); stopAuto(); scheduleResume(); e.preventDefault(); }
    });
  }

  /* ── Hover pause / resume (desktop) ── */
  if (carousel) {
    carousel.addEventListener('mouseenter', function () { if (!isDragging) { clearTimeout(resumeTimer); stopAuto(); } });
    carousel.addEventListener('mouseleave', function () { if (!isDragging) startAuto(); });
  }

  /* ── Mouse drag ──
   * Mobile:  base stored as % index; live feedback via calc(-base% + deltaPx).
   * Desktop: base stored as pixels; live feedback via pixels.
   */
  var dragStartX  = 0;
  var dragBasePct = 0;   /* mobile */
  var dragBasePx  = 0;   /* desktop */
  track.style.cursor     = 'grab';
  track.style.userSelect = 'none';

  track.addEventListener('mousedown', function (e) {
    if (e.button !== 0) return;
    isDragging  = true;
    dragStartX  = e.clientX;
    dragBasePct = current * 100;
    dragBasePx  = current * sw();
    disableTransition();
    track.style.cursor = 'grabbing';
    clearTimeout(resumeTimer);
    stopAuto();
    e.preventDefault();
  });

  document.addEventListener('mousemove', function (e) {
    if (!isDragging) return;
    var delta = e.clientX - dragStartX;
    track.style.transform = mob()
      ? 'translateX(calc(-' + dragBasePct + '% + ' + delta + 'px))'
      : 'translateX(-' + (dragBasePx - delta) + 'px)';
  });

  document.addEventListener('mouseup', function (e) {
    if (!isDragging) return;
    isDragging = false;
    track.style.cursor = 'grab';
    var delta = e.clientX - dragStartX;
    var thr   = sw() * 0.18;
    if      (delta < -thr) goTo(current + 1);
    else if (delta >  thr) goTo(current - 1);
    else                   goTo(current);
    scheduleResume();
  });

  track.addEventListener('dragstart', function (e) { e.preventDefault(); });

  /* ── Touch swipe ── (same dual-mode pattern as mouse drag) */
  var touchStartX  = 0;
  var touchStartY  = 0;
  var touchBasePct = 0;
  var touchBasePx  = 0;
  var touchIsH     = null;

  track.addEventListener('touchstart', function (e) {
    isTouching   = true;
    touchStartX  = e.touches[0].clientX;
    touchStartY  = e.touches[0].clientY;
    touchBasePct = current * 100;
    touchBasePx  = current * sw();
    touchIsH     = null;
    disableTransition();
    clearTimeout(resumeTimer);
    stopAuto();
  }, { passive: true });

  track.addEventListener('touchmove', function (e) {
    if (!isTouching) return;
    var dx = e.touches[0].clientX - touchStartX;
    var dy = e.touches[0].clientY - touchStartY;
    if (touchIsH === null) touchIsH = Math.abs(dx) > Math.abs(dy);
    if (!touchIsH) return;
    track.style.transform = mob()
      ? 'translateX(calc(-' + touchBasePct + '% + ' + dx + 'px))'
      : 'translateX(-' + (touchBasePx - dx) + 'px)';
  }, { passive: true });

  track.addEventListener('touchend', function (e) {
    if (!isTouching) return;
    isTouching = false;
    var dx  = e.changedTouches[0].clientX - touchStartX;
    var thr = sw() * 0.18;
    if (touchIsH) {
      if      (dx < -thr) goTo(current + 1);
      else if (dx >  thr) goTo(current - 1);
      else                goTo(current);
    } else {
      goTo(current);
    }
    scheduleResume();
  }, { passive: true });

  /* ── Resize: re-snap to current slide ── */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { snapTo(current); }, 100);
  });

  /* ── prefers-reduced-motion ── */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    disableTransition();
  } else {
    enableTransition();
  }

  /* ── Init ── */
  requestAnimationFrame(function () {
    track.style.transform = 'translateX(0)';
    startAuto();
  });
})();

/* ── MOBILE STICKY CTA BAR ───────────────────────────── */
(function initMobileCTABar() {
  'use strict';
  var bar         = document.getElementById('mobileCTABar');
  var reserveForm = document.getElementById('reservationForm');
  var feedback    = document.getElementById('formFeedback');
  if (!bar) return;

  /* Permanently dismissed this session (form was submitted) */
  if (sessionStorage.getItem('ctaBarDismissed')) {
    bar.style.display = 'none';
    return;
  }

  var SHOW_AFTER_PX = 150;   /* ~15% scroll before bar appears */
  var isVisible     = false;
  var formDone      = false;

  var focusables = bar.querySelectorAll('a');

  function setVisible(show) {
    if (show === isVisible) return;
    isVisible = show;
    bar.classList.toggle('is-visible', show);
    bar.setAttribute('aria-hidden', String(!show));
    focusables.forEach(function (el) {
      el.setAttribute('tabindex', show ? '0' : '-1');
    });
  }

  function calcShouldShow() {
    if (formDone) return false;

    /* Wait for initial scroll — avoids distracting users who just arrived */
    if ((window.pageYOffset || window.scrollY) < SHOW_AFTER_PX) return false;

    /* Hide only while the booking form is visible in the viewport */
    if (reserveForm) {
      var r = reserveForm.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) return false;
    }

    return true;   /* visible everywhere else on the page */
  }

  function onScroll() { setVisible(calcShouldShow()); }

  /* Click: smooth-scroll to form and focus first field */
  var reserveLink = bar.querySelector('.mcb-reserve');
  if (reserveLink && reserveForm) {
    reserveLink.addEventListener('click', function (e) {
      e.preventDefault();
      reserveForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
      var firstInput = reserveForm.querySelector('input, select, textarea');
      if (firstInput) {
        setTimeout(function () { firstInput.focus(); }, 650);
      }
      setVisible(false);
    });
  }

  /* Permanent hide after successful submission — persisted in sessionStorage */
  if (feedback) {
    new MutationObserver(function () {
      if (feedback.classList.contains('is-success')) {
        formDone = true;
        sessionStorage.setItem('ctaBarDismissed', '1');
        setVisible(false);
      }
    }).observe(feedback, { attributes: true, attributeFilter: ['class'] });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();   /* handle reload-at-scroll-position edge case */
})();
