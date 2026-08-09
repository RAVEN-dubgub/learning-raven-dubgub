# DedSec-inspired UI assets (Agent Git Lab)

Original and licensed reference assets for the learning app background.

| File | Role | Shipped in production UI |
|------|------|--------------------------|
| `texture-alley-mural.jpg` | Street texture layer (~5% opacity, desaturated) | Yes |
| `grid-overlay.jpg` | Grid atmosphere layer (~12% opacity, screen blend) | Yes |
| `mark-agl.svg` | Original header mark (`//AGL`) | Yes |

## Not shipped

- Watch Dogs 2 menu screenshots — palette reference only
- DedSec logo — Ubisoft IP; reference only
- Alamy watermarked graffiti — skipped

## Tuning

Opacity controlled via CSS variables in `src/app/globals.css`:

- `--dedsec-texture-opacity` (default `0.05`)
- `--dedsec-grid-opacity` (default `0.12`)
