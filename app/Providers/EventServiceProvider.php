<?php

namespace App\Providers;

use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        'App\Events\TicketCreated' => [
            'App\Listeners\SendTicketEmail',
        ],
        'App\Events\UserInitLoginUpdated' => [
            'App\Listeners\SendInitLoginEmail',
        ],
        'App\Events\NewGiftCardPurchaseEvent' => [
            'App\Listeners\NewGiftCardPurchaseListener',
        ],
        'App\Events\SendMailEvent' => [
            'App\Listeners\SendMailListener',
        ]
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot();

        //
    }
}
