<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\User;
use App\UserAccountLink;
use App\Form;
use App\FormData;
use App\FormInput;
use App\Ticket;
use App\TicketResponse;
use App\PortfolioSnapshot;
use App\PaysafeBatchDetail;

use App\MerchantGiftCardAccountController;
use App\MerchantGuide;
use App\WebHook;
use App\DeviceMgmtController;
use App\Notification;
use Illuminate\Support\Facades\Mail;
use Ddeboer\Imap\Server;
use Ixudra\Curl\Facades\Curl;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\UserExtensionField;

use JoliCode\Slack\ClientFactory;
use JoliCode\Slack\Exception\SlackErrorResponse;



use App\Http\Controllers\Controller;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group(['prefix' => 'api/v1'], function () {
    Route::group(['middleware' => 'auth:api'],function() {

        Route::apiResource('user','API\v1\UserController');
    });

    Route::post('login', 'API\v1\AuthController@login');
    Route::post('logout', 'API\v1\AuthController@logout');
    Route::apiResource('forgotpassword', 'API\v1\ForgotPasswordController');


});

