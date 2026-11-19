# Bangladesh Facebook/TikTok COD Landing-Page Seller Journey (WordPress Plugin Scope)

Research date: 2026-11-19. Focus: practical capabilities for one WordPress plugin serving BD landing-page / f-commerce COD businesses — not a full ERP. Sources are BD courier docs, BD commerce platforms/plugins, Meta/TikTok developer docs, and secondary BD seller guides.

---

## Typical stack today (FB ads → landing → COD form → Messenger/phone confirm → Pathao/Steadfast/RedX → Google Sheet)? Where do plugins win?

### Takeaway
The modal BD journey is still **ad → single-offer mobile landing page → short COD form → human confirm (call/SMS/WhatsApp/Messenger) → courier booking → COD settlement**, with Google Sheets as the default ops layer until volume breaks it. Plugins win by collapsing retyping, status chaos, courier booking, fraud checks, and ad attribution into one order record — not by replacing confirmation culture or becoming an ERP.

### Cited Findings
- Sellsull’s 2026 BD landing-page guide states Facebook/TikTok ads should go to a single-offer page with on-page COD form (name, phone, address, quantity), because it converts better than a full shop or Messenger-only ordering, and because Pixel + Conversions API let Meta learn who actually orders. — [Sellsull: How to Build a Landing Page for Facebook Ads in Bangladesh](https://sellsull.com/blog/how-to-build-landing-page-facebook-ads-bangladesh)
- Reoncore Labs documents the f-commerce order life: inquiry → structured order → confirmation → COD or bKash advance → packing → courier booking → updates → delivery/return → COD settlement → aftersale; and describes the pre-software stack as notebook, phones, and a sheet. Fixed sheet statuses they recommend: New, Confirmed, Packed, Booked, Delivered, Returned, Cancelled, with the hard rule that nothing ships until Confirmed. — [Reoncore: F-commerce Order Management in Bangladesh](https://reoncorelabs.com/insights/f-commerce-order-management)
- Reoncore lists money leaks as fake/unconfirmed orders, returns, address/phone errors from chat retyping, stock mismatch, unreconciled COD payouts, and forgotten customers — and says major couriers (Steadfast, Pathao, RedX) expose merchant APIs so systems can book/track without copy-paste. — [Reoncore](https://reoncorelabs.com/insights/f-commerce-order-management)
- SMARTWAY’s Facebook commerce workflow warns that Messenger screenshots cause wrong products, duplicates, and wrong COD amounts; they prescribe a structured form (name, phone, address, product, variation, qty, total, note), unique order IDs, packing lists, tracking IDs on the order record, and fake/duplicate controls by phone/address. — [SMARTWAY: Facebook Page Order থেকে Delivery](https://courier.smartway.com.bd/blog/facebook-commerce-delivery)
- Easymall’s BD dropshipping guide: local COD dropshipping is the practical model; confirm every order by call before forwarding to supplier; track delivered/returns/profit weekly. — [Easymall: Dropshipping in Bangladesh](https://easymall.app/blog/dropshipping-in-bangladesh)
- Arrowbin’s courier-integration overview: a courier API books parcels from confirmed orders, stores tracking IDs, and pulls delivery/COD status back so staff stop retyping into merchant panels; RedX publishes open docs + sandbox + webhooks; Steadfast provides API keys and an official WooCommerce plugin; Pathao docs sit behind merchant login. — [Arrowbin: Bangladesh Courier API Integration](https://arrowbin.com/blog/courier-api-integration-bangladesh)
- Pathao Merchant API (community-documented): OAuth2 token issue, create order / bulk order, city→zone→area lookup, price calculation, order status; required fields include recipient name/phone/address, delivery_type, item_type, quantity, weight, amount_to_collect. — [Pathao Courier Merchant API (HackMD)](https://hackmd.io/@saikat/HyX7Wa2eR); [Pathao Python SDK](https://mojnomiya.github.io/pathao-python/)
- Steadfast (Packzy) API: base `https://portal.packzy.com/api/v1`, Api-Key + Secret-Key headers; create_order requires invoice, recipient_name, recipient_phone (11 digits), recipient_address, cod_amount; bulk up to 500; status by consignment/invoice/tracking; return requests; balance/payments; fraud_check by phone. — [SteadFast Postman docs](https://documenter.getpostman.com/view/26211192/2sAYJ1mhpk); [official SteadFast Laravel package](https://github.com/steadfast-it/SteadFast-Courier-Laravel-Package)
- RedX OpenAPI: sandbox `sandbox.redx.com.bd/v1.0.0-beta`, production `openapi.redx.com.bd/v1.0.0-beta`, header `API-ACCESS-TOKEN: Bearer …`; create parcel requires customer_name/phone, delivery_area + delivery_area_id, customer_address, cash_collection_amount, parcel_weight, value; optional merchant_invoice_id, pickup_store_id, is_closed_box; tracking messages available in English and Bengali; webhooks supported. — [RedX Developer API](https://redx.com.bd/developer-api/)
- Existing WP/Woo plugins already own courier booking niches: Bangla Track (Steadfast/Pathao/RedX/Carrybee booking + webhooks + PDF labels + COD reconciliation dashboard), BC CourierHub BD (multi-courier send/sync/webhooks/bulk), official SteadFast API plugin (single-courier one-click + bulk). — [Bangla Track Woo plugin](https://banglatrack.com/woocommerce-plugin/); [BC CourierHub BD](https://wordpress.org/plugins/bc-courierhub-bd/); [SteadFast API plugin](https://wordpress.org/plugins/steadfast-api/)
- Hosted BD commerce SaaS (Sellsull, Eazifiy, MStall, CZ Commerce) packages landing pages + COD + advance TrxID + courier + fraud tooling as one product — the competitive bar a “professional” WP plugin is measured against. — [Sellsull LP guide](https://sellsull.com/blog/how-to-build-landing-page-facebook-ads-bangladesh); [Eazifiy fake-order guide](https://eazifiy.com/blog/reduce-fake-orders-cod-bangladesh); [CZ Commerce payment methods](https://docs.czcommerce.app/en/payments/payment-methods)

### Inferences
- **Where plugins win (high leverage, WP-realistic):** (1) structured landing-page order capture replacing Messenger copy-paste; (2) BD address/phone normalization feeding courier APIs; (3) confirm-before-ship status machine; (4) one-click/bulk courier create + webhook status sync; (5) TrxID advance verification reducing COD collect amount; (6) Pixel/CAPI/TikTok Purchase with `event_id` dedupe; (7) basic COD collected/pending view so Sheets stop being the system of record.
- **Where plugins should not pretend to be ERP:** supplier purchasing, multi-warehouse WMS, full accounting, payroll, AI call centers, multi-brand franchise ops.
- Sheets remain the fallback for very early sellers; the plugin’s job is to make the jump from sheet → system feel obvious at ~dozens of orders/day (Reoncore’s trigger).

### Gaps
- No primary public study quantifying share of BD sellers still on Sheets vs WooCommerce vs SaaS (Sellsull/etc.); competitive share claims from plugin vendors should be treated as marketing.
- Pathao’s official developer portal content is not fully public; community HackMD/SDK docs are widely used but may lag Pathao’s live contract.
- Exact Google Sheets column templates vary by YouTube course; Reoncore’s column list is the strongest published BD ops template found.

---

## Checkout UX norms (name/phone required, district/upazila, COD vs bKash/Nagad TrxID, fake-order prevention, OTP?)

### Takeaway
BD checkout norms for landing-page COD are: **guest checkout, name + 11-digit mobile required, email/postcode optional, cascading district → thana/upazila + landmark, COD first, optional selective bKash/Nagad advance with TrxID, and layered fake-order filters (format validation → OTP optional/risk-based → courier fraud history → confirm call)**. Removing COD wholesale is treated as a conversion killer.

### Cited Findings
- Algomindz cites a 2026 BBS ICT household survey (via Ittefaq reporting): **86.8% of BD online shoppers use COD**, 13.9% mobile money, 3.1% cards, 1.1% internet banking (methods can overlap). Recommended flow: cart with inside/outside Dhaka delivery → name + 11-digit phone → district then area/thana then full address + landmark → COD first with bKash/Nagad/card options → selective delivery-charge advance → order number + SMS/WhatsApp. — [Algomindz: Checkout Design for Bangladesh](https://algomindz.com/blog/cash-on-delivery-checkout-design-bangladesh/)
- Algomindz: surprise delivery fees are a top abandonment reason; show inside Dhaka / suburbs / outside Dhaka early; keep advances small (commonly delivery charge ~৳70–130); notes Digital Commerce Operation Guidelines 2021 reports that larger advances may need Bangladesh Bank-approved escrow — verify current rules before large deposits. — [Algomindz](https://algomindz.com/blog/cash-on-delivery-checkout-design-bangladesh/)
- Sellsull LP form fields: name, phone, address, quantity; delivery charge inside/outside Dhaka; optional advance via bKash/Nagad + Transaction ID. — [Sellsull LP guide](https://sellsull.com/blog/how-to-build-landing-page-facebook-ads-bangladesh)
- Sellsull advance-payment product feature: per-product advance (fixed amount or delivery charge); TrxID required; duplicate TrxID blocked; admin verifies before reducing courier COD amount so fake TrxIDs cannot under-collect. — [Sellsull: COD অগ্রিম পেমেন্ট](https://sellsull.com/blog/cod-advance-payment-per-product-sellsull)
- CZ Commerce: manual bKash/Nagad/Rocket/bank with sender number + TrxID; advance rules = none / delivery charge only / fixed / percent; same TrxID cannot be reused; admin Verified/Reject workflow. — [CZ Commerce payment methods](https://docs.czcommerce.app/en/payments/payment-methods)
- WordPress ecosystem already encodes the same pattern: AAM Partial COD (delivery-charge advance + TrxID optional/required) and CodeCareBD (manual bKash/Nagad/Rocket + advance, screenshot optional). — [AAM Partial COD](https://wordpress.org/plugins/aam-partial-cod/); [CodeCareBD](https://wordpress.org/plugins/codecarebd-bkash-nagad-rocket-payoneer-gateway/)
- Address data: Woo plugin BD Address Fields ships 64 districts + 620 thanas/upazilas (incl. metro thanas); thikkit dataset: 8 divisions, 64 districts, 603 units bilingual EN/BN. Couriers deliver by area/landmark, not postcode. — [BD Address Fields for WooCommerce](https://wordpress.org/plugins/bd-address-fields-for-woocommerce/); [thikkit](https://thikkit.space/)
- Fake-order stack used by BD tools: phone format validation; SMS OTP (pre-order or flexible post-pending); courier history / fraud check; blacklist; duplicate phone windows; selective advance; confirm-before-ship. Eazifiy explicitly ranks OTP as cheap filter #1 and courier history as filter #3 used at confirmation, not always at checkout. — [Eazifiy: Reduce fake COD orders](https://eazifiy.com/blog/reduce-fake-orders-cod-bangladesh); [Hoorin Order Guard](https://hoorin.com/); [MStall](https://www.mstall.com/); [Advanced Order Tracker Pro](https://aot.marketingxpart.com/home-final/)
- Steadfast fraud API: `GET /fraud_check/{phone}` returns total_parcels / total_delivered / total_cancelled (and related score endpoints in community SDKs); recommended before high-value COD. — [SteadFast Laravel package fraudCheck](https://github.com/steadfast-it/SteadFast-Courier-Laravel-Package); [steadfast-merchant-sdk getFraudScore](https://github.com/Sifat07/steadfast-merchant-sdk)

### Inferences
- **Must-have checkout for a professional BD LP plugin:** name, phone (normalize `01XXXXXXXXX` / `+880` / `880`), quantity/variant, district → thana/upazila dropdowns, free-text address + optional landmark, inside/outside Dhaka (or zone) delivery charge visible before submit, COD default, thank-you with order ID.
- **Must-have payment adjacent:** manual bKash/Nagad (and ideally Rocket) personal/merchant numbers + TrxID capture + admin verify + COD amount adjustment; selective advance rules (outside Dhaka / high AOV / risky fraud score).
- **OTP is professional but not universal-default:** treat as configurable / risk-based so conversion isn’t tanked for low-risk offers; always keep phone validation + confirm workflow.
- Full SSLCommerz/bKash merchant API checkout is a later phase for stores that graduate past personal Send Money.

### Gaps
- No citable public A/B numbers for OTP conversion drop specifically in BD LP ads traffic (vendor blogs assert low drop among real buyers).
- Upazila vs Pathao city/zone/area vs RedX delivery_area_id mapping is non-trivial; plugins must map admin geography to each courier’s taxonomy — exact mapping tables are courier-specific and not standardized publicly.
- Current legal threshold for “large advance vs escrow” under Digital Commerce rules needs legal verification; Algomindz flags uncertainty.

---

## Ops needs: order statuses, bulk actions, courier API, SMS, invoice, packing slip, refunds

### Takeaway
Ops non-negotiables for a professional BD tool are a **confirm-centric status model**, **bulk confirm/courier-book/print**, **multi-courier API create + webhook/status sync + COD amount**, **transactional SMS (Bangla)**, and **printable invoice/packing slip/label**. Refunds in this market are mostly advance/TrxID adjustments and return/refusal handling, not card chargebacks.

### Cited Findings
- Reoncore recommended statuses: New → Confirmed → Packed → Booked → Delivered / Returned / Cancelled; confirm before courier; weekly settlement matching. — [Reoncore](https://reoncorelabs.com/insights/f-commerce-order-management)
- Bangla Track Woo plugin adds Preparing for Shipment and In Transit; books Steadfast/Pathao/RedX/Carrybee from orders table (single + bulk); webhook status; PDF labels/invoices; COD pending vs collected; payout reconciliation against orders. — [Bangla Track docs overview](https://banglatrack.com/docs/overview/); [Bangla Track Woo plugin](https://banglatrack.com/woocommerce-plugin/)
- BC CourierHub BD: manual/AJAX send, bulk send up to 10, webhook + hourly sync fallback, tracking shortcode, balance/fraud tools for Steadfast, Pathao city/zone/area helpers, RedX pickup store tools. — [BC CourierHub BD](https://wordpress.org/plugins/bc-courierhub-bd/)
- Steadfast statuses in community SDK guidance: parcels start `in_review`; treat `delivered` (not rider-reported pending) as COD owed; `cancelled` means returning — restock only when return status confirms. — [steadfast-merchant-sdk](https://github.com/Sifat07/steadfast-merchant-sdk)
- RedX create parcel fields include `cash_collection_amount`, `is_closed_box` (open-box vs sealed), bilingual tracking messages; webhook payload includes tracking_number, status, message_en/bn, invoice_number. — [RedX Developer API](https://redx.com.bd/developer-api/); [Arrowbin courier guide](https://arrowbin.com/blog/courier-api-integration-bangladesh)
- Pathao order create supports amount_to_collect, bulk orders, and city/zone/area hierarchy required for production booking quality. — [Pathao HackMD](https://hackmd.io/@saikat/HyX7Wa2eR)
- SMS: BD gateways (CloudWave, Send My SMS, SMSGELY, ZENOR) market WooCommerce order-placed / status / OTP SMS with Bangla Unicode support; SMSGELY documents events for new/processing/on-hold/completed/cancelled/failed/refunded with EN+BN templates. — [SMSGELY plugin](https://wordpress.org/plugins/smsgely-order-sms-otp/); [CloudWave SMS](https://sms.cloudwavebd.com/); [Send My SMS](https://www.sendmysms.net/)
- Invoice/packing slip: standard Woo PDF invoices & packing slips pattern (auto PDF, bulk print) is sold/used in BD store ops content. — [Digital Product BD: WooCommerce PDF Invoices & Packing Slips](https://digitalproduct.com.bd/product/woocommerce-pdf-invoices-packing-slips/)
- Algomindz / Reoncore: confirmation SMS within a minute with order number, total incl. delivery, expected date; hold if unreachable rather than ship. — [Algomindz](https://algomindz.com/blog/cash-on-delivery-checkout-design-bangladesh/); [Reoncore](https://reoncorelabs.com/insights/f-commerce-order-management)

### Inferences
**Must-have ops (Phase 1 “professional”):**
- Statuses roughly: Pending/New → Awaiting advance verify (if any) → Confirmed → Packed → Courier Booked / In Transit → Delivered → Returned → Cancelled (+ optional On Hold / Fraud Review).
- Order admin: filter by status/courier/date/phone; notes; duplicate phone warning; fraud score badge.
- Bulk actions: mark confirmed, send to courier (per selected courier), print packing slips/invoices/labels, export CSV (Sheets escape hatch).
- Courier: credentials for Steadfast + Pathao + RedX; create consignment; store tracking/consignment IDs; webhook or poll status; pass correct COD collect amount after advance.
- SMS hooks: order placed, confirmed, shipped+tracking, delivered/cancelled (Bangla templates).
- Documents: packing slip + simple invoice PDF; courier label if API provides or printable fallback.

**Later phases:**
- Full COD payout reconciliation ledger (Bangla Track’s differentiator).
- Auto-split multi-courier rules by zone.
- WhatsApp Business API automation / AI confirm calls (MStall-style).
- Return merchandise authorization workflows, partial refunds accounting, supplier dropship portals.
- Official merchant bKash/Nagad API auto-verify of TrxID (today most SMB flow is manual verify).

### Gaps
- Unified courier status taxonomy does not exist; plugin must normalize Pathao/Steadfast/RedX statuses into its own model — mapping tables need live API validation.
- Refund UX for pure COD (no advance) is mostly cancel-before-ship or return; little public BD-specific refund-state design beyond Woo’s Refunded status.
- Packing-slip legal/tax requirements for BD informal f-commerce are unclear; most need is operational, not tax-invoice compliance.

---

## Marketing needs: Meta/TikTok/Google pixels + CAPI, UTM, thank-you page, upsell, bundles, countdown, stock scarcity, multi-offer pages

### Takeaway
For ad-driven BD LPs, **attribution plumbing is non-negotiable** (Meta Pixel + CAPI Purchase with shared `event_id`, TikTok Pixel Purchase, UTM persistence onto the order, thank-you page). Conversion creative modules (countdown, scarcity, bundles, upsell, multi-offer) are high-value but secondary to correct Purchase events and delivery-charge honesty.

### Cited Findings
- Meta Pixel standard `Purchase` requires **currency and value**; fires when checkout completes / thank-you loads; also lists ViewContent, InitiateCheckout, etc. — [Meta Pixel reference](https://developers.facebook.com/documentation/meta-pixel/reference)
- Meta Conversions API: POST `/{PIXEL_ID}/events`; Purchase example includes hashed `em`/`ph`, `fbc`/`fbp`, `client_ip_address`, `client_user_agent`, `custom_data.value` + `currency`, `action_source`, `event_source_url`; send `event_id` for Pixel↔CAPI deduplication; event_time within 7 days. — [Meta CAPI: Using the API](https://developers.facebook.com/docs/marketing-api/conversions-api/using-the-api/)
- TikTok: standard web event `Purchase` (optimization `SHOPPING`) with recommended `content_type`, `quantity`, `content_id`, `currency`, `value`; legacy `CompletePayment` still accepted but new builds should use `Purchase` consistently on Pixel and Events API for dedupe. — [TikTok supported pixel events](https://business-api.tiktok.com/portal/docs/supported-pixel-events/v1.3); [TikTok install pixel using code](https://business-api.tiktok.com/portal/docs/install-pixel-using-code/v1.3)
- Sellsull positions Facebook Pixel + CAPI and TikTok Pixel as core LP setup; paid plans unlock Meta CAPI; features that raise AOV: coupons, free delivery, combo/bundle pages, upsells before order complete. — [Sellsull LP guide](https://sellsull.com/blog/how-to-build-landing-page-facebook-ads-bangladesh)
- Rizer (BD LP agency): Meta events for page view / order started / order placed; Google Ads conversion tags; WhatsApp/call tap events; campaign labels (UTM-style) on every ad link. — [Rizer Landing Page Design Bangladesh](https://rizerweb.com/bd/landing-page-design/)
- Common LP content blocks in BD guides: headline, multi-angle photos/video, price + strikethrough, bullets, social proof, delivery/payment rules, COD form; mistakes include hiding delivery charge and ad/page price mismatch. — [Sellsull](https://sellsull.com/blog/how-to-build-landing-page-facebook-ads-bangladesh)

### Inferences
**Must-have marketing (Phase 1):**
- Meta Pixel base + ViewContent / InitiateCheckout (or Lead) / Purchase on thank-you.
- Meta CAPI server Purchase (and ideally InitiateCheckout) with phone hashing (`ph`) — phone is the primary identifier in COD markets where email is often absent.
- Shared `event_id` = order ID for dedupe.
- TikTok Pixel Purchase (+ ViewContent).
- Capture UTM + fbclid/ttclid onto order meta; show source in admin.
- Dedicated thank-you page (not only admin email) for pixel fire + order summary + “we will call to confirm” trust copy.
- Google tag / gtag or Ads conversion label support (even if Meta/TikTok dominate traffic).

**Nice-to-have / Phase 2+:**
- One-click upsell / order-bump, combo/bundle LP builder, countdown timers, stock scarcity meters, multi-product offer pages, coupon-in-ad, A/B section variants, TikTok Events API server-side, Google Enhanced Conversions, post-purchase upsell SMS.

### Gaps
- Few BD-specific public case studies with audited ROAS lift from CAPI vs Pixel-only (treat Meta’s general guidance as authoritative for implementation, not for BD lift %).
- Scarcity/countdown effectiveness in BD is asserted in course/YouTube culture more than in primary research; mark as conversion UX opinion unless product telemetry exists.

---

## Language: Bengali admin + storefront; trust signals for BD buyers

### Takeaway
Bengali storefront copy is table-stakes for mass COD buyers; bilingual admin (Bangla-first or Bangla-capable) is a competitive expectation versus local SaaS. Trust signals that matter locally are **COD clarity, delivery charge & ETA by zone, real photos/reviews, return rules, reachable phone/WhatsApp, and confirmation SMS** — not Western card-badge theater alone.

### Cited Findings
- Sellsull explicitly says headline/language should match buyers; publishes Bangla companion LP guide; Bangla is default market language for many offers. — [Sellsull LP guide](https://sellsull.com/blog/how-to-build-landing-page-facebook-ads-bangladesh)
- Algomindz: allow Bangla or English address text; show COD availability plainly; show bKash/Nagad logos; confirm by SMS/WhatsApp; landmark field for rider trust. — [Algomindz](https://algomindz.com/blog/cash-on-delivery-checkout-design-bangladesh/)
- RedX tracking API returns `message_bn` alongside `message_en` — couriers themselves ship bilingual customer messaging. — [RedX Developer API](https://redx.com.bd/developer-api/)
- thikkit / BD address plugins emphasize bilingual district/upazila names. — [thikkit](https://thikkit.space/)
- SMSGELY and other BD SMS plugins advertise English + Bangla templates as a feature. — [SMSGELY](https://wordpress.org/plugins/smsgely-order-sms-otp/)
- Reoncore notes Ministry of Commerce DBID (2022) for online/Facebook businesses and Digital Commerce Operation Guidelines 2021 delivery deadlines for advance-paid orders (5 days same city / 10 days elsewhere) — trust/compliance context sellers increasingly cite. — [Reoncore](https://reoncorelabs.com/insights/f-commerce-order-management)

### Inferences
**Must-have language/trust:**
- Storefront strings in Bangla (or bilingual toggle): form labels, errors, delivery/payment explanations, thank-you, SMS.
- Admin UI at least translation-ready with Bangla pack; critical ops labels (statuses, fraud, courier) usable by Bangla-first staff.
- Trust modules: “ক্যাশ অন ডেলিভারি”, inside/outside Dhaka charge + time, return/exchange short policy, WhatsApp/call buttons, customer photo reviews, order confirmation SMS.

**Later:** full Bangla documentation, voice-note order intake, DBID display helpers, advanced policy pages required for gateway onboarding.

### Gaps
- No single authoritative UX study ranking which trust badges convert best on BD Facebook LP traffic.
- Whether admin must be 100% Bangla on day one vs English admin + Bangla storefront is a product decision; local SaaS competitors lean Bangla-heavy.

---

## Synthesis for Noksha: must-have vs later (WordPress plugin, not ERP)

### Takeaway
A “professional” BD landing-page COD plugin is credible when it covers **LP checkout + confirm ops + courier book/track + manual wallet advance + ad Purchase attribution + Bangla customer messaging**. Everything else is phase packaging.

### Cited Findings
- Competitive feature clusters already exist piecemeal in Woo (courier hubs, partial COD gateways, BD address dropdowns, SMS OTP, PDF slips) and as all-in-one BD SaaS (Sellsull/Eazifiy/etc.). — sources above across sections
- Courier API surface area for the big three is publicly integrable today (RedX most open; Steadfast well-documented via Postman/official Laravel package; Pathao via merchant credentials + community docs). — [RedX](https://redx.com.bd/developer-api/); [SteadFast Postman](https://documenter.getpostman.com/view/26211192/2sAYJ1mhpk); [Pathao HackMD](https://hackmd.io/@saikat/HyX7Wa2eR)

### Inferences

#### Non-negotiable (Phase 1 — “professional” MVP+)
1. Mobile single-offer landing page with on-page COD order form.
2. Required name + BD phone normalization; guest checkout; no forced email.
3. District → thana/upazila (+ landmark) address UX; inside/outside Dhaka delivery charge shown pre-submit.
4. Order statuses with confirm-before-courier rule; fraud/hold queue.
5. Manual bKash/Nagad (+ Rocket nice) Send Money + TrxID + admin verify; selective COD advance.
6. Basic fake-order defenses: phone validation, duplicate detection, blacklist, Steadfast (and/or multi) fraud check display.
7. Steadfast + Pathao + RedX: create order, store tracking, webhook/status sync, correct `amount_to_collect` / `cod_amount` / `cash_collection_amount`.
8. Bulk confirm / bulk courier send / CSV export; packing slip + invoice PDF.
9. Bangla SMS on place + ship (tracking); Bangla storefront strings.
10. Thank-you page + Meta Pixel/CAPI Purchase (`value`/`currency`/`event_id`/`ph`) + TikTok Pixel Purchase + UTM on orders.
11. Admin order screen that replaces the Google Sheet as system of record for daily ops.

#### Nice-to-have / Phase 2
- OTP (global or risk-based), WhatsApp template messaging, device/IP bot guards.
- Bundles, order bumps/upsells, countdown/scarcity, multi-product LPs, coupons.
- COD payout reconciliation dashboard; multi-pickup stores; auto courier selection.
- Google Ads Enhanced Conversions; TikTok Events API; closed-box courier flag UX.
- Merchant API auto payment verify; SSLCommerz/card path.
- Advanced analytics: confirmation rate, return rate by area/product, MER/ROAS by UTM.

#### Later / out of plugin scope (or Phase 3+)
- Full inventory WMS, purchasing, multi-branch accounting, HR.
- Built-in ad account management / creative studio.
- Nationwide shared fraud bureau beyond courier APIs (unless partnering).
- Replacing human confirmation for all orders.

### Gaps
- End-to-end “one plugin covers everything” is aspirational; realistic packaging is a tight Phase-1 core with clear upgrade modules so the product does not become an unfocused ERP.
- Primary research did not include paid YouTube course curricula beyond secondary blog echoes; treat course feature checklists as weak evidence unless corroborated by courier/docs/SaaS behavior.
