<?php

declare(strict_types=1);

use Noksha\Pages\Sanitizer;
use Noksha\Region\Phone;
use PHPUnit\Framework\TestCase;

final class SanitizerTest extends TestCase {
    public function test_phone_normalizes_bd_mobile(): void {
        $this->assertSame('01712345678', Phone::normalize('01712-345678'));
        $this->assertSame('', Phone::error(Phone::normalize('01712345678')));
    }

    public function test_html_strips_script_keeps_youtube(): void {
        $html = Sanitizer::clean_html('<h2>Hi</h2><script>alert(1)</script><iframe src="https://www.youtube.com/embed/abc"></iframe>');
        $this->assertStringNotContainsString('<script', $html);
        $this->assertStringContainsString('youtube.com/embed/abc', $html);
    }

    public function test_offer_shipping_zones(): void {
        $offer = Sanitizer::offer([
            'productName' => 'Oil',
            'price' => 480,
            'shippingInside' => 60,
            'shippingOutside' => 80,
        ]);
        $this->assertSame(60.0, $offer['shippingInside']);
        $this->assertSame(80.0, $offer['shippingOutside']);
        $this->assertSame(80.0, $offer['shipping']);
    }

    public function test_seo_limits(): void {
        $seo = Sanitizer::seo([
            'title' => str_repeat('a', 100),
            'description' => str_repeat('b', 300),
        ]);
        $this->assertSame(70, strlen($seo['title']));
        $this->assertSame(200, strlen($seo['description']));
    }
}
