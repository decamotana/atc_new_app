<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AdminNotificationSettingsController extends Controller
{
    public function index()
    {
        $notification_settings = \App\AdminNotificationSettings::first();

        return response()->json([
            'success' => true,
            'data' => $notification_settings
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

        $admin = auth()->user();

        $update = \App\AdminNotificationSettings::updateOrCreate(['user_id' => $admin->id], [

            'sms_notif_90_under' => $request->smsNotif_90_under,
            'sms_notif_90_over' => $request->smsNotif_90_over,
            'email_notif_90_under' => $request->emailNotif_90_under,
            'email_notif_90_over' => $request->emailNotif_90_over,
            'calendar_settings' => $request->calendar_settings,
            'sms_template' => $request->sms_template,
            'email_template' => $request->email_template,


        ]);

        return response()->json(['success' => true, 'message' => 'successfuly updated'], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\AdminNotificationSettings  $adminNotificationSettings
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    { }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\AdminNotificationSettings  $adminNotificationSettings
     * @return \Illuminate\Http\Response
     */


    public function get_settings()
    {
        $calendar_settings = \App\AdminNotificationSettings::select('calendar_settings')->first();
        return response()->json(['success' => true, 'data' => $calendar_settings['calendar_settings']], 200);
    }
}
