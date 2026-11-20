<?php
/**
 * Form token for the public landing pages and checkout.
 *
 * WordPress nonces are tied to the signed-in user, but these requests are sent without the REST nonce header,
 * so WordPress treats every caller as signed out. A signed-in admin testing a page then always failed with
 * "The form expired". This token does not depend on who is signed in.
 *
 * @package Noksha
 */

namespace Noksha\Support;

final class PublicNonce {
    private const LIFETIME = 12 * HOUR_IN_SECONDS;

    public static function create(): string {
        return self::token(self::tick());
    }

    /** Valid for the current and the previous window, so a token lives 12 to 24 hours. */
    public static function verify(string $token): bool {
        if ($token === '') {
            return false;
        }
        $tick = self::tick();
        return hash_equals(self::token($tick), $token) || hash_equals(self::token($tick - 1), $token);
    }

    private static function tick(): int {
        return (int) floor(time() / self::LIFETIME);
    }

    private static function token(int $tick): string {
        return substr(hash_hmac('sha256', 'noksha_public|' . $tick, wp_salt('nonce')), 0, 12);
    }
}