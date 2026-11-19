<?php
/**
 * Starter landing pages.
 *
 * @package Noksha
 */

namespace Noksha\Pages;

final class Templates {
    public static function ids(): array {
        return ['single', 'lead', 'festival', 'beauty', 'gadget', 'blank'];
    }

    public static function make(string $template, string $lang): array {
        $lang = $lang === 'bn' ? 'bn' : 'en';
        $template = in_array($template, self::ids(), true) ? $template : 'single';
        $copy = self::copy($template, $lang);
        $checkout = self::checkout($lang);
        $price = match ($template) {
            'lead' => 0,
            'festival' => 420,
            'beauty' => 890,
            'gadget' => 1490,
            default => 480,
        };
        $compare = $template === 'lead' ? 0 : ($template === 'gadget' ? 1990 : ($template === 'beauty' ? 1200 : 560));
        $offer = [
            'productName' => $copy['product'],
            'price' => $price,
            'compareAt' => $compare,
            'shipping' => $template === 'lead' ? 0 : 80,
            'shippingInside' => $template === 'lead' ? 0 : 60,
            'shippingOutside' => $template === 'lead' ? 0 : 80,
            'shippingDefault' => $template === 'lead' ? 0 : 80,
            'shippingZones' => $template === 'lead' ? [] : [
                [
                    'id' => 'inside_dhaka',
                    'label' => 'Inside Dhaka',
                    'price' => 60,
                    'districtIds' => ['47'],
                    'upazilaIds' => [],
                ],
                [
                    'id' => 'outside_dhaka',
                    'label' => 'Outside Dhaka',
                    'price' => 80,
                    'districtIds' => [],
                    'upazilaIds' => [],
                ],
            ],
            'imageUrl' => '',
        ];
        if ($template === 'lead') {
            foreach (['division', 'district', 'upazila', 'address', 'note'] as $field) {
                $checkout['fields'][$field]['enabled'] = false;
                $checkout['fields'][$field]['required'] = false;
            }
            $checkout['payments'] = ['cod'];
            $checkout['trustBadges'] = ['secure'];
            $checkout['deliveryNote'] = '';
            $checkout['summaryPosition'] = 'bottom';
        }
        $sections = [];
        foreach ($copy['sections'] as $section) {
            $sections[] = [
                'id' => 's_' . wp_generate_password(8, false, false),
                'type' => $section['type'],
                'hidden' => false,
                'props' => $section['props'],
            ];
        }
        return [
            'title' => $copy['title'],
            'language' => $lang,
            'offer' => $offer,
            'checkout' => $checkout,
            'sections' => $sections,
            'tokens' => null,
        ];
    }

    public static function checkout(string $lang): array {
        $bn = $lang === 'bn';
        return [
            'fields' => [
                'name' => ['enabled' => true, 'required' => true],
                'phone' => ['enabled' => true, 'required' => true],
                'email' => ['enabled' => false, 'required' => false],
                'division' => ['enabled' => true, 'required' => true],
                'district' => ['enabled' => true, 'required' => true],
                'upazila' => ['enabled' => true, 'required' => false],
                'address' => ['enabled' => true, 'required' => true],
                'note' => ['enabled' => false, 'required' => false],
            ],
            'payments' => ['cod', 'manual_bkash', 'manual_nagad'],
            'summaryPosition' => 'right',
            'trustBadges' => ['secure', 'cod', 'delivery'],
            'deliveryNote' => $bn
                ? 'ঢাকার ভিতরে সাধারণত ২৪ ঘণ্টা, ঢাকার বাইরে ২–৪ দিন।'
                : 'Inside Dhaka, usually within 24 hours. Outside Dhaka, 2–4 days.',
        ];
    }

    private static function copy(string $template, string $lang): array {
        $bn = $lang === 'bn';
        $product = match ($template) {
            'beauty' => $bn ? 'ভিটামিন সি ফেস সিরাম' : 'Vitamin C face serum',
            'gadget' => $bn ? 'ওয়্যারলেস ইয়ারবাডস' : 'Wireless earbuds',
            default => $bn ? 'কোল্ড-প্রেসড সরিষার তেল' : 'Cold-pressed mustard oil',
        };
        $ends = wp_date('Y-m-d\TH:i', time() + 7 * DAY_IN_SECONDS);
        $order = [
            'type' => 'order_form',
            'props' => [
                'title' => $bn ? 'অর্ডার করুন' : 'Order now',
                'buttonLabel' => $template === 'lead'
                    ? ($bn ? 'কল চাই' : 'Request a call')
                    : ($bn ? 'অর্ডার করুন' : 'Place order'),
            ],
        ];
        $hero = [
            'type' => 'hero',
            'props' => [
                'eyebrow' => $bn ? 'ঢাকা থেকে সারা দেশে' : 'From Dhaka, across Bangladesh',
                'title' => match ($template) {
                    'lead' => $bn ? 'এক মিনিটে কথা বলার সময় নিন' : 'Book a one-minute call',
                    'beauty' => $bn ? 'উজ্জ্বল ত্বক, ৭ দিনেই ফারাক' : 'Brighter skin in seven days',
                    'gadget' => $bn ? 'ক্লিয়ার সাউন্ড, সারাদিন ব্যাটারি' : 'Clear sound, all-day battery',
                    default => $bn ? 'খাঁটি সরিষার তেল, দরজায় পৌঁছে যায়' : 'Pure mustard oil, at your door',
                },
                'subtitle' => match ($template) {
                    'lead' => $bn ? 'নাম ও ফোন দিন। আমরা কল করব।' : 'Leave your name and phone. We will call you.',
                    'beauty' => $bn ? 'ডার্মাটেস্টেড। ক্যাশ অন ডেলিভারি।' : 'Dermatologist tested. Cash on delivery.',
                    'gadget' => $bn ? '১ বছর ওয়ারেন্টি। ক্যাশ অন ডেলিভারি।' : '1-year warranty. Cash on delivery.',
                    default => $bn ? 'কোল্ড-প্রেসড। ক্যাশ অন ডেলিভারি। বিকাশ বা নগদও চলবে।' : 'Cold-pressed. Cash on delivery. bKash and Nagad too.',
                },
                'imageUrl' => '',
                'buttonLabel' => $template === 'lead'
                    ? ($bn ? 'কল চাই' : 'Request a call')
                    : ($bn ? 'এখনই অর্ডার' : 'Order now'),
            ],
        ];
        $benefits = [
            'type' => 'benefits',
            'props' => [
                'title' => $bn ? 'কেন এই অফার' : 'Why this offer',
                'items' => $bn
                    ? [
                        ['title' => 'খাঁটি', 'text' => 'কোল্ড-প্রেসড, কোনো মেশানো তেল নেই।'],
                        ['title' => 'দেশের ভিতরে', 'text' => 'বোতলজাত বাংলাদেশে।'],
                        ['title' => 'হাতে পেয়ে টাকা', 'text' => 'ক্যাশ অন ডেলিভারি খোলা আছে।'],
                    ]
                    : [
                        ['title' => 'Pure', 'text' => 'Cold-pressed, with no blended oil.'],
                        ['title' => 'Packed here', 'text' => 'Bottled in Bangladesh.'],
                        ['title' => 'Pay at the door', 'text' => 'Cash on delivery is available.'],
                    ],
            ],
        ];
        $product_section = [
            'type' => 'product',
            'props' => [
                'title' => $product,
                'text' => $bn
                    ? '৫০০ মিলি বোতল। রান্না ও মাখার জন্য। দাম ও ডেলিভারি চার্জ অর্ডার ফর্মে দেখা যাবে।'
                    : 'A 500 ml bottle for cooking and daily use. The order form shows the price and delivery charge.',
                'imageUrl' => '',
                'bullets' => $bn
                    ? ['৫০০ মিলি', 'কোল্ড-প্রেসড', 'সিল করা বোতল']
                    : ['500 ml', 'Cold-pressed', 'Sealed bottle'],
            ],
        ];
        $reviews = [
            'type' => 'reviews',
            'props' => [
                'title' => $bn ? 'যারা নিয়েছেন' : 'From customers',
                'items' => $bn
                    ? [
                        ['name' => 'নাসরিন, মিরপুর', 'text' => 'গন্ধটা ঠিক ঘানির তেলের মতো। দ্বিতীয়বার নিলাম।', 'rating' => 5],
                        ['name' => 'ইমরান, কুমিল্লা', 'text' => 'কুরিয়ার তিন দিনে দিল। বোতল ভাঙেনি।', 'rating' => 5],
                        ['name' => 'রূপা, সিলেট', 'text' => 'ফোনে কনফার্ম করেছিল, তাই নিশ্চিন্তে নিয়েছি।', 'rating' => 4],
                    ]
                    : [
                        ['name' => 'Nasrin, Mirpur', 'text' => 'It smells like ghani oil. I ordered a second bottle.', 'rating' => 5],
                        ['name' => 'Imran, Cumilla', 'text' => 'The courier arrived in three days. The bottle was intact.', 'rating' => 5],
                        ['name' => 'Rupa, Sylhet', 'text' => 'They confirmed by phone, so I was sure about the order.', 'rating' => 4],
                    ],
            ],
        ];
        $faq = [
            'type' => 'faq',
            'props' => [
                'title' => $bn ? 'প্রশ্ন' : 'Questions',
                'items' => $bn
                    ? [
                        ['q' => 'ঢাকার বাইরে যাবে?', 'a' => 'হ্যাঁ। ডেলিভারি চার্জ অর্ডার ফর্মে যোগ হয়।'],
                        ['q' => 'বিকাশে দিতে পারি?', 'a' => 'পারবেন। নম্বর ও TrxID ফর্মে দিন, আমরা মিলিয়ে নেব।'],
                    ]
                    : [
                        ['q' => 'Do you deliver outside Dhaka?', 'a' => 'Yes. The delivery charge is added in the order form.'],
                        ['q' => 'Can I pay with bKash?', 'a' => 'Yes. Enter the number transfer and your TrxID. We match it before packing.'],
                    ],
            ],
        ];
        $guarantee = [
            'type' => 'guarantee',
            'props' => [
                'title' => $bn ? 'সিলে সমস্যা হলে বদলে দেব' : 'We replace a broken seal',
                'text' => $bn
                    ? 'বোতল ফাটা বা সিল ভাঙা পেলে কুরিয়ারকে ফেরত দিন। নতুন বোতল পাঠাব।'
                    : 'If the seal is broken or the bottle leaks, refuse it from the courier. We send a replacement.',
            ],
        ];
        $countdown = [
            'type' => 'countdown',
            'props' => [
                'title' => $bn ? 'উৎসবের দাম' : 'Festival price',
                'endsAt' => $ends,
            ],
        ];

        $map = [
            'single' => [$hero, $benefits, $product_section, $reviews, $faq, $guarantee, $order],
            'beauty' => [$hero, $benefits, $product_section, $reviews, $faq, $guarantee, $order],
            'gadget' => [$hero, $benefits, $product_section, $reviews, $faq, $guarantee, $order],
            'lead' => [$hero, $benefits, $order],
            'festival' => [$hero, $countdown, $product_section, $reviews, $order],
            'blank' => [[
                'type' => 'hero',
                'props' => [
                    'eyebrow' => '',
                    'title' => $bn ? 'নতুন পেইজ' : 'New page',
                    'subtitle' => $bn ? 'সেকশন যোগ করে শুরু করুন।' : 'Add a section to begin.',
                    'imageUrl' => '',
                    'buttonLabel' => $bn ? 'অর্ডার' : 'Order',
                ],
            ]],
        ];

        $titles = [
            'single' => $bn ? 'সরিষার তেল' : 'Mustard oil',
            'beauty' => $bn ? 'স্কিনকেয়ার অফার' : 'Skincare offer',
            'gadget' => $bn ? 'গ্যাজেট অফার' : 'Gadget offer',
            'lead' => $bn ? 'কল বুক করুন' : 'Book a call',
            'festival' => $bn ? 'উৎসব অফার' : 'Festival offer',
            'blank' => $bn ? 'খালি পেইজ' : 'Blank page',
        ];

        return [
            'title' => $titles[$template],
            'product' => $template === 'lead' ? ($bn ? 'পরামর্শ' : 'Consultation') : $product,
            'sections' => $map[$template],
        ];
    }
}
