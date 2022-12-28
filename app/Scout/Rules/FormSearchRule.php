<?php

namespace App\Scout\Rules;

use ScoutElastic\SearchRule;

class FormSearchRule extends SearchRule
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
                    'fields' => ['form_name','form_shortname','form_title'],
                    'query' => $this->builder->query,
                    // 'type' => 'phrase_prefix'
                ]
            ]
        ];
    }
}