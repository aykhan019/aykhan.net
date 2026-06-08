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
        return "guest@" + SERVICES[state.context].host + ":/ $";
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
                ["unicourse", "How this maps to Product Engineering work"],
                ["home", "Switch context to aykhan.net"],
                ["media", "Switch context to media.aykhan.net"],
                ["data", "Switch context to data.aykhan.net"],
                ["clear", "Clear the screen"]
            ]],
            ["Media (in media context)", [
                ["ls", "List indexed public folders & files"],
                ["tree", "Show a tree from media-index.json"],
                ["find <query>", "Search media by name/path/type"],
                ["preview <path>", "Preview an image/video/audio file"],
                ["copy <path>", "Copy the public media URL"]
            ]],
            ["Data (in data context)", [
                ["endpoints", "List public JSON endpoints"],
                ["cat <endpoint>", "Fetch & pretty-print an endpoint"],
                ["pretty <endpoint>", "Same as cat, formatted JSON"],
                ["find <query>", "Search endpoint names/paths"],
                ["copy <endpoint>", "Copy the public endpoint URL"]
            ]]
        ];
        groups.forEach(function (g) {
            var wrap = el("div", "help-group");
            wrap.appendChild(el("div", "group-title", g[0]));
            g[1].forEach(function (row) {
                var line = el("div", "line");
                line.appendChild(el("span", "help-cmd", row[0]));
                line.appendChild(document.createTextNode(row[1]));
                wrap.appendChild(line);
            });
            print(wrap);
        });
        printLine("Tip: use ↑/↓ for history. This terminal is read-only.", "muted");
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

    function cmdLs() {
        return withMediaIndex(function (idx) {
            var folders = idx.folders || [];
            var files = idx.files || [];
            if (folders.length) {
                printLine("folders/", "accent");
                folders.forEach(function (f) { printLine("  " + f + "/", "blue"); });
            }
            printLine(files.length + " file(s)" + (files.length > MAX_LIST_ROWS ? " (showing " + MAX_LIST_ROWS + ")" : ""), "accent");
            files.slice(0, MAX_LIST_ROWS).forEach(function (f) {
                var line = el("div", "line");
                line.appendChild(el("span", "muted", formatBytes(f.sizeBytes).padStart(9) + "  "));
                line.appendChild(document.createTextNode(f.path));
                print(line);
            });
        });
    }

    function cmdTree() {
        return withMediaIndex(function (idx) {
            var files = idx.files || [];
            var root = {};
            files.forEach(function (f) {
                var parts = (f.path || "").split("/");
                var node = root;
                parts.forEach(function (p) {
                    node[p] = node[p] || {};
                    node = node[p];
                });
            });
            printLine(SERVICES.media.host, "accent");
            renderTree(root, "");
        });
    }

    function renderTree(node, prefix) {
        var keys = Object.keys(node).sort();
        keys.forEach(function (key, i) {
            var last = i === keys.length - 1;
            var hasChildren = Object.keys(node[key]).length > 0;
            printLine(prefix + (last ? "└─ " : "├─ ") + key + (hasChildren ? "/" : ""),
                hasChildren ? "blue" : "");
            if (hasChildren) {
                renderTree(node[key], prefix + (last ? "   " : "│  "));
            }
        });
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
            printLine(matches.length + " match(es):", "accent");
            matches.slice(0, MAX_LIST_ROWS).forEach(function (f) {
                var line = el("div", "line");
                var a = el("a", null, f.path);
                a.href = f.url; a.target = "_blank"; a.rel = "noopener noreferrer";
                line.appendChild(a);
                line.appendChild(el("span", "muted", "  (" + (f.type || f.extension || "?") + ")"));
                print(line);
            });
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
                var line = el("div", "line");
                line.appendChild(el("span", "green", (e.name || "?")));
                line.appendChild(el("span", "muted", "  " + (e.path || "") + "  " + formatBytes(e.sizeBytes)));
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
                var line = el("div", "line");
                line.appendChild(el("span", "green", e.name || "?"));
                line.appendChild(el("span", "muted", "  " + (e.path || "")));
                print(line);
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
            case "clear": output.innerHTML = ""; return;
            case "home": return switchContext("aykhan");
            case "media": return switchContext("media");
            case "data": return switchContext("data");
            case "stats": return cmdStats();
        }

        // context-specific
        if (state.context === "media") {
            switch (name) {
                case "ls": return cmdLs();
                case "tree": return cmdTree();
                case "find": return cmdMediaFind(arg);
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
                case "copy": return cmdDataCopy(arg);
                case "ls": case "tree": case "preview": return notHere(name, "media");
            }
            return unknown(name);
        }

        // aykhan context
        switch (name) {
            case "ls": case "tree": case "find": case "preview":
                return notHere(name, "media");
            case "endpoints": case "cat": case "pretty":
                return notHere(name, "data");
            case "copy":
                return printLine("Switch to 'media' or 'data' first to copy a URL.", "yellow");
        }
        return unknown(name);
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
        if (e.key === "ArrowUp") {
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
        print(el("div", "banner", "aykhan.net"));
        printLine("· terminal gateway ·", "muted");
        printLine("Read-only gateway to media.aykhan.net & data.aykhan.net.", "muted");
        printLine("Type 'help' to begin, or 'media' / 'data' to switch context.", "muted");
        printLine("", "");
    }

    refreshPrompt();
    banner();
    input.focus();
})();
