# larrybuckalew.github.io

The portfolio hub — **https://larrybuckalew.github.io/**

A single, dependency-free static site. No build step, no framework, no
`node_modules` in production: HTML, CSS and ~40 lines of vanilla JS that GitHub
Pages serves straight from `main`.

```
index.html               the whole page
404.html                 not-found page
.nojekyll                stops GitHub Pages running Jekyll over the files
robots.txt  sitemap.xml
assets/
  css/style.css          design tokens + all layout
  js/main.js             sticky nav, scroll reveals, footer year
  img/favicon.svg
  img/og.png             1200x630 social card
  img/projects/*.jpg     screenshots of the live sites
scripts/
  shoot-thumbs.mjs       regenerate the project screenshots
  og-card.mjs            regenerate assets/img/og.png
```

## Adding a project

1. Screenshot it (or run `node scripts/shoot-thumbs.mjs` to refresh all of them)
   into `assets/img/projects/<slug>.jpg`.
2. Drop a `.card` into the `.grid` in `index.html` — copy an existing one and
   change the `href`, `img src`, `alt`, heading, description and tags.
3. Add the entry to `sitemap.xml`.
4. Commit and push. Pages deploys within a minute or two.

### Replacing an existing thumbnail

If you overwrite a screenshot, bump the `?v=` query on that card's `img src`
(`nebula-demo.jpg?v=2` → `?v=3`). The filename stays the same, so browsers keep
serving the old bytes from cache and the change looks like it never landed.
GitHub Pages sends `Cache-Control: max-age=600`, so it does self-heal in about
ten minutes — but a query string makes it instant for everyone and avoids the
confusion. Hard-refresh (`Ctrl+Shift+R`) works too, it just only fixes your copy.

Cards with no live URL just leave the `.card__shot` link off and use a plain
`.list` row in the "Also built" section instead.

## Deploying

Pages is set to **Deploy from a branch** (`main` / root), so pushing to `main`
is the whole release process. There is no build to run and nothing to configure.

## Regenerating assets

Both scripts need Playwright with a browser available:

```bash
npm i -D @playwright/test      # only needed for the scripts
node scripts/shoot-thumbs.mjs  # refresh project screenshots
node scripts/og-card.mjs       # refresh the social card
```

## Notes

- `og.png` is committed as a real PNG on purpose. An extensionless file gets
  served as `application/octet-stream`, which Facebook, LinkedIn and Slack all
  refuse — shared links would render with no preview image.
- Thumbnails are JPEG (~80 KB each) rather than PNG. A PNG screenshot of a
  WebGL scene is ~1.5 MB, which would make the hub needlessly heavy.
- Live sites are linked directly. No iframes: four WebGL scenes loading at once
  is a slideshow of jank and would tank the page on mobile.
- Edit the contact email, name and tagline straight in `index.html`.
