/**
 * ADITI GUPTA - PORTFOLIO INTERACTIVE & ANIMATION ENGINE
 * Hardware ⇄ Software Dual-Track Portfolio
 */

(function () {
  'use strict';

  // Wait until DOM is ready
  document.addEventListener('DOMContentLoaded', function () {
    initHeroCanvas();
    initScrollReveal();
    initTrackSwitcher();
    initMobileNav();
    initResumeDropdown();
    initContactForm();
  });

  /* ==========================================================================
     1. HERO CANVAS - SIGNAL WAVE & NEURAL NETWORK NODES ANIMATION
     ========================================================================== */
  function initHeroCanvas() {
    var canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var width = 0;
    var height = 0;
    var animationFrameId = null;
    var step = 0;

    // Node particles for software track feel
    var nodes = [];
    var nodeCount = 35;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = canvas.parentElement ? canvas.parentElement.offsetHeight : window.innerHeight;
      initNodes();
    }

    function initNodes() {
      nodes = [];
      for (var i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 2 + 1,
          alpha: Math.random() * 0.5 + 0.2
        });
      }
    }

    function drawWave() {
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = 1.5;

      var gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, 'rgba(193, 122, 61, 0.4)'); // Copper
      gradient.addColorStop(0.5, 'rgba(230, 167, 95, 0.6)');
      gradient.addColorStop(1, 'rgba(63, 174, 100, 0.4)'); // Eco

      ctx.strokeStyle = gradient;

      var frequency = 0.008;
      var amplitude = 35;
      var centerY = height * 0.45;

      for (var x = 0; x < width; x += 3) {
        var y = centerY + Math.sin(x * frequency + step) * amplitude + Math.cos(x * 0.003 - step * 0.5) * 15;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.restore();
    }

    function drawNodes() {
      ctx.save();
      for (var i = 0; i < nodes.length; i++) {
        var p = nodes[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(111, 226, 143, ' + p.alpha + ')';
        ctx.fill();

        // Connect nearby nodes with vector lines
        for (var j = i + 1; j < nodes.length; j++) {
          var p2 = nodes[j];
          var dx = p.x - p2.x;
          var dy = p.y - p2.y;
          var dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            var lineAlpha = (1 - dist / 130) * 0.15;
            ctx.strokeStyle = 'rgba(63, 174, 100, ' + lineAlpha + ')';
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      ctx.restore();
    }

    function render() {
      ctx.clearRect(0, 0, width, height);
      step += 0.015;
      drawWave();
      drawNodes();
      animationFrameId = requestAnimationFrame(render);
    }

    window.addEventListener('resize', resize);
    resize();
    render();
  }

  /* ==========================================================================
     2. SCROLL REVEAL ANIMATIONS
     ========================================================================== */
  function initScrollReveal() {
    var targets = document.querySelectorAll(
      '.hero-title, .hero-sub, .hero-cta, .resume-hero-bar, .track-head, .diagram-panel, .case-study, .xp-item, .proj-card, .skill-grid, .flat-item, .spec-card'
    );

    targets.forEach(function (el) {
      el.classList.add('reveal-on-scroll');
    });

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
      );

      targets.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      // Fallback for older browsers
      targets.forEach(function (el) {
        el.classList.add('revealed');
      });
    }
  }

  /* ==========================================================================
     3. TRACK SWITCHER & NAV ACTIVE STATE
     ========================================================================== */
  function initTrackSwitcher() {
    var btnHw = document.getElementById('btnHw');
    var btnSw = document.getElementById('btnSw');
    var hw = document.getElementById('hardware');
    var sw = document.getElementById('software');

    if (!btnHw || !btnSw || !hw || !sw) return;

    btnHw.addEventListener('click', function () {
      hw.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    btnSw.addEventListener('click', function () {
      sw.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    if ('IntersectionObserver' in window) {
      var trackObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var isHw = entry.target === hw;
              btnHw.classList.toggle('active', isHw);
              btnHw.setAttribute('aria-selected', isHw ? 'true' : 'false');
              btnSw.classList.toggle('active', !isHw);
              btnSw.setAttribute('aria-selected', !isHw ? 'true' : 'false');
            }
          });
        },
        { rootMargin: '-45% 0px -50% 0px' }
      );

      trackObserver.observe(hw);
      trackObserver.observe(sw);
    }
  }

  /* ==========================================================================
     4. MOBILE NAVIGATION DRAWER
     ========================================================================== */
  function initMobileNav() {
    var menuToggle = document.getElementById('menuToggle');
    var navLinks = document.getElementById('navLinks');

    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ==========================================================================
     5. RESUME DROPDOWN MENU
     ========================================================================== */
  function initResumeDropdown() {
    var resumeBtn = document.getElementById('resumeDropdownBtn');
    var resumeMenu = document.getElementById('resumeDropdownMenu');

    if (!resumeBtn || !resumeMenu) return;

    resumeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var expanded = resumeMenu.classList.toggle('show');
      resumeBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });

    document.addEventListener('click', function (e) {
      if (!resumeBtn.contains(e.target) && !resumeMenu.contains(e.target)) {
        resumeMenu.classList.remove('show');
        resumeBtn.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && resumeMenu.classList.contains('show')) {
        resumeMenu.classList.remove('show');
        resumeBtn.setAttribute('aria-expanded', 'false');
        resumeBtn.focus();
      }
    });
  }

  /* ==========================================================================
     6. CONTACT FORM CONTROLLER
     ========================================================================== */
  function initContactForm() {
    var contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    var statusEl = document.getElementById('cfStatus');
    var submitBtn = document.getElementById('cfSubmit');

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Check honeypot field
      var honeypot = document.getElementById('cf-company');
      if (honeypot && honeypot.value) {
        return; // Anti-spam bot trap
      }

      var nameVal = document.getElementById('cf-name').value.trim();
      var emailVal = document.getElementById('cf-email').value.trim();
      var messageVal = document.getElementById('cf-message').value.trim();

      if (!nameVal || !emailVal || !messageVal) {
        statusEl.textContent = 'Please fill in all required fields.';
        statusEl.className = 'cf-status err';
        return;
      }

      submitBtn.disabled = true;
      statusEl.textContent = 'Sending message…';
      statusEl.className = 'cf-status';

      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nameVal, email: emailVal, message: messageVal })
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Network error');
          return res.json();
        })
        .then(function () {
          statusEl.textContent = 'Message sent successfully — thank you!';
          statusEl.className = 'cf-status ok';
          contactForm.reset();
        })
        .catch(function () {
          statusEl.textContent = 'Something went wrong — please email ag0484363@gmail.com directly.';
          statusEl.className = 'cf-status err';
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
    });
  }
})();
