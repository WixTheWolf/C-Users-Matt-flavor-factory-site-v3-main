/* ============================================================
   WYX Golf Supply — theme.js
   ============================================================ */
(function () {
  'use strict';

  var routes = window.routes || {};
  var theme = window.theme || { moneyFormat: '${{amount}}', cartType: 'drawer', strings: {} };

  /* ---------- Money formatting (Shopify-compatible) ---------- */
  function formatMoney(cents, format) {
    if (typeof cents === 'string') cents = cents.replace('.', '');
    var fmt = format || theme.moneyFormat || '${{amount}}';
    var value = '';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;

    function defaultTo(num, dec, thou, deci) {
      dec = isNaN(dec) ? 2 : dec;
      thou = thou === undefined ? ',' : thou;
      deci = deci === undefined ? '.' : deci;
      if (isNaN(num) || num == null) return 0;
      num = (num / 100.0).toFixed(dec);
      var parts = num.split('.');
      var dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thou);
      var centsPart = parts[1] ? deci + parts[1] : '';
      return dollars + centsPart;
    }

    var match = fmt.match(placeholderRegex);
    var token = match ? match[1] : 'amount';
    switch (token) {
      case 'amount': value = defaultTo(cents, 2); break;
      case 'amount_no_decimals': value = defaultTo(cents, 0); break;
      case 'amount_with_comma_separator': value = defaultTo(cents, 2, '.', ','); break;
      case 'amount_no_decimals_with_comma_separator': value = defaultTo(cents, 0, '.', ','); break;
      case 'amount_with_space_separator': value = defaultTo(cents, 2, ' ', ','); break;
      default: value = defaultTo(cents, 2);
    }
    return fmt.replace(placeholderRegex, value);
  }

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* ---------- Generic drawer/modal toggling ---------- */
  function openPanel(el) {
    if (!el) return;
    el.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closePanel(el) {
    if (!el) return;
    el.hidden = true;
    document.body.style.overflow = '';
  }

  function bindToggle(openAttr, closeAttr, panelEl) {
    if (!panelEl) return;
    $all('[' + openAttr + ']').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openPanel(panelEl);
      });
    });
    $all('[' + closeAttr + ']', panelEl).forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        closePanel(panelEl);
      });
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      [$('[data-mobile-nav]'), $('[data-search-modal]'), $('[data-cart-drawer]')].forEach(function (p) {
        if (p && !p.hidden) closePanel(p);
      });
    }
  });

  /* ---------- Mobile nav + search ---------- */
  bindToggle('data-menu-open', 'data-menu-close', $('[data-mobile-nav]'));
  bindToggle('data-search-open', 'data-search-close', $('[data-search-modal]'));
  var searchModal = $('[data-search-modal]');
  if (searchModal) {
    searchModal.addEventListener('transitionend', function () {});
    $all('[data-search-open]').forEach(function (b) {
      b.addEventListener('click', function () {
        setTimeout(function () { var i = $('.search-modal__input', searchModal); if (i) i.focus(); }, 50);
      });
    });
  }

  /* ---------- Cart ---------- */
  var cartDrawer = $('[data-cart-drawer]');
  bindToggle('data-cart-open', 'data-cart-close', cartDrawer);

  // Populate upsells on first load if the drawer already has items
  if ($('[data-cart-upsell]') && $('[data-cart-line]')) {
    getCart().then(function (cart) { loadUpsells(cart); }).catch(function () {});
  }

  function getCart() {
    return fetch(routes.cart_url + '.js', { headers: { 'Accept': 'application/json' } })
      .then(function (r) { return r.json(); });
  }

  function updateCartCount(count) {
    $all('[data-cart-count]').forEach(function (el) {
      el.textContent = count;
      el.classList.toggle('is-empty', count === 0);
    });
  }

  function renderDrawer(cart) {
    if (!cartDrawer) return;
    var body = $('[data-cart-body]', cartDrawer);
    var footer = $('.cart-drawer__footer', cartDrawer);
    if (!body) return;

    if (cart.item_count === 0) {
      body.innerHTML = '<div class="cart-drawer__empty"><p>' + (theme.strings.cartEmpty || 'Your cart is empty') +
        '</p><a href="' + (routes.all_products_collection_url || '/collections/all') + '" class="button button--secondary">Continue shopping</a></div>';
      if (footer) footer.style.display = 'none';
      return;
    }

    var html = '<ul class="cart-drawer__items">';
    cart.items.forEach(function (item) {
      var variant = (item.variant_title && item.variant_title.indexOf('Default') === -1)
        ? '<p class="cart-line__variant">' + item.variant_title + '</p>' : '';
      var img = item.image ? '<img src="' + item.image.replace(/(\.[^.]*)$/, '_160x$1') + '" alt="" width="80" height="80" loading="lazy">' : '';
      html += '<li class="cart-line" data-cart-line="' + item.key + '">' +
        '<a href="' + item.url + '" class="cart-line__media">' + img + '</a>' +
        '<div class="cart-line__info">' +
          '<a href="' + item.url + '" class="cart-line__title">' + item.product_title + '</a>' + variant +
          '<p class="cart-line__price">' + formatMoney(item.final_price) + '</p>' +
          '<div class="cart-line__qty">' +
            '<button class="qty-btn" data-qty-down data-line-key="' + item.key + '" aria-label="Decrease">−</button>' +
            '<input type="number" class="qty-input" value="' + item.quantity + '" min="0" data-line-key="' + item.key + '">' +
            '<button class="qty-btn" data-qty-up data-line-key="' + item.key + '" aria-label="Increase">+</button>' +
          '</div>' +
        '</div>' +
        '<button class="cart-line__remove" data-line-key="' + item.key + '" data-remove aria-label="' + (theme.strings.remove || 'Remove') + '">' +
          '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6l12 12M18 6L6 18" stroke-linecap="round"/></svg>' +
        '</button>' +
      '</li>';
    });
    html += '</ul>';
    body.innerHTML = html;

    if (footer) {
      footer.style.display = '';
      var sub = $('[data-cart-subtotal]', footer);
      if (sub) sub.textContent = formatMoney(cart.total_price);
    }
    bindCartLineEvents();
  }

  function updateShippingBar(totalPrice, itemCount) {
    if (!theme.showShippingBar) return;
    var bar = $('[data-shipping-bar]');
    if (!bar) return;
    var threshold = theme.freeShippingThreshold || 0;
    if (threshold <= 0) return;
    bar.hidden = itemCount === 0;
    var remaining = threshold - totalPrice;
    var textEl = $('[data-shipping-text]', bar);
    var fillEl = $('[data-shipping-fill]', bar);
    if (textEl) {
      textEl.innerHTML = remaining > 0
        ? "You're <strong>" + formatMoney(remaining) + "</strong> away from free shipping!"
        : "🎉 You've unlocked <strong>free shipping!</strong>";
    }
    if (fillEl) {
      var pct = Math.min(100, Math.round((totalPrice / threshold) * 100));
      fillEl.style.width = pct + '%';
    }
  }

  /* ---------- Cart upsell (complementary recommendations) ---------- */
  function loadUpsells(cart) {
    var wrap = $('[data-cart-upsell]');
    var list = $('[data-cart-upsell-items]');
    if (!wrap || !list || !routes.product_recommendations_url) return;
    if (!cart || cart.item_count === 0) { wrap.hidden = true; return; }

    var seed = cart.items[0].product_id;
    var inCart = cart.items.map(function (i) { return i.product_id; });
    var url = routes.product_recommendations_url + '.json?product_id=' + seed +
      '&limit=6&intent=complementary';
    fetch(url, { headers: { 'Accept': 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var products = (data.products || []).filter(function (p) { return inCart.indexOf(p.id) === -1; }).slice(0, 3);
        if (!products.length) { wrap.hidden = true; return; }
        var html = '';
        products.forEach(function (p) {
          var variantId = '';
          var single = p.variants && p.variants.length === 1;
          if (p.variants && p.variants.length) {
            var firstAvail = p.variants.filter(function (v) { return v.available; })[0] || p.variants[0];
            variantId = firstAvail.id;
          }
          var img = (p.featured_image && (p.featured_image.url || p.featured_image)) || '';
          if (img && img.indexOf('//') === 0) img = 'https:' + img;
          var price = (typeof p.price === 'number') ? formatMoney(p.price) : '';
          var action = single
            ? '<button class="cart-upsell__add" data-upsell-add data-variant-id="' + variantId + '">Add</button>'
            : '<a class="cart-upsell__add" href="' + p.url + '">Options</a>';
          html += '<div class="cart-upsell__item">' +
            '<a href="' + p.url + '" class="cart-upsell__media">' + (img ? '<img src="' + img + '" alt="" width="48" height="48" loading="lazy">' : '') + '</a>' +
            '<div class="cart-upsell__info"><a href="' + p.url + '" class="cart-upsell__title">' + p.title + '</a>' +
            '<span class="cart-upsell__price">' + price + '</span></div>' + action + '</div>';
        });
        list.innerHTML = html;
        wrap.hidden = false;
        $all('[data-upsell-add]', list).forEach(function (btn) {
          btn.addEventListener('click', function () {
            var id = this.getAttribute('data-variant-id');
            if (!id) return;
            var self = this; self.disabled = true; self.textContent = '…';
            fetch(routes.cart_add_url + '.js', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
              body: JSON.stringify({ id: id, quantity: 1 })
            }).then(function (r) { return r.json(); })
              .then(function () { refreshCart(false); })
              .catch(function () { self.disabled = false; self.textContent = 'Add'; });
          });
        });
      })
      .catch(function () { wrap.hidden = true; });
  }

  function refreshCart(openAfter) {
    return getCart().then(function (cart) {
      updateCartCount(cart.item_count);
      renderDrawer(cart);
      updateShippingBar(cart.total_price, cart.item_count);
      loadUpsells(cart);
      if (openAfter && theme.cartType === 'drawer' && cartDrawer) openPanel(cartDrawer);
      return cart;
    });
  }

  function changeLine(key, quantity) {
    return fetch(routes.cart_change_url + '.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ id: key, quantity: quantity })
    }).then(function (r) { return r.json(); }).then(function (cart) {
      updateCartCount(cart.item_count);
      renderDrawer(cart);
      updateShippingBar(cart.total_price, cart.item_count);
      // If on the cart page, reload to reflect totals/rows
      if (document.body.classList.contains('template-cart')) window.location.reload();
      return cart;
    });
  }

  function bindCartLineEvents() {
    $all('[data-remove]').forEach(function (btn) {
      btn.addEventListener('click', function () { changeLine(this.getAttribute('data-line-key'), 0); });
    });
    $all('[data-qty-up][data-line-key]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var input = $('.qty-input[data-line-key="' + this.getAttribute('data-line-key') + '"]');
        changeLine(this.getAttribute('data-line-key'), parseInt(input.value, 10) + 1);
      });
    });
    $all('[data-qty-down][data-line-key]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var input = $('.qty-input[data-line-key="' + this.getAttribute('data-line-key') + '"]');
        changeLine(this.getAttribute('data-line-key'), Math.max(0, parseInt(input.value, 10) - 1));
      });
    });
    $all('.qty-input[data-line-key]').forEach(function (input) {
      input.addEventListener('change', function () {
        changeLine(this.getAttribute('data-line-key'), Math.max(0, parseInt(this.value, 10) || 0));
      });
    });
  }
  bindCartLineEvents();

  /* ---------- Add to cart (product form) ---------- */
  var productForm = $('#ProductForm');
  if (productForm) {
    productForm.addEventListener('submit', function (e) {
      // Let payment button / non-AJAX fall through only if drawer disabled
      if (theme.cartType !== 'drawer') return;
      e.preventDefault();
      var btn = $('[data-add-to-cart]', productForm);
      var label = btn ? $('[data-add-label]', btn) : null;
      var prevText = label ? label.textContent : '';
      if (btn) { btn.disabled = true; }
      if (label) label.textContent = 'Adding…';

      var formData = new FormData(productForm);
      fetch(routes.cart_add_url + '.js', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      }).then(function (r) { return r.json().then(function (data) { return { ok: r.ok, data: data }; }); })
        .then(function (res) {
          if (!res.ok) {
            if (label) label.textContent = res.data.description || (window.cartStrings && window.cartStrings.error) || 'Error';
            setTimeout(function () { if (label) label.textContent = prevText; if (btn) btn.disabled = false; }, 2500);
            return;
          }
          if (label) label.textContent = 'Added ✓';
          refreshCart(true).then(function () {
            setTimeout(function () { if (label) label.textContent = prevText; if (btn) btn.disabled = false; }, 1200);
          });
        }).catch(function () {
          if (label) label.textContent = prevText;
          if (btn) btn.disabled = false;
        });
    });
  }

  /* ---------- Product recommendations (Search & Discovery API) ---------- */
  var recEl = $('[data-product-recommendations]');
  if (recEl && recEl.dataset.url) {
    fetch(recEl.dataset.url, { headers: { 'Accept': 'text/html' } })
      .then(function (r) { return r.text(); })
      .then(function (text) {
        var doc = new DOMParser().parseFromString(text, 'text/html');
        var inner = doc.querySelector('[data-product-recommendations]');
        if (inner && inner.innerHTML.trim().length) {
          recEl.innerHTML = inner.innerHTML;
          // Re-bind quick-add for the freshly injected cards
          bindQuickAdd($all('[data-quick-add]', recEl));
        }
      })
      .catch(function () {});
  }

  /* ---------- Quick add from product cards ---------- */
  function bindQuickAdd(buttons) {
    buttons.forEach(function (btn) {
      if (btn._quickBound) return;
      btn._quickBound = true;
      btn.addEventListener('click', function () {
        var id = this.getAttribute('data-variant-id');
        if (!id) return;
        var label = $('[data-quick-add-label]', this) || this;
        var prev = label.textContent;
        var self = this;
        self.disabled = true;
        label.textContent = 'Adding…';
        fetch(routes.cart_add_url + '.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ id: id, quantity: 1 })
        }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
          .then(function (res) {
            if (!res.ok) { label.textContent = (res.data && res.data.description) || 'Unavailable'; }
            else { label.textContent = 'Added ✓'; refreshCart(theme.cartType === 'drawer'); }
            setTimeout(function () { label.textContent = prev; self.disabled = false; }, 1400);
          }).catch(function () { label.textContent = prev; self.disabled = false; });
      });
    });
  }
  bindQuickAdd($all('[data-quick-add]'));

  /* ---------- Variant selection ---------- */
  var productEl = $('[data-product]');
  if (productEl) {
    var variantJsonEl = $('[data-variant-json]', productEl);
    var variants = [];
    try { variants = JSON.parse(variantJsonEl.textContent); } catch (e) {}
    var variantSelect = $('[data-variant-select]', productEl);

    function getSelectedOptions() {
      var opts = [];
      $all('.product-form__option').forEach(function (optEl) {
        var checked = $('input[data-option-selector]:checked', optEl);
        if (checked) opts.push(checked.value);
      });
      return opts;
    }

    function findVariant(selected) {
      return variants.find(function (v) {
        return selected.every(function (val, i) { return v.options[i] === val; });
      });
    }

    function updateVariant() {
      var selected = getSelectedOptions();
      if (!selected.length) return;
      var variant = findVariant(selected);
      var priceEl = $('.product__price', productEl);
      var addBtn = $('[data-add-to-cart]', productEl);
      var addLabel = addBtn ? $('[data-add-label]', addBtn) : null;

      if (variant) {
        if (variantSelect) variantSelect.value = variant.id;
        var url = new URL(window.location.href);
        url.searchParams.set('variant', variant.id);
        window.history.replaceState({}, '', url);
        if (priceEl) {
          var saleHtml = '<div class="price"><span class="price__current">' + formatMoney(variant.price) + '</span>';
          if (variant.compare_at_price && variant.compare_at_price > variant.price) {
            saleHtml = '<div class="price price--on-sale"><s class="price__compare">' + formatMoney(variant.compare_at_price) + '</s><span class="price__current">' + formatMoney(variant.price) + '</span>';
          }
          priceEl.innerHTML = saleHtml + '</div>';
        }
        if (addBtn) {
          addBtn.disabled = !variant.available;
          if (addLabel) addLabel.textContent = variant.available ? (theme.strings.addToCart || 'Add to cart') : (theme.strings.soldOut || 'Sold out');
        }
      } else if (addBtn) {
        addBtn.disabled = true;
        if (addLabel) addLabel.textContent = theme.strings.unavailable || 'Unavailable';
      }
    }

    $all('input[data-option-selector]', productEl).forEach(function (input) {
      input.addEventListener('change', updateVariant);
    });

    /* Product gallery thumbnails */
    var mainImg = $('#ProductMainImage', productEl);
    $all('[data-thumb]', productEl).forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        if (mainImg) mainImg.src = this.getAttribute('data-full');
        $all('[data-thumb]', productEl).forEach(function (t) { t.classList.remove('is-active'); });
        this.classList.add('is-active');
      });
    });

    /* Quantity buttons on product form */
    $all('[data-qty-up]:not([data-line-key])', productEl).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var input = $('.qty-input', this.parentNode);
        input.value = parseInt(input.value, 10) + 1;
      });
    });
    $all('[data-qty-down]:not([data-line-key])', productEl).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var input = $('.qty-input', this.parentNode);
        input.value = Math.max(1, parseInt(input.value, 10) - 1);
      });
    });
  }

  /* ---------- Facets (filter + sort) ---------- */
  var facetsForm = $('[data-facets-form]');
  if (facetsForm) {
    var submitFacets = function () {
      var params = new URLSearchParams(new FormData(facetsForm));
      // Drop empty values so the URL stays clean
      var clean = new URLSearchParams();
      params.forEach(function (val, key) { if (val !== '') clean.append(key, val); });
      var base = window.location.pathname;
      window.location.href = base + '?' + clean.toString();
    };
    $all('[data-facet-input]', facetsForm).forEach(function (input) {
      var evt = (input.type === 'number') ? 'change' : 'change';
      input.addEventListener(evt, submitFacets);
    });
    var facetToggle = $('[data-facets-toggle]');
    var facetPanel = $('[data-facets-panel]', facetsForm);
    if (facetToggle && facetPanel) {
      facetToggle.addEventListener('click', function () { facetPanel.classList.toggle('is-open'); });
    }
    $all('[data-facets-close]', facetsForm).forEach(function (b) {
      b.addEventListener('click', function () { if (facetPanel) facetPanel.classList.remove('is-open'); });
    });
  }

  /* ---------- Predictive search ---------- */
  var psInput = $('[data-predictive-input]');
  var psResults = $('[data-predictive-results]');
  if (psInput && psResults) {
    var psTimer = null;
    var renderResults = function (data) {
      var products = (data.resources && data.resources.results && data.resources.results.products) || [];
      var collections = (data.resources && data.resources.results && data.resources.results.collections) || [];
      var pages = (data.resources && data.resources.results && data.resources.results.pages) || [];
      if (!products.length && !collections.length && !pages.length) {
        psResults.innerHTML = '<p class="predictive__empty">No matches yet — keep typing.</p>';
        psResults.hidden = false;
        return;
      }
      var html = '';
      if (products.length) {
        html += '<div class="predictive__group"><h3 class="predictive__heading">Products</h3><ul class="predictive__products">';
        products.forEach(function (p) {
          var img = p.featured_image && p.featured_image.url ? '<img src="' + p.featured_image.url + '" alt="" width="48" height="48" loading="lazy">' : '';
          var price = (typeof p.price === 'number') ? formatMoney(p.price) : (p.price || '');
          html += '<li><a href="' + p.url + '" class="predictive__product">' +
            '<span class="predictive__product-media">' + img + '</span>' +
            '<span class="predictive__product-info"><span class="predictive__product-title">' + p.title + '</span>' +
            '<span class="predictive__product-price">' + price + '</span></span></a></li>';
        });
        html += '</ul></div>';
      }
      if (collections.length || pages.length) {
        html += '<div class="predictive__group"><h3 class="predictive__heading">Suggestions</h3><ul class="predictive__links">';
        collections.concat(pages).forEach(function (c) {
          html += '<li><a href="' + c.url + '">' + c.title + '</a></li>';
        });
        html += '</ul></div>';
      }
      psResults.innerHTML = html;
      psResults.hidden = false;
    };

    psInput.addEventListener('input', function () {
      var q = this.value.trim();
      clearTimeout(psTimer);
      if (q.length < 2) { psResults.hidden = true; psResults.innerHTML = ''; return; }
      psTimer = setTimeout(function () {
        var url = (routes.search_url || '/search') + '/suggest.json?q=' + encodeURIComponent(q) +
          '&resources[type]=product,collection,page&resources[limit]=6&resources[options][unavailable_products]=last';
        fetch(url, { headers: { 'Accept': 'application/json' } })
          .then(function (r) { return r.json(); })
          .then(renderResults)
          .catch(function () { psResults.hidden = true; });
      }, 250);
    });
  }
})();
