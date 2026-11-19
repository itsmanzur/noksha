<?php
/**
 * A payment method that can start a checkout.
 *
 * @package Noksha
 */

namespace Noksha\Payments;

interface Gateway {
    public function id(): string;

    /**
     * @param array<string, mixed> $order
     * @param array<string, mixed> $input
     * @return array<string, string>
     */
    public function start(array $order, array $input): array;
}
