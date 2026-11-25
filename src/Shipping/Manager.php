<?php
/**
 * Books parcels with the configured courier.
 *
 * @package Noksha
 */

namespace Noksha\Shipping;

use Noksha\Options;
use Noksha\Orders\Repository as Orders;

final class Manager {
    public function get(string $id): ?Courier {
        return match ($id) {
            'steadfast' => new SteadfastCourier(),
            'pathao' => new PathaoCourier(),
            'redx' => new RedxCourier(),
            default => null,
        };
    }

    public function available(): array {
        $ready = [];
        foreach (['steadfast', 'pathao', 'redx'] as $id) {
            $courier = $this->get($id);
            if ($courier && $courier->ready()) {
                $ready[] = $id;
            }
        }
        return $ready;
    }

    public function book(int $order_id, string $courier_id, bool $force = false): array|\WP_Error {
        $order = Orders::find($order_id);
        if (!$order) {
            return new \WP_Error('noksha_not_found', 'Order not found.', ['status' => 404]);
        }
        $status = (string) ($order['status'] ?? '');
        if (in_array($status, ['cancelled', 'returned', 'delivered'], true)) {
            return new \WP_Error('noksha_not_bookable', 'This order cannot be booked.', ['status' => 409]);
        }
        if (!$force && !in_array($status, ['confirmed', 'paid'], true)) {
            return new \WP_Error('noksha_confirm_first', 'Confirm the order first.', ['status' => 409]);
        }
        if (!$force && ($order['consignment_id'] ?? '') !== '') {
            return new \WP_Error(
                'noksha_already_booked',
                sprintf('Already booked with %s.', (string) ($order['courier'] ?: 'courier')),
                ['status' => 409]
            );
        }
        $courier = $this->get($courier_id);
        if (!$courier || !$courier->ready()) {
            return new \WP_Error('noksha_courier_not_ready', 'Courier is not configured.', ['status' => 400]);
        }
        $result = $courier->book($order);
        if (empty($result['ok'])) {
            Orders::add_note($order_id, sprintf(
                'Booking with %s failed (%s): %s',
                $courier_id,
                (string) ($result['error'] ?? 'courier_failed'),
                noksha_clip((string) ($result['raw'] ?? ''), 300)
            ));
            return new \WP_Error('noksha_' . ($result['error'] ?? 'courier_failed'), 'Courier booking failed.', [
                'status' => 422,
                'raw' => $result['raw'] ?? '',
            ]);
        }
        // Status change fires noksha_order_status_changed → Sms::order_shipped once.
        Orders::update($order_id, [
            'status' => 'shipped',
            'courier' => $courier_id,
            'consignment_id' => $result['consignment_id'] ?? '',
            'tracking_code' => $result['tracking_code'] ?? '',
            'courier_status' => 'booked',
        ], true, 'courier');
        $fresh = Orders::find($order_id);
        return Orders::detail($fresh ?: $order);
    }

    public static function public_status(): array {
        $settings = Options::settings();
        $secrets = Options::secrets();
        return [
            'available' => (new self())->available(),
            'couriers' => [
                'steadfast' => [
                    'enabled' => !empty($settings['couriers']['steadfast']['enabled']),
                    'ready' => (new SteadfastCourier())->ready(),
                    'has_keys' => ($secrets['steadfast_api_key'] ?? '') !== '' && ($secrets['steadfast_secret_key'] ?? '') !== '',
                ],
                'pathao' => [
                    'enabled' => !empty($settings['couriers']['pathao']['enabled']),
                    'ready' => (new PathaoCourier())->ready(),
                    'store_id' => (string) ($settings['couriers']['pathao']['store_id'] ?? ''),
                    'has_keys' => ($secrets['pathao_client_id'] ?? '') !== '',
                ],
                'redx' => [
                    'enabled' => !empty($settings['couriers']['redx']['enabled']),
                    'ready' => (new RedxCourier())->ready(),
                    'store_id' => (string) ($settings['couriers']['redx']['store_id'] ?? ''),
                    'has_keys' => ($secrets['redx_api_key'] ?? '') !== '',
                ],
            ],
        ];
    }
}
