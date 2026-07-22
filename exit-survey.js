(function () {
  "use strict";

  var SHOWN_KEY = "vh_exit_survey_shown_v1";
  var RESPONSES_KEY = "vh_exit_survey_responses_v1";
  var EXIT_SURVEY_ENDPOINT = "https://script.google.com/macros/s/AKfycbyDKkpHSq5SnDfMMQQfVof6SAJkr6KEhaqQkxgKBaPnC_9R-GHyoYvAL1VtFaCPunkz/exec";

  var MIN_TIME_ON_PAGE_MS = 30000;
  var MIN_SCROLL_PERCENT = 70;
  var SCROLL_IDLE_MS = 2000;

  var WA_PREFIX = "https://wa.me/31625375673";
  var QUESTIONS_MESSAGE = "Bonjour,\nJ'ai encore quelques questions avant de réserver ma place au Voyage Holistique.";

  var BUDGET_THANKS = "Nous vous informerons en priorité si une future retraite correspond davantage à votre budget.";
  var DATES_THANKS = "Nous vous informerons dès qu'une prochaine retraite sera organisée durant cette période.";

  var pageLoadTime = (window.performance && performance.timing && performance.timing.navigationStart) || Date.now();
  var pricingSectionViewed = false;
  var maxScrollPercent = 0;
  var lastScrollTimestamp = 0;
  var scrollTicking = false;

  var exitModal = null;
  var currentReason = null;
  var currentBudget = null;
  var currentDate = null;
  var stepHistory = ["reason"];
  var initialized = false;

  function getScrollPercent() {
    var doc = document.documentElement;
    var scrollable = doc.scrollHeight - doc.clientHeight;
    if (scrollable <= 0) return 100;
    return (window.scrollY / scrollable) * 100;
  }

  function onScroll() {
    lastScrollTimestamp = Date.now();
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(function () {
      maxScrollPercent = Math.max(maxScrollPercent, getScrollPercent());
      scrollTicking = false;
    });
  }

  function observePricingSection() {
    var section = document.getElementById("reservation");
    if (!section || !("IntersectionObserver" in window)) return;
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            pricingSectionViewed = true;
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(section);
  }

  function isFormSubmitted() {
    try {
      return sessionStorage.getItem("voyageFormSubmitted") === "1";
    } catch (e) {
      return false;
    }
  }

  function isEligible() {
    if (!exitModal) return false;
    try {
      if (localStorage.getItem(SHOWN_KEY)) return false;
    } catch (e) {}
    if (isFormSubmitted()) return false;
    if (Date.now() - pageLoadTime < MIN_TIME_ON_PAGE_MS) return false;
    if (maxScrollPercent < MIN_SCROLL_PERCENT) return false;
    if (!pricingSectionViewed) return false;
    if (Date.now() - lastScrollTimestamp < SCROLL_IDLE_MS) return false;
    if (exitModal.classList.contains("open")) return false;
    var waModal = document.getElementById("waOptionsModal");
    if (waModal && waModal.classList.contains("open")) return false;
    return true;
  }

  function showStep(name) {
    Array.prototype.forEach.call(exitModal.querySelectorAll(".exit-step"), function (step) {
      step.hidden = step.getAttribute("data-exit-step") !== name;
    });
  }

  function goToStep(name) {
    stepHistory.push(name);
    showStep(name);
  }

  function goBack() {
    if (stepHistory.length > 1) stepHistory.pop();
    showStep(stepHistory[stepHistory.length - 1]);
  }

  function recordResponse(partial) {
    var payload = Object.assign(
      {
        status: "exit_survey",
        reason: null,
        budget: null,
        preferredDate: null,
        name: null,
        phone: null,
        timestamp: new Date().toISOString(),
        page_url: window.location.href,
        language: (window.VH_I18N && window.VH_I18N.getLang && window.VH_I18N.getLang()) || document.documentElement.lang || "fr"
      },
      partial
    );

    try {
      var existing = JSON.parse(localStorage.getItem(RESPONSES_KEY) || "[]");
      existing.push(payload);
      localStorage.setItem(RESPONSES_KEY, JSON.stringify(existing));
    } catch (e) {}

    if (typeof window.trackEvent === "function") {
      window.trackEvent("ExitSurveyResponse", payload);
    }

    if (EXIT_SURVEY_ENDPOINT) {
      fetch(EXIT_SURVEY_ENDPOINT, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      }).catch(function () {});
    }
  }

  function showExitSurvey() {
    try {
      localStorage.setItem(SHOWN_KEY, "1");
    } catch (e) {}

    currentReason = null;
    currentBudget = null;
    currentDate = null;
    stepHistory = ["reason"];
    showStep("reason");

    exitModal.classList.add("open");
    exitModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    var firstOption = exitModal.querySelector('[data-exit-step="reason"] .wa-option');
    if (firstOption) {
      setTimeout(function () {
        firstOption.focus({ preventScroll: true });
      }, 60);
    }

    if (typeof window.trackEvent === "function") {
      window.trackEvent("ExitSurveyShown", { page_url: window.location.href });
    }
  }

  function attemptShow() {
    if (!isEligible()) return;
    showExitSurvey();
  }

  function onModalClick(e) {
    var reasonBtn = e.target.closest("[data-exit-reason]");
    if (reasonBtn) {
      currentReason = reasonBtn.getAttribute("data-exit-reason");
      if (currentReason === "budget") {
        goToStep("budget-options");
      } else if (currentReason === "dates") {
        goToStep("dates-options");
      } else if (currentReason === "questions") {
        goToStep("questions");
        recordResponse({ reason: "questions" });
      } else if (currentReason === "not-for-me") {
        goToStep("not-for-me-thanks");
        recordResponse({ reason: "not-for-me" });
      }
      return;
    }

    var budgetBtn = e.target.closest("[data-exit-budget]");
    if (budgetBtn) {
      currentBudget = budgetBtn.getAttribute("data-exit-budget");
      goToStep("contact-form");
      return;
    }

    var dateBtn = e.target.closest("[data-exit-date]");
    if (dateBtn) {
      currentDate = dateBtn.getAttribute("data-exit-date");
      goToStep("contact-form");
      return;
    }

    var backBtn = e.target.closest("[data-exit-back]");
    if (backBtn) {
      goBack();
    }
  }

  function onFormSubmit(e) {
    e.preventDefault();
    var form = e.target;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var name = form.elements.exitName.value.trim();
    var phone = form.elements.exitPhone.value.trim();
    var payload = { reason: currentReason, name: name, phone: phone };
    if (currentReason === "budget") payload.budget = currentBudget;
    if (currentReason === "dates") payload.preferredDate = currentDate;
    recordResponse(payload);

    var detailEl = document.getElementById("exitSurveyThanksDetail");
    if (detailEl) {
      detailEl.textContent = currentReason === "dates" ? DATES_THANKS : BUDGET_THANKS;
    }
    goToStep("thanks");
  }

  function armDesktopExitIntent() {
    document.addEventListener("mouseout", function (e) {
      if (e.clientY <= 0) attemptShow();
    });
  }

  function armMobileBackGuard() {
    var isCoarsePointer = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    if (!isCoarsePointer) return;
    try {
      history.pushState({ vhExitGuard: true }, "", location.href);
    } catch (e) {
      return;
    }
    window.addEventListener(
      "popstate",
      function () {
        attemptShow();
      },
      { once: true }
    );
  }

  function init() {
    if (initialized) return;
    exitModal = document.getElementById("exitModal");
    if (!exitModal) return;
    initialized = true;

    var whatsappLink = document.getElementById("exitSurveyWhatsapp");
    if (whatsappLink) {
      whatsappLink.href = WA_PREFIX + "?text=" + encodeURIComponent(QUESTIONS_MESSAGE);
    }

    var form = document.getElementById("exitSurveyForm");
    if (form) form.addEventListener("submit", onFormSubmit);

    exitModal.addEventListener("click", onModalClick);

    window.addEventListener("scroll", onScroll, { passive: true });
    observePricingSection();
    armDesktopExitIntent();
    armMobileBackGuard();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
