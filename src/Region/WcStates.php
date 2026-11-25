<?php
/**
 * Noksha district ids to WooCommerce's Bangladesh state codes ("BD-13" is Dhaka).
 *
 * WooCommerce translates state names, so matching by name fails on a Bangla
 * site. The ids in data/bd-geo.json are fixed, so this map is too.
 *
 * @package Noksha
 */

namespace Noksha\Region;

final class WcStates {
    /** @var array<string, string> */
    private const CODES = [
        '1' => 'BD-08', // Cumilla
        '2' => 'BD-16', // Feni
        '3' => 'BD-04', // Brahmanbaria
        '4' => 'BD-56', // Rangamati
        '5' => 'BD-47', // Noakhali
        '6' => 'BD-09', // Chandpur
        '7' => 'BD-31', // Lakshmipur
        '8' => 'BD-10', // Chattogram
        '9' => 'BD-11', // Cox's Bazar
        '10' => 'BD-29', // Khagrachhari
        '11' => 'BD-01', // Bandarban
        '12' => 'BD-59', // Sirajganj
        '13' => 'BD-49', // Pabna
        '14' => 'BD-03', // Bogura
        '15' => 'BD-54', // Rajshahi
        '16' => 'BD-44', // Natore
        '17' => 'BD-24', // Joypurhat
        '18' => 'BD-45', // Chapainawabganj
        '19' => 'BD-48', // Naogaon
        '20' => 'BD-22', // Jashore
        '21' => 'BD-58', // Satkhira
        '22' => 'BD-39', // Meherpur
        '23' => 'BD-43', // Narail
        '24' => 'BD-12', // Chuadanga
        '25' => 'BD-30', // Kushtia
        '26' => 'BD-37', // Magura
        '27' => 'BD-27', // Khulna
        '28' => 'BD-05', // Bagerhat
        '29' => 'BD-23', // Jhenaidah
        '30' => 'BD-25', // Jhalokati
        '31' => 'BD-51', // Patuakhali
        '32' => 'BD-50', // Pirojpur
        '33' => 'BD-06', // Barishal
        '34' => 'BD-07', // Bhola
        '35' => 'BD-02', // Barguna
        '36' => 'BD-60', // Sylhet
        '37' => 'BD-38', // Moulvibazar
        '38' => 'BD-20', // Habiganj
        '39' => 'BD-61', // Sunamganj
        '40' => 'BD-42', // Narsingdi
        '41' => 'BD-18', // Gazipur
        '42' => 'BD-62', // Shariatpur
        '43' => 'BD-40', // Narayanganj
        '44' => 'BD-63', // Tangail
        '45' => 'BD-26', // Kishoreganj
        '46' => 'BD-33', // Manikganj
        '47' => 'BD-13', // Dhaka
        '48' => 'BD-35', // Munshiganj
        '49' => 'BD-53', // Rajbari
        '50' => 'BD-36', // Madaripur
        '51' => 'BD-17', // Gopalganj
        '52' => 'BD-15', // Faridpur
        '53' => 'BD-52', // Panchagarh
        '54' => 'BD-14', // Dinajpur
        '55' => 'BD-32', // Lalmonirhat
        '56' => 'BD-46', // Nilphamari
        '57' => 'BD-19', // Gaibandha
        '58' => 'BD-64', // Thakurgaon
        '59' => 'BD-55', // Rangpur
        '60' => 'BD-28', // Kurigram
        '61' => 'BD-57', // Sherpur
        '62' => 'BD-34', // Mymensingh
        '63' => 'BD-21', // Jamalpur
        '64' => 'BD-41', // Netrakona
    ];

    /**
     * WooCommerce state code for a Noksha district id, or '' when unknown.
     */
    public static function code(string $district_id): string {
        return self::CODES[$district_id] ?? '';
    }
}
