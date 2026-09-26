// NovaTalk AI landing page — vanilla JS only, no build step (file:// friendly).

(function () {
  'use strict';

  /* Sticky navbar shadow on scroll */
  var navbar = document.getElementById('navbar');
  var backToTop = document.getElementById('backToTop');

  function onScroll() {
    var scrolled = window.scrollY > 12;
    navbar.classList.toggle('scrolled', scrolled);
    backToTop.classList.toggle('visible', window.scrollY > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* Mobile nav toggle */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('mobile-open');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  var navAnchors = navLinks.querySelectorAll('a');
  for (var i = 0; i < navAnchors.length; i++) {
    navAnchors[i].addEventListener('click', function () {
      navLinks.classList.remove('mobile-open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  }

  /* Scroll-reveal animation */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* Animated stat counters */
  var statEls = document.querySelectorAll('.stat-num');
  var countersStarted = false;

  function animateCounters() {
    if (countersStarted) { return; }
    countersStarted = true;

    statEls.forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var decimals = parseInt(el.getAttribute('data-decimal') || '0', 10);
      var duration = 1400;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) { startTime = timestamp; }
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = target * eased;
        el.textContent = decimals > 0 ? current.toFixed(decimals) : Math.floor(current).toLocaleString('en-US');
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = decimals > 0 ? target.toFixed(decimals) : target.toLocaleString('en-US');
        }
      }
      requestAnimationFrame(step);
    });
  }

  var heroStats = document.querySelector('.hero-stats');
  if (heroStats && 'IntersectionObserver' in window) {
    var statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.4 });
    statsObserver.observe(heroStats);
  } else {
    animateCounters();
  }

  /* Pricing monthly/yearly toggle */
  var billingSwitch = document.getElementById('billingSwitch');
  var labelMonthly = document.getElementById('labelMonthly');
  var labelYearly = document.getElementById('labelYearly');
  var amounts = document.querySelectorAll('.amount');

  billingSwitch.addEventListener('click', function () {
    var isYearly = billingSwitch.getAttribute('aria-checked') !== 'true';
    billingSwitch.setAttribute('aria-checked', isYearly ? 'true' : 'false');
    labelMonthly.classList.toggle('active', !isYearly);
    labelYearly.classList.toggle('active', isYearly);

    amounts.forEach(function (el) {
      var monthly = el.getAttribute('data-monthly');
      var yearly = el.getAttribute('data-yearly');
      var value = isYearly ? yearly : monthly;
      el.textContent = '฿' + Number(value).toLocaleString('en-US');
    });
  });

  /* FAQ accordion */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var q = item.querySelector('.faq-q');
    q.addEventListener('click', function () {
      var wasOpen = item.classList.contains('open');
      faqItems.forEach(function (other) { other.classList.remove('open'); });
      if (!wasOpen) { item.classList.add('open'); }
    });
  });

  /* Newsletter form (demo only — no backend) */
  var newsletterForm = document.getElementById('newsletterForm');
  var newsletterMsg = document.getElementById('newsletterMsg');

  newsletterForm.addEventListener('submit', function (e) {
    e.preventDefault();
    newsletterMsg.textContent = '✓ ขอบคุณที่สมัครรับข่าวสาร!';
    newsletterForm.reset();
    setTimeout(function () { newsletterMsg.textContent = ''; }, 4000);
  });

})();
