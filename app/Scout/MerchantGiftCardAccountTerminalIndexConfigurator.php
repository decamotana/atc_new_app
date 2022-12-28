<?php

namespace App\Scout;

use ScoutElastic\IndexConfigurator;
use ScoutElastic\Migratable;

class MerchantGiftCardAccountTerminalIndexConfigurator extends IndexConfigurator
{
    use Migratable;

    /**
     * @var array
     */
    protected $settings = [
        //
    ];
}