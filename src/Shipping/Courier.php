<?php
/**
 * Courier driver contract.
 *
 * @package Noksha
 */

namespace Noksha\Shipping;

interface Courier {
    public function id(): string;

    public function ready(): bool;

    /**
     * @return array{ok?:bool,consignment_id?:string,tracking_code?:string,error?:string,raw?:string}
     */
    public function book(array $order): array;
}
