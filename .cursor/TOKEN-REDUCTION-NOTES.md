# Token reduction notes

Approximate byte counts from this conversion:

| Metric | Original upload | Optimized pack |
|---|---:|---:|
| `SKILL.md` files only | 258,936 bytes | 15,240 bytes |
| All files excluding `node_modules` | 1,460,876 bytes | 727,949 bytes |

The optimized pack may still include generator scripts/templates and selected reference files. Those preserve outcome capability without forcing the agent to read long workflow docs up front.

## Main reductions

- Removed bundled `node_modules`.
- Merged `url-page-html` into `capture-website`.
- Merged `mimic-url` orchestration into `website-to-sitecore`.
- Merged page/component/section/content-sdk build instructions into `sitecore-from-capture`.
- Merged collection/site/rendering/media serialization into `sitecore-yaml`.
- Moved rare support tasks into `sitecore-utilities`.


## Runtime dependencies outside skills

The capture skill no longer has its own `package.json` or `package-lock.json`. The setup script creates a shared `.cursor/package.json` so Playwright installs into `.cursor/node_modules`, not `.cursor/skills/capture-website/node_modules`. This prevents accidental dependency trees from becoming part of the skill package.
