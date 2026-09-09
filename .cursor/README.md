# Optimized Cursor skills: website screenshots → Sitecore TSX + YAML

This pack is a compact replacement for the larger skill set you uploaded. It keeps the same outcome, but reduces token pressure by:

- replacing long orchestration skills with small dispatcher skills;
- merging duplicate screenshot / HTML capture instructions;
- keeping Playwright and Sitecore generators as scripts, not prompt text;
- moving detailed rules into short references that are only opened when needed;
- keeping `node_modules` outside `.cursor/skills`;
- using JSON contracts between phases instead of repeating the full workflow in every skill.

## Install

Copy the folders in this pack into your repository under:

```txt
.cursor/skills/
```

Recommended final structure:

```txt
.cursor/
  package.json              # created by setup-cursor-runtime.mjs
  node_modules/             # created by npm install, do not commit
  skills/
    website-to-sitecore/
    capture-website/
    visual-cms-map/
    sitecore-from-capture/
    sitecore-yaml/
    sitecore-search-experience/
    sitecore-utilities/
```

## One-time Playwright setup

Run from the repository root:

```bash
node .cursor/skills/capture-website/scripts/setup-cursor-runtime.mjs
npm --prefix .cursor install
npm --prefix .cursor run setup:playwright
```

This installs Playwright in `.cursor/node_modules`, not inside `.cursor/skills/capture-website`.

Do not run this anymore:

```bash
cd .cursor/skills/capture-website
npm install
```

## Recommended workflow

```txt
1. website-to-sitecore
   Orchestrates the flow and keeps the agent on track.

2. capture-website
   Captures desktop/tablet/mobile screenshots, clean screenshots, HTML, section crops, and manifests.

3. visual-cms-map
   Reads screenshots/manifests and produces a CMS component inventory.

4. sitecore-from-capture
   Builds TSX components, variants, placeholders, page composition, and component-map registration.

5. sitecore-yaml
   Generates collection/site/rendering/media YAML, site authoring wiring
   (placeholders, datasources, Available Renderings, partial/page designs),
   and validates/pushes serialization. See references/non-unique-item-paths.md
   when validate reports NON-UNIQUE ITEM PATH.
```

## Why this should consume fewer tokens

The original pack had many long `SKILL.md` files that repeated the same constraints across screenshot capture, page decomposition, component creation, YAML creation, and orchestration. Skills work best when the metadata and main instruction file are small, and deeper references/scripts are opened only for the active phase.

This pack keeps each skill narrow:

- `website-to-sitecore` is the workflow skill.
- `capture-website` is the Playwright/URL skill.
- `visual-cms-map` is the screenshot interpretation skill.
- `sitecore-from-capture` is the TSX/page/component skill.
- `sitecore-yaml` is the serialization skill.

The scripts and templates remain available, but the agent does not need to read them unless it is executing that phase.

Usefull commands
dotnet sitecore cloud login

dotnet sitecore cloud project list

dotnet sitecore cloud environment list --project-id 6tzPYN1qvcrCSJmAQiEkfT

dotnet sitecore cloud environment connect --environment-id 04u2K3PpSyhSZaACVBMWF --allow-write true

dotnet sitecore ser validate --fix


In xmcloud.build.json:

"deployItems": {
    "modules": []
  },