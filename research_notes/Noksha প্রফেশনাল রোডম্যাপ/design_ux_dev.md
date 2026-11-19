# Design, UX, and development patterns for modern landing-page / page builders (Noksha)

## What UX patterns do best builders use (canvas-first vs form-first, section libraries, inline edit, device frames, undo/redo, autosave, templates, design tokens, constraints that prevent ugly pages)?

### Takeaway
Best-in-class builders are **canvas-first for content/layout** with a **thin settings sidebar for advanced options**, not form-first page configuration. For a section-based product like Noksha, the winning pattern is: curated section library + inline content edit on a live preview, device frames, autosave with undo/redo, and hard design constraints (tokens, variants, limited freeform) so merchants assemble polished pages instead of inventing layout from scratch.

### Cited Findings
- Webflow’s primary workspace is a direct-manipulation **canvas**: hover outlines, click-to-select, drag with placement indicators, Navigator/breadcrumbs for hierarchy, and a canvas bar with undo/redo, breakpoints, and expand-canvas multi-device view — [Webflow canvas overview](https://help.webflow.com/hc/en-us/articles/33961319255059-Webflow-canvas-overview); [Intro to Webflow](https://help.webflow.com/hc/en-us/articles/33961260162323-Intro-to-Webflow)
- Webflow content editors edit **text, images, and links on the canvas** with immediate visual feedback; layout/styling stay protected; edits **autosave**, publishing is a separate action — [Edit content on the canvas](https://university.webflow.com/course-lesson/c21---edit-content---2-1---edit-content-on-the-canvas)
- Webflow undo/redo is first-class (`Cmd/Ctrl+Z`, `Shift+Cmd/Ctrl+Z`) and remains available during collaboration as **independent per-user history**; all edits autosave — [Keyboard shortcuts](https://help.webflow.com/hc/en-us/articles/33961359609875-Keyboard-shortcuts-in-Webflow); [Real-time collaboration](https://help.webflow.com/hc/en-us/articles/43232037920275-Real-time-collaboration)
- WordPress Gutenberg’s core principle: the **block content area is the primary UI** (direct manipulation); Block Toolbar is secondary for required controls; Settings Sidebar is **tertiary/advanced only**—critical actions must work when the sidebar is hidden (mobile/laptop) — [Block Design](https://developer.wordpress.org/block-editor/explanations/user-interface/block-design/)
- Gutenberg design principles: **placeholders** (“fill in the blanks”), **direct manipulation**, drag-and-drop as additive (not the only path), equal blocks in one inserter with search/recency/tabs — [Design Contributions](https://developer.wordpress.org/block-editor/contributors/design/)
- Gutenberg UI: toolbar holds undo/redo/insert/save; content area is immersive; settings cog hides sidebar for focus; good defaults so users can finish without opening advanced settings — [Gutenberg UI README](https://github.com/WordPress/gutenberg/blob/trunk/docs/explanations/user-interface/README.md)
- User testing showed Site Editor sidebars confuse users when Global Styles vs block settings compete and essential controls hide in collapsed sidebars — [Gutenberg issue #30737](https://github.com/WordPress/gutenberg/issues/30737)
- Shopify OS 2.0 is explicitly **section-based**: JSON templates store ordered sections/settings; merchants add/remove/reorder sections in the theme editor; up to **25 sections / 50 blocks per section** — [JSON templates](https://shopify.dev/docs/storefronts/themes/architecture/templates/json-templates); [Theme architecture](https://shopify.dev/docs/storefronts/themes/architecture)
- Shopify guidance: use sections for page-level modules; use blocks for within-section reorderable pieces; **avoid overly granular blocks**; settings scoped to section/block; layouts must remain logical regardless of block order — [Building with sections and blocks](https://shopify.dev/docs/storefronts/themes/best-practices/templates-sections-blocks)
- Framer scales via **text/color styles (tokens)**, reusable components with **variants + component variables**, and **modular section layouts** (hero, features, testimonials); primary breakpoint first, then refine smaller breakpoints — [Setting up your Framer site for scale](https://www.framer.com/help/articles/setting-up-your-framer-site-for-scale/); [Design Tokens](https://www.framer.com/dictionary/design-tokens); [Component variables](https://www.framer.com/academy/lessons/component-variables-in-framer)
- Framer component libraries: naming conventions (`Navigation/Menu`), Desktop/Tablet/Phone variants, **min/max width constraints** for predictable resize — [Best practices for setting up a component library](https://www.framer.com/help/articles/best-practices-for-setting-up-a-component-library/)
- WordPress patterns: starter patterns on new post/template creation; pattern directory registration via `theme.json`; curated patterns are a primary way to improve empty-canvas UX — [Patterns (curating editor experience)](https://developer.wordpress.org/block-editor/how-to-guides/curating-the-editor-experience/patterns/)
- Pattern discovery UX trends toward split-pane category browse + large previews, favorites, and “Browse all” explorers — [Pattern Inserter: Next](https://github.com/WordPress/gutenberg/issues/41379); [Gutenberg 16.7 notes](https://make.wordpress.org/core/2023/09/28/whats-new-in-gutenberg-16-7-27-september/)
- CartFlows separates **funnel structure** (list or Canvas Mode map) from **step design** (page builder / Gutenberg blocks); Canvas Mode is a visual funnel map with zoom, fullscreen (hides WP menus), minimap, Accept/Reject paths—not a freeform page canvas — [CartFlows Canvas Mode](https://cartflows.com/docs/cartflows-canvas-mode/); [Editing funnel steps](https://cartflows.com/docs/editing-and-customising-funnel-steps/)
- CartFlows UI redesign intentionally moved design settings into page-builder modules and reduced admin menu complexity (Flows / Settings / Templates) for beginner funnel creators — [Introducing the New CartFlows UI](https://cartflows.com/blog/new-cartflows-user-interface/); [WPMarmite CartFlows review](https://wpmarmite.com/en/cartflows/)

### Inferences
- **Noksha roadmap — editor model:** Prefer **preview-canvas-first + section picker**, not a long form that configures the whole page. Keep COD/product/shipping rules in a clear “Offer settings” panel; keep copy/media/layout on the canvas.
- **Section library over freeform:** Ship a curated library of BD offer sections (hero+price, trust bar, FAQ, COD form, testimonials, urgency, guarantee) with live thumbnails, categories, and “start from template” modal—Shopify/Gutenberg patterns, not Webflow’s full CSS canvas.
- **Inline edit constraints:** Allow inline edit for text/images/CTA labels; expose spacing/color/typography only via **token presets / section variants** (Framer variables + Shopify settings), not arbitrary CSS per element.
- **Device frames:** Desktop / tablet / mobile preview toggles (Webflow breakpoints pattern); optionally side-by-side later. Default mobile check for COD forms.
- **Autosave + undo/redo:** Debounced autosave with visible “Saved / Saving / Offline” status; undo stack for section reorder, content edits, and variant changes. Separate **Save draft** vs **Publish** if storefront is public.
- **Ugly-page prevention (design constraints):** Locked section grids; limited color palettes; type scale from tokens; max sections; no overlapping absolute positions; image aspect-ratio locks; “reset to template defaults” per section.
- **Funnel vs page canvas:** If Noksha has multi-step offers, use CartFlows-style **structure canvas** for steps and a **section editor** for each step’s page—don’t conflate the two.

### Gaps
- No primary-source CartFlows deep dive quantifying conversion lift from Canvas Mode vs list mode.
- Limited public product-engineering writeups on Webflow/Framer internal preview pipelines (mostly help-center UX docs).
- Shopify Hydrogen is a headless React storefront stack; OS 2.0 theme editor patterns are more directly analogous to Noksha’s section model than Hydrogen’s code architecture—Hydrogen-specific UX for builders was not strongly documented in sources retrieved here.
- No A/B study found that definitively ranks canvas-first vs form-first for WordPress COD plugins specifically.


## What design quality bar do high-converting BD/Global offer pages share (typography, spacing, trust, mobile, form friction)?

### Takeaway
High-converting offer/landing pages optimize for **one action**, **message match**, **scannable hierarchy**, **trust adjacent to the ask**, and **minimal form friction**—especially on mobile. For BD COD offers, that means clear value + price, verifiable social proof near the CTA, COD-friendly short forms with explicit required/optional marking, generous spacing (especially Bengali body text), and a single-column mobile layout.

### Cited Findings
- Stripe: landing pages differ from home/product pages by stripping navigation/side paths; high-converting pages include value headline, contextual hero media, benefit-led body, **one primary CTA**, social proof above the fold, trust signals near CTA; message match with ads matters — [Ecommerce landing page best practices (Stripe)](https://stripe.com/resources/more/ecommerce-landing-page-best-practices)
- Stripe cites cart abandonment rates of **over 80% mobile** and **68% desktop** as context for conversion risk (industry-level claim on their page) — [same Stripe article](https://stripe.com/resources/more/ecommerce-landing-page-best-practices)
- Stripe: Core Web Vitals (LCP, INP, CLS) affect conversion and search/paid quality; fixable issues include image compression/dimensions, `font-display: swap`, deferring third-party scripts — [same Stripe article](https://stripe.com/resources/more/ecommerce-landing-page-best-practices)
- Stripe: place star rating/review count near headline; short specific quote next to CTA; trust badges near price; CTA copy should state value (“Get 20% off today”), not mechanics (“Submit”); urgency only when real — [same Stripe article](https://stripe.com/resources/more/ecommerce-landing-page-best-practices)
- Stripe: landing→checkout handoff needs visual consistency, no surprise account creation, few fields, autofill/wallets; set expectation (“Checkout in 2 minutes”) — [same Stripe article](https://stripe.com/resources/more/ecommerce-landing-page-best-practices)
- Baymard: minimize form fields / interaction cost; hide rare fields (e.g., Address Line 2 behind a link); persistent labels above fields; mark **both required and optional** explicitly — [Checkout flow UX optimization](https://baymard.com/blog/checkout-flow-ux-optimization); [Required/optional fields research](https://baymard.com/research-articles/required-optional-form-fields)
- Baymard benchmark: only **14%** of sites mark both required and optional fields (desktop); only **6%** on mobile; failing to mark both causes validation errors, confusion, slower checkout, abandonments; **98%** of benchmarked sites have at least one optional field; fewer fields correlate with better overall UX performance — [Required/optional fields research](https://baymard.com/research-articles/required-optional-form-fields)
- Baymard: page-level “All fields required” statements are often overlooked; marking only optional or only required still causes errors/privacy abandonments; Microsoft-style asterisk + “(Optional)” is clear; findings strongest for checkout/long forms (short signup may differ) — [same Baymard article](https://baymard.com/research-articles/required-optional-form-fields)
- CXL: every extra field increases friction; ask only what’s needed for the current task; cites Baymard on excessive fields as a core checkout usability issue — [Form design best practices (CXL)](https://cxl.com/blog/form-design-best-practices/)
- Conversion Sciences (secondary aggregator of form studies): reports high form abandonment rates when forms are long or complicated (e.g., 81% abandoned after starting; 27% because too long)—treat as directional industry claims, not Baymard-grade primary research — [Landing page forms best practices](https://conversionsciences.com/designing-landing-page-forms-that-convert/)
- Trust-on-mobile guidance: ensure at least one **verifiable** trust signal above the first CTA (named customer/logo, sourced rating+count, short named quote); avoid vague “trusted by thousands” and unverified badges — [Trust signals before first CTA](https://www.cortality.com/blog/trust-signals-before-first-cta/)
- Placement pattern (vendor blog, useful but marketing-oriented): trust in three zones—above fold (credibility), near CTA (validation), near pricing (justification) — [Social proof placement](https://notiproof.com/resources/social-proof/social-proof-for-landing-pages/)
- Mobile payment UX: single-column stack, large tap targets, 1–2 trust badges near pay button, payment method logos, calm microcopy near submit — [Stripe mobile payment page tips](https://stripe.com/resources/more/mobile-payment-page-design-tips)
- Mobile social proof: prefer full-width cards, vertical stacks over carousels, large rating near buy button, 16px+ text, ~44px tap targets; avoid autoplay video — [Social proof on mobile patterns](https://testivo.tech/blog/social-proof-on-mobile)

### Inferences
- **Noksha storefront quality bar (templates):**
  - Hero: offer name + primary benefit + price/COD clarity + one CTA within first viewport.
  - Trust strip: rating+count or logos/testimonials **before or beside** first CTA—not only footer.
  - Body rhythm: consistent vertical spacing scale (e.g., 8/16/24/40); sections with one job each.
  - COD form: Name, Phone, Address (± District/Thana as needed); hide optional fields; mark Required/* and Optional; labels above inputs; inline validation; preserve input on error.
  - Mobile: single column; sticky CTA optional; 16–18px body; 44px+ buttons; no hover-only interactions.
- **BD-specific offer copy defaults:** Show delivery/COD terms, return/exchange policy snippet, and local phone support near form—map to “trust near ask.”
- **Performance bar for templates:** Pre-sized hero images, limited fonts (Latin + Bengali subset), no heavy chat widgets on offer pages by default.
- **Editor constraints that raise the quality bar:** Template sections that already place proof near CTA; discourage removing trust section without warning; discourage second competing CTA in hero.

### Gaps
- No Baymard/CXL study specifically on **Bangladesh COD landing pages** (phone-first, cash-on-delivery, district/thana fields). Global checkout research must be adapted carefully.
- Stripe’s 80%/68% abandonment figures are industry context on a commercial page—not a controlled study of landing pages alone.
- Limited high-quality comparative visual audits of top BD offer pages in this research pass (no systematic screenshot corpus).
- Conversion Sciences form abandonment percentages should be treated cautiously without primary study links.


## What development architecture patterns keep builders maintainable (block schema, sanitization, preview pipelines, design tokens, component libraries)?

### Takeaway
Maintainable builders separate **document schema** (ordered sections + typed settings), **design tokens**, **render components**, and **sanitize-on-save/load**. WordPress `block.json`/`theme.json` and Shopify section schemas show the pattern: declare allowed settings, validate shape, drop unknown keys, preview with the same component tree as production (or a thin isomorphic layer), and expose only safe instance overrides.

### Cited Findings
- Shopify architecture stack: layout → JSON template / section groups → sections → blocks → snippets; sections are reusable customizable modules; blocks reorder within sections — [Theme architecture](https://shopify.dev/docs/storefronts/themes/architecture)
- Shopify theme blocks vs section blocks: theme blocks reusable across sections (nesting possible); section blocks local/single-level; don’t mix both types in one section; prefer grouping related settings over micro-blocks — [Blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks); [Building with sections and blocks](https://shopify.dev/docs/storefronts/themes/best-practices/templates-sections-blocks)
- Shopify antifragility: don’t support arbitrary app/extra blocks if unexpected types break layout/CSS or muddy section purpose — [Building with sections and blocks](https://shopify.dev/docs/storefronts/themes/best-practices/templates-sections-blocks)
- WordPress `block.json` schema defines name, attributes, supports; `theme.json` defines presets (colors, typography, spacing) and global styles; editors use `$schema` URLs for validation — [JSON Schema in WordPress](https://developer.wordpress.org/news/2024/07/json-schema-in-wordpress/); [Gutenberg schemas README](https://github.com/WordPress/gutenberg/blob/trunk/schemas/README.md)
- WordPress runtime sanitization: `WP_Theme_JSON` migrates then **sanitizes** input against valid top-level keys, valid block names, elements, and style variations—unknown keys are stripped — [WP_Theme_JSON](https://developer.wordpress.org/reference/classes/wp_theme_json/); [WP_Theme_JSON::sanitize](https://developer.wordpress.org/reference/classes/wp_theme_json/sanitize/)
- Schema vs runtime: JSON Schema checks shape/types; WordPress may still drop/ignore values; don’t rely on schema alone for security or behavior—surface rejections where authors see them — [Gutenberg schemas README](https://github.com/WordPress/gutenberg/blob/trunk/schemas/README.md)
- Framer: variables as design tokens (colors, numbers, responsive values); components expose **instance variables** for content while locking structure; variants for meaningful layout/state changes — [Design Tokens](https://www.framer.com/dictionary/design-tokens); [Component variables](https://www.framer.com/academy/lessons/component-variables-in-framer)
- Framer component library: central library, update propagation, structural naming, breakpoint variants, size constraints — [Component library best practices](https://www.framer.com/help/articles/best-practices-for-setting-up-a-component-library/)
- Gutenberg block design: good defaults, setup/placeholder states when preview isn’t 1:1 with config, avoid putting essential controls only in sidebar — [Block Design](https://developer.wordpress.org/block-editor/explanations/user-interface/block-design/)
- CartFlows provides dedicated Gutenberg blocks per funnel step (Next Step, Opt-in, Checkout, Upsell) so functional commerce UI is componentized rather than free HTML — [CartFlows Block Editor Blocks](https://cartflows.com/docs/cartflows-gutenberg-blocks/)

### Inferences
- **Noksha data model (roadmap):**
  ```text
  OfferDocument {
    meta, tokensOverride?,
    sections: [{ id, type, variant, settings, blocks? }]
  }
  ```
  Mirror Shopify JSON templates: ordered typed sections with JSON Schema + PHP sanitize allowlists.
- **Section registry:** Each section type = schema (settings/attributes) + admin React editor controls + public render component + default content. Forbid unknown `type` on load.
- **Sanitization:** On save and on load: allowlisted keys/types; `wp_kses` for rich text; escape on output; never trust client JSON for prices/shipping rules—server recomputes critical commerce fields.
- **Design tokens:** CSS variables generated from a token file (`--nk-color-brand`, `--nk-space-4`, `--nk-font-bn`, type scale). Sections consume tokens only; editor theme presets switch token sets.
- **Preview pipeline:** Prefer **same React/PHP components** for admin canvas and storefront with an `isEditor` flag for chrome (outlines, drop zones). Avoid a second “approximate HTML” preview that drifts.
- **Component library:** Shared UI kit for Button, Price, Badge, FormField, TrustStrip, SectionShell. Section variants (e.g., `hero/split`, `hero/stacked`) instead of forking templates.
- **Template packs:** Versioned JSON documents + asset manifests; import/export like Gutenberg patterns JSON.
- **Capability split:** Content overrides (Framer variables) vs structural edits (add/reorder sections). Merchants edit content; “advanced layout” gated or locked in section variants.

### Gaps
- No open detailed reference architecture for “React admin editor inside `wp-admin` + isomorphic public render” specific to COD funnels—patterns must be composed from Gutenberg/Shopify/Framer.
- Preview strategies (iframe vs inline React vs SSR snapshot) are underspecified in public builder docs; tradeoffs (CSS isolation, WP admin chrome, performance) need Noksha-specific prototyping.
- Hydrogen’s React Server Components / Oxygen hosting patterns are only loosely relevant to a WP plugin sandbox and were not deeply sourced here.


## Accessibility, Bengali typography, and admin usability at laptop widths (~1024–1366) with WP admin chrome

### Takeaway
Accessibility and Bengali readability require correct `lang`, looser line-height, no letter-spacing/synthetic italics, and real font weights; WCAG also requires layouts that survive user text-spacing overrides. At 1024–1366px with WP admin chrome, treat the editor like Gutenberg: **don’t put critical controls only in a collapsible right sidebar**, support fullscreen/distraction-free modes, and design for ~700–900px effective canvas width.

### Cited Findings
- WCAG 3.1.1: default human language of the page must be programmatically determinable (`lang`) so AT/browsers apply correct pronunciation and fonts — [Understanding SC 3.1.1](https://www.w3.org/WAI/WCAG22/Understanding/language-of-page.html)
- WCAG 1.4.12: no loss of content/functionality when users set line-height ≥1.5× font size, paragraph spacing ≥2×, letter-spacing ≥0.12×, word-spacing ≥0.16× (scripts that don’t use a property may omit it) — [Understanding SC 1.4.12](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html)
- Bengali web typography practice: body `line-height` ~**1.6–1.8**, headings ~**1.3–1.4**; Bengali often needs slightly larger optical size than Latin at same `font-size`; avoid `letter-spacing`; avoid synthetic italic (use weight/color); stack recommended fonts such as Noto Sans Bengali / Hind Siliguri — [Bangla Web Typography (ABCL TECH)](https://abcltech.com/html-css/bangla-on-the-web.html)
- Measured Bangla UI guidance: Noto Sans Bengali ink height can clip below ~1.4 line-height in single-line controls; recommend body 1.6+, UI controls ≥1.4, `letter-spacing: 0`, `font-synthesis: none`, NFC Unicode, grapheme-aware truncation; use `:lang(bn)` tokens — [Best Bangla fonts for apps](https://maniruzzamanjubayer.com/blog/bangla-interface-typography)
- Non-Latin web CSS pitfalls: letter-spacing breaks conjuncts; synthetic bold/italic looks poor; justify creates uneven gaps; tight heading leading collides vowel signs — [Non-Latin scripts on the web](https://websolutionmaster.com/blog/non-latin-scripts-on-the-web)
- Gutenberg: Settings Sidebar hidden by default on small screens and dismissible on desktop—**essential block operation must not depend on it**; consider mobile; support dark editor background — [Block Design](https://developer.wordpress.org/block-editor/explanations/user-interface/block-design/)
- Gutenberg: drag-and-drop is secondary; provide explicit click/keyboard alternatives for accessibility — [Design Contributions](https://developer.wordpress.org/block-editor/contributors/design/)
- CartFlows Canvas Mode **Full Screen** hides WordPress menus to give the canvas the whole screen (`Esc` to exit)—explicit response to WP admin chrome crowding — [CartFlows Canvas Mode](https://cartflows.com/docs/cartflows-canvas-mode/)
- Baymard: mobile form overview is harder; failing to mark required/optional is especially damaging on small viewports (75% of users in their testing hit severe issues on such designs) — [Required/optional fields research](https://baymard.com/research-articles/required-optional-form-fields)
- Gutenberg pattern/inserter work emphasizes discoverability under constrained UI (split panes, browse-all explorers) rather than denser sidebars — [Pattern Inserter: Next](https://github.com/WordPress/gutenberg/issues/41379)

### Inferences
- **Storefront a11y/Bengali checklist for Noksha:**
  - Set `lang="bn"` (or `bn-BD`) on Bengali offers; bilingual pages mark language switches.
  - Tokenize `:lang(bn) { line-height; letter-spacing: 0; font-synthesis: none; }`.
  - Load real Bengali weights (400/600/700); subset with `unicode-range`; `font-display: swap`.
  - Form fields: visible labels (not placeholder-only), error text linked via `aria-describedby`, focus visible, 44px targets.
  - Ensure layouts reflow under WCAG text spacing (no fixed-height text boxes that clip matras).
- **Admin at 1024–1366 with WP chrome:**
  - Budget: WP left menu (~160px) + optional Noksha left library (~240px) + right inspector (~280px) leaves a narrow canvas—default to **collapsed inspector until section selected**, or **fullscreen editor** (CartFlows pattern).
  - Put section movers, variant switch, duplicate/delete in **contextual toolbar** on the selected section (Gutenberg Block Toolbar pattern).
  - Offer settings (product, price, COD fields) as a top-level tab, not buried only in the right sidebar.
  - Keyboard: undo/redo, move section up/down, Esc to deselect—don’t rely on drag alone.
  - Preview device switcher always visible in the top bar at laptop widths.
- **Editor typography:** Admin UI can stay Latin/system UI fonts; canvas preview must render the storefront Bengali stack so merchants see true line breaks/clipping.
- **Roadmap phasing:** (1) fullscreen + contextual toolbar + autosave; (2) Bengali token pack + form a11y; (3) richer pattern library; (4) optional collab/presence later.

### Gaps
- No formal usability study of WordPress plugin editors specifically at 1024–1366px widths found in this pass—recommendations extrapolate from Gutenberg sidebar issues and CartFlows fullscreen.
- Bengali sources are strong on typography mechanics but lighter on ecommerce conversion interaction with Bangla copy length (longer words/wrapping in CTAs).
- Screen-reader testing results for BD COD forms (Bengali labels + phone fields) were not located; WCAG criteria are cited instead of product-specific audits.
- Hydrogen accessibility guidance was not retrieved; WP + WCAG + Bangla sources carry this section.
