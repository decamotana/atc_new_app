<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Appointment;
use App\AppointmentConsultant;
use App\Consultants;
use App\ConsultantSchedule;

use Ixudra\Curl\Facades\Curl;
use \App\User;
use Carbon\Carbon;
use DateTimeZone;
use DateTime;
use Dotenv\Result\Success;
use File;
use Illuminate\Support\Facades\DB;

use function GuzzleHttp\json_encode;

class AppointmentController extends Controller
{
    public function getTimeZone()
  {

    $timeZone = \DateTimeZone::listIdentifiers(\DateTimeZone::ALL);

    return response()->json([
      'success' => true,
      'data' => $timeZone
    ], 200);
  }

  public function addAppointment(Request $request)
  {

    $user = auth()->user();
    // $check_appointment = \App\Appointment::where('user_id', $user->id);
    $current_tag = $this->get_current_tag();

    $appointment_book_tags = [
      'call 1 - book (current task)',
      'call 2 - book (current task)',
      'follow up call - book (current task)',
      'timeline - book (current task)',
      'pre publish - book (current task)',
      'pre interview - book (current task)',
      'reschedule - book (current task)',
    ];

    $hasBookCurrentTask = false;
    if (is_array($current_tag)) {
      $current_tag = json_encode($current_tag);
      if (str_contains($current_tag, 'book (current task)')) {
        $hasBookCurrentTask = true;
      }
    } else {
      if (in_array($current_tag, $appointment_book_tags) == true) {
        $hasBookCurrentTask = true;
      }
    }

    if (!$hasBookCurrentTask) {
      return response()->json([
        'success' => false,
        'message' => 'You are not allowed to book appointment, please check your current task and try again.',
        'task' => $current_tag
      ], 200);
    }

    // $data = [
    //   'email' => $user->email,
    //   'calendarId' => $request->calendarID,
    //   "selectedTimezone" =>  $request->timezone,
    //   "selectedSlot" => $request->timeslot,
    // ];

    // $response = $this->getGoHighlevelAddAppointment($data); //jepril 10/04/2023
    // if ($response->status != 200) {
    //   //    $this->remove_tag($tag_to_remove);

    //   //   $tag_data =  (object) [];
    //   //   $tag_data->tag = $tag_to_add;
    //   //   $this->add_tag($tag_data);

    //   return response()->json([
    //     'success' => false,
    //     'message' => $response,
    //     'other' => $data
    //   ], $response->status);
    // }

    // $task = $this->get_task_details('Book Appointment');
    // if (!isset($task)) {
    //   return response()->json([
    //     'success' => false,
    //     'message' => 'Something went wrong, Please try again!',
    //     'task' => $task,
    //     'current_tag' => $current_tag
    //   ], 200);
    // }

    $task_params = [
        'ghl_id' => $user->id,
        'task_id' => "Book Appointment"
    ];

    $taskMarked =  $this->marktask($task_params);
    if (!$taskMarked) {
        return response()->json([
        'success' => false,
        'message' => 'Something went wrong, Please try again!',
        ], 200);
    }

    $tag_data =  (object) [];
    switch ($current_tag) {
      case ((str_contains($current_tag, 'call 1 - book (current task)'))):
        // $this->remove_tag('call 1 - book (current task)');
        // $tag_data->tag = ['call 1 - book (done)', 'call 1 - call (current task)', 'book for call 1'];

        $removeTagData = ['call 1 - book (current task)', 'book for call 1'];
        $tag_data = ['call 1 - book (done)', 'call 1 - call (current task)'];

        break;
      case ((str_contains($current_tag, 'call 2 - book (current task)'))):
        // $this->remove_tag('call 2 - book (current task)');
        //     $tag_data->tag = ['call 2 - book (done)', 'call 2 - call (current task)', 'book for call 2'];

        $removeTagData = ['call 2 - book (current task)', 'call 1 - call (done)', 'book for call 2'];
        $tag_data = ['call 2 - book (done)', 'call 2 - call (current task)'];
        break;
      case ((str_contains($current_tag, 'follow up call - book (current task)'))):
        // $this->remove_tag('follow up call - book (current task)');
        //     $tag_data->tag = ['follow up call - book (done)', 'follow up call - call (current task)', 'book for follow up call'];

        $removeTagData = ['book for follow up call', 'call 2 - call (done)', 'follow up call - book (current task)'];
        $tag_data = ['follow up call - book (done)', 'follow up call - call (current task)'];

        break;
      case ((str_contains($current_tag, 'timeline - book (current task)'))):
        // $this->remove_tag('timeline - book (current task)');
        //    $tag_data->tag = ['timeline - book (done)', 'timeline - call (current task)', 'book for timeline'];

        $removeTagData = ['book for timeline', 'timeline - book (current task)', 'follow up call - call (done)', 'call 2 - call (done)'];
        $tag_data = ['timeline - book (done)', 'timeline - call (current task)'];

        break;
      case ((str_contains($current_tag, 'pre publish - book (current task)'))):
        // $this->remove_tag('pre publish - book (current task)');
        //    $tag_data->tag = ['pre publish - book (done)', 'pre publish - call (current task)', 'book for pre publish'];

        $removeTagData = ['book for pre publish', 'pre publish - book (current task)', 'timeline - call (done)'];
        $tag_data = ['pre publish - book (done)', 'pre publish - call (current task)'];

        break;
      case ((str_contains($current_tag, 'pre interview - book (current task)'))):
        // $this->remove_tag('pre interview - book (current task)');
        // $tag_data->tag = ['pre interview - book (done)', 'pre interview - call (current task)', 'book for pre interview'];

        $removeTagData = ['appointment cancelled (done)', 'appointment reschedule (done)', 'book for pre interview', 'pre interview - book (current task)'];
        $tag_data = ['pre interview - book (done)', 'pre interview - call (current task)'];

        break;
      case (str_contains($current_tag, '1 hour update') && str_contains($current_tag, 'book (current task)')):

        // $this->remove_tag('1 hour update ' . $upload_number . ' - book (current task)');
        // $tag_data->tag = ['1 hour update - book task ' . $upload_number];
        // $upload_number = explode(' ', $current_tag)[3];
        // $removeTagData = '1 hour update ' . $upload_number . ' - book (current task)';

        $removeTagData = [];
        $tag_data = [];

        break;
      case ((str_contains($current_tag, 'reschedule book (current task)'))):

        if (str_contains($current_tag, 'call 1 - reschedule book (current task)')) { // reschedule - book (current task) cancels on call 1
            $removeTagData = ['appointment cancelled (done)', 'call 1 - reschedule book (current task)', 'book for reschedule', 'cancels on call 1', 'no show on call 1'];
            $tag_data = ['reschedule - book (done)', 'call 1 - call (current task)'];
        } else if (str_contains($current_tag, 'call 2 - reschedule book (current task)')) { // reschedule - book (current task) cancels on call 2
            $removeTagData = ['appointment cancelled (done)', 'call 2 - reschedule book (current task)', 'book for reschedule', 'cancels on call 2', 'no show on call 2'];
            $tag_data = ['reschedule - book (done)', 'call 2 - call (current task)'];
        } else if (str_contains($current_tag, 'follow up call - reschedule book (current task)')) { // reschedule - book (current task) cancels on follow up call
            $removeTagData = ['appointment cancelled (done)', 'follow up call - reschedule book (current task)', 'book for reschedule', 'cancels on follow up call', 'no show on follow up call'];
            $tag_data = ['reschedule - book (done)', 'follow up call - call (current task)'];
        } else if (str_contains($current_tag, 'timeline - reschedule book (current task)')) { // reschedule - book (current task) cancels on timeline
            $removeTagData = ['appointment cancelled (done)', 'timeline - reschedule book (current task)', 'book for reschedule', 'cancels on timeline', 'no show on timeline'];
            $tag_data = ['reschedule - book (done)', 'timeline - call (current task)'];
        } else if (str_contains($current_tag, 'pre publish - reschedule book (current task)')) { // reschedule - book (current task) cancels on pre publish
            $removeTagData = ['appointment cancelled (done)', 'pre publish - reschedule book (current task)', 'book for reschedule', 'cancels on pre publish', 'no show on pre publish'];
            $tag_data = ['reschedule - book (done)', 'pre publish - call (current task)'];
        } else if (str_contains($current_tag, 'pre publish - reschedule book (current task)')) { // reschedule - book (current task) cancels on pre publish
            $removeTagData = ['appointment cancelled (done)', 'pre publish - reschedule book (current task)', 'book for reschedule', 'cancels on pre publish', 'no show on pre publish'];
            $tag_data = ['reschedule - book (done)', 'pre publish - call (current task)'];
        } else if (str_contains($current_tag, 'pre interview - reschedule book (current task)')) { // reschedule - book (current task) cancels on pre interview
            $removeTagData = ['appointment cancelled (done)', 'pre interview - reschedule book (current task)', 'book for reschedule', 'cancels on pre interview ', 'no show on pre interview '];
            $tag_data = ['reschedule - book (done)', 'pre interview - call (current task)'];
        }


        break;
      default:
        return "something went wrong";
    }

    $removeTag = ['appointment cancelled (done)', 'appointment reschedule (done)', 'docusign (done)', 'product purchase (done)'];
    $removeTag = array_merge($removeTag, $removeTagData);
    $remove_tag_data = [
        'user_id' => $user->id,
        'tag' => $removeTag
    ];
    $this->remove_tag($remove_tag_data); // remove tags

    $add_tag_data = [
        'user_id' => $user->id,
        'tag' => $tag_data
    ];
    $this->add_new_tag($add_tag_data); // add tags

    if (!str_contains($current_tag, 'pre interview - book (current task)')) { // except for pre interview - book (current task)
        $update_progress_timeline = ['user_id' => $user->id, 'name' => "Appointment Stage"];
        $this->update_progress_timeline($update_progress_timeline); // update ROGRESS TIMELINE
    }

    $booked = ConsultantSchedule::find($request->slot_id)->update([
        'status' => 'booked',
        'booked_by' => $user->id,
        // 'ghl_appointment_id' => $content->id
    ]);

    return response()->json([
        'success' => true,
        'data' => $booked,
        'message' => "success booking"
    ], 200);
  }

  public function getAppointments(Request $request)
  {

    $response = $this->getGoHighlevelAppointment($request);

    $appointments = $response->appointments;

    foreach ($appointments as $key => $value) {
      $_slot = \App\ConsultantSchedule::where('ghl_appointment_id', $value->id)->first();


      if ($_slot) {
        $time_end = date('Y-m-d', strtotime($_slot->schedule_date)) . "T" . date('H:i:s', strtotime($_slot->time_end)) . "-07:00";
        $time_start = date('Y-m-d', strtotime($_slot->schedule_date)) . "T" . date('H:i:s', strtotime($_slot->time_start)) . "-07:00";
        $value->endTime = $time_end;
        $value->startTime = $time_start;
      }
    }

    return response()->json([
      'success' => true,
      'data' => $response,
    ], 200);
  }

  public function getAvailableSlots(Request $request)
  {

    $response = $this->getGoHighlevelAppointmentSlots($request);
    //$response = $this->getGoHighlevelTeamCalendar();
    return response()->json([
      'success' => true,
      'data' =>   $response,
    ], 200);
  }


  public function downloadappointments(Request $request)
  {
    $headers = array(
      'Content-Type' => 'text/csv'
    );

    if (!File::exists(public_path() . "/files")) {
      File::makeDirectory(public_path() . "/files");
    }
    $filename =  public_path("files/download.csv");
    // $handle = fopen($filename, 'w');

    $csv_string = [];
    $csv_string[] = [
      "Subject",
      "Start Date",
      "End Date",
      "Start time",
      "End Time"
    ];


    // fputcsv($handle, [
    //   "test schedule",
    //   \Carbon\Carbon::now()->format('Y-m-d'),
    //   \Carbon\Carbon::tomorrow()->format('Y-m-d'),
    // ]);



    foreach ($request->appointments as $appointment) {

      if (!$appointment['appointmentStatus']) {
        $description = "You have an ATC scheduled appointment";
      } else if ($appointment['appointmentStatus'] == "confirmed") {
        $description = "You have an ATC scheduled appointment";
      } else if ($appointment['appointmentStatus'] == "cancelled") {
        $description = "Cancelled scheduled appointment";
      } else {
        $description = "You have an ATC scheduled appointment";
      }

      $csv_string[] = [
        $description,
        \Carbon\Carbon::parse($appointment['startTime'])->format('Y-m-d'),
        \Carbon\Carbon::parse($appointment['endTime'])->format('Y-m-d'),
        \Carbon\Carbon::parse($appointment['startTime'])->format('g:i A'),
        \Carbon\Carbon::parse($appointment['endTime'])->format('g:i A'),
      ];
    }
    // fclose($handle);

    return response()->json(
      [
        'success' => true,
        'data' => $csv_string
      ]
    );
  }

  public function change_appointment_status(Request $request)
  {

    $user = auth()->user();

    if ($user->role != "Consultant" && $user->role != "Admin") {
    //   $this->cancel_all_task();
      $apiResponse = $this->ghl_change_appointment_status($request);
      $error_message =  'something went wrong while changing appointment status';
    } else {
      $error_message =  'something went wrong while cancelling your appointment';
      $apiResponse = $this->ghl_change_appointment_status($request);
    }

    // if (!isset($request->status)) {
    //   $get_user = \App\ConsultantSchedule::where('ghl_appointment_id', $request->id)->first();

    //   if ($apiResponse->status == 200) {
    //     if ($user->role == "User") {
    //       $this->notify_consultant(['user' => $user, 'request_user' => $get_user]);
    //     } else if ($user->role == "Consultant") {
    //       $this->notify_client(['user' => $user, 'request_user' => $get_user]);
    //     } else {
    //       $consultant = \App\User::find($request->consultant_id);
    //       $this->notify_client(['user' =>   $consultant, 'request_user' => $get_user]);
    //     }

    //     $this->notify_admin(['user' => $user, 'request_user' => $get_user]);
    //   }
    // }

    // if (isset($request->deleteAppointment) && $apiResponse->status == 200) {
    //   ConsultantSchedule::where('id', $request->deleteAppointment)->delete();
    // }

    if (isset($apiResponse)) {
      return response()->json([
        'success' => true,
      ], 200);
    } else {
      return response()->json([
        'success' => false,
        'message' => $error_message,
      ], 200);
    }
  }


  public function notify_admin($_data)
  {

    if ($_data['user']->role == "Consultant") {
      $user = \App\User::find($_data['request_user']->booked_by);
      $description = "An appointment with client " . $user->firstname . " " . $user->lastname . " has been cancelled.";
    } else {
      $description = "An appointment with client " . $_data['user']->firstname . " " . $_data['user']->lastname . " has been cancelled.";
    }

    $data = \App\Notification::create([
      'title' => 'Appointment Cancelled',
      'search_for' => "Role",
      'description' => $description,
      'type' => 'Admin',
      'created_by' => auth()->user()->id,
    ]);

    $notification_id = $data['id'];
    $admin = \App\User::where('role', 'Admin')->first();
    $notify =  \App\NotificationUser::create(
      [

        'notification_id' => $notification_id,
        'user_id' => $admin->id,
        'notification_id' => $notification_id,
        'read' => 0,
      ]
    );
  }

  public function notify_client($_data)
  {

    $description = "An appointment with consultant " . $_data['user']->firstname . " " . $_data['user']->lastname . " has been cancelled.";

    $data = \App\Notification::create([
      'title' => 'Appointment Cancelled',
      'search_for' => "Role",
      'description' => $description,
      'type' => 'User',
      'created_by' => auth()->user()->id,
    ]);

    $notification_id = $data['id'];

    $notify =  \App\NotificationUser::create(
      [
        // 'user_id' => $request->user_id,
        'notification_id' => $notification_id,
        'user_id' => $_data['request_user']->id,
        'notification_id' => $notification_id,
        'read' => 0,
      ]
    );
  }

  public function notify_consultant($_data)
  {
    $user = \App\User::find($_data['request_user']->booked_by);
    $description = "Your appointment with client " . $user->firstname . " " . $user->lastname . " has been cancelled.";

    $data = \App\Notification::create([
      'title' => 'Appointment Cancelled',
      'search_for' => "Role",
      'description' => $description,
      'type' => 'User',
      'created_by' => auth()->user()->id,
    ]);

    $notification_id = $data['id'];
    $notify =  \App\NotificationUser::create(
      [
        // 'user_id' => $request->user_id,
        'notification_id' => $notification_id,
        'user_id' =>  $_data['request_user']->user_id,
        'notification_id' => $notification_id,
        'read' => 0,
      ]
    );
  }

  public function downloadAppointmentAsICS(Request $request)
  {

    $headers = array(
      'Content-Type' => 'text/calendar; charset=utf-8',
      'Content-Disposition: inline; download.ics'
    );

    if (!File::exists(public_path() . "/files")) {
      File::makeDirectory(public_path() . "/files");
    } else if (File::exists(public_path() . "/files/download.ics")) {
      File::delete(public_path() . "/files/download.ics");
    }

    $filename =  public_path("files/download.ics");
    $handle = fopen($filename, 'w');


    $ical = "BEGIN:VCALENDAR";
    $ical .= "\nVERSION:2.0";
    $ical .= "\nPRODID:-//hacksw/handcal//NONSGML v1.0//EN";
    $ical .= "\nMETHOD:REQUEST";
    $ical .= "\nCALSCALE:GREGORIAN";
    $ical .= "\nX-WR-RELCALID:asjh675adashdh";
    $ical .= "\nX-WR-CALNAME:My Nov Calendar";

    foreach ($request->appointments as $index => $appointment) {


      $consultant_details = User::where('go_high_level_id', $appointment['calendarId'])->first();

      if (!$appointment['appointmentStatus']) {
        $description = "You have an ATC scheduled appointment";
      } else if ($appointment['appointmentStatus'] == "confirmed") {
        $description = "You have an ATC scheduled appointment";
      } else if ($appointment['appointmentStatus'] == "cancelled") {
        $description = "Cancelled scheduled appointment";
      } else {
        $description = "You have an ATC scheduled appointment";
      }


      $ical .= "\nBEGIN:VEVENT";
      $ical .= "\nUID:" . md5(\Carbon\Carbon::parse($appointment['startTime'])) . "system.airlinetc.com";
      $ical .= "\nSEQUENCE:" . $index;
      $ical .= "\nDTSTAMP:" . gmdate('Ymd');
      $ical .= "\nORGANIZER:" . $consultant_details->email;
      $ical .= "\nDTSTART:" . \Carbon\Carbon::parse($appointment['startTime'])->format('Ymd') . 'T' . \Carbon\Carbon::parse($appointment['startTime'])->format('His');
      $ical .= "\nDTEND:" . \Carbon\Carbon::parse($appointment['endTime'])->format('Ymd') . 'T' . \Carbon\Carbon::parse($appointment['endTime'])->format('His');
      $ical .= "\nSUMMARY:" .  $description;
      $ical .= "\nDESCRIPTION:" . "scheduled appointment with consultant" . $appointment['title'];
      $ical .= "\nCLASS:PUBLIC";
      $ical .= "\nSTATUS: " . $appointment['status'];
      $ical .= "\nTRANSP:TRANSPARENT";
      $ical .= "\nEND:VEVENT";
    }

    $ical .= "\nEND:VCALENDAR";



    fputs($handle, $ical);
    fclose($handle);

    return response()->json([
      'success' => true,
      'data' => $ical
    ]);


    //  print_r($request->appointments);
  }


  public function downloadConsultantSchedule(Request $request)
  {

    $from = date('m/d/Y', strtotime($request->start));
    $to = date('m/d/Y', strtotime($request->end));


    $schedule = ConsultantSchedule::with(['user', 'client'])->whereBetween('schedule_date', [$from, $to]);

    if (auth()->user()->role == "Consultant") {

      $schedule = $schedule->where('user_id', auth()->user()->id)->orderBy('schedule_date', 'asc')->orderBy('time_start', 'asc')->get();
    } else if (isset($request->id)) {
      $schedule = $schedule->where('user_id', $request->id)->get();
    } else {


      $params = $request->params["schedule"];
      $consultant = $request->params['consultant'];

      $schedule = $schedule->where(function ($q) use ($params) {
        if (in_array('availability', $params)) {

          $q->orWhere('status', null);
        }
        if (in_array('bookings', $params)) {

          $q->orWhere('status', 'booked');
        }
        if (in_array('cancelled', $params)) {

          $q->orWhere('status', 'cancelled');
        }
        if (in_array('noshow', $params)) {

          $q->orWhere('status', 'noshow');
        }
        if (in_array('showed', $params)) {

          $q->orWhere('status', 'showed');
        }
      });

      if (isset($consultant)) {
        $consultant_filter = $consultant;
        $schedule = $schedule->where(function ($q) use ($consultant_filter) {
          foreach ($consultant_filter as $key => $filter) {

            if ($key == 0) {
              $q->where('user_id', $filter['value']);
              error_log($filter['value']);
            } else {
              $q->orWhere('user_id', $filter['value']);
            }
          }
        });
      }


      $schedule = $schedule->orderBy('schedule_date', 'asc')->orderBy('time_start', 'asc')->get();
    }


    if (!File::exists(public_path() . "/files")) {
      File::makeDirectory(public_path() . "/files");
    } else if (File::exists(public_path() . "/files/download.ics")) {
      File::delete(public_path() . "/files/download.ics");
    }


    // $filename =  public_path("files/download.ics");
    // $handle = fopen($filename, 'w');

    $ical = "BEGIN:VCALENDAR";
    $ical .= "\nVERSION:2.0";
    $ical .= "\nPRODID:-//hacksw/handcal//NONSGML v1.0//EN";
    $ical .= "\nMETHOD:PUBLISH";
    $ical .= "\nCALSCALE:GREGORIAN";
    $ical .= "\nX-WR-RELCALID:asjh675adashdh";
    $ical .= "\nX-WR-CALNAME:ATC CALENDAR";

    foreach ($schedule as $index => $appointment) {

      if (!$appointment['status']) {
        $description = "Scheduled availability of Consultant " . $appointment['user']['firstname'] . " " . $appointment['user']['lastname'];
      } else if ($appointment['status'] == "booked") {
        $description = "Scheduled appointment of " . $appointment["client"]['firstname'] . " " . $appointment["client"]['lastname'] . " to Consultant " . $appointment['user']['firstname'] . " " . $appointment['user']['lastname'];
      } else if ($appointment['status'] == "cancelled") {
        $description = "Cancelled schedule of " . $appointment["client"]['firstname'] . " " . $appointment["client"]['lastname'] . " to Consultant " . $appointment['user']['firstname'] . " " . $appointment['user']['lastname'];
      } else {
        $description = "Schedule of Consultant " . $appointment['user']['firstname'] . " " . $appointment['user']['lastname'];
      }


      $schedule_date = \Carbon\Carbon::parse($appointment['schedule_date'])->format('Ymd');
      $timeStart =  \Carbon\Carbon::parse($appointment['time_start'])->format('His');
      $timeEnd = \Carbon\Carbon::parse($appointment['time_end'])->format('His');

      $timezone = new DateTimeZone('America/Denver');
      $formattedTimeStart = new DateTime("{$schedule_date} {$timeStart}", $timezone);
      $formattedTimeEnd = new DateTime("{$schedule_date} {$timeEnd}", $timezone);




      $ical .= "\nBEGIN:VEVENT";
      $ical .= "\nUID:" . md5(\Carbon\Carbon::parse($appointment['schedule_date']) . " " . \Carbon\Carbon::parse($appointment['time_start'])->format('His') . " " . $appointment['id']) . "system.airlinetc.com";
      $ical .= "\nSEQUENCE:" . $index;
      $ical .= "\nDTSTAMP:" .  \Carbon\Carbon::parse($appointment['created_at'])->format('Ymd');
      $ical .= "\nORGANIZER:" . $appointment['user']['email'];
      $ical .= "\nDTSTART;TZID={$timezone->getName()}:{$formattedTimeStart->format('Ymd\THis')}";
      $ical .= "\nDTEND;TZID={$timezone->getName()}:{$formattedTimeEnd->format('Ymd\THis')}";
      $ical .= "\nSUMMARY:" . "ATC Schedule of " . $appointment['user']['firstname'] . " " . $appointment['user']['lastname'];
      $ical .= "\nDESCRIPTION: " . $description . " scheduled  on " . \Carbon\Carbon::parse($appointment['schedule_date'])->format('Y-m-d');
      $ical .= "\nCLASS:PUBLIC";
      $ical .= "\nSTATUS: " . $appointment['status'];
      $ical .= "\nTRANSP:TRANSPARENT";
      $ical .= "\nEND:VEVENT";
      $ical .= "\n";
    }

    $ical .= "\nEND:VCALENDAR";

    // fputs($handle, $ical);
    // fclose($handle);

    // $headers = array(
    //     'Content-Type' => 'text/calendar; charset=utf-8',
    //     'Content-Disposition: inline; download.ics'
    //   );

    return response()->json([
      'success' => true,
      'data' => $ical
    ]);

    //  print_r($request->appointments);
  }

  public function downloadConsultantScheduleCSV(Request $request)
  {
    $from = date('m/d/Y', strtotime($request->start));
    $to = date('m/d/Y', strtotime($request->end));

    $schedule = ConsultantSchedule::with(['user', 'client'])->whereBetween('schedule_date', [$from, $to]);

    if (auth()->user()->role == "Consultant") {

      $schedule = $schedule->where('user_id', auth()->user()->id)->get();
    } else if (isset($request->id)) {
      $schedule = $schedule->where('user_id', $request->id)->get();
    } else {


      $params = $request->params["schedule"];
      $consultant = $request->params['consultant'];

      $schedule = $schedule->where(function ($q) use ($params) {
        if (in_array('availability', $params)) {

          $q->orWhere('status', null);
        }
        if (in_array('bookings', $params)) {

          $q->orWhere('status', 'booked');
        }
        if (in_array('cancelled', $params)) {

          $q->orWhere('status', 'cancelled');
        }
        if (in_array('noshow', $params)) {

          $q->orWhere('status', 'noshow');
        }
        if (in_array('showed', $params)) {

          $q->orWhere('status', 'showed');
        }
      });

      if (isset($consultant)) {
        $consultant_filter = $consultant;
        $schedule = $schedule->where(function ($q) use ($consultant_filter) {
          foreach ($consultant_filter as $key => $filter) {

            if ($key == 0) {
              $q->where('user_id', $filter['value']);
              error_log($filter['value']);
            } else {
              $q->orWhere('user_id', $filter['value']);
            }
          }
        });
      }

      $schedule = $schedule->orderBy('schedule_date', 'asc')->orderBy('time_start', 'asc')->get();
    }

    $headers = array(
      'Content-Type' => 'text/csv'
    );

    if (!File::exists(public_path() . "/files")) {
      File::makeDirectory(public_path() . "/files");
    } else if (File::exists(public_path() . "/files/download.csv")) {
      File::delete(public_path() . "/files/download.csv");
    }
    $filename =  public_path("files/download.csv");
    // $handle = fopen($filename, 'w');
    $csv_string = [];
    $csv_string[] = [
      "Subject",
      "Start Date",
      "End Date",
      "Start time",
      "End Time"
    ];


    foreach ($schedule as $appointment) {
      if (!$appointment['status']) {
        $description = "Scheduled availability of Consultant " . $appointment['user']['firstname'] . " " . $appointment['user']['lastname'];
      } else if ($appointment['status'] == "booked") {
        $description = "Scheduled appointment of " . $appointment["client"]['firstname'] . " " . $appointment["client"]['lastname'] . " to Consultant " . $appointment['user']['firstname'] . " " . $appointment['user']['lastname'];
      } else if ($appointment['status'] == "cancelled") {
        $description = "Cancelled schedule of " . $appointment["client"]['firstname'] . " " . $appointment["client"]['lastname'] . " to Consultant " . $appointment['user']['firstname'] . " " . $appointment['user']['lastname'];
      } else {
        $description = "Schedule of Consultant " . $appointment['user']['firstname'] . " " . $appointment['user']['lastname'];
      }


      $csv_string[] = [
        $description,
        \Carbon\Carbon::parse($appointment['schedule_date'])->format('Y-m-d'),
        \Carbon\Carbon::parse($appointment['schedule_date'])->format('Y-m-d'),
        \Carbon\Carbon::parse($appointment['time_start'])->format('g:i A'),
        \Carbon\Carbon::parse($appointment['time_end'])->format('g:i A'),
      ];
    }
    // fclose($handle);

    return response()->json(
      [
        'success' => true,
        'data' => $csv_string
      ]
    );
  }

  public function save_consultant_schedule(Request $request)
  {

    $response = [];


    foreach ($request->data as $data) {

      $consultant_existing_slots = \App\ConsultantSchedule::where('user_id', $data['id'])->where('schedule_date', $data['date'],)->get();

      $startTime = \Carbon\Carbon::createFromFormat('H:i',  $data['startTime']);
      $endTime = \Carbon\Carbon::createFromFormat('H:i', $data['endTime']);


      $hasConflict = false;
      $conflictTime = "";
      foreach ($consultant_existing_slots as $existing_slots) {
        if ($startTime->between($existing_slots->time_start, $existing_slots->time_end, true) && $startTime != \Carbon\Carbon::createFromFormat('H:i', $existing_slots->time_end)) {

          $hasConflict = true;
          $conflictTime = $existing_slots->time_start . " - " . $existing_slots->time_end;
        } else if ($endTime->between($existing_slots->time_start, $existing_slots->time_end, true)) {

          $hasConflict = true;
          $conflictTime = $existing_slots->time_start . " - " . $existing_slots->time_end;
        }
      }

      if (!$hasConflict) {
        $created =  ConsultantSchedule::create([
          'user_id' => $data['id'],
          'schedule_date' => $data['date'],
          'time_start' => $data['startTime'],
          'time_end' => $data['endTime']
        ]);

        array_push($response, $created['time_start'] . "- added");
      } else {
        array_push($response,  $data['startTime'] . " - " .  $data['endTime'] . " conflict with existing slot " . $conflictTime);
      }
    }


    if (!$response) {
      return response()->json([
        'success' => false,
      ], 500);
    }

    return response()->json([
      'data' => $response,
      'success' => true,
    ], 200);
  }

  public function get_consultant_schedule(Request $request)
  {

    $consultant_schedule  =  ConsultantSchedule::where('user_id', $request->id)->get();

    return response()->json([
      'success' => true,
      'data' =>  $consultant_schedule
    ], 200);
  }

  public function get_consultant_availability(Request $request)
  {
    $user = User::where('id', auth()->user()->id)->with('consultant')->first();

    $user_consultant = $user->consultant;

    if (!empty($user_consultant)) {
      $get_schedule = ConsultantSchedule::where(function ($q) {
        $q->whereNull('status')->orWhere('status', 'cancelled');
      })->where('user_id', $user_consultant->id)->with('user');
    } else {
      $user_opprtunity = $this->get_user_opportunity();
      // $user_opprtunity = json_decode($user_opprtunity, true);
      // $user_opprtunity = $user_opprtunity['data'];
      //  $user_opprtunity = json_decode($user_opprtunity, true);
      $user_stages = $user_opprtunity->original['pipeline_stages_appointment'];
      $user_current_stage = "";
      $user_stages->map(function ($q) use (&$user_current_stage) {
        if ($q->status == "process") {
          $user_current_stage = $q->name;
        }
      });



      $get_schedule = ConsultantSchedule::where(function ($q) {
        $q->whereNull('status')->orWhere('status', 'cancelled');
      })->with(['user']);
    }

    $get_schedule = $get_schedule->get();

    $schedule = $get_schedule->filter(function ($q) {

      if (\Carbon\Carbon::parse($q->schedule_date)->format('m/d/Y') == \Carbon\Carbon::now()->format('m/d/Y')) {

        if (\Carbon\Carbon::now()->format('H:i') < (\Carbon\Carbon::parse($q->time_start)->format('H:i'))) {
          return $q;
        }
      } else if (\Carbon\Carbon::parse($q->schedule_date)->format('m/d/Y') > \Carbon\Carbon::now()->format('m/d/Y')) {
        return $q;
      }

      return $q;
    })->values();

    $schedule = $get_schedule;

    $dates = [];
    $schedule = $schedule->map(function ($sched) use ($schedule, &$dates) {

      $data = [];
      if (count($dates) === 0) {
        $data['extendedProps'] = (object) [];
        $data['extendedProps']->slots = [];

        array_push($data['extendedProps']->slots, [
          'calendar_id' => $sched->user->go_high_level_id,
          'date' => $sched->schedule_date,
          'slot_id' => $sched->id,
          'time_end' => $sched->time_end,
          'time_start' => $sched->time_start,
          'user_id' =>  $sched->user->id
        ]);

        array_push($dates, [
          'start' => \Carbon\Carbon::parse($sched->schedule_date)->format('Y-m-d'),
          'title' => $sched->user->firstname . " " . $sched->user->lastname,
          'user_id' => $sched->user->id,
          'extendedProps' => $data['extendedProps']
        ]);
      } else {

        $data['extendedProps'] = (object) [];
        $data['extendedProps']->slots = [];
        $slot = [
          'calendar_id' => $sched->user->go_high_level_id,
          'date' => $sched->schedule_date,
          'slot_id' => $sched->id,
          'time_end' => $sched->time_end,
          'time_start' => $sched->time_start,
          'user_id' =>  $sched->user->id
        ];

        array_push($data['extendedProps']->slots, $slot);



        $array_data = [
          'start' =>  \Carbon\Carbon::parse($sched->schedule_date)->format('Y-m-d'),
          'title' => $sched->user->firstname . " " . $sched->user->lastname,
          'user_id' => $sched->user->id,
          'extendedProps' => $data['extendedProps']
        ];


        $hasRow = false;
        foreach ($dates as $date) {
          if ($array_data['start'] === $date['start']) {
            if ($array_data['title'] === $date['title']) {

              $hasRow = true;
              array_push($date['extendedProps']->slots, $slot);
            }
          }
        }

        if (!$hasRow) {
          array_push($dates, $array_data);
        }
      }


      $data['start'] = $sched->schedule_date;
      $data['title'] = $sched->user->firstname . " " . $sched->user->lastname;

      $data['id'] = $sched->user->go_high_level_id;

      return $data;

      //   return $sched_array;
    });


    if (!$user_consultant) {
      $has_assigned_consulatant = AppointmentConsultant::select('user_id')->where("appointment_call", 'LIKE', "%" .  $user_current_stage . '%')->get();

      // \Log::info("dsasdad: " . json_encode($has_assigned_consulatant));
      // \Log::info("dsasdad: " . $user_current_stage);

      if ($has_assigned_consulatant->count() != 0) {
        $consultant_id = [];
        foreach ($has_assigned_consulatant as $consultant) {
          array_push($consultant_id, $consultant->user_id);
        }

        $dates =  collect($dates)->filter(function ($date) use ($consultant_id) {
          if (in_array($date['user_id'], $consultant_id) && count($date['extendedProps']->slots) > 0) {
            return $date;
          }
        })->values()->all();
      } else {
        $dates = [];
      }
    }


    //echo json_encode($dates);



    return  response()->json([
      'success' => true,
      'data' =>  $dates,

    ], 200);
  }

  // public function filter_data($data)
  // {
  //   $user = User::where('id', auth()->user()->id)->with('consultant')->first();

  //   $user_consultant = $user->consultant ?  $user->consultant : [];
  //   if (count($user_consultant) != 0) { }
  // }


  public function assign_consultant(Request $request)
  {

    $app_consultant = \App\AppointmentConsultant::updateOrCreate(['user_id' => $request->id], [
      'appointment_call' => json_encode($request->assigned_app),
      'user_id' => $request->id
    ]);

    return response()->json([
      'success' => true,
    ], 200);
  }

  public function test_availability()
  {
    $schedule = ConsultantSchedule::whereHas(['user'])->whereNull('status');

    return $schedule;
  }

  public function deleteSlot(Request $request)
  {
    if (!isset($request->slot_id)) {
      return response()->json([
        'success' => false,
        'message' => 'No selected slot to delete'
      ]);
    }

    $deleted = ConsultantSchedule::with(['user'])->find($request->slot_id);
    $delete_item = $deleted->delete();

    return response()->json([
      'success' => true,
      'message' => 'Successfuly deleted',
      'data' => $deleted
    ]);
  }

  public function proceed_to_next_timeline(Request $request)
  {

    // $user = \App\User::where('email', $request->email)->first();
    if ($request->tag == 'timeline - book (current task)') {
        $add_tag = ['book for timeline', 'timeline - book (current task)'];
        $remove_tag = ['book for follow up call', 'follow up call - book (current task)'];

        $update_appointment_progress= [
            'user_id' => $request->user_id,
            'finish' => 'Follow Up Call (Optional)',
            'process' => 'Timeline',
        ];
        $this->update_appointment_progress_timeline_call($update_appointment_progress);

        $data = [
          'user_id' => $request->user_id,
          'tag' => $add_tag
        ];
        $this->add_new_tag($data);

         $remove_tag = [
            'user_id' => $request->user_id,
            'tag' => $remove_tag
        ];
        $this->remove_tag($remove_tag);
    } else {
        // $add_tag = ['book for follow up call'];

        // $update_appointment_progress= [
        //     'user_id' => $request->user_id,
        //     'name' => 'Call 2',
        // ];
        // $this->update_appointment_progress($update_appointment_progress);
    }
    return response()->json(['success' => true]);



    // $removeTag = ['call 2 - call (done)'];
    // $remove_tag = [
    //     'user_id' => $request->user_id,
    //     'tag' => $removeTag
    // ];
    // $this->remove_tag($remove_tag);


    // $task_data = [
    //   'id' => $user->id,
    //   'query' => 'Consultation Call'
    // ];

    // $task = $this->get_task_details($task_data);

    // if (!collect($task)->isEmpty()) {
    //   $task_data = ['ghl_id' => $user->go_high_level_id, 'task_id' => $task->id];
    //   $this->marktask($task_data);
    // }

    // if (isset($addTag)) {

    //   return response()->json(['success' => true]);
    // } else {

    //   return response()->json(['success' => false, 'message' => 'Something went wrong while adding tag']);
    // }
  }

  public function add_approval(Request $request)
  {
    if (is_numeric($request->id)) {

      $client = \App\User::where('id', $request->id)->first();
    } else {
      $client = \App\User::where('go_high_level_id', $request->id)->first();
    }

    $data = [
      'email' => $client->email,
      'tag' => $request->tag
    ];

    $addTag = $this->add_new_tag($data);


    if ($addTag == 200) {
      return response()->json(['success' => true]);
    } else {

      return response()->json(['success' => false, 'message' => 'Something went wrong while adding approval tag']);
    }
  }

  public function get_cancelled_appointment(Request $request)
  {

    $data = new ConsultantSchedule;

    $data = $data->select([
      'consultant_schedules.*',
      DB::raw("(SELECT DATE_FORMAT(created_at, '%m/%d/%Y')) as created_str")
    ]);

    $data = $data->with(['client', 'user']);

    $data = $data->where(function ($q) use ($request) {
      $q->orWhere('schedule_date', 'LIKE', "%$request->search%");
      $q->orWhere('time_start', 'LIKE', "%$request->search%");
      $q->orWhere('time_end', 'LIKE', "%$request->search%");
      $q->orWhere(DB::raw("(SELECT DATE_FORMAT(cancelled_at, '%Y-%m-%d'))"), 'LIKE', "%$request->search%");
      $q->orWhere(DB::raw("(SELECT DATE_FORMAT(created_at, '%m/%d/%Y'))"), 'LIKE', "%$request->search%");
      $q->orWhereHas('user', function ($user_q) use ($request) {
        $user_q->where('firstname', 'LIKE', "%$request->search%");
        $user_q->orWhere('lastname', 'LIKE', "%$request->search%");
      });
      $q->orWhereHas('client', function ($user_q) use ($request) {
        $user_q->where('firstname', 'LIKE', "%$request->search%");
        $user_q->orWhere('lastname', 'LIKE', "%$request->search%");
      });
    });


    $data = $data->where('status', 'cancelled')->whereNotNull('status');

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
      ->paginate($request->page_size, ['*'], 'page', $request->page_number)->toArray();

    return response()->json([
      'success' => true,
      'data' => $data,
    ], 200);
  }


  public function user_options(Request $request)
  {
    $data = \App\User::where('role', '=', 'User')->where('status', 'Active')->get();

    return response()->json([
      'success' => true,
      'data' => $data,
    ], 200);
  }

  public function send_email_notification(Request $request)
  {

    $appointment_id = $request->booking_details['id'];


    $body = $request->body;
    $subject = $request->subject;

    switch ($request->search_for) {
      case 'Same stage clients':

        $same_stage_clients = $this->get_same_stage_clients($request->appointment_stage['id']);

        foreach ($same_stage_clients->opportunities as $client) {

          $user = \App\User::where('email', $client->contact->email)->first();

          if ($user) {
            $token = $user->createToken('atc')->accessToken;

            $data = [
              'user' => $client->contact,
              'link' => $request->link_origin . "/email/notification/autologin/" . $token . "/" . $appointment_id,
              'booking' => $request->booking_details,
              'content' => $body,
              'subject' => $subject

            ];

            $this->email_notification($data);
          }
        }

        break;


      case 'Client':

        foreach ($request->type as $user_id) {

          $user = \App\User::find($user_id);
          $token = $user->createToken('atc')->accessToken;

          $data = [
            'user' => $user,
            'link' => $request->link_origin . "/email/notification/autologin/" . $token . "/" . $appointment_id,
            'booking' => $request->booking_details,
            'content' => $body,
            'subject' => $subject
          ];

          $this->email_notification($data);
        }

        break;

      case 'Stage':

        $specific_stage_client = $this->get_same_stage_clients($request->type);


        foreach ($specific_stage_client->opportunities as $client) {

          $user = \App\User::where('email', $client->contact->email)->first();

          if ($user) {
            $token = $user->createToken('atc')->accessToken;


            $data = [
              'user' => $client->contact,
              'link' => $request->link_origin . "/email/notification/autologin/" . $token . "/" . $appointment_id,
              'booking' => $request->booking_details,
              'content' => $body,
              'subject' => $subject

            ];

            $this->email_notification($data);
          }
        }

        break;

      default:
        return response()->json([
          'success' => false,
          'messahe' => 'Something went wrong while sending email',
        ], 200);
        break;
    }

    return response()->json([
      'success' => true,
      // 'data' => $data,
    ], 200);
  }


  public function email_notification($data)
  {

    $date = $data['booking']['schedule_date'];
    $timeStart = date('h:i A', strtotime($data['booking']['schedule_date'] . " " . $data['booking']['time_start']));
    $timeEnd = date('h:i A', strtotime($data['booking']['schedule_date'] . " " . $data['booking']['time_end']));
    $consultant = $data['booking']['user']['firstname'] . " " . $data['booking']['user']['lastname'];


    $link = $data['link'];

    $to_name = isset($data['user']->firstname) ? $data['user']->firstname . " " . $data['user']->lastname : $data['user']->name;
    $subject = $data['subject'] ? $data['subject'] : "Appointment Availability Notice";

    $body = $data['content'];
    $body = str_replace('[user:display-name]', $to_name, $body);
    $body = str_replace('[consultant:display-name]', $consultant, $body);
    $body = str_replace('[time-start:apppoitment-time-start]', $timeStart, $body);
    $body = str_replace('[time-end:apppoitment-time-end]', $timeEnd, $body);
    $body = str_replace('[date:appoitment-date]', Carbon::parse($date)->toFormattedDateString(), $body);
    $body = str_replace('<p><br></p>', "", $body);


    $email_temp1 = explode('+', $data['user']->email);
    $email_temp2 = explode('@', $data['user']->email);

    $to_email = count($email_temp1) == 2 ? $email_temp1[0] . "@" . $email_temp2[1] : $email_temp1[0];


    $data_email = [
      'to_name'       =>  $to_name,
      'to_email'      =>  $to_email,
      'subject'       =>  $subject,
      'from_name'     => "Airline Transition Consultatant",
      'from_email'    => "no-reply@airlinetc.com",
      'template'      => "admin.emails.email-appointment-availability-notification",
      'body_data'     => [
        "content" => $body,
        "name" =>  $to_name,
        "link" =>  $link,
        "date" =>  Carbon::parse($date)->toFormattedDateString(),
        "timeStart" => $timeStart,
        "timeEnd" => $timeEnd,
        "consultant" => $consultant
      ]
    ];

    event(new \App\Events\SendMailEvent($data_email));
  }

  public function get_same_stage_clients($data)
  {

    $url = 'https://rest.gohighlevel.com/v1/pipelines/YoQDM4Nh4X7vKrFACKMF/opportunities?pipelineStageId=' . $data;
    $response = Curl::to($url)
      ->withHeader('Content-Type: application/json')
      ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
      ->get();


    if (empty($response)) {

      return $response;
    }

    return  json_decode($response);
  }


  public function show($id)
  {

    $appointment = \App\ConsultantSchedule::with('user')->where('ghl_appointment_id', $id)->first();

    if ($appointment) {
      if ($appointment->status == "cancelled") {
        return response()->json([
          'data' => $appointment,
          'success' => true
        ]);
      }
    } else {

      return response()->json([
        'message' => 'Sorry you just missed out ... someone else booked this appointment. Good luck next time',
        'success' => false
      ]);
    }
  }

  public function calendar_appointments(Request $request)
  {

    $appointments = \App\ConsultantSchedule::with(['user', 'client'])->whereNotNull('user_id');

    if (isset($request->schedule)) {
      $schedule_filter = $request->schedule;

      $appointments = $appointments->where(function ($q) use ($schedule_filter) {
        if (in_array('availability', $schedule_filter)) {

          $q->orWhere('status', null);
        }
        if (in_array('bookings', $schedule_filter)) {

          $q->orWhere('status', 'booked');
        }
        if (in_array('cancelled', $schedule_filter)) {

          $q->orWhere('status', 'cancelled');
        }
        if (in_array('noshow', $schedule_filter)) {

          $q->orWhere('status', 'noshow');
        }
        if (in_array('showed', $schedule_filter)) {

          $q->orWhere('status', 'showed');
        }
      });
    }

    if (isset($request->consultant)) {
      $consultant_filter = $request->consultant;
      $appointments = $appointments->where(function ($q) use ($consultant_filter) {
        foreach ($consultant_filter as $key => $filter) {

          if ($key == 0) {
            $q->where('user_id', $filter['value']);
            error_log($filter['value']);
          } else {
            $q->orWhere('user_id', $filter['value']);
          }
        }
      });
    }

    $appointments = $appointments->get();

    $events = $appointments->map(function ($query) {
      $event = [];
      $event['title'] = $query->user->firstname;

      $start_date = $query->schedule_date . " " . $query->time_start;
      $event['start'] = \Carbon\Carbon::parse($start_date)->format("Y-m-d") . "T" . \Carbon\Carbon::parse($start_date)->format("h:i:s");
      $event['extendedProps'] = $query;

      return $event;
    });


    return response()->json([
      'success' => true,
      'data' => $appointments,
      'events' => $events
    ]);
  }


  public function update_slot(Request $request)
  {

    $booked = ConsultantSchedule::find($request->id)->update([
      'time_start' => $request->timeStart,
      'time_end' => $request->timeEnd,
    ]);


    if ($booked) {
      return response()->json(['success' => true, 'message' => 'Time slot successfuly updated'], 200);
    } else {
      return response()->json(['success' => false, 'message' => 'Something went wrong while updating time slot'], 500);
    }
  }

  public function delete_slot(Request $request)
  {

    $deleted = ConsultantSchedule::find($request->id);
    $delete_item = $deleted->delete();

    if ($deleted) {
      return response()->json(['success' => true, 'message' => 'Time slot successfuly deleted', 'data' => $deleted], 200);
    } else {
      return response()->json(['success' => false, 'message' => 'Something went wrong while deleting time slot'], 500);
    }
  }
}
