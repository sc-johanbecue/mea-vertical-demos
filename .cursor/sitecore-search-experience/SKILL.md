---
name: sitecore-search-experience
description: Add the Sitecore Search Experience component to a Content SDK App Router rendering host, including TSX, component-map registration, next-intl wiring, dependencies, and YAML.
paths:
  - "**/src/components/**/SearchExperience*.tsx"
  - "**/.sitecore/component-map*.ts"
  - "authoring/items/**/Search*.yml"
---

# Sitecore Search Experience

Use only for App Router hosts. Pages Router is not supported by this optimized skill.

## Steps

1. Confirm the target rendering host uses App Router.
2. Confirm or add `next-intl` provider wiring from `references/app-router-next-intl.md`.
3. Copy TSX from `references/search-experience/` into the target host.
4. Install dependencies listed in `references/package.json.dependencies.json`.
5. Register component-map entries using `references/component-map-registration.md`.
6. Copy/adapt YAML from `references/sitecore/` into the current module only.
7. Ask for search index/source ID if it is not present in the user's context.
8. Run `npm run build`.

## Rules

- Keep all generated files inside the current rendering host/module.
- Replace placeholders such as `{{hostRoot}}`, `{{componentNamespace}}`, and `{{collectionName}}`.
- Do not hardcode a search index ID unless supplied by the user or existing config.
