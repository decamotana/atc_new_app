<?php

namespace App\Http\Controllers;

use App\Order;
use Illuminate\Http\Request;
use Ixudra\Curl\Facades\Curl;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    { }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

    public function save_product_to_ghl($data)
    {

        $user = \App\User::where('email', $data['user_email'])->first();


        $custom_field_id = $this->get_custom_fields('contact.product_purchase_details');

        $params = [
            'email' => $data['user_email'],
            'customField' => [$custom_field_id->id => $data['product']]
        ];

        // $params = [
        //     'email' => $user->email,
        //     'customField' => [$custom_field_id->id => $file_paths]
        // ];

        $params = json_encode($params);
        $params = str_replace("[", "", $params);
        $params = str_replace("]", "", $params);


        $url = 'https://rest.gohighlevel.com/v1/contacts/' . $user->go_high_level_id;
        $response = Curl::to($url)
            // ->withData(json_encode($params))
            ->withData($params)
            ->withHeader('Content-Type: application/json')
            ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
            ->put();
    }

    public function get_one_hour_update()
    {

        $user = auth()->user();

        $one_hour_update_order = \App\Order::where('email', $user->email)->where('order_details', 'like', '%1 Hour Update%')->get();

        return response()->json(['success' => true, 'data'  => $one_hour_update_order, 'purchaseCount' => count($one_hour_update_order), 'freeOneHourUpdate' =>  $user->free_one_hour_update]);
    }
}
