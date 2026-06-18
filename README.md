# WYX Golf Supply — Shopify Theme

A custom, conversion-focused Shopify theme for **wyxgolfsupply.com**, built to run the
storefront directly on Shopify. It follows Shopify's Online Store 2.0 architecture
(JSON templates + sections + section groups), so everything is editable in the Shopify
theme editor while living in version control here.

## What's included

- **Layouts** — `theme.liquid` (storefront) + `password.liquid` (coming-soon/dev gate)
- **Templates** (JSON, OS 2.0) — home, product, collection, list-collections, cart,
  page, contact page, blog, article, search, 404, password
- **Sections** — header (with mega-nav, search, sticky), footer, announcement bar,
  hero banner, featured collection, collection list, image-with-text, rich text,
  value props, newsletter, product, collection grid, cart, blog/article, contact form
- **Snippets** — product card, price, cart drawer, pagination, icons, social icons, meta tags
- **Assets** — `base.css` (full responsive design system) + `theme.js` (AJAX cart drawer,
  variant switching, product gallery, mobile nav, search, sort)
- **Config** — theme settings schema (brand colors, typography, layout, cart, social)
- **Locales** — `en.default.json`

## Brand defaults

- Fairway green `#14542E` / deep green `#0B3D21`, sand-gold accent `#C9A86A`
- Headings: Poppins · Body: Work Sans (swap in the editor under **Typography**)

## Connecting this theme to Shopify (GitHub integration)

This repo is meant to be connected to the store via Shopify's native GitHub integration —
no manual uploads, every push syncs:

1. In Shopify admin: **Online Store → Themes → Add theme → Connect from GitHub**
2. Authorize GitHub and select this repository.
3. Choose the branch `claude/wyxgolfsupply-shopify-build-i3l37m` (or `main` after merge).
4. Shopify imports the theme. Open the **theme editor** to set the logo, menus, and
   sections, then **Preview** and **Publish** when ready.

> Alternatively, develop locally with the [Shopify CLI](https://shopify.dev/docs/themes/tools/cli):
> `shopify theme dev --store wyxgolfsupply.myshopify.com` then `shopify theme push`.

## After connecting — store setup checklist

These live in Shopify admin (not in theme code):

- [ ] Add products & collections (Clubs, Balls, Apparel, Accessories…)
- [ ] Build the **main-menu** and footer menus (Navigation)
- [ ] Upload logo + favicon (theme editor → Branding)
- [ ] Configure payments, shipping zones, and taxes
- [ ] Connect the `wyxgolfsupply.com` domain (Settings → Domains)
- [ ] Set social links (theme settings → Social media)
- [ ] Review checkout, refund, and privacy policies

## Local structure

```
assets/      base.css, theme.js
config/      settings_schema.json, settings_data.json
layout/      theme.liquid, password.liquid
locales/     en.default.json
sections/    header, footer, hero, product, collection, cart, …
snippets/    product-card, price, cart-drawer, icon, …
templates/   index.json, product.json, collection.json, …
```
