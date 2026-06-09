/* ============================================================
   AYKHAN.NET — SHARED SHELL
   Injects the site nav + footer and wires the theme toggle, so every
   inner page matches the landing page. Self-locating: derives the repo
   root from this script's own src, so it works at any folder depth.
   Pair with home/css/site.css. Vanilla JS, no dependencies.
   ============================================================ */
(function () {
  var src = (document.currentScript && document.currentScript.src) || '';
  var base = src.replace(/home\/js\/shell\.js.*$/, ''); // absolute URL of repo root, trailing slash

  var logo = base + 'home/img/logo.svg';
  var home = base; // root index

  var nav = document.createElement('nav');
  nav.className = 'site-nav';
  nav.innerHTML =
    '<div class="wrap site-nav__inner">' +
      '<a class="brand" href="' + home + '">' +
        '<img src="' + logo + '" alt="Aykhan Ahmadzada logo" />' +
        '<span>aykhan.net</span>' +
      '</a>' +
      '<div class="nav-right">' +
        '<div class="nav-links">' +
          '<a href="' + home + '#journey-overview">Journey</a>' +
          '<a href="' + home + '#achievements">Achievements</a>' +
          '<a href="' + home + '#discover-more">Discover More</a>' +
        '</div>' +
        '<button class="theme-toggle" id="themeToggle" type="button" aria-label="Toggle dark / light mode">' +
          '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" /></svg>' +
          '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>' +
        '</button>' +
      '</div>' +
    '</div>';

  var footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML =
    '<div class="wrap site-footer__inner">' +
      '<a class="brand" href="' + home + '">' +
        '<img src="' + logo + '" alt="Aykhan Ahmadzada logo" />' +
        '<span>aykhan.net</span>' +
      '</a>' +
      '<div class="contact__links">' +
        '<a class="btn" href="https://github.com/aykhan019" target="_blank" rel="noopener">GitHub</a>' +
        '<a class="btn" href="https://www.youtube.com/@aykhan.projects" target="_blank" rel="noopener">YouTube</a>' +
        '<a class="btn" href="https://www.linkedin.com/in/aykhan-ahmadzada/" target="_blank" rel="noopener">LinkedIn</a>' +
      '</div>' +
      '<span class="site-footer__note">© 2026 Aykhan Ahmadzada</span>' +
    '</div>';

  document.body.insertBefore(nav, document.body.firstChild);
  document.body.appendChild(footer);

  var root = document.documentElement;
  var btn = document.getElementById('themeToggle');
  if (btn) {
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }
})();
