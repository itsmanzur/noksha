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
        // Needs a confirmation call before packing / courier booking.
        return [
            'status' => 'pending',
            'payment_status' => 'due',
        ];
    }
}
