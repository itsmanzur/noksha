<?php
/**
 * Printable packing slip HTML (A4 full slip or 4-up A6 labels).
 *
 * @package Noksha
 * @var array|null  $noksha_order
 * @var array|null  $noksha_orders
 * @var string|null $noksha_layout
 */

if (!defined('ABSPATH')) {
    exit;
}

use Noksha\Options;
use Noksha\Packing\Barcode;

$orders = [];
if (!empty($noksha_orders) && is_array($noksha_orders)) {
    $orders = array_values($noksha_orders);
} elseif (!empty($noksha_order) && is_array($noksha_order)) {
    $orders = [$noksha_order];
}

$layout = 'a4';
if (!empty($noksha_layout) && in_array($noksha_layout, ['a4', 'labels'], true)) {
    $layout = $noksha_layout;
} elseif (isset($_GET['layout'])) {
    $candidate = sanitize_key((string) wp_unslash($_GET['layout']));
    if (in_array($candidate, ['a4', 'labels'], true)) {
        $layout = $candidate;
    }
}

$settings = Options::settings();
$store_name = trim((string) ($settings['sms']['sender'] ?? ''));
if ($store_name === '') {
    $store_name = (string) get_bloginfo('name');
}

$money = static function ($amount): string {
    return '৳' . number_format((float) $amount, abs((float) $amount - round((float) $amount)) < 0.001 ? 0 : 2);
};

$format_address = static function (array $order): string {
    return implode(', ', array_filter([
        $order['address'] ?? '',
        $order['upazila'] ?? '',
        $order['district'] ?? '',
        $order['division'] ?? '',
    ]));
};

$method_label = static function (array $order): string {
    $method = (string) ($order['method'] ?? '');
    return match ($method) {
        'cod' => 'Cash on delivery',
        'manual_bkash' => 'bKash',
        'manual_nagad' => 'Nagad',
        'sslcommerz' => 'Card / SSL',
        default => $method !== '' ? $method : '—',
    };
};

$is_cod = static function (array $order): bool {
    return (string) ($order['method'] ?? '') === 'cod';
};

$render_a4 = static function (array $order) use ($store_name, $money, $format_address, $method_label, $is_cod): void {
    $collect = $order['collectAmount'] ?? $order['total'] ?? 0;
    $number = (string) ($order['number'] ?? '');
    ?>
    <section class="slip-a4">
      <header class="slip-head">
        <div class="store"><?php echo esc_html($store_name); ?></div>
        <div class="order-no"><?php echo esc_html($number); ?></div>
      </header>
      <div class="barcode"><?php echo Barcode::code128_svg($number, 56); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></div>
      <div class="phone-block">
        <span class="phone-label">Phone</span>
        <span class="phone-value"><?php echo esc_html($order['phone'] ?? ''); ?></span>
      </div>
      <?php if ($is_cod($order)) : ?>
        <div class="cod-collect">COD — Collect <?php echo esc_html($money($collect)); ?></div>
      <?php else : ?>
        <div class="collect-line">Collect <?php echo esc_html($money($collect)); ?> · <?php echo esc_html($method_label($order)); ?></div>
      <?php endif; ?>
      <table class="items">
        <thead>
          <tr><th>Item</th><th>Qty</th><th>Price</th></tr>
        </thead>
        <tbody>
          <?php foreach (($order['items'] ?? []) as $item) : ?>
            <tr>
              <td><?php echo esc_html($item['name'] ?? ''); ?></td>
              <td><?php echo esc_html((string) ($item['qty'] ?? 1)); ?></td>
              <td><?php echo esc_html($money($item['price'] ?? 0)); ?></td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
      <div class="ship-meta">
        <?php if (!empty($order['courier'])) : ?>
          <div><strong>Courier:</strong> <?php echo esc_html($order['courier']); ?></div>
        <?php endif; ?>
        <?php if (!empty($order['trackingCode'])) : ?>
          <div><strong>Tracking:</strong> <?php echo esc_html($order['trackingCode']); ?></div>
        <?php endif; ?>
        <?php if (!empty($order['consignmentId'])) : ?>
          <div><strong>Consignment:</strong> <?php echo esc_html($order['consignmentId']); ?></div>
        <?php endif; ?>
      </div>
      <div class="ship-to">
        <strong><?php echo esc_html($order['name'] ?? ''); ?></strong>
        <div><?php echo esc_html($format_address($order)); ?></div>
        <?php if (!empty($order['note'])) : ?>
          <div class="note"><?php echo esc_html($order['note']); ?></div>
        <?php endif; ?>
      </div>
      <div class="slip-foot">
        <span><?php echo esc_html($order['createdAt'] ?? ''); ?></span>
        <span><?php echo esc_html($method_label($order)); ?></span>
      </div>
    </section>
    <?php
};

$render_label = static function (array $order) use ($store_name, $money, $format_address, $is_cod): void {
    $collect = $order['collectAmount'] ?? $order['total'] ?? 0;
    $number = (string) ($order['number'] ?? '');
    ?>
    <div class="label-cell">
      <div class="label-store"><?php echo esc_html($store_name); ?></div>
      <div class="label-order"><?php echo esc_html($number); ?></div>
      <div class="label-barcode"><?php echo Barcode::code128_svg($number, 36); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></div>
      <div class="label-phone"><?php echo esc_html($order['phone'] ?? ''); ?></div>
      <?php if ($is_cod($order)) : ?>
        <div class="label-cod">COD <?php echo esc_html($money($collect)); ?></div>
      <?php else : ?>
        <div class="label-cod muted"><?php echo esc_html($money($collect)); ?></div>
      <?php endif; ?>
      <div class="label-name"><?php echo esc_html($order['name'] ?? ''); ?></div>
      <div class="label-addr"><?php echo esc_html($format_address($order)); ?></div>
      <?php if (!empty($order['trackingCode'])) : ?>
        <div class="label-track"><?php echo esc_html($order['trackingCode']); ?></div>
      <?php endif; ?>
    </div>
    <?php
};

?><!doctype html>
<html lang="bn">
<head>
  <meta charset="utf-8">
  <title><?php echo esc_html($orders[0]['number'] ?? __('Packing slip', 'noksha')); ?></title>
  <link rel="stylesheet" href="<?php echo esc_url(NOKSHA_URL . 'assets/fonts.css'); ?>">
  <style>
    @page { margin: 10mm; }
    * { box-sizing: border-box; }
    body {
      font-family: "Noto Sans Bengali", "Source Sans 3", sans-serif;
      color: #111;
      margin: 0;
      padding: 16px;
      background: #f4f4f5;
    }
    body.layout-a4 .labels-only { display: none !important; }
    body.layout-labels .a4-only { display: none !important; }
    .no-print {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
      margin-bottom: 16px;
    }
    .no-print a, .no-print button {
      font: inherit;
      padding: 8px 14px;
      border-radius: 6px;
      border: 1px solid #d4d4d8;
      background: #fff;
      cursor: pointer;
      text-decoration: none;
      color: #111;
    }
    .no-print a.is-active, .no-print button.is-active {
      background: #111;
      color: #fff;
      border-color: #111;
    }
    .slip-a4 {
      max-width: 210mm;
      margin: 0 auto 24px;
      padding: 12mm;
      background: #fff;
      border: 1px solid #e4e4e7;
    }
    .slip-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 16px;
      margin-bottom: 12px;
    }
    .store { font-size: 14px; color: #52525b; text-transform: uppercase; letter-spacing: 0.04em; }
    .order-no { font-size: 32px; font-weight: 800; line-height: 1.1; }
    .barcode { margin: 8px 0 12px; }
    .barcode svg { max-width: 100%; height: auto; display: block; }
    .phone-block { margin: 12px 0; }
    .phone-label { font-size: 11px; color: #71717a; text-transform: uppercase; display: block; }
    .phone-value { font-size: 28px; font-weight: 700; letter-spacing: 0.02em; }
    .cod-collect {
      background: #fef3c7;
      border: 2px solid #f59e0b;
      color: #92400e;
      font-size: 22px;
      font-weight: 800;
      padding: 12px 16px;
      margin: 12px 0 16px;
      border-radius: 8px;
    }
    .collect-line { font-size: 16px; font-weight: 600; margin: 12px 0 16px; }
    table.items { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 14px; }
    table.items th, table.items td { border-bottom: 1px solid #e4e4e7; text-align: left; padding: 8px 4px; }
    table.items th { font-size: 11px; text-transform: uppercase; color: #71717a; }
    .ship-meta { font-size: 13px; margin: 12px 0; color: #3f3f46; }
    .ship-to { margin-top: 16px; padding-top: 12px; border-top: 1px solid #e4e4e7; font-size: 15px; line-height: 1.45; }
    .ship-to .note { margin-top: 6px; font-size: 13px; color: #52525b; }
    .slip-foot {
      margin-top: 16px;
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #71717a;
    }
    .page-a4 { page-break-after: always; }
    .page-a4:last-child { page-break-after: auto; }
    .label-sheet {
      max-width: 210mm;
      margin: 0 auto 24px;
      background: #fff;
      border: 1px solid #e4e4e7;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      width: 100%;
      aspect-ratio: 210 / 297;
      page-break-after: always;
    }
    .label-sheet:last-child { page-break-after: auto; }
    .label-cell {
      padding: 8mm 6mm;
      border: 1px dashed #d4d4d8;
      overflow: hidden;
      font-size: 12px;
      line-height: 1.35;
    }
    .label-store { font-size: 10px; text-transform: uppercase; color: #71717a; }
    .label-order { font-size: 18px; font-weight: 800; margin: 2px 0; }
    .label-barcode svg { width: 100%; height: auto; max-height: 40px; }
    .label-phone { font-size: 16px; font-weight: 700; margin: 4px 0; }
    .label-cod { font-size: 14px; font-weight: 800; color: #b45309; }
    .label-cod.muted { color: #3f3f46; font-weight: 600; }
    .label-name { font-weight: 700; margin-top: 4px; }
    .label-addr { font-size: 11px; color: #3f3f46; }
    .label-track { font-size: 10px; margin-top: 4px; font-family: monospace; }
    @media print {
      body { background: #fff; padding: 0; }
      .no-print { display: none !important; }
      .slip-a4, .label-sheet { border: none; margin: 0; max-width: none; }
    }
  </style>
</head>
<body class="layout-<?php echo esc_attr($layout); ?>">
  <div class="no-print">
    <a href="?layout=a4" class="<?php echo $layout === 'a4' ? 'is-active' : ''; ?>" data-layout-pick="a4">A4 slip</a>
    <a href="?layout=labels" class="<?php echo $layout === 'labels' ? 'is-active' : ''; ?>" data-layout-pick="labels">4-up labels</a>
    <button type="button" onclick="window.print()">Print</button>
  </div>

  <div class="a4-only">
    <?php foreach ($orders as $order) : ?>
      <div class="page-a4">
        <?php $render_a4($order); ?>
      </div>
    <?php endforeach; ?>
  </div>

  <div class="labels-only">
    <?php foreach (array_chunk($orders, 4) as $chunk) : ?>
      <div class="label-sheet">
        <?php
        foreach ($chunk as $order) {
            $render_label($order);
        }
        $pad = 4 - count($chunk);
        for ($p = 0; $p < $pad; $p++) {
            echo '<div class="label-cell" aria-hidden="true"></div>';
        }
        ?>
      </div>
    <?php endforeach; ?>
  </div>

  <script>
    (function () {
      var body = document.body;
      document.querySelectorAll('[data-layout-pick]').forEach(function (el) {
        el.addEventListener('click', function (e) {
          var mode = el.getAttribute('data-layout-pick');
          if (!mode) {
            return;
          }
          if (location.protocol === 'about:' || location.href.indexOf('?') === -1 && location.pathname === '') {
            e.preventDefault();
            body.classList.remove('layout-a4', 'layout-labels');
            body.classList.add('layout-' + mode);
            document.querySelectorAll('[data-layout-pick]').forEach(function (link) {
              link.classList.toggle('is-active', link.getAttribute('data-layout-pick') === mode);
            });
          }
        });
      });
    })();
  </script>
</body>
</html>