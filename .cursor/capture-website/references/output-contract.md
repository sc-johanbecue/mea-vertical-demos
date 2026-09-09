# Capture output contract

```txt
design-screenshots/{project}/
  sections/
    manifest.json
    component-blueprint.json
    {section-folder}/
      {section-folder}-desktop.png
      {section-folder}-tablet.png
      {section-folder}-mobile.png
      section.html
      section-plan.json
  {page-slug}/
    desktop.png
    desktop-clean.png
    tablet.png
    tablet-clean.png
    mobile.png
    mobile-clean.png
    page.html
    source-url.txt
    page-manifest.json
    page-decomposition.json
    new-sections-manifest.json
    css/
  site-summary.json
  site-content-tree.json
```

## File meaning

| File | Meaning |
|---|---|
| `{device}.png` | Full page with visible sticky/overlay UI. |
| `{device}-clean.png` | Full page after sticky/overlay UI is hidden. |
| `page.html` | Rendered DOM. Used for text, assets, links, selectors. |
| `page-manifest.json` | Page section order, screenshot paths, design tokens. |
| `sections/manifest.json` | Site-level reusable section/component registry. |
| `component-blueprint.json` | Sitecore-oriented component plan if generated. |
| `new-sections-manifest.json` | Queue of components that need TSX/YAML versus reuse. |
