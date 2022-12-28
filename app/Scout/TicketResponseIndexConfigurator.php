<?php

namespace App\Scout;

use ScoutElastic\IndexConfigurator;
use ScoutElastic\Migratable;

class TicketResponseIndexConfigurator extends IndexConfigurator
{
    use Migratable;

    /**
     * @var array
     */
    protected $settings = [
        //
    ];
}