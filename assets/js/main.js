/* Portfolio hub — the only JS on the page.
   Sticky-nav state, scroll reveals, and the copyright year. No dependencies. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // --- sticky nav ---------------------------------------------------------
  var nav = document.querySelector(".nav");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("is-stuck", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // --- reveal on scroll ----------------------------------------------------
  var targets = document.querySelectorAll(
    ".card, .list li, .cta, .about__col, .section__head",
  );
  if (reduceMotion || !("IntersectionObserver" in window)) {
    targets.forEach(function (el) {
      el.classList.add("is-in");
    });
  } else {
    targets.forEach(function (el) {
      el.classList.add("reveal");
    });
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    targets.forEach(function (el) {
      io.observe(el);
    });
  }

  // --- footer year ---------------------------------------------------------
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
