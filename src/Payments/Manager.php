<?php
/**
 * Which gateways a page may offer.
 *
 * @package Noksha
 */

namespace Noksha\Payments;

use Noksha\Options;

final class Manager {
    public function get(string $id): ?Gateway {
        return match ($id) {
            'cod' => new CodGateway(),
            'manual_bkash' => new ManualWalletGateway('manual_bkash'),
            'manual_nagad' => new ManualWalletGateway('manual_nagad'),
            'sslcommerz' => new SslCommerzGateway(),
            default => null,
        };
    }

    public function available(array $page_methods): array {
        $settings = Options::settings();
        $ready = [];
        foreach ($page_methods as $method) {
            $gateway = $settings['gateways'][$method] ?? null;
            if (!is_array($gateway) || empty($gateway['enabled'])) {
                continue;
            }
            if (in_array($method, ['manual_bkash', 'manual_nagad'], true) && ($gateway['number'] ?? '') === '') {
                continue;
            }
            if ($method === 'sslcommerz') {
                $secrets = Options::secrets();
                if (($secrets['sslcommerz_store_id'] ?? '') === '' || ($secrets['sslcommerz_store_passwd'] ?? '') === '') {
                    continue;
                }
            }
            $ready[] = $method;
        }
        return $ready;
    }
}
