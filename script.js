const GOOGLE_SCRIPT_URL="https://script.google.com/macros/s/AKfycbyDKkpHSq5SnDfMMQQfVof6SAJkr6KEhaqQkxgKBaPnC_9R-GHyoYvAL1VtFaCPunkz/exec",META_PIXEL_ID="936528165885461",WHATSAPP_URL="https://wa.me/31625375673?text=Bonjour%20je%20souhaite%20obtenir%20plus%20d'informations%20concernant%20le%20Voyage%20Holistique%20du%2010%20au%2017%20ao%C3%BBt%202026%20%C3%A0%20Mirleft.",header=document.querySelector(".site-header"),hero=document.querySelector(".hero"),progress=document.getElementById("scrollProgress"),revealItems=document.querySelectorAll(".reveal"),lightbox=document.getElementById("lightbox"),lightboxImage=lightbox?.querySelector("img"),closeLightbox=document.getElementById("closeLightbox"),exitModal=document.getElementById("exitModal"),closeModal=document.getElementById("closeModal"),legalModals=document.querySelectorAll(".legal-modal"),legalModalTriggers=document.querySelectorAll("[data-legal-modal]"),reservationForm=document.getElementById("reservationForm"),formFeedback=document.getElementById("formFeedback");let ctaLocation=sessionStorage.getItem("voyageCtaLocation")||"direct",isSubmitting=!1,formStarted=!1;const trackedOnce=new Set;let activeLegalTrigger=null;function syncModalOpenState(){const e=document.querySelector(".lightbox.open, .exit-modal.open, .legal-modal.open, .mobile-menu.open");document.body.classList.toggle("modal-open",Boolean(e))}function isConfigured(e,t){return Boolean(e&&e!==t)}function trackEvent(e,t={},r={}){const o={event:e,...t};if(r.once){const r=`${e}:${JSON.stringify(t)}`;if(trackedOnce.has(r))return;trackedOnce.add(r)}if(window.dataLayer.push(o),isConfigured(META_PIXEL_ID,"PASTE_META_PIXEL_ID_HERE")){window.fbq||window.__ensureMetaPixel&&window.__ensureMetaPixel();if(window.fbq){const r=["PageView","Lead","ViewContent","Contact"].includes(e)?"track":"trackCustom";window.fbq(r,e,t)}else(window.__metaPixelQueue=window.__metaPixelQueue||[]).push([e,t])}}window.trackEvent=trackEvent;function updateScrollState(){const e=window.scrollY>40,t=document.documentElement.scrollHeight-window.innerHeight,r=t>0?window.scrollY/t*100:0;header?.classList.toggle("scrolled",e),progress&&(progress.style.width=`${r}%`),hero&&hero.style.setProperty("--hero-parallax",Math.min(-.08*window.scrollY,0).toFixed(2)),r>=25&&trackEvent("Scroll25",{},{once:!0}),r>=50&&trackEvent("Scroll50",{},{once:!0}),r>=75&&trackEvent("Scroll75",{},{once:!0}),r>=90&&trackEvent("Scroll90",{},{once:!0})}window.dataLayer=window.dataLayer||[],window.lucide&&window.lucide.createIcons(),window.addEventListener("scroll",updateScrollState,{passive:!0}),updateScrollState();if(hero){if("IntersectionObserver"in window){const heroViewObserver=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&(trackEvent("ViewContent",{},{once:!0}),heroViewObserver.unobserve(e.target))})},{threshold:.3});heroViewObserver.observe(hero)}else trackEvent("ViewContent",{},{once:!0})}const revealObserver="IntersectionObserver"in window?new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&(e.target.classList.add("visible"),revealObserver.unobserve(e.target))})},{threshold:.14}):null;function storeCtaLocation(e){const t=e.dataset.cta||"unknown";ctaLocation=t,sessionStorage.setItem("voyageCtaLocation",t)}function resolveCtaEventName(e){const t=e.dataset.cta||"",r=(e.getAttribute("href")||"").startsWith("https://wa.me/"),o={navbar:"CTA_Navbar_Reserve","hero-card":"CTA_Hero_Card_Reserve",activites:"CTA_Programme_Reserve",album:"CTA_Album_View","story-value":"CTA_Included_Reserve","story-value-inline":"CTA_Included_WhatsApp",expert:"CTA_Pricing_Reserve",location:"CTA_Final_Reserve","exit-modal":"CTA_ExitPopup_WhatsApp",footer:"CTA_Footer_Reserve"};return"hero"===t?r?"CTA_Hero_WhatsApp":"CTA_Hero_Reserve":"sticky"===t?r?"CTA_Sticky_WhatsApp":"CTA_Sticky_Bottom_Reserve":"mobile-sticky"===t?"CTA_Sticky_Bottom_Reserve":"mobile-sticky-wa"===t?"CTA_Sticky_WhatsApp":o[t]||null}function ctaTrackingMeta(e){return{cta_location:e.dataset.cta||"unknown",cta_text:e.textContent.trim()||e.getAttribute("aria-label")||"icon",page_url:window.location.href,language:window.VH_I18N?.getLang()||document.documentElement.lang||"fr"}}function hideLightbox(){lightbox&&(lightbox.classList.remove("open"),lightbox.setAttribute("aria-hidden","true"),syncModalOpenState())}revealItems.forEach(e=>{revealObserver?revealObserver.observe(e):e.classList.add("visible")}),document.addEventListener("click",e=>{const el=e.target.closest("[data-cta]");if(!el)return;storeCtaLocation(el);if("reservation-form"===el.dataset.cta)return;const t=resolveCtaEventName(el),r=ctaTrackingMeta(el);trackEvent(t||"CTA Click",r)}),document.querySelectorAll(".gallery-item").forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.full,r=e.querySelector("img")?.alt||"Image de galerie";lightbox&&lightboxImage&&t&&(lightboxImage.src=t,lightboxImage.alt=r,lightbox.classList.add("open"),lightbox.setAttribute("aria-hidden","false"),document.body.classList.add("modal-open"))})}),closeLightbox?.addEventListener("click",hideLightbox),lightbox?.addEventListener("click",e=>{e.target===lightbox&&hideLightbox()});let exitShown="true"===sessionStorage.getItem("voyageExitShown");function showExitModal(){if(exitShown||!exitModal)return;var formDone=!1,waClicked=!1;try{formDone="1"===sessionStorage.getItem("voyageFormSubmitted"),waClicked="1"===sessionStorage.getItem("voyageWaClicked")}catch(e){}if(formDone||waClicked)return;exitShown=!0,sessionStorage.setItem("voyageExitShown","true"),exitModal.classList.add("open"),exitModal.setAttribute("aria-hidden","false"),document.body.classList.add("modal-open")}function hideExitModal(){exitModal&&(exitModal.classList.remove("open"),exitModal.setAttribute("aria-hidden","true"),syncModalOpenState())}function openLegalModal(e,t){e&&(activeLegalTrigger=t||null,e.classList.add("open"),e.setAttribute("aria-hidden","false"),document.body.classList.add("modal-open"),e.querySelector(".legal-card")?.focus({preventScroll:!0}))}function closeLegalModal(e,t=!0){e&&(e.classList.remove("open"),e.setAttribute("aria-hidden","true"),syncModalOpenState(),t&&activeLegalTrigger?.focus({preventScroll:!0}),activeLegalTrigger=null)}function closeAllLegalModals(){legalModals.forEach(e=>closeLegalModal(e,!1))}function getTrackingParams(){const e=new URLSearchParams(window.location.search);return{page_url:window.location.href,utm_source:e.get("utm_source")||"",utm_campaign:e.get("utm_campaign")||"",utm_adset:e.get("utm_adset")||"",utm_ad:e.get("utm_ad")||"",fbclid:e.get("fbclid")||""}}function setFeedback(e,t=""){formFeedback&&(formFeedback.textContent=e,formFeedback.classList.toggle("is-error","error"===t),formFeedback.classList.toggle("is-success","success"===t))}function setFieldValidity(e){e.querySelectorAll("input, select, textarea").forEach(e=>{const t=e.required&&!String(e.value||"").trim()||!e.checkValidity();e.setAttribute("aria-invalid",t?"true":"false")})}function clearFieldValidity(e){e.querySelectorAll("input, select, textarea").forEach(e=>{e.setAttribute("aria-invalid","false")})}function getFormPayload(e){const t=new FormData(e),r=(new Date).toISOString();return{name:String(t.get("name")||"").trim(),phone:String(t.get("phone")||"").trim(),email:String(t.get("email")||"").trim(),city:String(t.get("city")||"").trim(),guests:String(t.get("guests")||"").trim(),status:"new",message:String(t.get("message")||"").trim(),cta_location:ctaLocation,timestamp:r,...getTrackingParams()}}async function submitLead(e){if(!GOOGLE_SCRIPT_URL.startsWith("https://script.google.com/macros/s/"))throw new Error("__INVALID_RESPONSE__");const ac=typeof AbortController<"u"?new AbortController:null,to=ac?setTimeout(()=>ac.abort(),2e4):null;let t;try{t=await fetch(GOOGLE_SCRIPT_URL,{method:"POST",mode:"cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(e),signal:ac?.signal})}catch(networkErr){throw console.error("Reservation submit: network error",networkErr),new Error(networkErr?.name==="AbortError"?"__TIMEOUT__":"__NETWORK__")}finally{to&&clearTimeout(to)}const raw=await t.text();let r;try{r=JSON.parse(raw)}catch(parseErr){throw console.error("Reservation submit: non-JSON response",t.status,raw.slice(0,500)),new Error("__INVALID_RESPONSE__")}if(r&&r.success===!0)return r;throw console.error("Reservation submit: server reported failure",t.status,r),new Error(r&&(r.message||r.error)||"__SERVER_ERROR__")}document.addEventListener("mouseout",e=>{e.clientY<=0&&showExitModal()}),setTimeout(()=>{window.scrollY>.7*window.innerHeight&&showExitModal()},45e3),closeModal?.addEventListener("click",hideExitModal),exitModal?.addEventListener("click",e=>{e.target===exitModal&&hideExitModal()}),document.getElementById("exitContinue")?.addEventListener("click",hideExitModal),document.addEventListener("click",e=>{const wa=e.target.closest('a[href^="https://wa.me/31625375673"]');if(!wa)return;try{sessionStorage.setItem("voyageWaClicked","1")}catch(t){}if(["hero","sticky","mobile-sticky-wa"].includes(wa.dataset.cta))return;const r={cta_location:wa.dataset.cta||"unknown",page_url:window.location.href,language:window.VH_I18N?.getLang()||document.documentElement.lang||"fr"};trackEvent("Contact",r),trackEvent("WhatsApp_Click",r)}),legalModalTriggers.forEach(e=>{e.addEventListener("click",()=>{openLegalModal(document.getElementById(e.dataset.legalModal),e)})}),legalModals.forEach(e=>{e.addEventListener("click",t=>{(t.target===e||t.target.closest("[data-close-legal]"))&&closeLegalModal(e)})}),document.addEventListener("keydown",e=>{"Escape"===e.key&&(hideLightbox(),hideExitModal(),closeAllLegalModals())}),reservationForm?.addEventListener("input",()=>{formStarted||(formStarted=!0,trackEvent("Reservation_Form_Start",{cta_location:ctaLocation},{once:!0})),clearFieldValidity(reservationForm)}),reservationForm?.addEventListener("submit",async e=>{if(e.preventDefault(),isSubmitting)return;if(!reservationForm.checkValidity())return setFieldValidity(reservationForm),reservationForm.reportValidity(),void setFeedback(window.VH_I18N?.t("form.feedbackRequired")||"Merci de completer les champs obligatoires.","error");const t=reservationForm.querySelector("button[type='submit']"),r=t?.textContent||(window.VH_I18N?.t("common.reserve")||"Reserver ma place"),o=getFormPayload(reservationForm);isSubmitting=!0,t?.setAttribute("disabled","true"),t?.setAttribute("aria-busy","true"),t&&(t.textContent=window.VH_I18N?.t("form.submitting")||"Enregistrement..."),setFeedback(window.VH_I18N?.t("form.feedbackSaving")||"Enregistrement de votre demande...","");try{await submitLead(o),setFeedback(window.VH_I18N?.t("form.feedbackSuccess")||"Votre demande est enregistree. Redirection vers WhatsApp...","success"),trackEvent("Lead",{cta_location:o.cta_location,guests:o.guests},{once:!0}),(()=>{try{sessionStorage.setItem("voyageFormSubmitted","1")}catch(e){}})(),setTimeout(()=>{window.location.href=window.VH_I18N?.getWhatsappUrl()||WHATSAPP_URL},800)}catch(e){isSubmitting=!1;const n=e&&e.message,c=["__NETWORK__","__INVALID_RESPONSE__","__SERVER_ERROR__","__TIMEOUT__"].includes(n),f=window.VH_I18N?.t("form.feedbackError")||"Une erreur est survenue. Merci de reessayer.";setFeedback(!n||c?f:n,"error"),t?.removeAttribute("disabled"),t?.setAttribute("aria-busy","false"),t&&(t.textContent=r)}}),function(){const e=document.getElementById("reservation"),t=document.querySelector(".sticky-reserve");if(!e||!t||!("IntersectionObserver"in window))return;new IntersectionObserver(([e])=>{t.classList.toggle("sticky-hidden",e.isIntersecting)},{threshold:.15}).observe(e)}(),function(){const e=document.querySelectorAll(".accordion-item");if(!e.length)return;const t=window.matchMedia("(prefers-reduced-motion: reduce)").matches;function r(e){const t=e.querySelector(".accordion-header"),r=e.querySelector(".accordion-content");e.classList.remove("open"),t.setAttribute("aria-expanded","false"),r.setAttribute("aria-hidden","true")}e.forEach(function(o){const n=o.querySelector(".accordion-header"),a=o.querySelector(".accordion-content"),i=n.getAttribute("aria-controls");a.setAttribute("id",i),a.setAttribute("aria-hidden","true"),n.setAttribute("aria-expanded","false"),t&&(a.style.transition="none"),n.addEventListener("click",function(){const t=o.classList.contains("open");e.forEach(function(e){e!==o&&r(e)}),t?r(o):function(e){const t=e.querySelector(".accordion-header"),r=e.querySelector(".accordion-content");e.classList.add("open"),t.setAttribute("aria-expanded","true"),r.setAttribute("aria-hidden","false");const qEl=t.querySelector("span:not(.accordion-icon)");trackEvent("FAQ_Open",{question_title:qEl?qEl.textContent.trim():""})}(o)})})}(),function(){"use strict";var e=document.getElementById("album");if(e){var t=e.querySelector(".album-track-wrapper"),r=e.querySelector("#albumTrack"),o=e.querySelector("#albumDots"),n=e.querySelector(".album-prev"),a=e.querySelector(".album-next"),i=e.querySelector(".album-carousel");if(t&&r&&o){var s=Array.from(r.querySelectorAll(".album-slide")),c=s.length;if(0!==c){var l=0,d=null,u=null,m=!1,g=!1;s.forEach(function(e,t){var r=document.createElement("button");r.type="button",r.className="album-dot"+(0===t?" active":""),r.setAttribute("role","tab"),r.setAttribute("aria-label","Image "+(t+1)+" sur "+c),r.setAttribute("aria-selected",String(0===t)),r.addEventListener("click",function(){q(t),_(),T()}),o.appendChild(r)}),n&&n.addEventListener("click",function(){q(l-1),_(),T()}),a&&a.addEventListener("click",function(){q(l+1),_(),T()}),i&&(i.setAttribute("tabindex","0"),i.addEventListener("keydown",function(e){"ArrowLeft"===e.key&&(q(l-1),_(),T(),e.preventDefault()),"ArrowRight"===e.key&&(q(l+1),_(),T(),e.preventDefault())})),i&&(i.addEventListener("mouseenter",function(){m||(clearTimeout(u),_())}),i.addEventListener("mouseleave",function(){m||F()}));var f=0,b=0,h=0;r.style.cursor="grab",r.style.userSelect="none",r.addEventListener("mousedown",function(e){0===e.button&&(m=!0,f=e.clientX,b=100*l,h=l*x(),M(),r.style.cursor="grabbing",clearTimeout(u),_(),e.preventDefault())}),document.addEventListener("mousemove",function(e){if(m){var t=e.clientX-f;r.style.transform=E()?"translateX(calc(-"+b+"% + "+t+"px))":"translateX(-"+(h-t)+"px)"}}),document.addEventListener("mouseup",function(e){if(m){m=!1,r.style.cursor="grab";var t=e.clientX-f,o=.18*x();q(t<-o?l+1:t>o?l-1:l),T()}}),r.addEventListener("dragstart",function(e){e.preventDefault()});var v,y=0,L=0,p=0,S=0,w=null;r.addEventListener("touchstart",function(e){g=!0,y=e.touches[0].clientX,L=e.touches[0].clientY,p=100*l,S=l*x(),w=null,M(),clearTimeout(u),_()},{passive:!0}),r.addEventListener("touchmove",function(e){if(g){var t=e.touches[0].clientX-y,o=e.touches[0].clientY-L;null===w&&(w=Math.abs(t)>Math.abs(o)),w&&(r.style.transform=E()?"translateX(calc(-"+p+"% + "+t+"px))":"translateX(-"+(S-t)+"px)")}},{passive:!0}),r.addEventListener("touchend",function(e){if(g){g=!1;var t=e.changedTouches[0].clientX-y,r=.18*x();q(w?t<-r?l+1:t>r?l-1:l:l),T()}},{passive:!0}),window.addEventListener("resize",function(){clearTimeout(v),v=setTimeout(function(){I(l=A(l),!1),requestAnimationFrame(function(){requestAnimationFrame(k)})},100)}),window.matchMedia("(prefers-reduced-motion: reduce)").matches?M():k(),requestAnimationFrame(function(){r.style.transform="translateX(0)",F()})}}}function E(){return window.innerWidth<768}function x(){return t.offsetWidth||t.getBoundingClientRect().width||600}function A(e){return(e%c+c)%c}function k(){r.style.transition=E()?"transform 0.45s ease":"transform 0.52s cubic-bezier(0.4, 0, 0.2, 1)"}function M(){r.style.transition="none"}function I(e,t){!1===t?M():k(),r.style.transform=E()?"translateX(-"+100*e+"%)":"translateX(-"+e*x()+"px)"}function q(e){var t=A(e);!function(e){var t=o.querySelectorAll(".album-dot");if(!t[l]||!t[e])return;t[l].classList.remove("active"),t[l].setAttribute("aria-selected","false"),t[e].classList.add("active"),t[e].setAttribute("aria-selected","true")}(t),l=t,I(t,!0)}function F(){clearInterval(d),d=setInterval(function(){m||g||q(l+1)},3500)}function _(){clearInterval(d),d=null}function T(){clearTimeout(u),u=setTimeout(F,2e3)}}(),function(){"use strict";var e=document.getElementById("mobileCTABar"),t=document.getElementById("reservationForm"),r=document.getElementById("formFeedback");if(e)if(sessionStorage.getItem("ctaBarDismissed"))e.style.display="none";else{var o=!1,n=!1,a=e.querySelectorAll("a"),i=e.querySelector(".mcb-reserve");i&&t&&i.addEventListener("click",function(e){e.preventDefault();var vhTarget=getReserveTarget();scrollToReserveTarget(vhTarget);if(vhTarget===t){var r=t.querySelector("input, select, textarea");r&&setTimeout(function(){r.focus()},650)}s(!1)}),r&&new MutationObserver(function(){r.classList.contains("is-success")&&(n=!0,sessionStorage.setItem("ctaBarDismissed","1"),s(!1))}).observe(r,{attributes:!0,attributeFilter:["class"]}),window.addEventListener("scroll",c,{passive:!0}),c()}function s(t){t!==o&&(o=t,e.classList.toggle("is-visible",t),e.setAttribute("aria-hidden",String(!t)),a.forEach(function(e){e.setAttribute("tabindex",t?"0":"-1")}))}function c(){s(function(){if(n)return!1;if((window.pageYOffset||window.scrollY)<150)return!1;if(t){var e=t.getBoundingClientRect();if(e.top<window.innerHeight&&e.bottom>0)return!1}return!0}())}}();
!function(){"use strict";
var configs=[
  {grid:".activites-grid",card:".activite-card",label:"Programme"},
  {grid:".value-grid",card:".value-card",label:"Situation"},
  {grid:".inclus-grid",card:".inclus-card",label:"Inclus"},
  {grid:".options-grid",card:".option-card",label:"Option"},
  {grid:".testimonials-grid",card:".testimonial-card",label:"Témoignage"}
];
function isMobile(){return window.innerWidth<768}
var reducedMotion=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
configs.forEach(function(cfg){
  var grid=document.querySelector(cfg.grid);
  if(!grid)return;
  var cards=Array.from(grid.querySelectorAll(cfg.card));
  if(!cards.length)return;
  var wrap=grid.closest(".mobile-carousel");
  var dots=document.createElement("div");
  dots.className="mobile-carousel-dots";
  dots.setAttribute("role","tablist");
  dots.setAttribute("aria-label",cfg.label);
  grid.insertAdjacentElement("afterend",dots);
  cards.forEach(function(card,i){
    var dot=document.createElement("button");
    dot.type="button";
    dot.className="mobile-carousel-dot"+(i===0?" active":"");
    dot.setAttribute("role","tab");
    dot.setAttribute("tabindex","-1");
    dot.setAttribute("aria-label","Élément "+(i+1)+" sur "+cards.length);
    dot.setAttribute("aria-selected",String(i===0));
    dot.addEventListener("click",function(){
      card.scrollIntoView({behavior:"smooth",inline:"start",block:"nearest"});
    });
    dots.appendChild(dot);
  });
  var dotEls=Array.from(dots.children);
  var prevBtn=wrap?wrap.querySelector("[data-carousel-prev]"):null;
  var nextBtn=wrap?wrap.querySelector("[data-carousel-next]"):null;
  var ticking=false;
  function activeIndex(){
    var rect=grid.getBoundingClientRect(),center=rect.left+rect.width/2,closest=0,dist=Infinity;
    cards.forEach(function(card,i){
      var r=card.getBoundingClientRect(),d=Math.abs(r.left+r.width/2-center);
      if(d<dist){dist=d;closest=i}
    });
    return closest;
  }
  function updateArrows(idx){
    if(!prevBtn&&!nextBtn)return;
    if(prevBtn)prevBtn.classList.toggle("is-disabled",idx<=0);
    if(nextBtn)nextBtn.classList.toggle("is-disabled",idx>=cards.length-1);
  }
  function update(){
    ticking=false;
    var idx=activeIndex();
    dotEls.forEach(function(dot,i){
      var active=i===idx;
      dot.classList.toggle("active",active);
      dot.setAttribute("aria-selected",String(active));
    });
    updateArrows(idx);
  }
  grid.addEventListener("scroll",function(){
    if(!ticking){ticking=true;requestAnimationFrame(update)}
  },{passive:true});
  function step(dir){
    var idx=activeIndex(),next=Math.max(0,Math.min(cards.length-1,idx+dir));
    cards[next].scrollIntoView({behavior:"smooth",inline:"start",block:"nearest"});
  }
  if(prevBtn)prevBtn.addEventListener("click",function(){step(-1)});
  if(nextBtn)nextBtn.addEventListener("click",function(){step(1)});
  function syncTabIndex(){
    grid.setAttribute("tabindex",isMobile()?"0":"-1");
  }
  window.addEventListener("resize",syncTabIndex);
  syncTabIndex();
  if(reducedMotion)updateArrows(0);else update();
});
}();
!function(){"use strict";
var toggle=document.getElementById("mobileMenuToggle");
var menu=document.getElementById("mobileMenu");
if(!toggle||!menu)return;
function closeMenu(){
  if(!toggle.classList.contains("open"))return;
  toggle.classList.remove("open");
  toggle.setAttribute("aria-expanded","false");
  menu.classList.remove("open");
  menu.setAttribute("aria-hidden","true");
  syncModalOpenState();
}
function openMenu(){
  toggle.classList.add("open");
  toggle.setAttribute("aria-expanded","true");
  menu.classList.add("open");
  menu.setAttribute("aria-hidden","false");
  syncModalOpenState();
}
toggle.addEventListener("click",function(){
  toggle.classList.contains("open")?closeMenu():openMenu();
});
menu.querySelectorAll("a, .lang-btn").forEach(function(el){
  el.addEventListener("click",closeMenu);
});
document.addEventListener("keydown",function(e){
  if(e.key==="Escape")closeMenu();
});
document.addEventListener("click",function(e){
  if(!toggle.classList.contains("open"))return;
  if(menu.contains(e.target)||toggle.contains(e.target))return;
  closeMenu();
});
window.addEventListener("resize",function(){
  if(window.innerWidth>=768)closeMenu();
});
}();

/* ── "Réserver ma place" CTA routing: reservation section vs. reservation form ── */
function getReserveTarget(){
  var section=document.getElementById("reservation");
  var form=document.getElementById("reservationForm");
  if(!section)return form;
  var rect=section.getBoundingClientRect();
  return rect.top<=130?(form||section):section;
}
function scrollToReserveTarget(el){
  if(!el)return;
  var reduced=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({behavior:reduced?"auto":"smooth",block:"start"});
}
document.addEventListener("click",function(e){
  var link=e.target.closest('a[data-i18n="common.reserve"]');
  if(!link||link.classList.contains("mcb-reserve"))return;
  var href=link.getAttribute("href")||"";
  if(href.indexOf("#reservation")!==0)return;
  e.preventDefault();
  scrollToReserveTarget(getReserveTarget());
});

/* ── AUDIO TESTIMONIALS: single playback + Meta Pixel tracking ── */
!function(){"use strict";
var players=Array.from(document.querySelectorAll(".testimonial-player"));
if(!players.length)return;
players.forEach(function(audio){
  audio.addEventListener("play",function(){
    players.forEach(function(other){
      if(other!==audio&&!other.paused)other.pause();
    });
    trackEvent("Audio_Testimonial_Play",{
      audio_number:audio.dataset.audioNumber||"",
      audio_duration:audio.dataset.duration||"",
      language:window.VH_I18N?.getLang()||document.documentElement.lang||"fr"
    },{once:!0});
  });
});
}();

/* ── WRITTEN TESTIMONIALS: single-slide carousel ── */
!function(){"use strict";
var track=document.getElementById("writtenTrack");
var dotsWrap=document.getElementById("writtenDots");
if(!track||!dotsWrap)return;
var slides=Array.from(track.querySelectorAll(".written-slide"));
if(!slides.length)return;
var prevBtn=document.querySelector("[data-written-prev]");
var nextBtn=document.querySelector("[data-written-next]");
var reducedMotion=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var index=0,autoplayTimer=null,resumeTimer=null;

slides.forEach(function(_,i){
  var dot=document.createElement("button");
  dot.type="button";
  dot.className="written-dot"+(i===0?" active":"");
  dot.setAttribute("role","tab");
  dot.setAttribute("aria-label","Témoignage "+(i+1)+" sur "+slides.length);
  dot.setAttribute("aria-selected",String(i===0));
  dot.addEventListener("click",function(){goTo(i);pauseThenResume()});
  dotsWrap.appendChild(dot);
});
var dotEls=Array.from(dotsWrap.children);

function render(){
  track.style.transition=reducedMotion?"none":"";
  track.style.transform="translateX(-"+index*100+"%)";
  dotEls.forEach(function(dot,i){
    var active=i===index;
    dot.classList.toggle("active",active);
    dot.setAttribute("aria-selected",String(active));
  });
}
function goTo(i){
  index=((i%slides.length)+slides.length)%slides.length;
  render();
}
function next(){goTo(index+1)}
function prev(){goTo(index-1)}
function stopAutoplay(){clearInterval(autoplayTimer);autoplayTimer=null}
function startAutoplay(){
  if(reducedMotion)return;
  stopAutoplay();
  autoplayTimer=setInterval(next,6000);
}
function pauseThenResume(){
  stopAutoplay();
  clearTimeout(resumeTimer);
  resumeTimer=setTimeout(startAutoplay,8000);
}

prevBtn&&prevBtn.addEventListener("click",function(){prev();pauseThenResume()});
nextBtn&&nextBtn.addEventListener("click",function(){next();pauseThenResume()});

var slider=track.closest(".written-slider");
if(slider){
  slider.addEventListener("mouseenter",stopAutoplay);
  slider.addEventListener("mouseleave",startAutoplay);
  slider.addEventListener("focusin",stopAutoplay);
  slider.addEventListener("focusout",startAutoplay);
}

var touchStartX=0,touchDeltaX=0,touching=false;
track.addEventListener("touchstart",function(e){
  touching=true;
  touchStartX=e.touches[0].clientX;
  touchDeltaX=0;
  stopAutoplay();
},{passive:true});
track.addEventListener("touchmove",function(e){
  if(!touching)return;
  touchDeltaX=e.touches[0].clientX-touchStartX;
},{passive:true});
track.addEventListener("touchend",function(){
  if(!touching)return;
  touching=false;
  var threshold=40;
  if(touchDeltaX<-threshold)next();
  else if(touchDeltaX>threshold)prev();
  pauseThenResume();
});

window.addEventListener("resize",render);
render();
startAutoplay();
}();
