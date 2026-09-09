# Runtime dependency layout

Do not install dependencies inside individual skill folders.

Use this layout:

```txt
.cursor/
  package.json
  node_modules/
  skills/
    capture-website/
      SKILL.md
      scripts/
```

Why this works:

- The screenshot scripts stay inside `.cursor/skills/capture-website/scripts`.
- Playwright is installed in `.cursor/node_modules`.
- `.cursor` is an ancestor of `.cursor/skills/capture-website`, so the resolver can find Playwright there.
- The heavy `node_modules` folder is not inside any skill package.

Setup:

```bash
node .cursor/skills/capture-website/scripts/setup-cursor-runtime.mjs
npm --prefix .cursor install
npm --prefix .cursor run setup:playwright
```

Run:

```bash
node .cursor/skills/capture-website/scripts/capture.mjs --urls "https://example.com" --out "./design-screenshots/example-com" --manifest
```

Never commit:

```txt
.cursor/node_modules/
.cursor/package-lock.json  # optional team choice; commit only if you want locked runtime installs
```
