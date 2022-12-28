<?php

namespace App\Scout\Rules;

use ScoutElastic\SearchRule;

class UserExtensionFieldSearchRule extends SearchRule
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
                    'fields' => ['merchant_name'],
                    'query' => $this->builder->query,
                    // 'type' => 'phrase_prefix'
                ]
            ]
        ];
    }
}