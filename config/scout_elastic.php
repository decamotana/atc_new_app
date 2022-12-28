<?php

return [
    'client' => [
        'hosts' => [
            [
                'host' => env('SCOUT_ELASTIC_HOST','localhost'),
                'user' => env('SCOUT_ELASTIC_USER',''),
                'pass' => env('SCOUT_ELASTIC_PASS','')
            ],
        ],
    ],
    'update_mapping' => env('SCOUT_ELASTIC_UPDATE_MAPPING', true),
    'indexer' => env('SCOUT_ELASTIC_INDEXER', 'single'),
    'document_refresh' => env('SCOUT_ELASTIC_DOCUMENT_REFRESH'),
];
