<?php

namespace App\Traits;

trait AreaNumeralFormat
{
    public function toRoman(int $number): string
    {
        $identifier = [
            'M' => 1000,
            'CM' => 900,
            'D' => 500,
            'CD' => 400,
            'C' => 100,
            'XC' => 90,
            'L' => 50,
            'XL' => 40,
            'X' => 10,
            'IX' => 9,
            'V' => 5,
            'IV' => 4,
            'I' => 1,
        ];

        $result = '';

        foreach ($identifier as $roman => $num) {
            while ($number >= $num) {
                $result .= $roman;
                $number -= $num;
            }
        };
        return $result;
    }
}
