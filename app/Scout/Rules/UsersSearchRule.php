<?php

namespace App\Scout\Rules;

use ScoutElastic\SearchRule;

class UsersSearchRule extends SearchRule
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
                    'fields' => ['name','email','phone_number'],
                    'query' => $this->builder->query,
                    // 'type' => 'phrase_prefix'
                ]
            ]
        ];
    }
}