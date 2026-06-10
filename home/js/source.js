/* ============================================================
   AYKHAN.NET — CARD LIST RENDERER
   Fetches a section's metadata.json and renders link cards into a
   matching <ul class="case-studies-list">. Vanilla JS, no dependencies.

   Two ways to use it:
     1) Declarative (preferred for new pages):
          <ul class="case-studies-list" data-source="<json url>"></ul>
        Renders automatically on DOMContentLoaded. No inline script needed.
     2) Imperative (kept for backward compatibility):
          new PageLinkDataManager('<json url>').addPageLinkItems()

   Resilience:
     - Cache-first paint from localStorage so repeat visits are instant and
       the page still renders if data.aykhan.net is unreachable.
     - A skeleton placeholder fills empty lists on first load (no layout shift).

   metadata.json shape:
     { "<container-id>": [ { id, title, description, imageUrl, linkUrl }, ... ] }
   The single top-level key must match the target <ul id> (imperative mode)
   or simply name the section (declarative mode, where the <ul> is explicit).
   ============================================================ */
(function () {
  'use strict';

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Block dangerous schemes and neutralise characters that could break out
  // of an href or a CSS url('...') context.
  function safeUrl(value) {
    var url = String(value == null ? '' : value).trim();
    if (/^javascript:/i.test(url)) return '';
    return url.replace(/["'()\\\s<>]/g, encodeURIComponent);
  }

  function padIndex(id) {
    var n = Number(id);
    if (!isFinite(n) || n < 0) return '000';
    return n < 10 ? '0' + n : String(n);
  }

  var ARROW =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 476.213 476.213" aria-hidden="true">' +
      '<path d="M405.606 167.5l-21.212 21.213 34.393 34.393H0v30h418.787L384.394 287.5l21.212 21.213 70.607-70.607"/>' +
    '</svg>';

  function cardHtml(item) {
    return (
      '<li itemscope itemtype="http://schema.org/CreativeWork">' +
        '<a class="case-study" itemprop="url" href="' + safeUrl(item.linkUrl) + '">' +
          '<div class="case-study-media" style="background-image: url(\'' + safeUrl(item.imageUrl) + '\');"></div>' +
          '<div class="case-study-mask-number"><span class="case-study-mask-back">' + padIndex(item.id) + '</span></div>' +
          '<div class="case-study-text-section">' +
            '<h3 class="case-study-title" itemprop="name">' + escapeHtml(item.title) + '</h3>' +
            '<p class="case-study-subtitle" itemprop="description">' + escapeHtml(item.description) + '</p>' +
            '<span class="the-button call-to-button">' +
              '<span class="button-text">' + escapeHtml(item.btnText || 'Explore') + '</span>' +
              '<span class="button-icon">' + ARROW + '</span>' +
            '</span>' +
          '</div>' +
        '</a>' +
      '</li>'
    );
  }

  function skeletonHtml(count) {
    var li = '<li class="case-study case-study--skeleton" aria-hidden="true"></li>';
    return new Array(count + 1).join(li);
  }

  function renderError(container, message) {
    if (!container) return;
    container.innerHTML = '<li class="cards-error" role="alert">' + escapeHtml(message) + '</li>';
  }

  function renderCards(container, items) {
    if (!Array.isArray(items) || items.length === 0) {
      renderError(container, 'No items were found.');
      return;
    }
    container.innerHTML = items.map(cardHtml).join('');
  }

  // ---- localStorage cache (best-effort; never throws) ----
  function cacheGet(url) {
    try {
      var raw = localStorage.getItem('cards:' + url);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function cacheSet(url, data) {
    try { localStorage.setItem('cards:' + url, JSON.stringify(data)); } catch (e) {}
  }

  // Resolve the target <ul> and its items from a parsed payload.
  function resolve(el, data) {
    var key = Object.keys(data)[0];
    return { key: key, container: el || document.getElementById(key), items: data[key] };
  }

  async function renderSection(url, el) {
    // 1) Instant paint from cache, if we have it.
    var painted = false;
    var cached = cacheGet(url);
    if (cached) {
      var rc = resolve(el, cached);
      if (rc.container) { renderCards(rc.container, rc.items); painted = true; }
    } else if (el && el.children.length === 0) {
      el.innerHTML = skeletonHtml(6);
    }

    // 2) Revalidate from the network.
    try {
      var res = await fetch(url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      var data = await res.json();
      cacheSet(url, data);
      var rr = resolve(el, data);
      if (!rr.container) throw new Error('No matching <ul> for data key "' + rr.key + '"');
      renderCards(rr.container, rr.items);
    } catch (err) {
      console.error('[cards] failed to load', url, err);
      if (!painted) {
        var fallback = el || (cached && document.getElementById(Object.keys(cached)[0]));
        renderError(fallback, 'Could not load this section.');
      }
    }
  }

  // ---- Public API (backward compatible with existing pages) ----
  function PageLinkDataManager(jsonFilePath) {
    this.jsonFilePath = jsonFilePath;
  }
  PageLinkDataManager.prototype.addPageLinkItems = function () {
    return renderSection(this.jsonFilePath, null);
  };
  window.PageLinkDataManager = PageLinkDataManager;

  // ---- On load: skeleton any still-empty lists, then auto-init declarative ones ----
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.case-studies-list').forEach(function (ul) {
      if (ul.children.length === 0) ul.innerHTML = skeletonHtml(6);
    });
    document.querySelectorAll('.case-studies-list[data-source]').forEach(function (ul) {
      renderSection(ul.getAttribute('data-source'), ul);
    });
  });
})();
