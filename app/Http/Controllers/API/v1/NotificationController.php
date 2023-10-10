<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Notification;
use Illuminate\Support\Facades\DB;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $data = new Notification;
        $data = $data->with(['notification_user'])->select([
            'notifications.*',
            DB::raw("(SELECT DATE_FORMAT(created_at, '%m/%d/%Y')) as created_str")
        ]);
        $data = $data->where(function ($q) use ($request) {
            $q->orWhere('title', 'LIKE', "%$request->search%");
            $q->orWhere('description', 'LIKE', "%$request->search%");
            $q->orWhere('search_for', 'LIKE', "%$request->search%");
            $q->orWhere(DB::raw("(SELECT DATE_FORMAT(created_at, '%m/%d/%Y'))"), 'LIKE', "%$request->search%");
        });

        if ($request->sort_field && $request->sort_order) {
            if (
                $request->sort_field != '' && $request->sort_field != 'undefined' && $request->sort_field != 'null'  &&
                $request->sort_order != ''  && $request->sort_order != 'undefined' && $request->sort_order != 'null'
            ) {
                if ($request->sort_field == "created_str") {
                    $data->orderBy(DB::raw("(SELECT DATE_FORMAT(created_at, '%m/%d/%Y'))")  ? $request->sort_order : 'desc');
                } else {
                    $data->orderBy(isset($request->sort_field) ? $request->sort_field : 'id', isset($request->sort_order)  ? $request->sort_order : 'desc');
                }
            }
        } else {
            $data->orderBy('id', 'desc');
        }

        $data = $data
            ->limit($request->page_size)
            ->paginate($request->page_size, ['*'], 'page', $request->page)->toArray();

        return response()->json([
            'success' => true,
            'data' => $data,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = Notification::updateOrCreate(['id' => $request->id], [
            'title' => $request->title,
            'search_for' => $request->search_for,
            'description' => $request->description,
            'type' => $request->search_for == 'Clients' ? json_encode($request->type) : ('Consultants' ? json_encode($request->type) : $request->type),
            'created_by' => auth()->user()->id,
        ]);

        if (isset($request->id)) {
            if ($request->old_type != $request->type) {
                $delete = \App\NotificationUser::where('notification_id', $data['id'])->get();
                if ($delete) {
                    \App\NotificationUser::where('notification_id', $data['id'])->delete();
                }
            }
        }
        if ($request->search_for === 'Role') {
            if ($request->type != 'All') {
                $find = \App\User::where('role', $request->type)->get();
                foreach ($find as $key => $value) {
                    \App\NotificationUser::updateOrCreate([
                        'user_id' => $value['id'],
                        'notification_id' => $data['id'],
                    ], [
                        'user_id' => $value['id'],
                        'notification_id' => $data['id'],
                        'read' => 0,
                    ]);
                }
            } else {
                $find = \App\User::where('role', '!=', "Admin")->get();
                if ($request->old_type != $request->type) {
                    foreach ($find as $key => $value) {
                        // \App\NotificationUser::create([
                        \App\NotificationUser::updateOrCreate([
                            'user_id' => $value['id'],
                            'notification_id' => $data['id'],
                        ], [
                            'user_id' => $value['id'],
                            'notification_id' => $data['id'],
                            'read' => 0,
                        ]);
                    }
                }
            }
        } else if ($request->search_for === 'Clients' || $request->search_for === 'Consultants') {
            // $find = \App\User::where(DB::raw('(SELECT business_name FROM member_companies user_id=users.id)'), $request->search_for)->get();
            // foreach ($find as $key => $value) {
            // }

            foreach ($request->type as $key => $value) {
                \App\NotificationUser::updateOrCreate(
                    ['notification_id' => $data['id'], 'user_id' => $value],
                    [
                        // 'user_id' => $request->user_id,
                        'user_id' => $value,
                        'notification_id' => $data['id'],
                        'read' => 0,
                    ]
                );
            }
        }

        return response()->json([
            'success' => true,
            // 'data' =>  $find
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Notification  $notification
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $data = Notification::find($id);
        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Data not found'
            ], 400);
        }

        return response()->json([
            'success' => true,
            'data' => $data
        ], 200);
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Notification  $notification
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $update_query = Notification::find($id);

        $updated_result = $update_query->fill($request->all());
        $updated_result = $updated_result->save();

        if ($updated_result)
            return response()->json([
                'success'       => true,
                'message'       => 'City',
                'description'   => 'Data updated successfully'
            ], 200);
        else
            return response()->json([
                'success'       => false,
                'message'       => 'City',
                'description'   => 'Data not updated'
            ], 200);
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Notification  $notification
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $data = Notification::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Device with id ' . $id . ' not found'
            ], 400);
        }

        if ($data->delete()) {
            return response()->json([
                'success' => true
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Device could not be deleted'
            ], 500);
        }
    }

    public function get_account_option(Request $request)
    {
        // $data = \App\AccountType::all();
        // return response()->json([
        //     'success' => true,
        //     'data' => $data
        // ]);
    }

    public function read(Request $request)
    {
        $update_query = \App\NotificationUser::find($request->id);

        // $updated_result = $update_query->fill($request->all());
        $update_query->read = $request->read;
        $update_query = $update_query->save();

        return response()->json([
            'success' => true,
            'data' => $update_query
        ]);
    }

    public function archive(Request $request)
    {
        $update_query = \App\NotificationUser::find($request->id);

        $update_query->read = 1;
        $update_query->archive = 1;
        $update_query = $update_query->save();

        return response()->json([
            'success' => true,
            'data' => $update_query
        ]);
    }

    public function get_notification_alert(Request $request)
    {
        $data = \App\NotificationUser::with(['notification', 'user'])
            ->where('user_id', auth()->user()->id)
            ->where('archive', '<>', 1)
            ->orderBy('created_at', 'desc')
            ->get();
        $unread = \App\NotificationUser::where('user_id', auth()->user()->id)->where('archive', '<>', 1)->where('read', 0)->get();

        return response()->json([
            'success' => true,
            'data' => $data,
            'unread' => count($unread),
        ]);
    }

    public function user_options(Request $request)
    {
        $data = \App\User::where('role', '<>', 'ADMIN')->where('status', 'Active')->get();

        return response()->json([
            'success' => true,
            'data' => $data,
        ], 200);
    }

    public function company_option(Request $request)
    {
        // $data = \App\Organization::where('status', 'Approved')->get();

        // return response()->json([
        //     'success' => true,
        //     'data' => $data
        // ], 200);
    }

    // public function get_messages_alert(Request $request)
    // {
    //     $data = \App\MessageConvo::with(['from', 'to'])
    //         ->where(function ($q) {
    //             $q
    //                 ->orWhere('to_id', auth()->user()->id);
    //             // ->orWhere('from_id', auth()->user()->id);
    //         })
    //         ->where('unread', true)
    //         ->orderBy('created_at', 'desc')
    //         ->groupBy('message_id')
    //         ->get();
    //     // $unread = \App\MessageConvo::where('user_id', auth()->user()->id)->where('read', 0)->get();

    //     return response()->json([
    //         'success' => true,
    //         'data' => $data,
    //         'unread' => count($data),
    //     ]);
    // }
}
