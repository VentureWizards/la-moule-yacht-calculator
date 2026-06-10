/*
  La Moule Yacht – Angebotsrechner
  Baut sich selbst in <div id="price-calculator-root"></div> ein.
  Zusammen mit lamoule-rechner.css einbinden.

  Preise und Regeln: siehe priceConfig weiter unten.
  EmailJS-Zugangsdaten: siehe EMAILJS_* Konstanten.
*/
(function(){
  "use strict";

  /* ===========================================
     EMAILJS KONFIGURATION
     =========================================== */
  var EMAILJS_PUBLIC_KEY  = "5tVukYvOy-2gTUy9O";
  var EMAILJS_SERVICE_ID  = "service_evlu4xg";
  var EMAILJS_TEMPLATE_ID = "template_46453g4";

  /* ===========================================
     PREISKONFIGURATION
     -> Preise hier zentral anpassen
     =========================================== */
  var priceConfig = {
    boatPerHourHighSeason: 450,        // Bootsmiete pro Stunde – Hauptsaison Mai bis Oktober (€)
    boatPerHourLowSeason: 250,         // Bootsmiete pro Stunde – Nebensaison November bis April (€)
    drinksPerPersonPerHour: 10,        // Getränkepauschale pro Person pro Stunde (€)
    cateringBBQPerPerson: 55,          // BBQ-Catering pro Person (€)
    cateringFingerfoodPerPerson: 38,   // Gehobenes Fingerfood pro Person (€)
    cleaningFee: 150,                  // Reinigungspauschale, fix (€)
    servicePerHour: 27,                // Service-Personal pro Kraft pro Stunde (€)
    serviceExtraHours: 2,              // immer +1h Vorbereitung und +1h Nachbereitung
    secondServiceFromPersons: 20,      // ab dieser Gästezahl ist eine 2. Servicekraft Pflicht
    minBookingHours: 4                 // Mindestbuchung in Stunden
  };

  var occasionLabels = {
    wedding: "Hochzeit",
    birthday: "Geburtstag",
    companyevent: "Firmenevent",
    jga: "JGA",
    babyshower: "Baby Shower",
    other: "Andere"
  };

  var cateringLabels = {
    bbq: "BBQ",
    fingerfood: "Gehobenes Fingerfood"
  };

  /* ===========================================
     MARKUP – wird in #price-calculator-root eingesetzt
     =========================================== */
  var MARKUP = ''
  + '<div class="calc-layout">'
  +   '<div class="calc-left">'

  +     '<section data-step="0">'
  +       '<h2 class="calc-title">Für welchen Anlass?</h2>'
  +       '<div class="calc-options" data-field="occasion">'
  +         '<button type="button" class="calc-option" data-value="wedding">Hochzeit</button>'
  +         '<button type="button" class="calc-option" data-value="birthday">Geburtstag</button>'
  +         '<button type="button" class="calc-option" data-value="companyevent">Firmenevent</button>'
  +         '<button type="button" class="calc-option" data-value="jga">JGA</button>'
  +         '<button type="button" class="calc-option" data-value="babyshower">Baby Shower</button>'
  +         '<button type="button" class="calc-option" data-value="other">Andere</button>'
  +       '</div>'
  +     '</section>'

  +     '<section data-step="1" class="calc-hidden">'
  +       '<h2 class="calc-title">Wann willst du das<br/>Eventboot buchen?</h2>'
  +       '<label class="calc-label" for="calc-date">Datum</label>'
  +       '<input type="date" id="calc-date" class="calc-input" />'
  +       '<span class="calc-label">Uhrzeit</span>'
  +       '<div class="calc-slider" id="time-slider">'
  +         '<div class="track"></div>'
  +         '<div class="fill" id="time-fill"></div>'
  +         '<input type="range" id="calc-time-from" min="9" max="22" step="1" value="12" />'
  +         '<input type="range" id="calc-time-until" min="9" max="22" step="1" value="16" />'
  +       '</div>'
  +       '<div class="calc-slider-values">'
  +         '<span id="time-from-label">12 Uhr</span>'
  +         '<span id="time-until-label">16 Uhr</span>'
  +       '</div>'
  +     '</section>'

  +     '<section data-step="2" class="calc-hidden">'
  +       '<h2 class="calc-title">Für wie viele Personen?</h2>'
  +       '<span class="calc-label">Personen</span>'
  +       '<div class="calc-slider" id="persons-slider">'
  +         '<div class="track"></div>'
  +         '<div class="fill" id="persons-fill"></div>'
  +         '<input type="range" id="calc-persons" min="10" max="45" step="1" value="10" />'
  +       '</div>'
  +       '<div class="calc-slider-values single">'
  +         '<span id="persons-label">10 Personen</span>'
  +       '</div>'
  +     '</section>'

  +     '<section data-step="3" class="calc-hidden">'
  +       '<h2 class="calc-title">Catering dazu buchen?</h2>'
  +       '<p class="calc-intro">Für jedes Event bieten wir standardmäßig eine Getränkepauschale. Möchtest Du auch ein Catering dazu buchen?</p>'
  +       '<div class="calc-options" data-field="catering">'
  +         '<button type="button" class="calc-option pill" data-value="no">Nein</button>'
  +         '<button type="button" class="calc-option pill" data-value="yes">Ja</button>'
  +       '</div>'
  +     '</section>'

  +     '<section data-step="4" class="calc-hidden">'
  +       '<h2 class="calc-title">Welche Art von Catering<br/>möchtest du dazu buchen?</h2>'
  +       '<div class="calc-options" data-field="cateringType">'
  +         '<button type="button" class="calc-option wide" data-value="bbq">BBQ</button>'
  +         '<button type="button" class="calc-option wide" data-value="fingerfood">Gehobenes Fingerfood</button>'
  +       '</div>'
  +     '</section>'

  +     '<section data-step="5" class="calc-hidden">'
  +       '<h2 class="calc-title">Deine Angaben</h2>'
  +       '<div class="calc-form">'
  +         '<input type="text" id="calc-name" class="calc-input" placeholder="Vor- / Nachname" />'
  +         '<input type="email" id="calc-email" class="calc-input" placeholder="E-Mail Adresse" />'
  +         '<input type="tel" id="calc-phone" class="calc-input" placeholder="Telefonnummer" />'
  +         '<input type="text" id="calc-company" class="calc-input" placeholder="Firmenname (Optional)" />'
  +         '<input type="text" id="calc-wishes" class="calc-input" placeholder="Sonderwünsche (Optional)" />'
  +       '</div>'
  +       '<div id="calc-toast"></div>'
  +     '</section>'

  +     '<div class="calc-nav">'
  +       '<button type="button" class="calc-btn prev" id="calc-prev">Zurück</button>'
  +       '<button type="button" class="calc-btn next" id="calc-next">Weiter</button>'
  +       '<button type="button" class="calc-btn next calc-hidden" id="calc-submit" disabled>Jetzt anfragen</button>'
  +     '</div>'

  +   '</div>'
  +   '<div class="calc-divider"></div>'
  +   '<div class="calc-right">'
  +     '<h2 class="calc-right-title">Dein vorrausichtlicher Preis:</h2>'
  +     '<div id="calc-summary"></div>'
  +     '<div class="calc-total">'
  +       '<div class="big" id="calc-total-big">0€</div>'
  +       '<div class="pp" id="calc-total-pp">Preis p.P. 0€</div>'
  +       '<div class="vat">zzgl. MwSt.</div>'
  +     '</div>'
  +   '</div>'
  + '</div>';

  /* ===========================================
     INITIALISIERUNG
     =========================================== */
  function init(){
    var root = document.getElementById("price-calculator-root");
    if (!root) return;
    root.innerHTML = MARKUP;

    // EmailJS-SDK nachladen, falls noch nicht vorhanden
    if (!window.emailjs) {
      var s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
      s.onload = function(){ window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY }); };
      document.head.appendChild(s);
    } else {
      window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    }

    /* --- State (Standardwerte wie im Original) --- */
    var state = {
      occasion: null,
      date: null,
      timeFrom: 12,
      timeUntil: 16,
      persons: 10,
      catering: null,
      cateringType: null
    };

    var step = 0;
    var maxStep = 5;

    var sections = root.querySelectorAll("[data-step]");
    var btnPrev = root.querySelector("#calc-prev");
    var btnNext = root.querySelector("#calc-next");
    var btnSubmit = root.querySelector("#calc-submit");
    var toastEl = root.querySelector("#calc-toast");

    function showStep(i){
      sections.forEach(function(s){
        s.classList.toggle("calc-hidden", parseInt(s.dataset.step,10) !== i);
      });
      btnNext.classList.toggle("calc-hidden", i === maxStep);
      btnSubmit.classList.toggle("calc-hidden", i !== maxStep);
      btnPrev.disabled = (i === 0);
      updateNextEnabled();
    }

    function canProceed(i){
      switch(i){
        case 0: return !!state.occasion;
        case 1: return !!state.date;
        case 2: return state.persons >= 10;
        case 3: return state.catering !== null;
        case 4: return !!state.cateringType;
        default: return true;
      }
    }

    function updateNextEnabled(){
      btnNext.disabled = !canProceed(step);
    }

    /* --- Schritt 0: Anlass --- */
    root.querySelectorAll('[data-field="occasion"] .calc-option').forEach(function(btn){
      btn.addEventListener("click", function(){
        state.occasion = btn.dataset.value;
        root.querySelectorAll('[data-field="occasion"] .calc-option').forEach(function(b){
          b.classList.toggle("selected", b === btn);
        });
        updateNextEnabled();
      });
    });

    /* --- Schritt 1: Datum + Uhrzeit-Slider --- */
    var dateInput = root.querySelector("#calc-date");
    dateInput.addEventListener("change", function(){
      state.date = dateInput.value || null;
      updateNextEnabled();
      renderSummary();
    });

    var fromInput = root.querySelector("#calc-time-from");
    var untilInput = root.querySelector("#calc-time-until");
    var timeFill = root.querySelector("#time-fill");
    var fromLabel = root.querySelector("#time-from-label");
    var untilLabel = root.querySelector("#time-until-label");

    function pct(v, min, max){ return ((v - min) / (max - min)) * 100; }

    function updateTimeSlider(){
      var min = 9, max = 22;
      var p1 = pct(state.timeFrom, min, max);
      var p2 = pct(state.timeUntil, min, max);
      timeFill.style.left = p1 + "%";
      timeFill.style.width = (p2 - p1) + "%";
      fromLabel.textContent = state.timeFrom + " Uhr";
      untilLabel.textContent = state.timeUntil + " Uhr";
    }

    fromInput.addEventListener("input", function(){
      var v = parseInt(fromInput.value, 10);
      if (v > state.timeUntil - priceConfig.minBookingHours) {
        v = state.timeUntil - priceConfig.minBookingHours;
        fromInput.value = v;
      }
      state.timeFrom = v;
      updateTimeSlider();
      renderSummary();
    });

    untilInput.addEventListener("input", function(){
      var v = parseInt(untilInput.value, 10);
      if (v < state.timeFrom + priceConfig.minBookingHours) {
        v = state.timeFrom + priceConfig.minBookingHours;
        untilInput.value = v;
      }
      state.timeUntil = v;
      updateTimeSlider();
      renderSummary();
    });

    /* --- Schritt 2: Personen-Slider --- */
    var personsInput = root.querySelector("#calc-persons");
    var personsFill = root.querySelector("#persons-fill");
    var personsLabel = root.querySelector("#persons-label");

    function updatePersonsSlider(){
      personsFill.style.left = "0%";
      personsFill.style.width = pct(state.persons, 10, 45) + "%";
      personsLabel.textContent = state.persons + " Personen";
    }

    personsInput.addEventListener("input", function(){
      state.persons = parseInt(personsInput.value, 10);
      updatePersonsSlider();
      updateNextEnabled();
      renderSummary();
    });

    /* --- Schritt 3: Catering ja/nein --- */
    root.querySelectorAll('[data-field="catering"] .calc-option').forEach(function(btn){
      btn.addEventListener("click", function(){
        state.catering = btn.dataset.value === "yes";
        if (!state.catering) {
          state.cateringType = null;
          root.querySelectorAll('[data-field="cateringType"] .calc-option').forEach(function(b){
            b.classList.remove("selected");
          });
        }
        root.querySelectorAll('[data-field="catering"] .calc-option').forEach(function(b){
          b.classList.toggle("selected", b === btn);
        });
        updateNextEnabled();
        renderSummary();
      });
    });

    /* --- Schritt 4: Catering-Art --- */
    root.querySelectorAll('[data-field="cateringType"] .calc-option').forEach(function(btn){
      btn.addEventListener("click", function(){
        state.cateringType = btn.dataset.value;
        root.querySelectorAll('[data-field="cateringType"] .calc-option').forEach(function(b){
          b.classList.toggle("selected", b === btn);
        });
        updateNextEnabled();
        renderSummary();
      });
    });

    /* ===========================================
       PREISBERECHNUNG
       =========================================== */
    function getHours(){
      return Math.max(0, state.timeUntil - state.timeFrom);
    }

    function isHighSeason(){
      // Hauptsaison: Mai (Monat 4) bis Oktober (Monat 9); ohne Datum gilt Hauptsaison
      if (!state.date) return true;
      var month = new Date(state.date).getMonth();
      return month >= 4 && month <= 9;
    }

    function getBoatPerHour(){
      return isHighSeason()
        ? priceConfig.boatPerHourHighSeason
        : priceConfig.boatPerHourLowSeason;
    }

    function getCateringPricePerPerson(){
      if (!state.catering || !state.cateringType) return 0;
      return state.cateringType === "bbq"
        ? priceConfig.cateringBBQPerPerson
        : priceConfig.cateringFingerfoodPerPerson;
    }

    function getServiceStaffCount(){
      return state.persons >= priceConfig.secondServiceFromPersons ? 2 : 1;
    }

    function calculatePrice(){
      var h = getHours();
      var persons = state.persons || 0;
      var serviceHours = h + priceConfig.serviceExtraHours; // Eventdauer + 1h Vor- + 1h Nachbereitung
      var staffCount = getServiceStaffCount();

      var result = {
        rent:     h * getBoatPerHour(),
        drinks:   h * persons * priceConfig.drinksPerPersonPerHour,
        catering: persons * getCateringPricePerPerson(),
        service:  staffCount * serviceHours * priceConfig.servicePerHour,
        cleaning: priceConfig.cleaningFee,
        serviceHours: serviceHours,
        staffCount: staffCount
      };

      result.total = result.rent + result.drinks + result.catering + result.service + result.cleaning;

      return result;
    }

    /* ===========================================
       LIVE-PREISÜBERSICHT
       =========================================== */
    function renderSummary(){
      var h = getHours();
      var prices = calculatePrice();
      var persons = state.persons || 0;

      var cateringLabel = state.cateringType
        ? cateringLabels[state.cateringType] + " Catering für " + persons + " Personen"
        : "Catering für " + persons + " Personen";

      var rows = [
        // Posten mit Euro-Preisen
        { label: "Miete für Bootsfahrt " + h + "h", value: prices.rent + "€" },
        { label: prices.staffCount + "x Service-Personal für " + prices.serviceHours + "h (inkl. Vor- u. Nachbereitung)", value: prices.service + "€" },
        { label: "Getränkepauschale für " + persons + " Personen", value: prices.drinks + "€" },
        { label: cateringLabel, value: prices.catering + "€" },
        { label: "Reinigungspauschale", value: prices.cleaning + "€" },
        // Inklusive-Leistungen
        { label: "Bootsfahrt für " + h + "h", value: "inklusive" },
        { label: "Möbel – Lounge, Tische und Stühle", value: "inklusive" },
        { label: "Musikanlage", value: "inklusive" },
        { label: "Sonderwünsche", value: "nach Absprache" }
      ];

      root.querySelector("#calc-summary").innerHTML = rows.map(function(r){
        return '<div class="calc-summary-row"><span>' + r.label + '</span><span class="val">' + r.value + '</span></div>';
      }).join("");

      root.querySelector("#calc-total-big").textContent = prices.total.toLocaleString("de-DE") + "€";
      root.querySelector("#calc-total-pp").textContent =
        "Preis p.P. " + (persons > 0 ? Math.round(prices.total / persons) : 0) + "€";
    }

    /* ===========================================
       NAVIGATION
       =========================================== */
    btnNext.addEventListener("click", function(){
      if (!canProceed(step)) return;
      step = Math.min(step + 1, maxStep);
      // Schritt 4 (Catering-Art) überspringen, wenn kein Catering gewünscht
      if (step === 4 && !state.catering) step = 5;
      showStep(step);
    });

    btnPrev.addEventListener("click", function(){
      step = Math.max(step - 1, 0);
      if (step === 4 && !state.catering) step = 3;
      showStep(step);
    });

    /* ===========================================
       ABSENDEN (EmailJS)
       =========================================== */
    var nameInput = root.querySelector("#calc-name");
    var emailInput = root.querySelector("#calc-email");

    function updateSubmitEnabled(){
      btnSubmit.disabled = !(nameInput.value.trim() && emailInput.value.trim());
    }
    nameInput.addEventListener("input", updateSubmitEnabled);
    emailInput.addEventListener("input", updateSubmitEnabled);

    btnSubmit.addEventListener("click", function(){
      toastEl.innerHTML = "";

      var prices = calculatePrice();
      var dateLabel = state.date
        ? new Date(state.date).toLocaleDateString("de-DE", { dateStyle: "long" })
        : "";

      var templateParams = {
        occasion: state.occasion ? occasionLabels[state.occasion] : "",
        on_date: dateLabel,
        from_time: state.timeFrom + ":00",
        until_time: state.timeUntil + ":00",
        persons: state.persons,
        catering: state.catering ? "Ja – " + cateringLabels[state.cateringType] : "Nein",
        service_staff: prices.staffCount + "x Servicekraft für " + prices.serviceHours + "h",
        price_rent: prices.rent,
        price_drinks: prices.drinks,
        price_catering: prices.catering,
        price_service: prices.service,
        price_cleaning: prices.cleaning,
        price_total: prices.total,
        sender_name: nameInput.value.trim(),
        sender_email: emailInput.value.trim(),
        sender_phone: root.querySelector("#calc-phone").value.trim(),
        sender_company: root.querySelector("#calc-company").value.trim(),
        sender_specialwishes: root.querySelector("#calc-wishes").value.trim()
      };

      btnSubmit.disabled = true;
      btnSubmit.textContent = "Wird gesendet …";

      if (!window.emailjs) {
        toastEl.innerHTML = '<div class="calc-toast error">Der Versand-Dienst konnte nicht geladen werden. Bitte Seite neu laden.</div>';
        btnSubmit.disabled = false;
        btnSubmit.textContent = "Jetzt anfragen";
        return;
      }

      window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(function(){
          toastEl.innerHTML = '<div class="calc-toast success">Vielen Dank! Deine Anfrage wurde versendet – wir melden uns in Kürze bei dir.</div>';
          btnSubmit.disabled = false;
          btnSubmit.textContent = "Jetzt anfragen";
        })
        .catch(function(err){
          console.error(err);
          toastEl.innerHTML = '<div class="calc-toast error">Beim Versenden ist ein Fehler aufgetreten. Bitte versuche es später erneut.</div>';
          btnSubmit.disabled = false;
          btnSubmit.textContent = "Jetzt anfragen";
        });
    });

    /* --- Start --- */
    updateTimeSlider();
    updatePersonsSlider();
    renderSummary();
    showStep(step);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
