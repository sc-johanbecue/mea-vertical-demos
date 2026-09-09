# MEA Vertical Demo Banking

Sitecore Content SDK Next.js editing host for the Digital Experience Bank demo.

## Setup

```bash
npm install
cp .env.remote.example .env.local
# set SITECORE_EDGE_CONTEXT_ID and related vars for your environment
npm run dev
```

Default site name: `digital-experience-bank`

## Components

Sitecore renderings live under `src/components/banking/`. They are registered via `sitecore-tools project component generate-map`.

Serialization module: `mea-vertical-demo-banking-scs`  
Authoring path: `authoring/items/MEA Vertical Demo Banking/`

## Notes

- Offline build skips Edge `generateSites()`; `.sitecore/sites.json` is maintained locally until a live context ID is configured.
- Capture evidence: `.cursor/design-screenshots/mea-vertical-demo-banking/`
