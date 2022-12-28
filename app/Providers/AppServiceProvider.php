<?php

namespace App\Providers;
use App\Notification;
use App\FormData;
use App\Ticket;
use App\User;
use App\Observers\FormDataObserver;
use App\Observers\TicketObserver;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
use Illuminate\Routing\UrlGenerator;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot(UrlGenerator $url)
    {
        Schema::defaultStringLength(191);
        // FormData::observe(FormDataObserver::class);
        // Ticket::observe(TicketObserver::class);
    }
}
