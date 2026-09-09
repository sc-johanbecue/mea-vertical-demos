---
name: capture-website
description: Capture desktop/tablet/mobile screenshots, clean screenshots without sticky overlays, rendered HTML, section crops, design tokens, and JSON manifests for one or more URLs. Use before visual CMS analysis or Sitecore generation.
paths:
  - "**/design-screenshots/**"
---

# Capture Website

Use this skill only for deterministic URL capture. Do not create TSX or YAML here.

## One-time setup

Do **not** run `npm install` inside this skill folder. Keep runtime dependencies outside `.cursor/skills`.

From the repository root:

```bash
node .cursor/skills/capture-website/scripts/setup-cursor-runtime.mjs
npm --prefix .cursor install
npm --prefix .cursor run setup:playwright
```

This installs Playwright into `.cursor/node_modules`, which is a sibling of `.cursor/skills`, not part of any skill package.

## Run

Preferred direct command:

```bash
node .cursor/skills/capture-website/scripts/capture.mjs \
  --urls "https://example.com,https://example.com/about" \
  --out "./design-screenshots/example-com" \
  --manifest
```

Equivalent npm runtime command:

```bash
npm --prefix .cursor run capture:website -- \
  --urls "https://example.com" \
  --out "./design-screenshots/example-com" \
  --manifest
```

HTML only:

```bash
node .cursor/skills/capture-website/scripts/fetch-html.mjs \
  --urls "https://example.com" \
  --out "./design-screenshots/example-com"
```

Refresh sections for an existing page folder:

```bash
node .cursor/skills/capture-website/scripts/section-capture.mjs \
  --page-dir "./design-screenshots/example-com/home" \
  --refresh-html
```

## Output contract

See `references/output-contract.md`.

## Rules

- Capture `desktop`, `tablet`, and `mobile` unless the user asks for fewer.
- Save both overlay and clean screenshots.
- Save rendered HTML as `page.html`.
- Hide cookie banners, sticky headers, chat widgets, floating buttons, and modal backdrops for clean captures.
- Section crops should represent major CMS bands, not every DOM element.
- Site chrome (`Header`, `Navigation`, `Footer`, `CookieBanner`) is site-scoped and captured once per project.
- Content sections are page-scoped first, then merged into `sections/manifest.json` for reuse.

## After running

Report only:

- project folder;
- page folders;
- full-page screenshot paths;
- `sections/manifest.json` path;
- failed URLs/viewports;
- whether overlay removal and section detection looked reliable.
