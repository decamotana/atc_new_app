<?php

namespace App\Scout;

use ScoutElastic\IndexConfigurator;
use ScoutElastic\Migratable;

class ClearentBoardingIndexConfigurator extends IndexConfigurator
{
    use Migratable;

    /**
     * @var array
     */
    protected $settings = [
        "analysis" => [
            "analyzer" => [
              "my_email_analyzer" => [
                "type" => "custom",
                "tokenizer" => "uax_url_email",
                "filter" => ["lowercase", "stop"]
              ]
            ]
          ]
    ];
}