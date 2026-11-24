=== Noksha ===
Contributors: noksha
Requires at least: 6.6
Requires PHP: 8.1
Stable tag: 0.1.5
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Bangladesh-first landing pages with checkout, payments, and analytics.

== Description ==

Build a one-page offer, take cash on delivery, bKash, Nagad, or SSLCommerz on that page, and read the sales from a branded dashboard. The admin is English and Bengali. Colors and type are style tokens.

== Installation ==

1. Upload the `noksha` folder to `/wp-content/plugins/`.
2. Activate Noksha.
3. Open the Noksha menu and create a page.

== Changelog ==

= Unreleased =
* Sell a WooCommerce product from a landing page. Pick it in the editor (Offer tab); name, price, image and stock are read live, so the page and the order always agree. Variable products show an option picker.
* A WooCommerce product order creates a real WooCommerce order (items, totals, address, stock) and links it to the Noksha order. Statuses stay in step both ways. Cancelling gives the stock back.
* Out-of-stock products and quantities above stock are refused at checkout.
* Pixel and catalog events use the WooCommerce product id for store products.
* A store product can also be the order bump (simple products). It is read live and added to the same WooCommerce order; a sold-out bump is hidden.
* Settings > General: choose whether WooCommerce sends its own emails for landing page orders.
* Hooks for stores: filter `noksha_wc_shipped_status` (WooCommerce status for a shipped order, default processing) and action `noksha_wc_before_push`.
* Database version 9: `wc_order_id` on orders, product and variation ids on order items.

= 0.1.5 =
* Wallet auto-verify (bKash merchant / Nagad), courier webhooks, confirm/return analytics, canvas editor polish.

= 0.1.4 =
* Risk OTP, order bump, A/B variants, COD reconcile.

= 0.1.3 =
* Couriers, SMS, leads, blacklist, packing slip, SEO, editor autosave.

= 0.1.2 =
* Pixels/CAPI, thank-you, Dhaka shipping zones, TrxID tools, CSV/bulk, onboarding.

= 0.1.1 =
* Initial public loop: landing, COD/wallets, orders, funnel analytics.
