<?php
/**
 * Niche starter pages: ready-made sections, colours, and copy for common Bangladeshi COD products.
 *
 * Every text is a placeholder the seller rewrites. No image is bundled, so layouts that need a
 * photo (like "over image") are avoided.
 *
 * @package Noksha
 */

namespace Noksha\Pages;

use Noksha\Brand\Tokens;

final class Niches {
    public const IDS = ['fashion', 'food', 'health', 'home', 'beauty', 'gadget'];

    public static function has(string $template): bool {
        return in_array($template, self::IDS, true);
    }

    /**
     * @return array{title:string,product:string,price:float,compare:float,motion:string,tokens:?array,sections:array}
     */
    public static function build(string $template, string $lang): array {
        $bn = $lang === 'bn';
        $t = static fn(string $en, string $bangla): string => $bn ? $bangla : $en;
        $data = match ($template) {
            'fashion' => self::fashion($t),
            'food' => self::food($t),
            'health' => self::health($t),
            'home' => self::home($t),
            'beauty' => self::beauty($t),
            default => self::gadget($t),
        };
        $data['tokens'] = Tokens::sanitize_override(['enabled' => true, 'color' => $data['colors']]);
        unset($data['colors']);
        return $data;
    }

    private static function s(string $type, array $props, array $style = []): array {
        return ['type' => $type, 'props' => $props, 'style' => $style];
    }

    private static function hero(callable $t, string $eyebrow, string $title, string $sub, string $cta, array $style = []): array {
        return self::s('hero', [
            'eyebrow' => $eyebrow,
            'title' => $title,
            'subtitle' => $sub,
            'imageUrl' => '',
            'buttonLabel' => $cta,
        ], $style);
    }

    private static function order(callable $t): array {
        return self::s('order_form', [
            'title' => $t('Order now', 'অর্ডার করুন'),
            'buttonLabel' => $t('Place order', 'অর্ডার করুন'),
        ]);
    }

    private static function steps(callable $t, string $title, array $items, array $style = []): array {
        return self::s('steps', ['title' => $title, 'items' => $items], $style);
    }

    private static function order_steps(callable $t, array $style = []): array {
        return self::steps($t, $t('How to order', 'কীভাবে অর্ডার করবেন'), [
            ['title' => $t('Choose', 'পছন্দ করুন'), 'text' => $t('Pick your item and press order.', 'পণ্য বেছে অর্ডার চাপুন।')],
            ['title' => $t('Fill in the form', 'ফর্ম পূরণ করুন'), 'text' => $t('Name, phone and address only.', 'শুধু নাম, ফোন ও ঠিকানা।')],
            ['title' => $t('Pay when it arrives', 'হাতে পেয়ে টাকা দিন'), 'text' => $t('Check the parcel, then pay the courier.', 'পার্সেল দেখে কুরিয়ারকে টাকা দিন।')],
        ], $style);
    }

    private static function compare(callable $t, string $us, string $them, array $rows, array $style = []): array {
        $list = [];
        foreach ($rows as $row) {
            $list[] = ['label' => $row, 'us' => '✓', 'them' => '✗'];
        }
        return self::s('compare', [
            'title' => $t('Why choose us', 'কেন আমরা'),
            'usLabel' => $us,
            'themLabel' => $them,
            'rows' => $list,
        ], $style);
    }

    private static function whatsapp(): array {
        return self::s('whatsapp', ['number' => '', 'label' => '', 'message' => '']);
    }

    private static function fashion(callable $t): array {
        return [
            'title' => $t('Fashion offer', 'ফ্যাশন অফার'),
            'product' => $t('Cotton panjabi', 'কটন পাঞ্জাবি'),
            'price' => 1290,
            'compare' => 1790,
            'motion' => 'lively',
            'colors' => ['brand' => '#7C2D5B', 'accent' => '#C4841D', 'canvas' => '#FBF7F9'],
            'sections' => [
                self::hero($t, $t('New collection', 'নতুন কালেকশন'), $t('Look sharp, feel light', 'স্মার্ট লুক, হালকা আরাম'), $t('Soft cotton. Ready to wear. Cash on delivery.', 'নরম কটন। পরার জন্য তৈরি। ক্যাশ অন ডেলিভারি।'), $t('Order now', 'এখনই অর্ডার'), ['layout' => 'center', 'bg' => 'soft']),
                self::s('gallery', ['title' => $t('See it up close', 'কাছ থেকে দেখুন'), 'images' => []], ['layout' => 'grid', 'ratio' => '3-4']),
                self::s('benefits', [
                    'title' => $t('Made for everyday', 'প্রতিদিনের জন্য'),
                    'items' => [
                        ['title' => $t('Soft fabric', 'নরম কাপড়'), 'text' => $t('Breathable cotton that stays comfortable.', 'শ্বাস নেওয়া যায় এমন কটন, সারাদিন আরাম।')],
                        ['title' => $t('True to size', 'ঠিক মাপ'), 'text' => $t('A size chart is on the page.', 'সাইজ চার্ট পেজেই আছে।')],
                        ['title' => $t('Easy exchange', 'সহজ এক্সচেঞ্জ'), 'text' => $t('Wrong size? We swap it.', 'মাপ না মিললে বদলে দেব।')],
                    ],
                ]),
                self::s('product', [
                    'title' => $t('Cotton panjabi', 'কটন পাঞ্জাবি'),
                    'text' => $t('A classic cut with a clean finish. Sizes M to XXL.', 'ক্লাসিক কাট, পরিচ্ছন্ন ফিনিশিং। সাইজ M থেকে XXL।'),
                    'imageUrl' => '',
                    'bullets' => [$t('100% cotton', '১০০% কটন'), $t('Sizes M–XXL', 'সাইজ M–XXL'), $t('Machine washable', 'মেশিনে ধোয়া যায়')],
                ], ['layout' => 'reverse', 'bg' => 'warm']),
                self::s('reviews', [
                    'title' => $t('Happy customers', 'খুশি ক্রেতারা'),
                    'items' => [
                        ['name' => $t('Rafi, Dhaka', 'রাফি, ঢাকা'), 'text' => $t('Fits well and the colour matches the photos.', 'মাপ ঠিক আছে, রং ছবির মতোই।'), 'rating' => 5],
                        ['name' => $t('Sajid, Chattogram', 'সাজিদ, চট্টগ্রাম'), 'text' => $t('Good fabric for the price.', 'দামের তুলনায় কাপড় ভালো।'), 'rating' => 5],
                        ['name' => $t('Tanvir, Rajshahi', 'তানভীর, রাজশাহী'), 'text' => $t('Exchanged one size without any fuss.', 'কোনো ঝামেলা ছাড়াই সাইজ বদলে দিয়েছে।'), 'rating' => 4],
                    ],
                ]),
                self::s('faq', [
                    'title' => $t('Questions', 'প্রশ্ন'),
                    'items' => [
                        ['q' => $t('How do I pick my size?', 'সাইজ কীভাবে বাছব?'), 'a' => $t('Measure a shirt you like and compare it with the size chart.', 'পছন্দের একটা জামা মেপে সাইজ চার্টের সাথে মিলিয়ে নিন।')],
                        ['q' => $t('Can I exchange it?', 'এক্সচেঞ্জ করা যাবে?'), 'a' => $t('Yes, within 3 days if it is unworn.', 'হ্যাঁ, না পরা থাকলে ৩ দিনের মধ্যে।')],
                    ],
                ]),
                self::s('guarantee', [
                    'title' => $t('Wrong size? We swap it', 'মাপ না মিললে বদলে দেব'),
                    'text' => $t('Send it back unworn within 3 days and we exchange it.', 'না পরে ৩ দিনের মধ্যে ফেরত দিন, আমরা বদলে দেব।'),
                ], ['bg' => 'brand']),
                self::whatsapp(),
                self::order($t),
            ],
        ];
    }

    private static function food(callable $t): array {
        return [
            'title' => $t('Food offer', 'খাবার অফার'),
            'product' => $t('Pure honey, 500 g', 'খাঁটি মধু, ৫০০ গ্রাম'),
            'price' => 750,
            'compare' => 950,
            'motion' => 'lively',
            'colors' => ['brand' => '#B45309', 'accent' => '#15803D', 'canvas' => '#FFFBF0'],
            'sections' => [
                self::hero($t, $t('Straight from the hive', 'সরাসরি চাক থেকে'), $t('Pure honey, nothing added', 'খাঁটি মধু, কিছুই মেশানো নেই'), $t('Collected, filtered and sealed. Cash on delivery.', 'সংগ্রহ, ছাঁকা ও সিল করা। ক্যাশ অন ডেলিভারি।'), $t('Order now', 'এখনই অর্ডার')),
                self::s('benefits', [
                    'title' => $t('Why it is different', 'কেন আলাদা'),
                    'items' => [
                        ['title' => $t('Single source', 'একটি উৎস'), 'text' => $t('From one trusted apiary.', 'একটি বিশ্বস্ত খামার থেকে।')],
                        ['title' => $t('No sugar syrup', 'চিনির সিরাপ নেই'), 'text' => $t('Only honey in the jar.', 'বয়ামে শুধু মধু।')],
                        ['title' => $t('Sealed jar', 'সিল করা বয়াম'), 'text' => $t('Broken seal? Do not accept it.', 'সিল ভাঙা হলে নেবেন না।')],
                    ],
                ], ['layout' => 'numbers', 'bg' => 'warm']),
                self::s('product', [
                    'title' => $t('Pure honey, 500 g', 'খাঁটি মধু, ৫০০ গ্রাম'),
                    'text' => $t('Thick, golden honey for tea, bread or a spoon on its own.', 'চা, রুটি বা এমনি চামচে খাওয়ার ঘন সোনালি মধু।'),
                    'imageUrl' => '',
                    'bullets' => [$t('500 g glass jar', '৫০০ গ্রাম কাচের বয়াম'), $t('No added sugar', 'চিনি মেশানো নেই'), $t('Packed this week', 'এই সপ্তাহে প্যাক')],
                ]),
                self::s('video', ['title' => $t('See how it is collected', 'কীভাবে সংগ্রহ হয় দেখুন'), 'url' => '', 'caption' => '']),
                self::compare($t, $t('Our honey', 'আমাদের মধু'), $t('Market honey', 'বাজারের মধু'), [$t('No sugar syrup', 'চিনির সিরাপ নেই'), $t('Sealed jar', 'সিল করা বয়াম'), $t('Source you can ask about', 'উৎস জিজ্ঞেস করা যায়')]),
                self::order_steps($t, ['bg' => 'soft']),
                self::s('reviews', [
                    'title' => $t('What people say', 'ক্রেতারা বলছেন'),
                    'items' => [
                        ['name' => $t('Mitu, Dhaka', 'মিতু, ঢাকা'), 'text' => $t('Thick and fragrant. Finished the jar in two weeks.', 'ঘন আর সুগন্ধি। দুই সপ্তাহে বয়াম শেষ।'), 'rating' => 5],
                        ['name' => $t('Arif, Khulna', 'আরিফ, খুলনা'), 'text' => $t('The seal was intact and it arrived on time.', 'সিল অক্ষত ছিল, সময়মতো পৌঁছেছে।'), 'rating' => 5],
                        ['name' => $t('Shila, Sylhet', 'শীলা, সিলেট'), 'text' => $t('Tastes like the honey from my village.', 'গ্রামের মধুর মতো স্বাদ।'), 'rating' => 4],
                    ],
                ], ['layout' => 'grid']),
                self::s('faq', [
                    'title' => $t('Questions', 'প্রশ্ন'),
                    'items' => [
                        ['q' => $t('Why did my honey thicken?', 'মধু জমে গেল কেন?'), 'a' => $t('Pure honey can crystallise in cool weather. Warm the jar in water to loosen it.', 'ঠান্ডায় খাঁটি মধু জমতে পারে। বয়াম গরম পানিতে রাখলে আবার গলে যায়।')],
                        ['q' => $t('How long does it keep?', 'কতদিন রাখা যায়?'), 'a' => $t('Store it sealed and dry. It keeps for a long time.', 'শুকনো জায়গায় ঢাকনা আটকে রাখুন। অনেকদিন ভালো থাকে।')],
                    ],
                ]),
                self::s('guarantee', [
                    'title' => $t('Not happy? We refund you', 'পছন্দ না হলে টাকা ফেরত'),
                    'text' => $t('If the jar is damaged on arrival, refuse it and we send a new one.', 'বয়াম ক্ষতিগ্রস্ত এলে ফেরত দিন, নতুন পাঠাব।'),
                ], ['bg' => 'dark']),
                self::whatsapp(),
                self::order($t),
            ],
        ];
    }

    private static function health(callable $t): array {
        return [
            'title' => $t('Wellness offer', 'ওয়েলনেস অফার'),
            'product' => $t('Herbal tea blend', 'হারবাল টি ব্লেন্ড'),
            'price' => 650,
            'compare' => 850,
            'motion' => 'simple',
            'colors' => ['brand' => '#166534', 'accent' => '#0E7490', 'canvas' => '#F4F8F4'],
            'sections' => [
                self::hero($t, $t('A calmer cup', 'শান্ত এক কাপ'), $t('A simple herbal blend for your evenings', 'সন্ধ্যার জন্য সহজ হারবাল ব্লেন্ড'), $t('Natural ingredients. No added colour. Cash on delivery.', 'প্রাকৃতিক উপাদান। রং মেশানো নেই। ক্যাশ অন ডেলিভারি।'), $t('Order now', 'এখনই অর্ডার')),
                self::s('benefits', [
                    'title' => $t('What is inside', 'ভেতরে কী আছে'),
                    'items' => [
                        ['title' => $t('Natural herbs', 'প্রাকৃতিক ভেষজ'), 'text' => $t('A short list of plant ingredients.', 'উদ্ভিজ্জ উপাদানের ছোট তালিকা।')],
                        ['title' => $t('No added colour', 'রং নেই'), 'text' => $t('Nothing artificial in the box.', 'বাক্সে কৃত্রিম কিছু নেই।')],
                        ['title' => $t('Easy to make', 'বানানো সহজ'), 'text' => $t('Steep for five minutes.', 'পাঁচ মিনিট ভিজিয়ে রাখুন।')],
                    ],
                ], ['layout' => 'list']),
                self::s('product', [
                    'title' => $t('Herbal tea blend', 'হারবাল টি ব্লেন্ড'),
                    'text' => $t('A box of 30 tea bags. Read the label for the ingredient list.', '৩০টি টি-ব্যাগের বাক্স। উপাদানের তালিকা লেবেলে পড়ুন।'),
                    'imageUrl' => '',
                    'bullets' => [$t('30 tea bags', '৩০টি টি-ব্যাগ'), $t('Caffeine free', 'ক্যাফেইন মুক্ত'), $t('Sealed box', 'সিল করা বাক্স')],
                ]),
                self::compare($t, $t('Our blend', 'আমাদের ব্লেন্ড'), $t('Typical tea', 'সাধারণ চা'), [$t('Caffeine free', 'ক্যাফেইন মুক্ত'), $t('No added colour', 'রং নেই'), $t('Ingredients listed', 'উপাদান লেখা আছে')], ['bg' => 'soft']),
                self::steps($t, $t('How to use', 'কীভাবে খাবেন'), [
                    ['title' => $t('Add hot water', 'গরম পানি দিন'), 'text' => $t('One tea bag in a cup.', 'এক কাপে একটি টি-ব্যাগ।')],
                    ['title' => $t('Steep', 'ভিজতে দিন'), 'text' => $t('Wait five minutes.', 'পাঁচ মিনিট অপেক্ষা করুন।')],
                    ['title' => $t('Enjoy', 'উপভোগ করুন'), 'text' => $t('Drink it warm.', 'গরম গরম পান করুন।')],
                ]),
                self::s('reviews', [
                    'title' => $t('From our customers', 'ক্রেতাদের কথা'),
                    'items' => [
                        ['name' => $t('Farhana, Dhaka', 'ফারহানা, ঢাকা'), 'text' => $t('A lovely evening habit now.', 'এখন সন্ধ্যার প্রিয় অভ্যাস।'), 'rating' => 5],
                        ['name' => $t('Kamal, Bogura', 'কামাল, বগুড়া'), 'text' => $t('Mild taste, easy to drink.', 'হালকা স্বাদ, খেতে সহজ।'), 'rating' => 4],
                    ],
                ]),
                self::s('faq', [
                    'title' => $t('Questions', 'প্রশ্ন'),
                    'items' => [
                        ['q' => $t('Is it a medicine?', 'এটা কি ওষুধ?'), 'a' => $t('No. It is a food product. Speak to your doctor if you have a health condition.', 'না, এটি খাদ্যপণ্য। শারীরিক সমস্যা থাকলে ডাক্তারের পরামর্শ নিন।')],
                        ['q' => $t('How many cups per day?', 'দিনে কয় কাপ?'), 'a' => $t('One or two cups is usual.', 'সাধারণত এক-দুই কাপ।')],
                    ],
                ]),
                self::s('guarantee', [
                    'title' => $t('Sealed and fresh', 'সিল করা ও টাটকা'),
                    'text' => $t('If the box arrives opened, refuse it and we send a new one.', 'বাক্স খোলা এলে ফেরত দিন, নতুন পাঠাব।'),
                ], ['bg' => 'brand']),
                self::order($t),
            ],
        ];
    }

    private static function home(callable $t): array {
        return [
            'title' => $t('Home offer', 'হোম অফার'),
            'product' => $t('Vegetable chopper', 'ভেজিটেবল চপার'),
            'price' => 1190,
            'compare' => 1590,
            'motion' => 'lively',
            'colors' => ['brand' => '#0369A1', 'accent' => '#F59E0B', 'canvas' => '#F3F8FC'],
            'sections' => [
                self::hero($t, $t('Save time in the kitchen', 'রান্নাঘরে সময় বাঁচান'), $t('Chop in seconds, not minutes', 'মিনিট নয়, সেকেন্ডে কুচি'), $t('One press, even pieces. Cash on delivery.', 'এক চাপে সমান টুকরো। ক্যাশ অন ডেলিভারি।'), $t('Order now', 'এখনই অর্ডার')),
                self::s('countdown', ['title' => $t('Offer price ends in', 'অফার শেষ হতে বাকি'), 'endsAt' => wp_date('Y-m-d\TH:i', time() + 7 * DAY_IN_SECONDS)]),
                self::s('video', ['title' => $t('Watch it work', 'কীভাবে কাজ করে দেখুন'), 'url' => '', 'caption' => '']),
                self::s('benefits', [
                    'title' => $t('Why you will use it', 'কেন কাজে লাগবে'),
                    'items' => [
                        ['title' => $t('Fast', 'দ্রুত'), 'text' => $t('Onions, carrots and more in seconds.', 'পেঁয়াজ, গাজর সহ আরও অনেক কিছু সেকেন্ডে।')],
                        ['title' => $t('Easy to clean', 'পরিষ্কার সহজ'), 'text' => $t('Parts come apart and rinse clean.', 'অংশগুলো খুলে ধুয়ে ফেলা যায়।')],
                        ['title' => $t('Safe grip', 'নিরাপদ গ্রিপ'), 'text' => $t('Non-slip base keeps it steady.', 'নন-স্লিপ বেস, নড়বড়ে হয় না।')],
                    ],
                ]),
                self::s('gallery', ['title' => $t('In the kitchen', 'রান্নাঘরে'), 'images' => []], ['layout' => 'slider']),
                self::order_steps($t, ['bg' => 'soft']),
                self::compare($t, $t('Our chopper', 'আমাদের চপার'), $t('Knife and board', 'ছুরি ও বোর্ড'), [$t('Done in seconds', 'সেকেন্ডে শেষ'), $t('Even pieces', 'সমান টুকরো'), $t('Less mess', 'কম ঝামেলা')]),
                self::s('reviews', [
                    'title' => $t('Customer reviews', 'ক্রেতাদের রিভিউ'),
                    'items' => [
                        ['name' => $t('Shirin, Dhaka', 'শিরিন, ঢাকা'), 'text' => $t('Dinner prep takes half the time now.', 'রাতের প্রস্তুতিতে এখন অর্ধেক সময় লাগে।'), 'rating' => 5],
                        ['name' => $t('Habib, Gazipur', 'হাবিব, গাজীপুর'), 'text' => $t('Sturdy and easy to wash.', 'মজবুত, ধোয়া সহজ।'), 'rating' => 5],
                        ['name' => $t('Lopa, Barishal', 'লোপা, বরিশাল'), 'text' => $t('Works well on onions.', 'পেঁয়াজে দারুণ কাজ করে।'), 'rating' => 4],
                    ],
                ], ['layout' => 'grid']),
                self::s('faq', [
                    'title' => $t('Questions', 'প্রশ্ন'),
                    'items' => [
                        ['q' => $t('Does it need electricity?', 'বিদ্যুৎ লাগে?'), 'a' => $t('No. It works by hand.', 'না, হাতে চালানো যায়।')],
                        ['q' => $t('Is there a warranty?', 'ওয়ারেন্টি আছে?'), 'a' => $t('Yes, 6 months against defects.', 'হ্যাঁ, ত্রুটির জন্য ৬ মাস।')],
                    ],
                ]),
                self::s('guarantee', [
                    'title' => $t('6-month warranty', '৬ মাসের ওয়ারেন্টি'),
                    'text' => $t('If it fails from a defect, we repair or replace it.', 'ত্রুটিতে নষ্ট হলে মেরামত বা বদলে দেব।'),
                ], ['bg' => 'brand']),
                self::whatsapp(),
                self::order($t),
            ],
        ];
    }

    private static function beauty(callable $t): array {
        return [
            'title' => $t('Skincare offer', 'স্কিনকেয়ার অফার'),
            'product' => $t('Vitamin C face serum', 'ভিটামিন সি ফেস সিরাম'),
            'price' => 890,
            'compare' => 1200,
            'motion' => 'lively',
            'colors' => ['brand' => '#BE185D', 'accent' => '#C4841D', 'canvas' => '#FDF6F8'],
            'sections' => [
                self::hero($t, $t('Daily glow', 'প্রতিদিনের উজ্জ্বলতা'), $t('Brighter-looking skin, one drop at a time', 'এক ফোঁটায় উজ্জ্বল ত্বক'), $t('Lightweight serum. Dermatologist tested. Cash on delivery.', 'হালকা সিরাম। ডার্মাটেস্টেড। ক্যাশ অন ডেলিভারি।'), $t('Order now', 'এখনই অর্ডার'), ['layout' => 'center', 'bg' => 'soft']),
                self::s('benefits', [
                    'title' => $t('What it does', 'কী করে'),
                    'items' => [
                        ['title' => $t('Lightweight', 'হালকা'), 'text' => $t('Absorbs fast, no sticky feel.', 'দ্রুত শোষিত হয়, আঠালো লাগে না।')],
                        ['title' => $t('Daily use', 'প্রতিদিনের জন্য'), 'text' => $t('Fits easily into a morning routine.', 'সকালের রুটিনে সহজে মেলে।')],
                        ['title' => $t('Tested', 'পরীক্ষিত'), 'text' => $t('Dermatologist tested.', 'ডার্মাটোলজিস্ট পরীক্ষিত।')],
                    ],
                ], ['layout' => 'numbers']),
                self::s('product', [
                    'title' => $t('Vitamin C face serum', 'ভিটামিন সি ফেস সিরাম'),
                    'text' => $t('A 30 ml bottle with a dropper. Patch test before first use.', 'ড্রপারসহ ৩০ মিলি বোতল। প্রথমবার ব্যবহারের আগে প্যাচ টেস্ট করুন।'),
                    'imageUrl' => '',
                    'bullets' => [$t('30 ml', '৩০ মিলি'), $t('Dropper bottle', 'ড্রপার বোতল'), $t('For daily use', 'প্রতিদিনের জন্য')],
                ], ['layout' => 'reverse']),
                self::steps($t, $t('How to use', 'কীভাবে ব্যবহার করবেন'), [
                    ['title' => $t('Cleanse', 'পরিষ্কার করুন'), 'text' => $t('Wash your face and pat dry.', 'মুখ ধুয়ে মুছে নিন।')],
                    ['title' => $t('Apply', 'লাগান'), 'text' => $t('Two to three drops on the face.', 'মুখে দুই-তিন ফোঁটা।')],
                    ['title' => $t('Moisturise', 'ময়েশ্চারাইজ'), 'text' => $t('Follow with your cream and sunscreen.', 'এরপর ক্রিম ও সানস্ক্রিন।')],
                ], ['bg' => 'soft']),
                self::compare($t, $t('Our serum', 'আমাদের সিরাম'), $t('Others', 'অন্যান্য'), [$t('Lightweight texture', 'হালকা টেক্সচার'), $t('Dermatologist tested', 'ডার্মাটেস্টেড'), $t('Dropper bottle', 'ড্রপার বোতল')]),
                self::s('reviews', [
                    'title' => $t('Customer love', 'ক্রেতাদের মতামত'),
                    'items' => [
                        ['name' => $t('Nusrat, Dhaka', 'নুসরাত, ঢাকা'), 'text' => $t('My skin looks fresher after two weeks.', 'দুই সপ্তাহে ত্বক টাটকা লাগছে।'), 'rating' => 5],
                        ['name' => $t('Tania, Cumilla', 'তানিয়া, কুমিল্লা'), 'text' => $t('Not sticky at all.', 'একদমই আঠালো না।'), 'rating' => 5],
                        ['name' => $t('Mim, Khulna', 'মিম, খুলনা'), 'text' => $t('Nice packaging, arrived sealed.', 'প্যাকেজিং সুন্দর, সিল করা এসেছে।'), 'rating' => 4],
                    ],
                ]),
                self::s('faq', [
                    'title' => $t('Questions', 'প্রশ্ন'),
                    'items' => [
                        ['q' => $t('Is it safe for sensitive skin?', 'সংবেদনশীল ত্বকে চলবে?'), 'a' => $t('Do a patch test first. Stop if you feel irritation.', 'আগে প্যাচ টেস্ট করুন। জ্বালা হলে ব্যবহার বন্ধ করুন।')],
                        ['q' => $t('When do I use it?', 'কখন লাগাব?'), 'a' => $t('Mornings, before moisturiser.', 'সকালে, ময়েশ্চারাইজারের আগে।')],
                    ],
                ]),
                self::s('guarantee', [
                    'title' => $t('Sealed bottle promise', 'সিল করা বোতলের নিশ্চয়তা'),
                    'text' => $t('If the bottle arrives opened or leaking, refuse it and we send a new one.', 'বোতল খোলা বা লিক এলে ফেরত দিন, নতুন পাঠাব।'),
                ], ['bg' => 'brand']),
                self::whatsapp(),
                self::order($t),
            ],
        ];
    }

    private static function gadget(callable $t): array {
        return [
            'title' => $t('Gadget offer', 'গ্যাজেট অফার'),
            'product' => $t('Wireless earbuds', 'ওয়্যারলেস ইয়ারবাডস'),
            'price' => 1490,
            'compare' => 1990,
            'motion' => 'lively',
            'colors' => ['brand' => '#4338CA', 'accent' => '#F59E0B', 'canvas' => '#F5F5FB'],
            'sections' => [
                self::hero($t, $t('New arrival', 'নতুন এসেছে'), $t('Clear sound, all-day battery', 'ক্লিয়ার সাউন্ড, সারাদিন ব্যাটারি'), $t('1-year warranty. Cash on delivery.', '১ বছর ওয়ারেন্টি। ক্যাশ অন ডেলিভারি।'), $t('Order now', 'এখনই অর্ডার'), ['bg' => 'dark']),
                self::s('countdown', ['title' => $t('Launch price ends in', 'লঞ্চ অফার শেষ হতে বাকি'), 'endsAt' => wp_date('Y-m-d\TH:i', time() + 7 * DAY_IN_SECONDS)]),
                self::s('benefits', [
                    'title' => $t('Built for daily use', 'প্রতিদিনের ব্যবহারের জন্য'),
                    'items' => [
                        ['title' => $t('Long battery', 'লম্বা ব্যাটারি'), 'text' => $t('Up to 24 hours with the case.', 'কেসসহ ২৪ ঘণ্টা পর্যন্ত।')],
                        ['title' => $t('Clear calls', 'পরিষ্কার কল'), 'text' => $t('Built-in mic with noise reduction.', 'নয়েজ রিডাকশনসহ মাইক।')],
                        ['title' => $t('Fast pairing', 'দ্রুত কানেক্ট'), 'text' => $t('Opens the case, connects on its own.', 'কেস খুললেই নিজে কানেক্ট।')],
                    ],
                ]),
                self::s('video', ['title' => $t('See it in action', 'কাজ করতে দেখুন'), 'url' => '', 'caption' => '']),
                self::s('gallery', ['title' => $t('Every angle', 'সব দিক থেকে'), 'images' => []], ['layout' => 'slider', 'ratio' => 'square']),
                self::compare($t, $t('Our earbuds', 'আমাদের ইয়ারবাডস'), $t('Cheap copies', 'সস্তা নকল'), [$t('1-year warranty', '১ বছর ওয়ারেন্টি'), $t('Real battery life', 'আসল ব্যাটারি ব্যাকআপ'), $t('After-sales support', 'বিক্রয়োত্তর সাপোর্ট')], ['bg' => 'soft']),
                self::s('reviews', [
                    'title' => $t('Customer reviews', 'ক্রেতাদের রিভিউ'),
                    'items' => [
                        ['name' => $t('Sohan, Dhaka', 'সোহান, ঢাকা'), 'text' => $t('Battery lasts the whole day.', 'পুরো দিন ব্যাটারি চলে।'), 'rating' => 5],
                        ['name' => $t('Jahid, Rangpur', 'জাহিদ, রংপুর'), 'text' => $t('Sound is clear for the price.', 'দামের তুলনায় সাউন্ড ভালো।'), 'rating' => 5],
                        ['name' => $t('Rakib, Cumilla', 'রাকিব, কুমিল্লা'), 'text' => $t('Connects instantly.', 'সাথে সাথে কানেক্ট হয়।'), 'rating' => 4],
                    ],
                ], ['layout' => 'grid']),
                self::s('faq', [
                    'title' => $t('Questions', 'প্রশ্ন'),
                    'items' => [
                        ['q' => $t('Does it work with all phones?', 'সব ফোনে চলবে?'), 'a' => $t('Yes, any phone with Bluetooth.', 'হ্যাঁ, ব্লুটুথ আছে এমন যেকোনো ফোনে।')],
                        ['q' => $t('How does the warranty work?', 'ওয়ারেন্টি কীভাবে?'), 'a' => $t('Contact us with your order number. We repair or replace it.', 'অর্ডার নম্বরসহ যোগাযোগ করুন। মেরামত বা বদলে দেব।')],
                    ],
                ]),
                self::s('guarantee', [
                    'title' => $t('1-year warranty', '১ বছরের ওয়ারেন্টি'),
                    'text' => $t('If it fails from a defect in the first year, we repair or replace it.', 'প্রথম বছরে ত্রুটিতে নষ্ট হলে মেরামত বা বদলে দেব।'),
                ], ['bg' => 'brand']),
                self::whatsapp(),
                self::order($t),
            ],
        ];
    }
}
