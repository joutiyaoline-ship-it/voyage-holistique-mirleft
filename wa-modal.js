(function () {
  "use strict";

  var WA_PREFIX = "https://wa.me/31625375673";

  var MESSAGES = {
    fr: {
      availability: "Bonjour,\nJe souhaite vérifier si l'une des 2 dernières places est toujours disponible pour le Voyage Holistique du 10 au 17 août 2026.",
      payment: "Bonjour,\nJe souhaiterais connaître les modalités de paiement et de réservation du Voyage Holistique.",
      question: "Bonjour,\nJ'ai quelques questions avant de réserver ma place au Voyage Holistique. Pouvez-vous m'aider ?",
      laila: "Bonjour Dr. Laila,\nJ'aimerais échanger personnellement avec vous avant de prendre ma décision.",
      formdone: "Bonjour,\n\nJe viens de remplir le formulaire de réservation.\n\nJe suis convaincue par le Voyage Holistique et je souhaite maintenant finaliser mon inscription.\n\nPouvez-vous m'envoyer les étapes pour effectuer le paiement et confirmer définitivement ma place ?\n\nMerci."
    },
    en: {
      availability: "Hello,\nI'd like to check whether one of the last 2 spots is still available for the Holistic Journey from August 10 to 17, 2026.",
      payment: "Hello,\nI would like to know the payment and booking details for the Holistic Journey.",
      question: "Hello,\nI have a few questions before booking my spot for the Holistic Journey. Could you help me?",
      laila: "Hello Dr. Laila,\nI would love to speak with you personally before making my decision.",
      formdone: "Hello,\n\nI just filled in the reservation form.\n\nI'm convinced about the Holistic Journey and I would now like to finalize my registration.\n\nCould you send me the steps to make the payment and confirm my spot for good?\n\nThank you."
    },
    nl: {
      availability: "Hallo,\nIk wil graag controleren of een van de laatste 2 plaatsen nog beschikbaar is voor de Holistische Reis van 10 tot 17 augustus 2026.",
      payment: "Hallo,\nIk zou graag de betalings- en reserveringsvoorwaarden van de Holistische Reis willen kennen.",
      question: "Hallo,\nIk heb nog een paar vragen voordat ik mijn plek reserveer voor de Holistische Reis. Kunt u mij helpen?",
      laila: "Hallo Dr. Laila,\nIk zou graag persoonlijk met u willen spreken voordat ik mijn beslissing neem.",
      formdone: "Hallo,\n\nIk heb zojuist het reserveringsformulier ingevuld.\n\nIk ben overtuigd van de Holistische Reis en wil nu graag mijn inschrijving afronden.\n\nKunt u mij de stappen sturen om te betalen en mijn plek definitief te bevestigen?\n\nDank u wel."
    }
  };

  var UI_TEXT = {
    fr: {
      eyebrow: "Contact WhatsApp",
      title: "Comment pouvons-nous vous aider aujourd’hui ?",
      close: "Fermer",
      opt1: "Vérifier la disponibilité des 2 dernières places",
      opt2: "Paiement et réservation",
      opt3: "J'ai une question avant de réserver",
      opt4: "Parler personnellement avec Dr. Laila",
      opt5: "J'ai rempli le formulaire, je veux finaliser ma réservation"
    },
    en: {
      eyebrow: "WhatsApp Contact",
      title: "How can we help you today?",
      close: "Close",
      opt1: "Check availability of the last 2 spots",
      opt2: "Payment and reservation",
      opt3: "I have a question before booking",
      opt4: "Speak personally with Dr. Laila",
      opt5: "I already completed the form"
    },
    nl: {
      eyebrow: "WhatsApp Contact",
      title: "Hoe kunnen we u vandaag helpen?",
      close: "Sluiten",
      opt1: "Controleer de beschikbaarheid van de laatste 2 plaatsen",
      opt2: "Betaling en reservering",
      opt3: "Ik heb een vraag voor ik boek",
      opt4: "Persoonlijk spreken met Dr. Laila",
      opt5: "Ik heb het formulier al ingevuld"
    }
  };

  var modal = null;
  var closeBtn = null;
  var options = [];
  var exitModal = null;
  var lastFocused = null;
  var initialized = false;

  function getLang() {
    var lang = window.VH_I18N && window.VH_I18N.getLang && window.VH_I18N.getLang();
    return MESSAGES[lang] ? lang : "fr";
  }

  function applyLanguage() {
    var lang = getLang();
    var t = UI_TEXT[lang];
    var m = MESSAGES[lang];

    Array.prototype.forEach.call(modal.querySelectorAll("[data-wa-i18n]"), function (el) {
      var key = el.getAttribute("data-wa-i18n");
      if (key === "eyebrow") {
        el.textContent = t.eyebrow;
      } else if (key === "title") {
        el.innerHTML = t.title;
      } else if (key.indexOf("opt") === 0) {
        el.textContent = t[key.split(".")[0]];
      }
    });

    if (closeBtn) closeBtn.setAttribute("aria-label", t.close);

    options.forEach(function (a) {
      var key = a.getAttribute("data-wa-option");
      var text = m[key] || m.question;
      a.setAttribute("href", WA_PREFIX + "?text=" + encodeURIComponent(text));
    });
  }

  function openModal(trigger) {
    if (exitModal && exitModal.classList.contains("open")) {
      exitModal.classList.remove("open");
      exitModal.setAttribute("aria-hidden", "true");
    }
    applyLanguage();
    lastFocused = trigger || document.activeElement;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("wa-modal-open");
    var first = options[0];
    if (first) {
      setTimeout(function () {
        first.focus({ preventScroll: true });
      }, 60);
    }
  }

  function closeModal() {
    if (!modal.classList.contains("open")) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("wa-modal-open");
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus({ preventScroll: true });
    }
    lastFocused = null;
  }

  function onDocumentClick(e) {
    var trigger = e.target.closest && e.target.closest('[data-wa-trigger="modal"]');
    if (trigger && !modal.contains(trigger)) {
      e.preventDefault();
      openModal(trigger);
      return;
    }

    if (e.target.closest && e.target.closest(".lang-btn")) {
      applyLanguage();
    }
  }

  function onDocumentKeydown(e) {
    if (e.key === "Escape") closeModal();
  }

  function onModalBackdropClick(e) {
    if (e.target === modal) closeModal();
  }

  function init() {
    if (initialized) return;

    modal = document.getElementById("waOptionsModal");
    if (!modal) return;

    initialized = true;

    closeBtn = document.getElementById("waModalClose");
    options = Array.prototype.slice.call(modal.querySelectorAll(".wa-option"));
    exitModal = document.getElementById("exitModal");

    document.addEventListener("click", onDocumentClick);
    document.addEventListener("keydown", onDocumentKeydown);
    modal.addEventListener("click", onModalBackdropClick);
    if (closeBtn) closeBtn.addEventListener("click", closeModal);

    applyLanguage();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
