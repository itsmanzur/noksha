<?php
/**
 * Cash on delivery.
 *
 * @package Noksha
 */

namespace Noksha\Payments;

final class CodGateway implements Gateway {
    public function id(): string {
        return 'cod';
    }

    public function start(array $order, array $input): array {
        return [
            'status' => 'confirmed',
            'payment_status' => 'due',
        ];
    }
}
