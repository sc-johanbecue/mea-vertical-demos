---
name: sitecore-from-capture
description: Build Sitecore Content SDK Next.js components and pages from approved screenshot capture manifests. Creates TSX, variants, placeholders, datasource wiring, Available Renderings, partial/page designs, component-map registration, page composition, and calls sitecore-yaml for serialization.
paths:
  - "**/src/components/**/*.tsx"
  - "**/.sitecore/component-map*.ts"
  - "**/design-screenshots/**/component-review.json"
  - "**/*.module.json"
---

# Sitecore from Capture

Use this skill after `component-review.json` is approved.

## Inputs

- `design-screenshots/{project}/component-review.json`
- `sections/manifest.json`
- per-section PNGs and `section.html`
- target rendering host path
- target serialization module path

## Build order

1. Resolve current rendering host and module. Do not write into another project.
2. Read approved `component-review.json`.
3. For each row:
   - `create`: build TSX + YAML.
   - `reuse`: wire existing rendering only.
   - `skip`: do nothing.
   - `unclear`: ask or leave unresolved.
4. Build child card/item components before parent sections that use placeholders.
5. Register components in `.sitecore/component-map.ts` and `.sitecore/component-map.client.ts` when present.
6. Call `sitecore-yaml` for collection/site/rendering/media items.
7. Run `npm run build` and fix errors before serialization push.

## TSX rules

- Use Content SDK field components: `Text`, `RichText`, `Image`, `Link`, `Placeholder`.
- No hardcoded marketing copy in JSX.
- Define a typed `Fields` interface for every component.
- Add editable image/link/text fields based on screenshot + HTML evidence.
- Root element must have a stable React `key` from `params.RenderingIdentifier` or `rendering.uid`.
- Use one file per rendering: `src/components/{namespace}/{ComponentName}.tsx`.
- Add variants when visually useful: `Default`, `Animated`, `Inversed`, `ImageTop`, `ImageBottom`, `Carousel`.
- If the component has repeatable children, use a named dynamic placeholder.

## Placeholder rules

For every TSX `<Placeholder>`:

- create placeholder-settings YAML under `placeholder-settings/{system}/` with Allowed Controls;
- set the parent rendering `Placeholders` field to those setting item IDs (braced GUIDs);
- use dynamic placeholder keys in TSX/layout only; settings use the base key:

```tsx
const phKey = `teaser-cards-${props.params.DynamicPlaceholderId}`;
<Placeholder name={phKey} rendering={props.rendering} />
```

## Datasource rules

- Create `Data/{ComponentName}s/` folder + at least one default item per authored rendering.
- Datasource field IDs must match template field definitions already on disk (including files under SCS hash folders). Never invent field GUIDs or duplicate a field Path.
- Before adding a missing template field, search for `Path: ".../Data/{FieldName}"` across the whole module.

## Page/partial design rules

- Header, Footer, and Cookie (or equivalent chrome) belong in **Partial Designs**; body bands belong on the **page** `__Renderings`.
- Wire Partial Designs into Page Designs + TemplatesMapping for the Page template.
- Host layout placeholders (`headless-header`, `headless-main`, `headless-footer`, …) must match partial/page targets.
- Register every new rendering in **Available Renderings** (Page Content / Navigation / Page Structure as appropriate).
- Internal links discovered from header/footer/nav should have stub page items before YAML push.
- Renderings XML must use valid GUIDs, real datasource IDs, matching placeholder keys, and escaped XML attributes.

Full site wiring checklist: `../sitecore-yaml/references/site-authoring-wiring.md`.

## Evidence priority

1. Section PNGs across desktop/tablet/mobile.
2. Full-page clean PNGs for page flow.
3. `section.html` for text, links, alt text, assets, and selectors.
4. Existing project components as style/reference patterns only.

The screenshot wins when HTML or old patterns conflict with the design.

## Done gate

Before marking complete:

- all approved `create` components exist as TSX;
- component map is updated;
- rendering/template YAML + Data folder + default datasource items exist;
- placeholder settings + rendering `Placeholders` for every TSX placeholder;
- Available Renderings lists every project rendering;
- Partial Designs + Page Design mapping for shared chrome;
- page YAML wires approved body renderings in the correct order;
- media YAML exists for downloaded assets;
- no duplicate Sitecore `Path:` values in the module;
- `npm run build` passes or failures are reported exactly;
- `dotnet sitecore ser validate --fix` is run; if `NON-UNIQUE ITEM PATH` appears, fix per `../sitecore-yaml/references/non-unique-item-paths.md` then re-validate.

See `references/sitecore-build-contract.md`.
