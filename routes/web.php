<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Ticket;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return view('admin');
// });

// // Route::get('/', 'DashboardController@index');
// Route::get('/', function() {
//     return view('admin.app');
// });

Route::get('/purechat-email', function() {
    return view('admin.emails.panticket',['link' => 'test','full_name' => 'Promise Network','email' => 'support@promise.network','button_link' => 'test']);
});


// Route::get( '/{any}', function( ){
//         return view('admin.app');
// });

Route::get('{all?}/{all1?}/{all2?}/{all3?}/{all4?}/{all5?}/{all6?}/{all7?}/{all8?}/{all9?}/{all10?}/{all11?}/{all12?}/{all13?}/{all14?}/{all15?}', function(Request $request){
    if($request->all == 'doc') {
        return view('apidoc.index');
    } else {
        return view('admin.app');
    }
});


 