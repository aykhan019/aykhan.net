<div align="center">

<img src="https://media.aykhan.net/assets/logos/aykhannet.ico" alt="aykhan.net logo" width="120" />

# aykhan.net

**Personal e‑portfolio and the Terminal Gateway that ties together a three‑domain static system.**

[![Live](https://img.shields.io/badge/live-aykhan.net-235aa6?style=flat-square)](https://aykhan.net)
[![Terminal](https://img.shields.io/badge/try-/terminal-1c1d25?style=flat-square)](https://aykhan.net/terminal)
[![Deploy](https://img.shields.io/badge/hosting-GitHub%20Pages-222?style=flat-square&logo=github)](https://pages.github.com)
[![Stack](https://img.shields.io/badge/stack-vanilla%20HTML%2FCSS%2FJS-f06449?style=flat-square)](#tech-stack)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](./LICENSE)

</div>

---

## Overview

`aykhan.net` is the flagship repository of a small constellation of three independent,
statically‑hosted sites, each deployed to GitHub Pages on its own domain:

| Domain | Repository | Role |
| --- | --- | --- |
| [aykhan.net](https://aykhan.net) | **this repo** | E‑portfolio + **Terminal Gateway** |
| [media.aykhan.net](https://media.aykhan.net) | `media.aykhan.net` | Public media host + `media-index.json` |
| [data.aykhan.net](https://data.aykhan.net) | `data.aykhan.net` | Static JSON "API" + `data-index.json` |

The site is built from **plain, framework‑free HTML/CSS/JS** so GitHub Pages can serve the
repository root directly — no server runtime, no build step required to view a page.

## Highlights

- **Terminal Gateway** — a single‑page, vanilla‑JS terminal at [`/terminal`](./terminal)
  that browses the public services and their static JSON indexes.
- **Shared `<head>` build** — a tiny Node tool keeps the `<head>` of every shell page in
  sync from one partial, while preserving each page's own title and description.
- **Read‑only by design** — no uploads, no auth, no API keys, no secrets. Everything the
  site exposes is public static content.
- **Theme‑aware** — light/dark theming driven by CSS variables, set before first paint.

## Tech stack

| Concern | Choice |
| --- | --- |
| Markup / styles / behaviour | Vanilla HTML, CSS (custom properties), ES (no framework) |
| Tooling | Node + [pnpm](https://pnpm.io) for the head build only |
| Hosting | GitHub Pages (`master` → `aykhan.net` via `CNAME`) |
| Fonts | IBM Plex Sans / IBM Plex Mono |

## Getting started

```bash
# Install dev tooling (only needed for the head build)
pnpm install

# Regenerate the shared <head> across all shell pages (writes in place)
pnpm build

# CI-style check that committed heads are already up to date (exits 1 if stale)
pnpm build:check

# Preview locally — root-absolute asset URLs require HTTP, not file://
python3 -m http.server   # then open http://localhost:8000/
```

## The Terminal Gateway

The gateway ([`/terminal`](./terminal)) is the integration point of the whole system. It
switches between three **services** and fetches **only four** static, public files:

```
media.aykhan.net/media-index.json   media.aykhan.net/build-report.json
data.aykhan.net/data-index.json     data.aykhan.net/build-report.json
```

…plus the individual public files those indexes reference. Service URLs and the colour
themes are declared at the top of [`terminal/terminal.js`](./terminal/terminal.js).

> **The terminal — and every site in this system — is strictly read‑only.** There are no
> write, upload, edit, delete, commit, or authentication features anywhere, and no tokens
> or secrets are ever used. Everything indexed into JSON is public by design.

## Static head build

Pages on the new shell stylesheet (`home/css/site.css`) share their `<head>` from
[`tools/head.html`](./tools/head.html) (with `{{TITLE}}` / `{{DESCRIPTION}}` placeholders).
[`tools/build-heads.js`](./tools/build-heads.js) walks every `.html`, keeps each page's own
`<title>` and `<meta name="description">`, and rewrites the rest from the partial. Generated
pages are committed in place so Pages serves them directly.

The walk intentionally skips `legacy/`, `node_modules/`, `tools/`, `github/overview.html`,
pages still on the old `home/css/application.css`, and any page containing FontAwesome
markers. To add a new shell page, copy an existing generated page, change only its title,
description, and body, then run `pnpm build`.

## Project structure

```
aykhan.net/
├── index.html              # Landing page
├── terminal/               # Terminal Gateway (single-page vanilla JS)
├── home/                   # Shared CSS / JS / images (site.css, landing.css, shell.js)
├── tools/                  # build-heads.js + head.html partial
├── projects/  books/  notion/  cyber-security/  piano/  …   # Section pages
├── achievements/           # Certificates & badges
├── legacy/                 # Older pages (not part of the head build)
├── CNAME                   # aykhan.net
└── package.json            # pnpm scripts: build, build:check
```

## License

Released under the [MIT License](./LICENSE) © 2023 Aykhan Ahmadzada.
