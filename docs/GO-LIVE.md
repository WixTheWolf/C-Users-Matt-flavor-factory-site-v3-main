# WYX Golf Supply — Go-Live Runbook

The theme is complete and on `main` (passes `shopify theme check` with 0 offenses).
Everything below happens inside **your** Shopify admin — it can't be done from the
build sandbox because Shopify hosts are blocked there by network policy. Total time: ~20–30 min.

## 1. Connect the theme (2 min)
1. Shopify admin → **Online Store → Themes**
2. **Add theme → Connect from GitHub** → authorize GitHub
3. Repo: `WixTheWolf/C-Users-Matt-flavor-factory-site-v3-main` · Branch: **`main`**
4. It imports under **Theme library**. Click **Customize** to set logo, menus, colors,
   then **Preview**. Don't publish until products exist (step 3).

## 2. Build navigation (3 min)
Online Store → **Navigation**:
- **Main menu**: Clubs, Balls, Apparel, Accessories, About, Contact
- **Footer**: a "Shop" menu (collections) + "Support" menu (Contact, Shipping, Returns)
The header/footer read these automatically.

## 3. Add products (fastest = bulk import)
- **Products → Import** → upload `docs/products-import-template.csv` from this repo.
  These import as **drafts** with $0 inventory — edit prices, images, stock, then set
  each to **Active**. Replace the samples with your real catalog.
- Create **Collections** named to match the menu: Clubs, Balls, Apparel, Accessories
  (smart collections by Type or Tag work well — the CSV pre-tags products).

## 4. Turn on store features
- **Settings → Payments**: activate Shopify Payments (or PayPal) — required to take money.
- **Settings → Shipping**: set rates; the free-shipping bar is set to $99 (theme settings → Cart).
- **Apps → Search & Discovery**: enable **Filters** (collection pages) and
  **Recommendations** (the product-page "Complete your bag" row).

## 5. Domain + go live
- **Settings → Domains**: connect `wyxgolfsupply.com` (or move it from your current host).
- Remove the storefront **password** (Online Store → Preferences) when ready.
- Back in **Themes**, **Publish** the WYX Golf Supply theme.

## 6. First-sale checklist
- [ ] Place a real test order (Bogus Gateway or a live $1 product) and confirm checkout + email
- [ ] Confirm taxes/shipping calculate at checkout
- [ ] Share the store link / run a launch promo to drive first traffic

Updates: any push to `main` auto-syncs to the connected theme.
