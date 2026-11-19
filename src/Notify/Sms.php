<?php
/**
 * Outbound Bangla/English SMS via a configured HTTP provider.
 *
 * @package Noksha
 */

namespace Noksha\Notify;

use Noksha\Options;

final class Sms {
    public static function send(string $phone, string $message): bool {
        $settings = Options::settings();
        if (empty($settings['sms']['enabled'])) {
            return false;
        }
        $message = trim($message);
        $phone = preg_replace('/\D+/', '', $phone) ?? '';
        if ($message === '' || strlen($phone) < 11) {
            return false;
        }
        $secrets = Options::secrets();
        $api_key = (string) ($secrets['sms_api_key'] ?? '');
        $sender = (string) ($settings['sms']['sender'] ?? 'Noksha');
        if ($api_key === '') {
            return false;
        }

        // BulkSMSBD-compatible shape; other providers can be added later.
        $response = wp_remote_post('https://bulksmsbd.net/api/smsapi', [
            'timeout' => 12,
            'body' => [
                'api_key' => $api_key,
                'senderid' => $sender,
                'number' => $phone,
                'message' => $message,
            ],
            'blocking' => false,
        ]);
        return !is_wp_error($response);
    }

    public static function order_placed(array $order): void {
        $lang = ($order['language'] ?? 'en') === 'bn' ? 'bn' : 'en';
        $number = (string) ($order['order_number'] ?? '');
        $message = $lang === 'bn'
            ? "আপনার অর্ডার {$number} গ্রহণ করা হয়েছে। শীঘ্রই ফোন করে কনফার্ম করা হবে। — Noksha"
            : "We received your order {$number}. We will call to confirm soon. — Noksha";
        self::send((string) ($order['phone'] ?? ''), $message);
    }

    public static function order_confirmed(array $order): void {
        $lang = ($order['language'] ?? 'en') === 'bn' ? 'bn' : 'en';
        $number = (string) ($order['order_number'] ?? '');
        $message = $lang === 'bn'
            ? "আপনার অর্ডার {$number} কনফার্ম হয়েছে। শীঘ্রই পাঠানো হবে। — Noksha"
            : "Your order {$number} is confirmed. We will ship it soon. — Noksha";
        self::send((string) ($order['phone'] ?? ''), $message);
    }

    public static function order_shipped(array $order): void {
        $lang = ($order['language'] ?? 'en') === 'bn' ? 'bn' : 'en';
        $number = (string) ($order['order_number'] ?? '');
        $track = (string) ($order['tracking_code'] ?? '');
        $message = $lang === 'bn'
            ? ("আপনার অর্ডার {$number} পাঠানো হয়েছে।" . ($track !== '' ? " ট্র্যাকিং: {$track}" : ''))
            : ("Your order {$number} has been shipped." . ($track !== '' ? " Tracking: {$track}" : ''));
        self::send((string) ($order['phone'] ?? ''), $message);
    }

    public static function order_delivered(array $order): void {
        $lang = ($order['language'] ?? 'en') === 'bn' ? 'bn' : 'en';
        $number = (string) ($order['order_number'] ?? '');
        $message = $lang === 'bn'
            ? "আপনার অর্ডার {$number} ডেলিভার হয়েছে। ধন্যবাদ! — Noksha"
            : "Your order {$number} has been delivered. Thank you! — Noksha";
        self::send((string) ($order['phone'] ?? ''), $message);
    }
}
