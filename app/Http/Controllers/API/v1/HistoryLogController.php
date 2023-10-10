<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\HistoryLogs;
use Symfony\Component\Serializer\Encoder\JsonDecode;

class HistoryLogController extends Controller
{
    public function createHistory(Request $request)
    {

        if (isset($request->method)) {
            if ($request->method == "book-appointment") {

                $consultant = \App\User::find($request->consultant);
                $subject = "<p class='history-data'><span><b>Field:</b> Booked Appointment / $consultant->firstname $consultant->lastname </span> <span><b>Old:</b>  </span> <span><b>New:</b> " . $request->new_data . " </span></p>";
                $newData = "Booked Appointment with " . $consultant->firstname . " " . $consultant->lastname . "on" . $request->new_data;
            } else if ($request->method == "cancel-appointment") {

                $consultant = $request->consultant;
                $subject = "<p class='history-data'><span><b>Field:</b> Appointment Status / $consultant </span> <span><b>Old:</b> $request->old_data   </span> <span><b>New:</b>  $request->new_data   </span></p>";
                $newData = "Cancelled Appointment with " .  $consultant . " on " . $request->new_data;
            } else if ($request->method == "upload-document") {
                $newData = str_replace("[", "", $request->new_data);
                $newData = str_replace("]", "", $newData);
                $newData = str_replace('"', "", $newData);
                $subject = "<p class='history-data'><span><b>Field:</b> Upload documents</span> <span><b>Old:</b> $request->old_data   </span> <span><b>New:</b> Uploaded (" . $newData . ") </span></p>";
            } else if ($request->method == "upload-document-admin") {
                $newData = str_replace("[", "", $request->new_data);
                $newData = str_replace("]", "", $newData);
                $newData = str_replace('"', "", $newData);
                $user = \App\User::find($request->user_id);


                $subject = "<p class='history-data'><span><b>Field:</b> Upload documents / $user->firstname $user->lastname </span> <span><b>Old:</b> $request->old_data   </span> <span><b>New:</b> Uploaded (" . $newData . ") </span></p>";
            } else if ($request->method == "add-slot") {
                $consultant = \App\User::find($request->consultant);
                $data = json_decode($request->new_data);

                $time_slot = [];

                foreach ($data as $key => $slot) {
                    $time_slot[] = $slot->startTime . "-" . $slot->endTime;
                }

                $time_slot = json_encode($time_slot);
                $time_slot = str_replace("[", "", $time_slot);
                $time_slot = str_replace("]", "", $time_slot);
                $time_slot = str_replace('"', "", $time_slot);

                $subject = "<p class='history-data'><span><b>Field:</b> Appointment slot / $consultant->firstname  $consultant->lastname  </span> <span><b>Old:</b>  </span> <span><b>New:</b>Added appointment slot( $time_slot ) on " . $data[0]->date . "  </span></p>";
                $newData = "Appointment slot( $time_slot ) added to " . $consultant->firstname . " " . $consultant->lastname . " on " . $data[0]->date;
            } else if ($request->method == "delete-slot") {

                $slot = json_decode($request->slot_data);
                $time_slot = $slot->time_start . "-" . $slot->time_end;
                $consultant = $slot->user;

                $subject = "<p class='history-data'><span><b>Field:</b> Appointment slots / $consultant->firstname  $consultant->lastname </span> <span><b>Old:</b>  Deleted appointment slot( $time_slot ) " . " on " . $slot->schedule_date  . " </span> <span><b>New:</b>  </span></p>";
                $newData = "Deleted appointment slot( $time_slot )" . " on " . $slot->schedule_date  . " of " . $consultant->firstname . " " . $consultant->lastname;
            } else if ($request->method == "change-appointment-status") {
                $data = json_decode($request->data);
                error_log($request->data);
                $status = strtolower($data->status) == "showed" ? "ATTENDED" : ($data->status == "noshow" || $data->status == "No Show"  ? "NO SHOW" : ($data->status == "cancelled" ? (isset($data->deleteAppointment) ? "CANCELLED AND DELETED" : "CANCELLED") : null));
                $subject = "<p class='history-data'><span><b>Field:</b> Appointment Status / id: " . $data->id . "  </span> <span><b>Old: CONFIRMED</b>  </span> <span><b>New:</b> Changed appointment status to " . $status . "  </span></p>";
                $newData = "Change appointment (id: " . $data->id . ") status to " . $status;
            } else if ($request->method == "add-user-notes") {
                $user = \App\User::find($request->user_id);

                $subject = "<p class='history-data'><span><b>Field:</b>User Notes / $user->firstname $user->lastname  </span> <span><b>Old: $request->old_data</b>  </span> <span><b>New:</b> Added notes ($request->new_data) </span></p>";
                $newData = "Added notes ($request->new_data)";
            } else {

                $subject = "<p class='history-data'><span><b>Field:</b> $request->page</span> <span><b>Old:</b> $request->old_data  </span> <span><b>New:</b> $request->new_data  </span></p>";
                $newData = $request->new_data;
            }
        } else {
            $subject = "<p class='history-data'><span><b>Field:</b> $request->page</span> <span><b>Old:</b> $request->old_data  </span> <span><b>New:</b> $request->new_data  </span></p>";
            $newData = $request->new_data;
        }

        $data = \App\HistoryLogs::updateOrCreate([
            'id' => $request->id ?? null
        ], [
            'page' => $request->page,
            'subject' => $subject ?? $request->subject,
            'key' => $request->key,
            'old_data' => $request->old_data,
            'new_data' => $newData ?? $request->new_data,
            'updated_by_id' => auth()->user()->id,
        ]);

        return response()->json([
            'success' => true,
            'data' => $data
        ], 200);
    }

    public function getHistory(Request $request)
    {
        $data = new HistoryLogs();
        $data = $data->select(['history_logs.*', \DB::raw("CONCAT(`firstname`, ' ', `lastname`) as consultant"), \DB::raw("DATE_FORMAT(history_logs.created_at, '%Y-%m-%d %l:%i%p') as timestamp")])
            ->leftJoin('users', 'history_logs.updated_by_id', '=', 'users.id');


        if (isset($request->search)) {

            if (is_array($request->search)) {
                $request->search =  $request->search['search'];
            }

            $data = $data->where(function ($q) use ($request) {
                $q->orWhere(\DB::raw("CONCAT(`firstname`, ' ', `lastname`)"), 'LIKE', "%$request->search%");
                $q->orWhere(\DB::raw("DATE_FORMAT(history_logs.created_at, '%Y-%m-%d %l:%i%p')"), 'LIKE', "%$request->search%");
                $q->orWhere('subject', 'LIKE', "%$request->search%");
                $q->orWhere('page', 'LIKE', "%$request->search%");
                // $q->orWhere(DB::raw("(SELECT city FROM `user_addresses` WHERE user_addresses.user_id = users.id)"), 'LIKE', "%$request->search%");
            });
        }


        if ($request->sort_field && $request->sort_order) {
            if (
                $request->sort_field != '' && $request->sort_field != 'undefined' && $request->sort_field != 'null'  &&
                $request->sort_order != ''  && $request->sort_order != 'undefined' && $request->sort_order != 'null'
            ) {
                if ($request->sort_field == "timestamp") {
                    $data->orderBy('history_logs.created_at', $request->sort_order);
                } else if ($request->sort_field == "page") {
                    $data->orderBy('page', isset($request->sort_order)  ? $request->sort_order : 'desc');
                } else if ($request->sort_field == "consultant") {
                    $data->orderBy('consultant', isset($request->sort_order)  ? $request->sort_order : 'desc');
                } else {
                    $data->orderBy(isset($request->sort_field) ? $request->sort_field : 'id', isset($request->sort_order)  ? $request->sort_order : 'desc');
                }
            }
        } else {
            $data = $data->orderBy('id', 'desc');
        }



        $data = $data->limit($request->page_size)
            ->paginate($request->page_size, ['*'], 'page', $request->page_number)->toArray();


        return response()->json([
            'success' => true,
            'data' => $data,

        ]);
    }
}
