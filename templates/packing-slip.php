<?php
/**
 * Printable packing slip / invoice HTML.
 *
 * @package Noksha
 * @var array $noksha_order
 */

if (!defined('ABSPATH')) {
    exit;
}
$order = $noksha_order;
$money = static function ($amount): string {
    return '৳' . number_format((float) $amount, abs((float) $amount - round((float) $amount)) < 0.001 ? 0 : 2);
};
?><!doctype html>
<html lang="bn">
<head>
  <meta charset="utf-8">
  <title><?php echo esc_html($order['number'] ?? ''); ?></title>
  <style>
    body { font-family: "Noto Sans Bengali", "Source Sans 3", sans-serif; color: #111; margin: 24px; }
    h1 { font-size: 20px; margin: 0 0 8px; }
    .meta, .box { margin: 12px 0; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th, td { border-bottom: 1px solid #ddd; text-align: left; padding: 8px 4px; }
    .total { font-size: 18px; font-weight: 700; }
    @media print { button { display: none; } body { margin: 0; } }
  </style>
</head>
<body>
  <button onclick="window.print()">Print</button>
  <h1>Noksha packing slip</h1>
  <div class="meta">
    <div><strong>Order:</strong> <?php echo esc_html($order['number'] ?? ''); ?></div>
    <div><strong>Date:</strong> <?php echo esc_html($order['createdAt'] ?? ''); ?></div>
    <div><strong>Status:</strong> <?php echo esc_html($order['status'] ?? ''); ?></div>
    <?php if (!empty($order['trackingCode'])) : ?>
      <div><strong>Tracking:</strong> <?php echo esc_html($order['trackingCode']); ?></div>
    <?php endif; ?>
  </div>
  <div class="grid">
    <div class="box">
      <strong>Ship to</strong>
      <div><?php echo esc_html($order['name'] ?? ''); ?></div>
      <div><?php echo esc_html($order['phone'] ?? ''); ?></div>
      <div><?php echo esc_html(implode(', ', array_filter([
          $order['address'] ?? '',
          $order['upazila'] ?? '',
          $order['district'] ?? '',
          $order['division'] ?? '',
      ]))); ?></div>
    </div>
    <div class="box">
      <strong>Payment</strong>
      <div><?php echo esc_html($order['method'] ?? ''); ?></div>
      <div>Collect: <?php echo esc_html($money($order['collectAmount'] ?? $order['total'] ?? 0)); ?></div>
      <div>Total: <?php echo esc_html($money($order['total'] ?? 0)); ?></div>
    </div>
  </div>
  <table>
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
  <p class="total">Collect on delivery: <?php echo esc_html($money($order['collectAmount'] ?? $order['total'] ?? 0)); ?></p>
</body>
</html>
