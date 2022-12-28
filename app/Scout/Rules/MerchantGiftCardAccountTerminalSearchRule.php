<?php

namespace App\Scout\Rules;

use ScoutElastic\SearchRule;

class MerchantGiftCardAccountTerminalSearchRule extends SearchRule
{
    /**
     * @inheritdoc
     */
    public function buildHighlightPayload()
    {
        return [
            'fields' => [
                'name' => [
                    'type' => 'plain'
                ]
            ]
        ];
    }

    /**
     * @inheritdoc
     */
    public function buildQueryPayload()
    {
        return [
            'must' => [
                'query_string' => [
                    'fields' => ['license_key','hardware_id','description'],
                    'query' => $this->builder->query,
                    // 'type' => 'phrase_prefix'
                ]
            ]
        ];
    }
}