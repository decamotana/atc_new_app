## git

    git remote -v
    git remote set-url origin 'url'

    https://github.com/adexin/spinners-react
    loaders

<p align="center"><img src="https://res.cloudinary.com/dtfbvvkyp/image/upload/v1566331377/laravel-logolockup-cmyk-red.svg" width="400"></p>

<p align="center">
<a href="https://travis-ci.org/laravel/framework"><img src="https://travis-ci.org/laravel/framework.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://poser.pugx.org/laravel/framework/d/total.svg" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://poser.pugx.org/laravel/framework/v/stable.svg" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://poser.pugx.org/laravel/framework/license.svg" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

-   [Simple, fast routing engine](https://laravel.com/docs/routing).
-   [Powerful dependency injection container](https://laravel.com/docs/container).
-   Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
-   Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
-   Database agnostic [schema migrations](https://laravel.com/docs/migrations).
-   [Robust background job processing](https://laravel.com/docs/queues).
-   [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains over 1500 video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the Laravel [Patreon page](https://patreon.com/taylorotwell).

-   **[Vehikl](https://vehikl.com/)**
-   **[Tighten Co.](https://tighten.co)**
-   **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
-   **[64 Robots](https://64robots.com)**
-   **[Cubet Techno Labs](https://cubettech.com)**
-   **[Cyber-Duck](https://cyber-duck.co.uk)**
-   **[British Software Development](https://www.britishsoftware.co)**
-   **[Webdock, Fast VPS Hosting](https://www.webdock.io/en)**
-   **[DevSquad](https://devsquad.com)**
-   [UserInsights](https://userinsights.com)
-   [Fragrantica](https://www.fragrantica.com)
-   [SOFTonSOFA](https://softonsofa.com/)
-   [User10](https://user10.com)
-   [Soumettre.fr](https://soumettre.fr/)
-   [CodeBrisk](https://codebrisk.com)
-   [1Forge](https://1forge.com)
-   [TECPRESSO](https://tecpresso.co.jp/)
-   [Runtime Converter](http://runtimeconverter.com/)
-   [WebL'Agence](https://weblagence.com/)
-   [Invoice Ninja](https://www.invoiceninja.com)
-   [iMi digital](https://www.imi-digital.de/)
-   [Earthlink](https://www.earthlink.ro/)
-   [Steadfast Collective](https://steadfastcollective.com/)
-   [We Are The Robots Inc.](https://watr.mx/)
-   [Understand.io](https://www.understand.io/)
-   [Abdel Elrafa](https://abdelelrafa.com)
-   [Hyper Host](https://hyper.host)
-   [Appoly](https://www.appoly.co.uk)
-   [OP.GG](https://op.gg)

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

<!-- elasticsearch window -->

https://github.com/babenkoivan/scout-elasticsearch-driver

## FOR LARAVEL GUIDE

-   composer install --ignore-platform-reqs (not necessary)

### VIA COMPOSER

-   composer create-project laravel/laravel example-app
-   laravel new example-app
-   php artisan serve

### INSTALLER

-   composer global require laravel/installer
-   laravel new example-app
-   php artisan serve

### FOR EXISTING

-   composer install
-   setup .env
-   create database
-   php artisan key:generate
-   php artisan migrate --seed
-   php artisan passport:install
-   php artisan serve or use valet (recommended for ios or mac)

#### ANOTHER COMMAND

-   composer update
-   composer dump-autoload
-   php artisan migrate:fresh --seed
-   php artisan db:seed
-   php artisan make:migration create_form_types_table
-   php artisan make:model User -c --api (auto generate for model and controller and api)
-   php artisan make:model User -mc --api (auto generate for migration table, model, controller and api)
-   php artisan make:observer UserObserver --model=User
-   php artisan make:seeder UserSeeder
-   php artisan make:migration add_status_to_users_table --table=users (status is the column and the users is the table name)
-   php artisan make:migration create_inventory_view (inventory is the name of your view din sumpayi ug view hehe)
-   php artisan storage:link

# to run elasticsearc

    go to elastic local folder
    type command = "./bin/elasticsearch"
    on browser url = "http://localhost:9200/"

# update mapping on laravel

    command = php artisan elastic:update-mapping 'App\(EXAPLE MODEL)'

    php artisan elastic:update-mapping 'App\User'
    php artisan elastic:update-mapping 'App\UserExtensionField'
    php artisan elastic:update-mapping 'App\UserAccountLink'
    php artisan elastic:update-mapping 'App\TicketResponse'
    php artisan elastic:update-mapping 'App\Ticket'
    php artisan elastic:update-mapping 'App\PaysafeAccount'
    php artisan elastic:update-mapping 'App\MerchantGiftCardAccountTerminal'
    php artisan elastic:update-mapping 'App\MerchantGiftCardAccount'
    php artisan elastic:update-mapping 'App\Form'
    php artisan elastic:update-mapping 'App\FormData'
    php artisan elastic:update-mapping 'App\ClearentMerchant'
    php artisan elastic:update-mapping 'App\ClearentBoarding'

    php artisan elastic:create-index 'App\Scout\UserIndexConfigurator'
    php artisan elastic:create-index 'App\Scout\UserExtensionFieldIndexConfigurator'
    php artisan elastic:create-index 'App\Scout\UserAccountLinkIndexConfigurator'
    php artisan elastic:create-index 'App\Scout\TicketResponseIndexConfigurator'
    php artisan elastic:create-index 'App\Scout\TicketIndexConfigurator'
    php artisan elastic:create-index 'App\Scout\PaysafeAccountIndexConfigurator'
    php artisan elastic:create-index 'App\Scout\MerchantGiftCardAccountTerminalIndexConfigurator'
    php artisan elastic:create-index 'App\Scout\MerchantGiftCardAccountIndexConfigurator'
    php artisan elastic:create-index 'App\Scout\FormIndexConfigurator'
    php artisan elastic:create-index 'App\Scout\FormDataIndexConfigurator'
    php artisan elastic:create-index 'App\Scout\ClearentMerchantIndexConfigurator'
    php artisan elastic:create-index 'App\Scout\ClearentBoardingIndexConfigurator'

    php artisan queue:work

php artisan cache:clear
php artisan route:clear
php artisan config:clear

php artisan elastic:drop-index 'App\Scout\UserIndexConfigurator'
php artisan elastic:create-index 'App\Scout\UserIndexConfigurator'
# atc_new_app
