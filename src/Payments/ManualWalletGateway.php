<?php
/**
 * Customer sends money to a merchant wallet and submits a TrxID.
 *
 * @package Noksha
 */

namespace Noksha\Payments;

final class ManualWalletGateway implements Gateway {
    public function __construct(private string $gateway_id) {
    }

    public function id(): string {
        return $this->gateway_id;
    }

    public function start(array $order, array $input): array {
        $trx = strtoupper((string) preg_replace('/\s+/', '', (string) ($input['trx_id'] ?? '')));
        if (!preg_match('/^[A-Z0-9]{6,40}$/', $trx)) {
            return ['error' => 'trx_required'];
        }
        if (\Noksha\Orders\Repository::trx_exists($trx, (int) ($order['id'] ?? 0))) {
            return ['error' => 'trx_required'];
        }
        return [
            'status' => 'awaiting_payment',
            'payment_status' => 'pending',
            'transaction_id' => $trx,
        ];
    }
}
