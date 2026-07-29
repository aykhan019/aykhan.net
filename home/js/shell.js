/* ============================================================
   AYKHAN.NET - SHARED SHELL
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
        '<span class="brand__logo"><img src="' + logo + '" alt="Aykhan Ahmadzada logo" /></span>' +
        '<span class="brand__name">aykhan<span class="brand__tld">.net</span></span>' +
      '</a>' +
      '<div class="nav-right">' +
        '<div class="nav-links">' +
          '<a href="' + home + '#journey-overview">Journey</a>' +
          '<a href="' + home + '#achievements">Achievements</a>' +
          '<a href="' + home + '#discover-more">Discover More</a>' +
          // Keep in step with the landing page's own hardcoded nav in
          // index.html — inner pages had been missing Services.
          '<a href="' + home + '#public-services">Services</a>' +
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
        '<span class="brand__logo"><img src="' + logo + '" alt="Aykhan Ahmadzada logo" /></span>' +
        '<span class="brand__name">aykhan<span class="brand__tld">.net</span></span>' +
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

  // --- Inline Notion note renderer --------------------------------------
  // Lesson pages carry the note URL on <iframe id="iframeContent" src="...">.
  // Rather than embedding a cross-origin iframe (own scrollbar, fixed height,
  // wrong background, image links that hijack the frame), we fetch the note
  // and render it as real page content inside a Shadow DOM. media.aykhan.net
  // serves Access-Control-Allow-Origin: *, so the fetch works from anywhere.
  // The shadow root encapsulates Notion's exported CSS (no bleed either way),
  // while the site's CSS custom properties (--text, --heading, ...) inherit
  // through the boundary, so the note follows the theme and the live toggle.
  function renderNote(holder) {
    var url = holder.getAttribute('src');
    if (!url) return;

    var host = document.createElement('div');
    host.className = 'notion-note';
    holder.parentNode.replaceChild(host, holder);
    var shadow = host.attachShadow({ mode: 'open' });
    shadow.innerHTML = '<p class="note-state">Loading note…</p>';

    // Theme + behaviour overrides applied inside the shadow root.
    var overrideCss =
      ':host{display:block}' +
      '.note-state{color:var(--text-soft);font-family:var(--font-sans);padding:2rem 0}' +
      '.notion-body{max-width:880px;margin:0 auto;color:var(--text);' +
        'font-family:var(--font-sans);line-height:1.65;white-space:pre-wrap}' + // matches Notion's body rule

      '.notion-body,.notion-body *{background:transparent!important}' +
      '.notion-body>*:first-child,.notion-body article,.notion-body header,' +
        '.notion-body .page-cover-image{margin-top:0!important;padding-top:0!important}' + // image flush to top

      '.notion-body h1,.notion-body h2,.notion-body h3,.notion-body h4,' +
        '.notion-body h5,.notion-body h6,.notion-body .page-title{color:var(--heading)!important}' +
      '.notion-body a{color:var(--accent-name)!important}' +
      '.notion-body code,.notion-body .code,.notion-body pre{' +
        'background:var(--surface)!important;color:var(--text)!important;border-radius:6px}' +
      '.notion-body pre{padding:14px;overflow:auto}' +
      '.notion-body .callout{background:var(--surface)!important;border:1px solid var(--line);' +
        'border-radius:8px;padding:14px}' +
      '.notion-body th,.notion-body td,.notion-body table,.notion-body hr{' +
        'border-color:var(--line)!important}' +
      '.notion-body blockquote{border-left-color:var(--line)!important;color:var(--text)!important}' +
      '.notion-body img{max-width:100%;height:auto;pointer-events:none}' + // images not clickable
      '.notion-body figure{margin-inline:0}';

    fetch(url)
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');

        // Resolve relative asset/link URLs against the note's own location.
        doc.querySelectorAll('[src]').forEach(function (n) {
          try { n.setAttribute('src', new URL(n.getAttribute('src'), url).href); } catch (e) {}
        });
        doc.querySelectorAll('[href]').forEach(function (n) {
          try { n.setAttribute('href', new URL(n.getAttribute('href'), url).href); } catch (e) {}
        });

        // Keep the note's exported styling, scoped to the shadow root.
        var styles = '';
        doc.querySelectorAll('head style, head link[rel="stylesheet"]').forEach(function (n) {
          styles += n.outerHTML;
        });

        shadow.innerHTML =
          styles + '<style>' + overrideCss + '</style>' +
          '<div class="notion-body">' + (doc.body ? doc.body.innerHTML : '') + '</div>';

        // Disable links that only wrap an image so a click can't take over.
        shadow.querySelectorAll('.notion-body a').forEach(function (a) {
          if (a.querySelector('img') && !a.textContent.trim()) {
            a.removeAttribute('href');
            a.style.pointerEvents = 'none';
            a.style.cursor = 'default';
          }
        });
      })
      .catch(function (err) {
        console.error('[note] failed to load', url, err);
        shadow.innerHTML =
          '<style>.note-state{color:var(--text-soft);font-family:var(--font-sans);padding:2rem 0}</style>' +
          '<p class="note-state">Could not load this note. ' +
          '<a href="' + url + '" target="_blank" rel="noopener">Open it directly</a>.</p>';
      });
  }

  var noteHolder = document.getElementById('iframeContent');
  if (noteHolder) renderNote(noteHolder);

  var btn = document.getElementById('themeToggle');
  if (btn) {
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }
})();
