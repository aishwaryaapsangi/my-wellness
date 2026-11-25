# Body Recomp: original generated image layers

The five transparent WebP images in the already-prepared **body_recomp_generated_asset_pack.zip** are the approved original generated art—not redraws. Upload the WebP files without changes under these exact paths in this repository:

- `public/art/body-recomp-woman.webp`
- `public/art/body-recomp-clouds.webp`
- `public/art/body-recomp-drinks.webp`
- `public/art/body-recomp-gear.webp`
- `public/art/body-recomp-nyc-window.webp`

The BodyRecompBanner component now looks for these files first, and falls back to the existing SVG artwork only if the WebP file is missing. The images are already independent layers with their own positioning rules in `src/bodyRecompBanner.css`.

The original WebPs are included alongside PNG copies and a full-banner preview in the user-provided asset ZIP. **Do not upload the ZIP itself** to `public/art`: extract its `public/art/*.webp` files first.

When GitHub Pages rebuilds after all five WebP files are added, the site automatically displays the original generated artwork and no longer shows the SVG versions.
