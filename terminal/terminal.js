/*
 * Aykhan Terminal Gateway — read-only.
 *
 * This terminal ONLY reads four public JSON indexes and the public files they
 * reference. It performs no writes, uploads, auth, or GitHub API calls.
 */
(function () {
    "use strict";

    var SERVICES = {
        aykhan: { label: "aykhan", host: "aykhan.net", base: "https://aykhan.net" },
        media: {
            label: "media",
            host: "media.aykhan.net",
            base: "https://media.aykhan.net",
            index: "https://media.aykhan.net/media-index.json",
            report: "https://media.aykhan.net/build-report.json"
        },
        data: {
            label: "data",
            host: "data.aykhan.net",
            base: "https://data.aykhan.net",
            index: "https://data.aykhan.net/data-index.json",
            report: "https://data.aykhan.net/build-report.json"
        }
    };

    var REPOS = {
        aykhan: "https://github.com/aykhan019/aykhan.net",
        media: "https://github.com/aykhan019/media.aykhan.net",
        data: "https://github.com/aykhan019/data.aykhan.net"
    };

    /* ------------------------------ themes --------------------------------- */
    // Central theme list. Each theme maps onto the terminal's CSS variables.
    var THEME_KEY = "aykhan-terminal-theme";

    var THEMES = [
        { id: "aykhan", name: "Aykhan (default)", background: "#0d1117", text: "#c9d1d9", muted: "#6e7681", accent: "#f06449", prompt: "#3fb950", link: "#58a6ff", error: "#f85149", border: "#21262d", selection: "#234a6b" },
        { id: "dracula", name: "Dracula", background: "#282a36", text: "#f8f8f2", muted: "#6272a4", accent: "#ff79c6", prompt: "#50fa7b", link: "#8be9fd", error: "#ff5555", border: "#44475a", selection: "#44475a" },
        { id: "tokyo-night", name: "Tokyo Night", background: "#1a1b26", text: "#c0caf5", muted: "#565f89", accent: "#bb9af7", prompt: "#9ece6a", link: "#7aa2f7", error: "#f7768e", border: "#2a2e42", selection: "#283457" },
        { id: "gruvbox-dark", name: "Gruvbox Dark", background: "#282828", text: "#ebdbb2", muted: "#928374", accent: "#fe8019", prompt: "#b8bb26", link: "#83a598", error: "#fb4934", border: "#3c3836", selection: "#504945" },
        { id: "catppuccin-mocha", name: "Catppuccin Mocha", background: "#1e1e2e", text: "#cdd6f4", muted: "#6c7086", accent: "#fab387", prompt: "#a6e3a1", link: "#89b4fa", error: "#f38ba8", border: "#313244", selection: "#313244" },
        { id: "nord", name: "Nord", background: "#2e3440", text: "#d8dee9", muted: "#4c566a", accent: "#88c0d0", prompt: "#a3be8c", link: "#81a1c1", error: "#bf616a", border: "#3b4252", selection: "#434c5e" },
        { id: "one-dark", name: "One Dark", background: "#282c34", text: "#abb2bf", muted: "#5c6370", accent: "#c678dd", prompt: "#98c379", link: "#61afef", error: "#e06c75", border: "#3b4048", selection: "#3e4451" },
        { id: "solarized-dark", name: "Solarized Dark", background: "#002b36", text: "#93a1a1", muted: "#586e75", accent: "#b58900", prompt: "#859900", link: "#268bd2", error: "#dc322f", border: "#073642", selection: "#073642" },
        { id: "monokai", name: "Monokai", background: "#272822", text: "#f8f8f2", muted: "#75715e", accent: "#fd971f", prompt: "#a6e22e", link: "#66d9ef", error: "#f92672", border: "#3e3d32", selection: "#49483e" },
        { id: "cyberpunk-neon", name: "Cyberpunk Neon", background: "#0b0c1e", text: "#e7f6ff", muted: "#6b6f9e", accent: "#ff00e5", prompt: "#00ff9f", link: "#00e5ff", error: "#ff3864", border: "#2a1a4a", selection: "#2a1a4a" },
        { id: "matrix-green", name: "Matrix Green", background: "#000000", text: "#00ff41", muted: "#008f11", accent: "#39ff14", prompt: "#00ff41", link: "#7cfc00", error: "#ff3131", border: "#003b00", selection: "#003b00" },
        { id: "amber-crt", name: "Amber CRT", background: "#1a1200", text: "#ffb000", muted: "#8a6a00", accent: "#ffcc33", prompt: "#ffb000", link: "#ffd87a", error: "#ff5e3a", border: "#3a2c00", selection: "#3a2c00" },
        { id: "minimal-bw", name: "Minimal B/W", background: "#000000", text: "#e6e6e6", muted: "#777777", accent: "#ffffff", prompt: "#ffffff", link: "#bdbdbd", error: "#ff6161", border: "#333333", selection: "#333333" }
    ];

    var currentThemeId = null;

    function getThemeById(id) {
        for (var i = 0; i < THEMES.length; i++) if (THEMES[i].id === id) return THEMES[i];
        return null;
    }

    function applyTheme(t) {
        var s = document.documentElement.style;
        s.setProperty("--bg", t.background);
        s.setProperty("--panel", t.background);
        s.setProperty("--bar", t.border);
        s.setProperty("--text", t.text);
        s.setProperty("--muted", t.muted);
        s.setProperty("--accent", t.accent);
        s.setProperty("--green", t.prompt);
        s.setProperty("--blue", t.link);
        s.setProperty("--link", t.link);
        s.setProperty("--red", t.error);
        s.setProperty("--yellow", t.accent);
        s.setProperty("--border", t.border);
        s.setProperty("--selection", t.selection);
        currentThemeId = t.id;
    }

    function saveTheme(id) {
        try { localStorage.setItem(THEME_KEY, id); } catch (e) { /* storage may be blocked */ }
    }

    function applySavedTheme() {
        var id = null;
        try { id = localStorage.getItem(THEME_KEY); } catch (e) { /* ignore */ }
        applyTheme(getThemeById(id) || THEMES[0]);
    }

    /* --------------------------- theme gallery ----------------------------- */
    var galleryEl = null, galleryGrid = null, galleryOpen = false, selectedIndex = 0;

    function buildCard(t, index) {
        var card = el("div", "theme-card");
        card.style.background = t.background;
        card.style.color = t.text;
        card.style.borderColor = t.border;

        var head = el("div", "tc-head");
        var dots = el("span", "tc-dots");
        ["#ff5f56", "#ffbd2e", "#27c93f"].forEach(function (c) {
            var d = el("i"); d.style.background = c; dots.appendChild(d);
        });
        head.appendChild(dots);
        var nm = el("span", "tc-name", t.name); nm.style.color = t.text;
        head.appendChild(nm);
        card.appendChild(head);

        var prev = el("div", "tc-preview");
        var l1 = el("div", null, "AYKHAN.NET"); l1.style.color = t.accent; l1.style.fontWeight = "700";
        prev.appendChild(l1);
        var l2 = el("div");
        var p = el("span", null, "guest@aykhan.net >"); p.style.color = t.accent;
        l2.appendChild(p); l2.appendChild(document.createTextNode(" ls"));
        prev.appendChild(l2);
        var l3 = el("div", null, "movies.json"); l3.style.color = t.link; prev.appendChild(l3);
        var l4 = el("div", null, "command not found"); l4.style.color = t.error; prev.appendChild(l4);
        var l5 = el("div", null, "output truncated..."); l5.style.color = t.muted; prev.appendChild(l5);
        card.appendChild(prev);

        card.addEventListener("click", function () {
            selectIndex(index);
            applySelected();
        });
        return card;
    }

    function ensureGallery() {
        if (galleryEl) return;
        galleryEl = el("div", "theme-gallery");
        var inner = el("div", "theme-gallery-inner");
        var head = el("div", "theme-gallery-head");
        head.appendChild(el("h2", null, "Theme gallery"));
        head.appendChild(el("span", "theme-gallery-hint",
            "Arrow keys navigate - Enter applies - Esc closes"));
        var close = el("button", "theme-gallery-close", "esc x");
        close.type = "button";
        close.setAttribute("aria-label", "Close theme gallery");
        close.addEventListener("click", closeGallery);
        head.appendChild(close);
        inner.appendChild(head);
        galleryGrid = el("div", "theme-grid");
        for (var i = 0; i < THEMES.length; i++) galleryGrid.appendChild(buildCard(THEMES[i], i));
        inner.appendChild(galleryGrid);
        galleryEl.appendChild(inner);
        document.body.appendChild(galleryEl);
    }

    function selectIndex(i) {
        selectedIndex = Math.max(0, Math.min(THEMES.length - 1, i));
        var cards = galleryGrid.children;
        for (var k = 0; k < cards.length; k++) {
            cards[k].classList.toggle("selected", k === selectedIndex);
        }
        cards[selectedIndex].scrollIntoView({ block: "nearest" });
    }

    function gridColumns() {
        var cards = galleryGrid.children;
        if (cards.length < 2) return 1;
        var top0 = cards[0].offsetTop, cols = 1;
        for (var k = 1; k < cards.length; k++) {
            if (cards[k].offsetTop === top0) cols++; else break;
        }
        return cols;
    }

    function applySelected() {
        var t = THEMES[selectedIndex];
        applyTheme(t);
        saveTheme(t.id);
        closeGallery();
        printLine("Theme applied: " + t.name + " (saved).", "green");
    }

    function openGallery() {
        ensureGallery();
        var idx = 0;
        for (var i = 0; i < THEMES.length; i++) if (THEMES[i].id === currentThemeId) { idx = i; break; }
        galleryEl.classList.add("open");
        galleryOpen = true;
        if (input) input.blur();
        selectIndex(idx);
    }

    function closeGallery() {
        if (galleryEl) galleryEl.classList.remove("open");
        galleryOpen = false;
        if (input) input.focus();
    }

    document.addEventListener("keydown", function (e) {
        if (!galleryOpen) return;
        var cols = gridColumns();
        if (e.key === "ArrowRight") { selectIndex(selectedIndex + 1); e.preventDefault(); }
        else if (e.key === "ArrowLeft") { selectIndex(selectedIndex - 1); e.preventDefault(); }
        else if (e.key === "ArrowDown") { selectIndex(selectedIndex + cols); e.preventDefault(); }
        else if (e.key === "ArrowUp") { selectIndex(selectedIndex - cols); e.preventDefault(); }
        else if (e.key === "Enter") { applySelected(); e.preventDefault(); }
        else if (e.key === "Escape") { closeGallery(); e.preventDefault(); }
    });

    function cmdTheme(arg) {
        if (arg) {
            var q = arg.trim().toLowerCase();
            var t = getThemeById(q);
            if (!t) {
                for (var i = 0; i < THEMES.length; i++) {
                    if (THEMES[i].name.toLowerCase() === q) { t = THEMES[i]; break; }
                }
            }
            if (t) {
                applyTheme(t); saveTheme(t.id);
                return printLine("Theme applied: " + t.name + " (saved).", "green");
            }
            printLine("Unknown theme '" + arg + "'. Opening gallery…", "yellow");
        }
        openGallery();
    }

    var MAX_JSON_CHARS = 4000;        // cat / pretty output cap
    var MAX_LIST_ROWS = 200;          // ls / find row cap
    var MAX_FETCH_BYTES = 2 * 1024 * 1024; // skip fetching endpoints larger than this

    var state = { context: "aykhan" };
    var cache = {};              // url -> parsed JSON (read-once)
    var history = [];
    var historyIndex = 0;

    var output = document.getElementById("output");
    var screen = document.getElementById("screen");
    var form = document.getElementById("input-line");
    var input = document.getElementById("command-input");
    var promptEl = document.getElementById("prompt");

    /* ----------------------------- DOM helpers ----------------------------- */

    function el(tag, cls, text) {
        var node = document.createElement(tag);
        if (cls) node.className = cls;
        if (text != null) node.textContent = text;
        return node;
    }

    function print(node) {
        if (typeof node === "string") node = el("div", "line", node);
        output.appendChild(node);
        scrollToBottom();
        return node;
    }

    function printLine(text, cls) {
        return print(el("div", "line " + (cls || ""), text));
    }

    function printLink(text, href) {
        var div = el("div", "line");
        var a = el("a", null, text || href);
        a.href = href;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        div.appendChild(a);
        return print(div);
    }

    function scrollToBottom() {
        screen.scrollTop = screen.scrollHeight;
    }

    function currentPrompt() {
        return "guest@" + SERVICES[state.context].host + " >";
    }

    function refreshPrompt() {
        promptEl.textContent = currentPrompt();
    }

    function echoCommand(raw) {
        var div = el("div", "line cmd-echo");
        div.appendChild(el("span", "prompt-echo", currentPrompt()));
        div.appendChild(el("span", "cmd-text", raw));
        print(div);
    }

    /* ----------------------------- fetching -------------------------------- */

    function fetchJson(url) {
        if (cache[url]) return Promise.resolve(cache[url]);
        return fetch(url, { cache: "no-store" }).then(function (res) {
            if (!res.ok) throw new Error("HTTP " + res.status);
            return res.json();
        }).then(function (json) {
            cache[url] = json;
            return json;
        });
    }

    function loadError(label, err) {
        printLine("Could not load " + label + ".", "red");
        printLine("  " + (err && err.message ? err.message : "Unknown error") +
            " — the index may not be generated/deployed yet.", "muted");
    }

    /* --------------------------- JSON rendering ---------------------------- */

    function escapeHtml(s) {
        return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    function highlightJson(str) {
        var html = escapeHtml(str);
        // strings (keys and values), numbers, booleans, null
        html = html.replace(
            /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false)\b|\bnull\b|-?\d+(\.\d+)?([eE][+-]?\d+)?)/g,
            function (match) {
                var cls = "json-number";
                if (/^"/.test(match)) {
                    cls = /:$/.test(match) ? "json-key" : "json-string";
                } else if (/true|false/.test(match)) {
                    cls = "json-bool";
                } else if (/null/.test(match)) {
                    cls = "json-null";
                }
                return '<span class="' + cls + '">' + match + "</span>";
            }
        );
        return html;
    }

    function printJson(obj) {
        var str = JSON.stringify(obj, null, 2);
        var truncated = false;
        if (str.length > MAX_JSON_CHARS) {
            str = str.slice(0, MAX_JSON_CHARS);
            truncated = true;
        }
        var pre = el("pre", "json");
        pre.innerHTML = highlightJson(str);
        print(pre);
        if (truncated) {
            printLine("… output truncated (" + MAX_JSON_CHARS +
                " chars). Open the URL to view the full JSON.", "muted");
        }
    }

    /* ------------------------------ utilities ------------------------------ */

    function formatBytes(n) {
        if (n == null || isNaN(n)) return "?";
        if (n < 1024) return n + " B";
        if (n < 1024 * 1024) return (n / 1024).toFixed(1) + " KB";
        return (n / 1024 / 1024).toFixed(1) + " MB";
    }

    function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text);
        }
        return Promise.reject(new Error("Clipboard API unavailable"));
    }

    function openPublicUrl(label, url) {
        printLine("Opening " + label + ":", "green");
        printLink(url, url);
        try {
            if (window.open) {
                var opened = window.open(url, "_blank", "noopener,noreferrer");
                if (!opened) printLine("Popup blocked. Use the link above.", "muted");
            }
        } catch (e) {
            printLine("Could not open automatically. Use the link above.", "muted");
        }
    }

    function printInfo(title, rows) {
        printLine(title, "accent");
        rows.forEach(function (row) {
            if (row[1] == null || row[1] === "") return;
            var line = el("div", "line info-row");
            line.appendChild(el("span", "info-key muted", row[0]));
            line.appendChild(el("span", "info-val", String(row[1])));
            print(line);
        });
    }

    function timestampOf(item) {
        var keys = ["updatedAt", "modifiedAt", "createdAt", "lastModified", "mtime", "date", "generatedAt"];
        for (var i = 0; i < keys.length; i++) {
            var value = item[keys[i]];
            var time = value ? Date.parse(value) : NaN;
            if (!isNaN(time)) return { key: keys[i], value: value, time: time };
        }
        return null;
    }

    function newest(items) {
        return items.map(function (item) {
            return { item: item, stamp: timestampOf(item) };
        }).filter(function (x) {
            return x.stamp;
        }).sort(function (a, b) {
            return b.stamp.time - a.stamp.time;
        });
    }

    function randomItem(items) {
        if (!items.length) return null;
        return items[Math.floor(Math.random() * items.length)];
    }

    function imageExt(ext) {
        return /^\.(png|jpe?g|gif|webp|svg|bmp|ico|avif)$/i.test(ext || "");
    }
    function videoExt(ext) {
        return /^\.(mp4|webm|ogg|mov|m4v)$/i.test(ext || "");
    }
    function audioExt(ext) {
        return /^\.(mp3|wav|ogg|m4a|flac|aac)$/i.test(ext || "");
    }

    /* ------------------------------ commands ------------------------------- */

    function cmdHelp() {
        var groups = [
            ["General", [
                ["help", "Show this list of commands"],
                ["about", "What the Terminal Gateway is"],
                ["repo", "GitHub repository links"],
                ["stats", "Stats for the current context"],
                ["theme [name]", "Open theme gallery or apply a theme"],
                ["themes", "Alias for theme"],
                ["context", "Show current context and commands"],
                ["where", "Explain the current service"],
                ["unicourse", "How this maps to Product Engineering work"],
                ["home", "Switch context to aykhan.net"],
                ["media", "Switch context to media.aykhan.net"],
                ["data", "Switch context to data.aykhan.net"],
                ["clear", "Clear the screen"]
            ]],
            ["Media (in media context)", [
                ["files", "List public media entries"],
                ["ls", "Alias for files"],
                ["tree", "Use files/find; media has no real filesystem"],
                ["find <query>", "Search media by name/path/type"],
                ["type <kind>", "Filter media by type"],
                ["open <path>", "Open the public media URL"],
                ["info <path>", "Show media metadata"],
                ["source <path>", "Show index and repo source"],
                ["recent", "Show newest media if timestamps exist"],
                ["random", "Show a random media file"],
                ["count", "Count media by type"],
                ["preview <path>", "Preview an image/video/audio file"],
                ["copy <path>", "Copy the public media URL"]
            ]],
            ["Data (in data context)", [
                ["endpoints", "List public JSON endpoints"],
                ["cat <endpoint>", "Fetch & pretty-print an endpoint"],
                ["pretty <endpoint>", "Same as cat, formatted JSON"],
                ["find <query>", "Search endpoint names/paths"],
                ["open <endpoint>", "Open the public endpoint URL"],
                ["info <endpoint>", "Show endpoint metadata"],
                ["source <endpoint>", "Show index and repo source"],
                ["recent", "Show newest endpoints if timestamps exist"],
                ["random", "Show a random endpoint"],
                ["count", "Count endpoints by group"],
                ["copy <endpoint>", "Copy the public endpoint URL"]
            ]]
        ];
        groups.forEach(function (g) {
            var wrap = el("div", "help-group");
            wrap.appendChild(el("div", "group-title", g[0]));
            g[1].forEach(function (row) {
                var line = el("div", "line help-row");
                line.appendChild(el("span", "help-cmd", row[0]));
                line.appendChild(el("span", "help-desc", row[1]));
                wrap.appendChild(line);
            });
            print(wrap);
        });
        printLine("Tip: use Tab for autocomplete and ↑/↓ for history. This terminal is read-only.", "muted");
    }

    function cmdAbout() {
        printLine("Aykhan Terminal Gateway", "accent bold");
        printLine("A read-only terminal that indexes and explores my public services:");
        printLine("  • media.aykhan.net  — public media files (images, audio, etc.)", "muted");
        printLine("  • data.aykhan.net   — public JSON endpoints", "muted");
        printLine("It reads only four static JSON indexes generated by whitelist-based");
        printLine("scripts. No uploads, no auth, no secrets, nothing writable. Switch");
        printLine("context with 'media' or 'data', then explore. Type 'help' for commands.");
    }

    function cmdRepo() {
        printLine("GitHub repositories:", "accent");
        printLink("aykhan.net  → " + REPOS.aykhan, REPOS.aykhan);
        printLink("media.aykhan.net  → " + REPOS.media, REPOS.media);
        printLink("data.aykhan.net  → " + REPOS.data, REPOS.data);
    }

    function cmdUnicourse() {
        printLine("Product Engineering — proof of work", "accent bold");
        printLine("This gateway is a compact demonstration of the day-to-day of a");
        printLine("Product Engineering Intern:");
        printLine("  • scripts & automation — Python generators build the JSON indexes", "muted");
        printLine("  • internal tooling — a CLI-style tool over real services", "muted");
        printLine("  • data workflows — whitelist indexing of media & data", "muted");
        printLine("  • frontend UX — clean, responsive, keyboard-driven terminal", "muted");
        printLine("  • product thinking — read-only, safe-by-default, public metadata", "muted");
        printLine("  • proof of work — everything is inspectable in the open repos", "muted");
    }

    function cmdContext() {
        printLine("Current context: " + SERVICES[state.context].host, "accent");
        if (state.context === "media") {
            printLine("Commands: files, find, type, open, info, source, recent, random, count, preview, copy", "muted");
        } else if (state.context === "data") {
            printLine("Commands: endpoints, cat, pretty, find, open, info, source, recent, random, count, copy", "muted");
        } else {
            printLine("Switch context with: media or data", "muted");
        }
    }

    function cmdWhere() {
        var service = SERVICES[state.context];
        printLine(service.host, "accent");
        if (state.context === "media") {
            printLine("Public media index. Files are referenced by URL; this is not a writable filesystem.", "muted");
            printLink("media-index.json", SERVICES.media.index);
        } else if (state.context === "data") {
            printLine("Public JSON endpoint index. Endpoints are static JSON files.", "muted");
            printLink("data-index.json", SERVICES.data.index);
        } else {
            printLine("Terminal gateway for exploring public media and data services.", "muted");
        }
        printLink("repository: " + REPOS[state.context], REPOS[state.context]);
    }

    function switchContext(ctx) {
        state.context = ctx;
        refreshPrompt();
        if (ctx === "aykhan") {
            printLine("Switched to aykhan.net", "green");
        } else {
            printLine("Switched to " + SERVICES[ctx].host, "green");
            printLine("Type 'help' for " + ctx + " commands.", "muted");
        }
    }

    function cmdStats() {
        if (state.context === "media") {
            return fetchJson(SERVICES.media.index).then(function (idx) {
                printLine("media.aykhan.net", "accent");
                printLine("  indexed files : " + (idx.totalFiles != null ? idx.totalFiles : (idx.files || []).length));
                printLine("  folders       : " + ((idx.folders || []).length));
                printLine("  generatedAt   : " + (idx.generatedAt || "?"), "muted");
            }).catch(function (e) { loadError("media-index.json", e); });
        }
        if (state.context === "data") {
            return fetchJson(SERVICES.data.index).then(function (idx) {
                printLine("data.aykhan.net", "accent");
                printLine("  endpoints   : " + (idx.totalEndpoints != null ? idx.totalEndpoints : (idx.endpoints || []).length));
                printLine("  generatedAt : " + (idx.generatedAt || "?"), "muted");
            }).catch(function (e) { loadError("data-index.json", e); });
        }
        // aykhan: combined summary
        printLine("Combined summary", "accent");
        return Promise.all([
            fetchJson(SERVICES.media.index).then(function (m) {
                printLine("  media : " + (m.totalFiles != null ? m.totalFiles : (m.files || []).length) +
                    " files, " + ((m.folders || []).length) + " folders");
            }).catch(function () { printLine("  media : unavailable", "muted"); }),
            fetchJson(SERVICES.data.index).then(function (d) {
                printLine("  data  : " + (d.totalEndpoints != null ? d.totalEndpoints : (d.endpoints || []).length) +
                    " endpoints");
            }).catch(function () { printLine("  data  : unavailable", "muted"); })
        ]);
    }

    /* ------------------------------- media --------------------------------- */

    function withMediaIndex(fn) {
        return fetchJson(SERVICES.media.index).then(fn).catch(function (e) {
            loadError("media-index.json", e);
        });
    }

    function printMediaFiles(files) {
        if (!files.length) return printLine("No media files indexed.", "yellow");
        printLine(files.length + " media file(s)" + (files.length > MAX_LIST_ROWS ? " (showing " + MAX_LIST_ROWS + ")" : ""), "accent");
        files.slice(0, MAX_LIST_ROWS).forEach(function (f) {
            var line = el("div", "line media-row");
            line.appendChild(el("span", "media-path blue", f.path || f.name || "?"));
            line.appendChild(el("span", "media-meta muted",
                (f.type || f.extension || "?") + "  " + formatBytes(f.sizeBytes)));
            print(line);
        });
    }

    function cmdFiles() {
        return withMediaIndex(function (idx) {
            printMediaFiles(idx.files || []);
        });
    }

    function cmdTree() {
        printLine("media.aykhan.net exposes a public file index, not a browsable filesystem.", "yellow");
        printLine("Use 'files' to list media entries or 'find <query>' to narrow results.", "muted");
        return cmdFiles();
    }

    function cmdMediaFind(query) {
        if (!query) return printLine("usage: find <query>", "yellow");
        var q = query.toLowerCase();
        return withMediaIndex(function (idx) {
            var matches = (idx.files || []).filter(function (f) {
                return (f.path || "").toLowerCase().indexOf(q) !== -1 ||
                    (f.name || "").toLowerCase().indexOf(q) !== -1 ||
                    (f.type || "").toLowerCase().indexOf(q) !== -1 ||
                    (f.extension || "").toLowerCase().indexOf(q) !== -1;
            });
            if (!matches.length) return printLine("No media matched \"" + query + "\".", "yellow");
            printMediaFiles(matches);
        });
    }

    function cmdMediaType(kind) {
        if (!kind) return printLine("usage: type <image|audio|video|json|other>", "yellow");
        var q = kind.toLowerCase().replace(/^\./, "");
        return withMediaIndex(function (idx) {
            var matches = (idx.files || []).filter(function (f) {
                var type = (f.type || "").toLowerCase();
                var ext = (f.extension || "").toLowerCase().replace(/^\./, "");
                if (q === "image") return /^image\//.test(type) || imageExt("." + ext);
                if (q === "audio") return /^audio\//.test(type) || audioExt("." + ext);
                if (q === "video") return /^video\//.test(type) || videoExt("." + ext);
                if (q === "json") return ext === "json" || type === "application/json";
                if (q === "other") return !(/^image\//.test(type) || /^audio\//.test(type) || /^video\//.test(type) || ext === "json");
                return type.indexOf(q) !== -1 || ext === q;
            });
            if (!matches.length) return printLine("No media matched type \"" + kind + "\".", "yellow");
            printMediaFiles(matches);
        });
    }

    function findMediaFile(idx, path) {
        var p = path.toLowerCase();
        var files = idx.files || [];
        return files.filter(function (f) { return (f.path || "").toLowerCase() === p; })[0] ||
            files.filter(function (f) { return (f.name || "").toLowerCase() === p; })[0] ||
            files.filter(function (f) { return (f.path || "").toLowerCase().indexOf(p) !== -1; })[0];
    }

    function cmdPreview(path) {
        if (!path) return printLine("usage: preview <path>", "yellow");
        return withMediaIndex(function (idx) {
            var file = findMediaFile(idx, path);
            if (!file) return printLine("No media file matched \"" + path + "\".", "yellow");
            printLine(file.path, "accent");
            var wrap = el("div", "line media-preview");
            if (imageExt(file.extension) || /^image\//.test(file.type || "")) {
                var img = el("img");
                img.src = file.url; img.alt = file.name || file.path; img.loading = "lazy";
                wrap.appendChild(img);
                print(wrap);
            } else if (videoExt(file.extension) || /^video\//.test(file.type || "")) {
                var v = document.createElement("video");
                v.src = file.url; v.controls = true;
                wrap.appendChild(v);
                print(wrap);
            } else if (audioExt(file.extension) || /^audio\//.test(file.type || "")) {
                var au = document.createElement("audio");
                au.src = file.url; au.controls = true;
                wrap.appendChild(au);
                print(wrap);
            } else {
                printLine("Preview not supported for this type. Public URL:", "muted");
            }
            printLink(file.url, file.url);
        });
    }

    function cmdMediaOpen(path) {
        if (!path) return printLine("usage: open <path>", "yellow");
        return withMediaIndex(function (idx) {
            var file = findMediaFile(idx, path);
            if (!file) return printLine("No media file matched \"" + path + "\".", "yellow");
            openPublicUrl(file.path || file.name || "media", file.url);
        });
    }

    function cmdMediaInfo(path) {
        if (!path) return printLine("usage: info <path>", "yellow");
        return withMediaIndex(function (idx) {
            var file = findMediaFile(idx, path);
            if (!file) return printLine("No media file matched \"" + path + "\".", "yellow");
            printInfo(file.path || file.name || "media", [
                ["name", file.name],
                ["path", file.path],
                ["url", file.url],
                ["type", file.type || file.extension],
                ["size", formatBytes(file.sizeBytes)],
                ["extension", file.extension],
                ["modified", (timestampOf(file) || {}).value]
            ]);
        });
    }

    function cmdMediaSource(path) {
        if (!path) return printLine("usage: source <path>", "yellow");
        return withMediaIndex(function (idx) {
            var file = findMediaFile(idx, path);
            if (!file) return printLine("No media file matched \"" + path + "\".", "yellow");
            printInfo("Source for " + (file.path || file.name || "media"), [
                ["public index", SERVICES.media.index],
                ["repository", REPOS.media],
                ["public url", file.url],
                ["generatedAt", idx.generatedAt]
            ]);
            printLink("open index", SERVICES.media.index);
            printLink("open repo", REPOS.media);
        });
    }

    function cmdMediaRecent() {
        return withMediaIndex(function (idx) {
            var items = newest(idx.files || []);
            if (!items.length) return printLine("No timestamp metadata is available for media entries.", "yellow");
            printMediaFiles(items.slice(0, 20).map(function (x) { return x.item; }));
        });
    }

    function cmdMediaRandom() {
        return withMediaIndex(function (idx) {
            var file = randomItem(idx.files || []);
            if (!file) return printLine("No media files indexed.", "yellow");
            printMediaFiles([file]);
        });
    }

    function cmdMediaCount() {
        return withMediaIndex(function (idx) {
            var counts = {};
            (idx.files || []).forEach(function (f) {
                var type = (f.type || "").split("/")[0] || (f.extension || "unknown").replace(/^\./, "") || "unknown";
                counts[type] = (counts[type] || 0) + 1;
            });
            printLine("Media counts by type", "accent");
            Object.keys(counts).sort().forEach(function (key) {
                printLine("  " + key + " : " + counts[key]);
            });
        });
    }

    function cmdMediaCopy(path) {
        if (!path) return printLine("usage: copy <path>", "yellow");
        return withMediaIndex(function (idx) {
            var file = findMediaFile(idx, path);
            if (!file) return printLine("No media file matched \"" + path + "\".", "yellow");
            return copyToClipboard(file.url).then(function () {
                printLine("Copied to clipboard: " + file.url, "green");
            }).catch(function () {
                printLine("Could not access clipboard. URL:", "yellow");
                printLink(file.url, file.url);
            });
        });
    }

    /* -------------------------------- data --------------------------------- */

    function withDataIndex(fn) {
        return fetchJson(SERVICES.data.index).then(fn).catch(function (e) {
            loadError("data-index.json", e);
        });
    }

    function findEndpoint(idx, name) {
        var n = name.toLowerCase().replace(/\.json$/, "");
        var eps = idx.endpoints || [];
        return eps.filter(function (e) { return (e.name || "").toLowerCase() === n; })[0] ||
            eps.filter(function (e) { return (e.path || "").toLowerCase() === name.toLowerCase(); })[0] ||
            eps.filter(function (e) {
                return (e.name || "").toLowerCase().indexOf(n) !== -1 ||
                    (e.path || "").toLowerCase().indexOf(n) !== -1;
            })[0];
    }

    function cmdEndpoints() {
        return withDataIndex(function (idx) {
            var eps = idx.endpoints || [];
            if (!eps.length) return printLine("No endpoints indexed.", "yellow");
            printLine(eps.length + " endpoint(s):", "accent");
            eps.forEach(function (e) {
                var line = el("div", "line endpoint-row");
                line.appendChild(el("span", "endpoint-name green", (e.name || "?")));
                line.appendChild(el("span", "endpoint-meta muted", (e.path || "") + "  " + formatBytes(e.sizeBytes)));
                print(line);
            });
        });
    }

    function cmdCat(name) {
        if (!name) return printLine("usage: cat <endpoint>", "yellow");
        return withDataIndex(function (idx) {
            var ep = findEndpoint(idx, name);
            if (!ep) return printLine("No endpoint matched \"" + name + "\".", "yellow");
            printLine("// " + ep.path + "  →  " + ep.url, "muted");
            if (ep.sizeBytes != null && ep.sizeBytes > MAX_FETCH_BYTES) {
                printLine("Endpoint is " + formatBytes(ep.sizeBytes) +
                    " — too large to fetch in the terminal. Open it directly:", "yellow");
                return printLink(ep.url, ep.url);
            }
            return fetchJson(ep.url).then(function (json) {
                printJson(json);
            }).catch(function (e) {
                loadError(ep.path, e);
            });
        });
    }

    function cmdDataFind(query) {
        if (!query) return printLine("usage: find <query>", "yellow");
        var q = query.toLowerCase();
        return withDataIndex(function (idx) {
            var matches = (idx.endpoints || []).filter(function (e) {
                return (e.name || "").toLowerCase().indexOf(q) !== -1 ||
                    (e.path || "").toLowerCase().indexOf(q) !== -1 ||
                    (e.description || "").toLowerCase().indexOf(q) !== -1;
            });
            if (!matches.length) return printLine("No endpoint matched \"" + query + "\".", "yellow");
            printLine(matches.length + " match(es):", "accent");
            matches.forEach(function (e) {
                var line = el("div", "line endpoint-row");
                line.appendChild(el("span", "endpoint-name green", e.name || "?"));
                line.appendChild(el("span", "endpoint-meta muted", e.path || ""));
                print(line);
            });
        });
    }

    function cmdDataOpen(name) {
        if (!name) return printLine("usage: open <endpoint>", "yellow");
        return withDataIndex(function (idx) {
            var ep = findEndpoint(idx, name);
            if (!ep) return printLine("No endpoint matched \"" + name + "\".", "yellow");
            openPublicUrl(ep.name || ep.path || "endpoint", ep.url);
        });
    }

    function cmdDataInfo(name) {
        if (!name) return printLine("usage: info <endpoint>", "yellow");
        return withDataIndex(function (idx) {
            var ep = findEndpoint(idx, name);
            if (!ep) return printLine("No endpoint matched \"" + name + "\".", "yellow");
            printInfo(ep.name || ep.path || "endpoint", [
                ["name", ep.name],
                ["path", ep.path],
                ["url", ep.url],
                ["size", formatBytes(ep.sizeBytes)],
                ["modified", (timestampOf(ep) || {}).value]
            ]);
        });
    }

    function cmdDataSource(name) {
        if (!name) return printLine("usage: source <endpoint>", "yellow");
        return withDataIndex(function (idx) {
            var ep = findEndpoint(idx, name);
            if (!ep) return printLine("No endpoint matched \"" + name + "\".", "yellow");
            printInfo("Source for " + (ep.name || ep.path || "endpoint"), [
                ["public index", SERVICES.data.index],
                ["repository", REPOS.data],
                ["public url", ep.url],
                ["generatedAt", idx.generatedAt]
            ]);
            printLink("open index", SERVICES.data.index);
            printLink("open repo", REPOS.data);
        });
    }

    function cmdDataRecent() {
        return withDataIndex(function (idx) {
            var items = newest(idx.endpoints || []);
            if (!items.length) return printLine("No timestamp metadata is available for endpoints.", "yellow");
            printLine(items.length + " timestamped endpoint(s) (showing 20):", "accent");
            items.slice(0, 20).forEach(function (x) {
                var e = x.item;
                var line = el("div", "line endpoint-row");
                line.appendChild(el("span", "endpoint-name green", e.name || "?"));
                line.appendChild(el("span", "endpoint-meta muted", x.stamp.value + "  " + (e.path || "")));
                print(line);
            });
        });
    }

    function cmdDataRandom() {
        return withDataIndex(function (idx) {
            var ep = randomItem(idx.endpoints || []);
            if (!ep) return printLine("No endpoints indexed.", "yellow");
            var line = el("div", "line endpoint-row");
            line.appendChild(el("span", "endpoint-name green", ep.name || "?"));
            line.appendChild(el("span", "endpoint-meta muted", (ep.path || "") + "  " + formatBytes(ep.sizeBytes)));
            print(line);
        });
    }

    function cmdDataCount() {
        return withDataIndex(function (idx) {
            var counts = {};
            (idx.endpoints || []).forEach(function (e) {
                var parts = (e.path || "").split("/");
                var group = parts[1] || "root";
                counts[group] = (counts[group] || 0) + 1;
            });
            printLine("Endpoint counts by group", "accent");
            Object.keys(counts).sort().forEach(function (key) {
                printLine("  " + key + " : " + counts[key]);
            });
        });
    }

    function cmdDataCopy(name) {
        if (!name) return printLine("usage: copy <endpoint>", "yellow");
        return withDataIndex(function (idx) {
            var ep = findEndpoint(idx, name);
            if (!ep) return printLine("No endpoint matched \"" + name + "\".", "yellow");
            return copyToClipboard(ep.url).then(function () {
                printLine("Copied to clipboard: " + ep.url, "green");
            }).catch(function () {
                printLine("Could not access clipboard. URL:", "yellow");
                printLink(ep.url, ep.url);
            });
        });
    }

    /* ------------------------------ dispatch ------------------------------- */

    function unknown(name) {
        printLine("command not found: " + name, "red");
        printLine("Type 'help' for available commands.", "muted");
    }

    function notHere(name, where) {
        printLine("'" + name + "' is a " + where + " command. Switch with: " + where, "yellow");
    }

    function run(raw) {
        var parts = raw.trim().split(/\s+/);
        var name = (parts[0] || "").toLowerCase();
        var arg = raw.trim().slice(parts[0].length).trim();
        if (!name) return;

        switch (name) {
            case "help": return cmdHelp();
            case "about": return cmdAbout();
            case "repo": return cmdRepo();
            case "unicourse": return cmdUnicourse();
            case "theme": return cmdTheme(arg);
            case "themes": return cmdTheme(arg);
            case "context": return cmdContext();
            case "where": return cmdWhere();
            case "clear": output.innerHTML = ""; return;
            case "home": return switchContext("aykhan");
            case "media": return switchContext("media");
            case "data": return switchContext("data");
            case "stats": return cmdStats();
        }

        // context-specific
        if (state.context === "media") {
            switch (name) {
                case "files": return cmdFiles();
                case "ls": return cmdFiles();
                case "tree": return cmdTree();
                case "find": return cmdMediaFind(arg);
                case "type": return cmdMediaType(arg);
                case "open": return cmdMediaOpen(arg);
                case "info": return cmdMediaInfo(arg);
                case "source": return cmdMediaSource(arg);
                case "recent": return cmdMediaRecent();
                case "random": return cmdMediaRandom();
                case "count": return cmdMediaCount();
                case "preview": return cmdPreview(arg);
                case "copy": return cmdMediaCopy(arg);
                case "endpoints": case "cat": case "pretty": return notHere(name, "data");
            }
            return unknown(name);
        }

        if (state.context === "data") {
            switch (name) {
                case "endpoints": return cmdEndpoints();
                case "cat": return cmdCat(arg);
                case "pretty": return cmdCat(arg);
                case "find": return cmdDataFind(arg);
                case "open": return cmdDataOpen(arg);
                case "info": return cmdDataInfo(arg);
                case "source": return cmdDataSource(arg);
                case "recent": return cmdDataRecent();
                case "random": return cmdDataRandom();
                case "count": return cmdDataCount();
                case "copy": return cmdDataCopy(arg);
                case "files": case "ls": case "tree": case "preview": case "type": return notHere(name, "media");
            }
            return unknown(name);
        }

        // aykhan context
        switch (name) {
            case "files": case "ls": case "tree": case "find": case "preview":
                return notHere(name, "media");
            case "type":
                return notHere(name, "media");
            case "endpoints": case "cat": case "pretty":
                return notHere(name, "data");
            case "open": case "info": case "source": case "recent": case "random": case "count": case "copy":
                return printLine("Switch to 'media' or 'data' first for '" + name + "'.", "yellow");
        }
        return unknown(name);
    }

    /* ---------------------------- completion ------------------------------- */

    var GENERAL_COMMANDS = ["help", "about", "repo", "stats", "theme", "themes", "context", "where", "unicourse", "home", "media", "data", "clear"];
    var MEDIA_COMMANDS = ["files", "ls", "tree", "find", "type", "open", "info", "source", "recent", "random", "count", "preview", "copy"];
    var DATA_COMMANDS = ["endpoints", "cat", "pretty", "find", "open", "info", "source", "recent", "random", "count", "copy"];
    var THEME_IDS = THEMES.map(function (t) { return t.id; });

    function commandList() {
        var list = GENERAL_COMMANDS.slice();
        if (state.context === "media") list = list.concat(MEDIA_COMMANDS);
        if (state.context === "data") list = list.concat(DATA_COMMANDS);
        return unique(list).sort();
    }

    function unique(items) {
        var seen = {};
        return items.filter(function (item) {
            if (seen[item]) return false;
            seen[item] = true;
            return true;
        });
    }

    function matching(items, prefix) {
        var q = (prefix || "").toLowerCase();
        return unique(items).filter(function (item) {
            return item.toLowerCase().indexOf(q) === 0;
        }).sort();
    }

    function longestCommonPrefix(items) {
        if (!items.length) return "";
        var prefix = items[0];
        for (var i = 1; i < items.length; i++) {
            while (items[i].indexOf(prefix) !== 0) {
                prefix = prefix.slice(0, -1);
                if (!prefix) return "";
            }
        }
        return prefix;
    }

    function printSuggestions(matches) {
        printLine(matches.slice(0, 12).join("  "), "muted");
        if (matches.length > 12) printLine("… " + (matches.length - 12) + " more", "muted");
    }

    function completeFrom(items, prefix, before) {
        var matches = matching(items, prefix);
        if (!matches.length) return false;
        if (matches.length === 1) {
            input.value = before + matches[0] + (matches[0].slice(-1) === "/" ? "" : " ");
            moveCaretToEnd();
            return true;
        }
        for (var i = 0; i < matches.length; i++) {
            if (matches[i].toLowerCase() === prefix.toLowerCase()) {
                input.value = before + matches[i] + (matches[i].slice(-1) === "/" ? "" : " ");
                moveCaretToEnd();
                return true;
            }
        }
        var common = longestCommonPrefix(matches);
        if (common.length > prefix.length) {
            input.value = before + common + (matches.indexOf(common) !== -1 && common.slice(-1) !== "/" ? " " : "");
            moveCaretToEnd();
        } else {
            printSuggestions(matches);
        }
        return true;
    }

    function completeCommand(raw) {
        var prefix = raw.trim();
        var matches = matching(commandList(), prefix);
        if (!matches.length) return false;
        if (matches.length === 1) {
            input.value = matches[0] + " ";
            moveCaretToEnd();
            return true;
        }
        for (var i = 0; i < matches.length; i++) {
            if (matches[i].toLowerCase() === prefix.toLowerCase()) {
                input.value = matches[i] + " ";
                moveCaretToEnd();
                return true;
            }
        }
        var common = longestCommonPrefix(matches);
        if (common.length > prefix.length) {
            input.value = common + (matches.indexOf(common) !== -1 ? " " : "");
            moveCaretToEnd();
        } else {
            printSuggestions(matches);
        }
        return true;
    }

    function completeThemeArg(arg) {
        return completeFrom(THEME_IDS, arg, "theme ");
    }

    function completeMediaTypeArg(arg) {
        return completeFrom(["image", "audio", "video", "json", "other"], arg, "type ");
    }

    function completeDataArg(name, arg) {
        return fetchJson(SERVICES.data.index).then(function (idx) {
            var choices = [];
            (idx.endpoints || []).forEach(function (e) {
                if (e.name) choices.push(e.name);
                if (e.path) choices.push(e.path);
            });
            return completeFrom(choices, arg, name + " ");
        }).catch(function (e) {
            loadError("data-index.json", e);
        });
    }

    function completeMediaArg(name, arg) {
        return fetchJson(SERVICES.media.index).then(function (idx) {
            var choices = [];
            (idx.folders || []).forEach(function (f) { choices.push(f + "/"); });
            (idx.files || []).forEach(function (f) {
                if (f.path) choices.push(f.path);
                if (f.name) choices.push(f.name);
            });
            return completeFrom(choices, arg, name + " ");
        }).catch(function (e) {
            loadError("media-index.json", e);
        });
    }

    function autocomplete() {
        var raw = input.value;
        var trimmed = raw.trim();
        if (!trimmed || trimmed.indexOf(" ") === -1 && raw.slice(-1) !== " ") {
            return completeCommand(raw);
        }

        var parts = trimmed.split(/\s+/);
        var name = (parts[0] || "").toLowerCase();
        var arg = trimmed.slice(parts[0].length).trim();

        if (name === "theme" || name === "themes") return completeThemeArg(arg);
        if (state.context === "data" && /^(cat|pretty|copy|find|open|info|source)$/.test(name)) return completeDataArg(name, arg);
        if (state.context === "media" && name === "type") return completeMediaTypeArg(arg);
        if (state.context === "media" && /^(preview|copy|find|open|info|source)$/.test(name)) return completeMediaArg(name, arg);
        return false;
    }

    /* ------------------------------- input --------------------------------- */

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        var raw = input.value;
        echoCommand(raw);
        if (raw.trim()) {
            history.push(raw);
            historyIndex = history.length;
        }
        input.value = "";
        try {
            run(raw);
        } catch (err) {
            printLine("Internal error: " + err.message, "red");
        }
    });

    input.addEventListener("keydown", function (e) {
        if (e.key === "Tab") {
            e.preventDefault();
            try {
                var result = autocomplete();
                if (result && typeof result.then === "function") {
                    result.catch(function (err) {
                        printLine("Autocomplete error: " + err.message, "red");
                    });
                }
            } catch (err) {
                printLine("Autocomplete error: " + err.message, "red");
            }
        } else if (e.key === "ArrowUp") {
            if (historyIndex > 0) {
                historyIndex--;
                input.value = history[historyIndex];
                moveCaretToEnd();
            }
            e.preventDefault();
        } else if (e.key === "ArrowDown") {
            if (historyIndex < history.length - 1) {
                historyIndex++;
                input.value = history[historyIndex];
            } else {
                historyIndex = history.length;
                input.value = "";
            }
            e.preventDefault();
        } else if (e.key === "l" && e.ctrlKey) {
            output.innerHTML = "";
            e.preventDefault();
        }
    });

    function moveCaretToEnd() {
        var v = input.value;
        input.value = "";
        input.value = v;
    }

    // keep focus on the input when clicking anywhere in the terminal
    document.getElementById("terminal").addEventListener("click", function (e) {
        if (e.target.tagName !== "A" && window.getSelection().toString() === "") {
            input.focus();
        }
    });

    /* ------------------------------- boot ---------------------------------- */

    function banner() {
        var art = [
            "██████  ██  ██  ██  ██  ██  ██  ██████  ██  ██      ██  ██  ██████  ██████",
            "██  ██  ██  ██  ██ ██   ██  ██  ██  ██  ███ ██      ███ ██  ██        ██  ",
            "██████   ████   ████    ██████  ██████  ██████      ██████  █████     ██  ",
            "██  ██    ██    ██ ██   ██  ██  ██  ██  ██ ███      ██ ███  ██        ██  ",
            "██  ██    ██    ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██████    ██  "
        ];
        var pre = el("pre", "banner");
        pre.textContent = art.join("\n");
        print(pre);
        printLine("· terminal gateway ·", "muted");
        printLine("Read-only gateway to media.aykhan.net & data.aykhan.net.", "muted");
        printLine("Type 'help' to begin, or 'media' / 'data' to switch context.", "muted");
        printLine("", "");
    }

    applySavedTheme();
    refreshPrompt();
    banner();
    input.focus();
})();
