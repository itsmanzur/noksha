<?php
/**
 * Outbound Bangla/English SMS via a configured HTTP provider.
 *
 * @package Noksha
 */

namespace Noksha\Notify;

use Noksha\Options;

final class Sms {
    /** Order events that can send a customer message. */
    public const EVENTS = ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'];

    private const COURIERS = ['steadfast' => 'Steadfast', 'pathao' => 'Pathao', 'redx' => 'RedX'];

    public static function store_name(): string {
        $settings = Options::settings();
        $name = trim((string) ($settings['store_name'] ?? ''));
        if ($name === '') {
            $name = trim((string) get_bloginfo('name'));
        }
        return $name !== '' ? $name : 'Noksha';
    }

    /**
     * Built-in message per event and language. {order} {name} {total} {store} {track} {courier} {link} are filled in;
     * {tracking} expands to "Tracking: CODE LINK", or nothing before the parcel is booked.
     *
     * @return array<string,array{en:string,bn:string}>
     */
    public static function defaults(): array {
        return [
            'placed' => [
                'en' => 'We received your order {order}. We will call to confirm soon. — {store}',
                'bn' => 'আপনার অর্ডার {order} গ্রহণ করা হয়েছে। শীঘ্রই ফোন করে কনফার্ম করা হবে। — {store}',
            ],
            'confirmed' => [
                'en' => 'Your order {order} is confirmed. We will ship it soon. — {store}',
                'bn' => 'আপনার অর্ডার {order} কনফার্ম হয়েছে। শীঘ্রই পাঠানো হবে। — {store}',
            ],
            'shipped' => [
                'en' => 'Your order {order} has been shipped.{tracking} — {store}',
                'bn' => 'আপনার অর্ডার {order} পাঠানো হয়েছে।{tracking} — {store}',
            ],
            'delivered' => [
                'en' => 'Your order {order} has been delivered. Thank you! — {store}',
                'bn' => 'আপনার অর্ডার {order} ডেলিভার হয়েছে। ধন্যবাদ! — {store}',
            ],
            'cancelled' => [
                'en' => 'Your order {order} has been cancelled. Please call us if this is a mistake. — {store}',
                'bn' => 'আপনার অর্ডার {order} বাতিল করা হয়েছে। ভুল হলে আমাদের ফোন করুন। — {store}',
            ],
        ];
    }

    public static function send(string $phone, string $message): bool {
        if (empty(Options::settings()['sms']['enabled'])) {
            return false;
        }
        $result = self::post($phone, $message, false);
        return !empty($result['ok']);
    }

    /** Synchronous send for the settings "test SMS" button; works even while sending is switched off. */
    public static function send_test(string $phone): array {
        $message = self::store_name() . ': test SMS from Noksha.';
        return self::post($phone, $message, true);
    }

    /** @return array{ok:bool,error?:string,status?:int,body?:string} */
    private static function post(string $phone, string $message, bool $blocking): array {
        $settings = Options::settings();
        $message = trim($message);
        $phone = preg_replace('/\D+/', '', $phone) ?? '';
        if ($message === '' || strlen($phone) < 11) {
            return ['ok' => false, 'error' => 'bad_phone'];
        }
        $api_key = (string) (Options::secrets()['sms_api_key'] ?? '');
        if ($api_key === '') {
            return ['ok' => false, 'error' => 'no_key'];
        }

        // BulkSMSBD-compatible shape; other providers can be added later.
        $response = wp_remote_post('https://bulksmsbd.net/api/smsapi', [
            'timeout' => $blocking ? 15 : 12,
            'body' => [
                'api_key' => $api_key,
                'senderid' => (string) ($settings['sms']['sender'] ?? 'Noksha'),
                'number' => $phone,
                'message' => $message,
            ],
            'blocking' => $blocking,
        ]);
        if (is_wp_error($response)) {
            return ['ok' => false, 'error' => 'request_failed', 'body' => $response->get_error_message()];
        }
        if (!$blocking) {
            return ['ok' => true];
        }
        $status = (int) wp_remote_retrieve_response_code($response);
        return [
            'ok' => $status >= 200 && $status < 300,
            'status' => $status,
            'body' => noksha_clip((string) wp_remote_retrieve_body($response), 300),
        ];
    }

    public static function order_placed(array $order): void {
        self::notify('placed', $order);
    }

    public static function order_confirmed(array $order): void {
        self::notify('confirmed', $order);
    }

    public static function order_shipped(array $order): void {
        self::notify('shipped', $order);
    }

    public static function order_delivered(array $order): void {
        self::notify('delivered', $order);
    }

    public static function order_cancelled(array $order): void {
        self::notify('cancelled', $order);
    }

    private static function notify(string $event, array $order): void {
        $saved = Options::settings()['sms']['events'][$event] ?? [];
        $enabled = array_key_exists('enabled', $saved) ? !empty($saved['enabled']) : $event !== 'cancelled';
        if (!$enabled) {
            return;
        }
        $lang = ($order['language'] ?? 'en') === 'bn' ? 'bn' : 'en';
        $template = trim((string) ($saved[$lang] ?? ''));
        if ($template === '') {
            $template = self::defaults()[$event][$lang];
        }
        self::send((string) ($order['phone'] ?? ''), strtr($template, self::variables($order, $lang)));
    }

    /** @return array<string,string> */
    private static function variables(array $order, string $lang): array {
        $track = (string) ($order['tracking_code'] ?? '');
        $courier = (string) ($order['courier'] ?? '');
        $link = self::track_link($courier, $track, (string) ($order['phone'] ?? ''));
        $tracking = '';
        if ($track !== '') {
            $tracking = ($lang === 'bn' ? ' ট্র্যাকিং: ' : ' Tracking: ') . $track . ($link !== '' ? ' ' . $link : '');
        }
        $total = number_format((float) ($order['total'] ?? 0), 0);
        return [
            '{order}' => (string) ($order['order_number'] ?? ''),
            '{name}' => (string) ($order['customer_name'] ?? ''),
            '{total}' => ($lang === 'bn' ? '৳' : 'Tk ') . $total,
            '{store}' => self::store_name(),
            '{track}' => $track,
            '{courier}' => self::COURIERS[$courier] ?? $courier,
            '{link}' => $link,
            '{tracking}' => $tracking,
        ];
    }

    private static function track_link(string $courier, string $track, string $phone): string {
        if ($track === '') {
            return '';
        }
        return match ($courier) {
            'steadfast' => 'https://steadfast.com.bd/t/' . rawurlencode($track),
            'pathao' => 'https://merchant.pathao.com/tracking?consignment_id=' . rawurlencode($track) . '&phone=' . rawurlencode(preg_replace('/\D+/', '', $phone) ?? ''),
            'redx' => 'https://redx.com.bd/track-global-parcel/?trackingId=' . rawurlencode($track),
            default => '',
        };
    }
}