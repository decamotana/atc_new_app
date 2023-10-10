<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\EmailTemplate;
use App\Http\Controllers\API\v1\AppointmentController;
use App\Http\Controllers\API\v1\AuthController;
use BeyondCode\LaravelWebSockets\HttpApi\Controllers\Controller;
use Dcblogdev\Dropbox\Facades\Dropbox;
use Ixudra\Curl\Facades\Curl;

use function GuzzleHttp\json_decode;


use Spipu\Html2Pdf\Html2Pdf;
use Spipu\Html2Pdf\Exception\Html2PdfException;
use Spipu\Html2Pdf\Exception\ExceptionFormatter;
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

Route::group(['prefix' => 'api'], function () { });

Route::group(['prefix' => 'api/v1'], function () {
    Route::group(['middleware' => 'auth:api'], function () {

        /** user */
        Route::apiResource('users', 'API\v1\UserController');
        Route::apiResource('task', 'API\v1\TaskController');
        Route::apiResource('appointments', 'API\v1\AppointmentController');
        Route::apiResource('email_template', 'API\v1\EmailTemplateController');
        Route::post('add_email_template', 'API\v1\EmailTemplateController@add_email_template');
        Route::post('set_password/auth', 'API\v1\AuthController@set_password');
        Route::post('profile_change_password', 'API\v1\AuthController@change_password');
        Route::get('new_clients', 'API\v1\UserController@get_new_clients');
        Route::get('clients_last_login', 'API\v1\UserController@get_clients_last_login');
        Route::get('clients_opportunity_stage/{data}', 'API\v1\UserController@get_all_opportunity');
        Route::get('clients_opportunity_stage_with_id', 'API\v1\UserController@get_opportunity_per_id');
        Route::post('client/signature', 'API\v1\UserController@save_client_signature');
        Route::post('client/mda', 'API\v1\UserController@docusign_pdf');
        Route::post('client/submit_mda', 'API\v1\UserController@submit_docusign');
        Route::post('admin/generate_client_mnda_link', 'API\v1\UserController@generate_link');




        //settings
        Route::apiResource('notification-settings', 'API\v1\AdminNotificationSettingsController');
        //Route::get('notification-settings', 'API\v1\AdminNotificationSettingsController@get_settings');

        Route::post('user/deactivate', 'API\v1\UserController@user_deactivate');
        Route::post('user/activate', 'API\v1\UserController@user_activate');
        Route::post('users/update', 'API\v1\UserController@update_profile');
        Route::post('user/upload', 'API\v1\UserController@uploadFiles');
        // Route::post('user/upload', 'API\v1\UserController@uploadFilesTest');
        Route::post('task/markcomplete', 'API\v1\UserController@markcomplete');
        Route::post('user/consultant_register', 'API\v1\UserController@add_new_consulatant');
        Route::get('user/get_existing_files/{id}', 'API\v1\UserController@get_ghl_files');


        //verify2fa
        Route::post('verifypass', 'API\v1\UserController@verifypass');
        Route::post('generate2faSecret', 'API\v1\TwoFactorAuthenticationController@generate2faSecret');
        Route::post('enable2fa', 'API\v1\TwoFactorAuthenticationController@enable2fa');
        Route::post('disable2fa', 'API\v1\TwoFactorAuthenticationController@disable2fa');

        Route::post('consultant/updaterecord', 'API\v1\UserController@register_consultant');
        // Route::post('consultant/syncandsave', 'API\v1\UserController@register_consultant');
        Route::get('consultant/getrecord', 'API\v1\UserController@get_consultants');

        //autologin myatc
        Route::post('myatc/autologin/auth', 'API\v1\AuthController@myatc_auto_login');

        Route::post('consultant/addconsultant', 'API\v1\UserController@add_consultant');
        Route::post('consultant/changerole', 'API\v1\UserController@change_consultant_role');
        Route::post('consultant/add_user_note', 'API\v1\UserController@add_note');
        Route::post('consultant/delete_user_note', 'API\v1\UserController@delete_note');
        Route::post('consultant/add_tag', 'API\v1\UserController@consultant_add_new_tag');
        Route::get('consultant/get_user_note/{id}', 'API\v1\UserController@get_user_note');
        Route::get('consultant', 'API\v1\UserController@consultants');
        //   Route::get('gettask/{id}', 'API\v1\UserController@get_user_task_by_id');
        Route::get('notes', 'API\v1\UserController@get_user_notes');
        Route::get('notes/{id}', 'API\v1\UserController@get_user_notes_by_id');
        Route::get('user/opportunity', 'API\v1\UserController@get_user_opportunity');
        Route::get('consultant/opportunity/{id}', 'API\v1\UserController@get_consultant_opportunity');
        Route::get('user/schedule', 'API\v1\UserController@get_schedule');
        Route::get('user/last_appointment', 'API\v1\UserController@get_last_appointment');
        Route::get('user/get_one_hour_update', 'OrderController@get_one_hour_update');
        Route::post('user/add_selected_tag', 'API\v1\UserController@add_selected_tag');
        Route::post('user/add_one_hour_update_tag', 'API\v1\UserController@add_one_hour_update_tag');
        Route::post('user/add_interview_feedback', 'API\v1\UserController@interview_feedback');

        /** stages */
        Route::get('user/stages', 'API\v1\StageController@get_stages');
        Route::post('user/stages/update', 'API\v1\StageController@update_stages');
        Route::get('user/getcurrenttag', 'API\v1\UserController@current_tag');
        Route::get('user/getalltags', 'API\v1\UserController@get_user_tags');
        Route::get('user/tags', 'API\v1\UserController@user_tags');
        Route::post('user/update_video_permission', 'API\v1\UserController@update_allow_video');
        Route::get('user/get_is_video_allowed', 'API\v1\UserController@get_allow_video');
        Route::post('client/allow_mnda', 'API\v1\UserController@allow_mnda');
        Route::get('task/list/{query}', 'API\v1\UserController@get_current_tag');

        // get and update user tags
        Route::get('admin/updateusertags/{id}', 'API\v1\UserController@current_tag');

        /** dropbox */
        Route::post('attachment', 'API\v1\UserController@set_contact_attachment');
        Route::post('dropbox/savetoken', 'API\v1\UserController@savetoken');
        Route::post('dropbox', 'API\v1\UserController@dropbox');
        Route::post('dropbox/download', 'API\v1\DropboxController@download_file');
        Route::get('dropbox/getfilelist', 'API\v1\DropboxController@get_dropbox_list');
        Route::get('dropbox/getlastuploadedstage', 'API\v1\DropboxController@get_last_uploaded_stage');
        Route::post('dropbox/preview', 'API\v1\DropboxController@preview_file');
        Route::get('dropbox/disconnect', function () {
            return Dropbox::disconnect('app/dropbox');
        });

        /** appointments */
        Route::get('timezones', 'API\v1\AppointmentController@getTimezone');
        Route::post('appointment', 'API\v1\AppointmentController@addAppointment');
        Route::post('calendar/slots', 'API\v1\AppointmentController@getAvailableSlots');
        Route::post('calendar/delete/slots', 'API\v1\AppointmentController@deleteSlot');
        Route::post('get/appointment', 'API\v1\AppointmentController@getAppointments');
        Route::post('add/appointment', 'API\v1\AppointmentController@save_consultant_schedule');
        Route::post('add/conusltant/proceed_tag', 'API\v1\AppointmentController@proceed_to_next_timeline');
        Route::post('get/consultant/appointment', 'API\v1\AppointmentController@get_consultant_schedule');
        Route::post('user/schedule/change_status', 'API\v1\AppointmentController@change_appointment_status');
        Route::post('calendar/consultant/availability', 'API\v1\AppointmentController@get_consultant_availability');
        Route::post('appointment/assign_consultant', 'API\v1\AppointmentController@assign_consultant');
        Route::get('appointment/cancelled_booking', 'API\v1\AppointmentController@get_cancelled_appointment');
        Route::get('appointment/user_option', 'API\v1\AppointmentController@user_options');
        Route::post('appointment/send_email_notification', 'API\v1\AppointmentController@send_email_notification');
        Route::get('admin/calendar/events', 'API\v1\AppointmentController@calendar_appointments');
        Route::post('admin/calendar/change-consultant-slot', 'API\v1\AppointmentController@update_slot');
        Route::post('admin/calendar/delete-consultant-slot', 'API\v1\AppointmentController@delete_slot');


        //approve -  not approve
        Route::post('consultant/add_approval', 'API\v1\AppointmentController@add_approval');
        Route::post('slot', 'API\v1\AppointmentController@getAvailableSlots');
        Route::post('calendar/download/csv', 'API\v1\AppointmentController@downloadappointments');
        Route::post('calendar/download/ics', 'API\v1\AppointmentController@downloadAppointmentAsICS');
        Route::post('calendar/download-schedule/ics', 'API\v1\AppointmentController@downloadConsultantSchedule');
        Route::post('calendar/download-schedule/csv', 'API\v1\AppointmentController@downloadConsultantScheduleCSV');


        // NotificationController
        Route::apiResource('notification', 'API\v1\NotificationController');
        Route::get('user_options', 'API\v1\NotificationController@user_options');
        Route::get('get_notification_alert', 'API\v1\NotificationController@get_notification_alert');
        Route::post('read', 'API\v1\NotificationController@read');
        Route::post('archive', 'API\v1\NotificationController@archive');

        //viewas
        Route::post('admin/viewas', 'API\v1\AuthController@viewas');

        //settings
        Route::get('consultant/settings', 'API\v1\AdminNotificationSettingsController@get_settings');


        //
        Route::post('historylogs/add', 'API\v1\HistoryLogController@createHistory');
        Route::get('historylogs/get', 'API\v1\HistoryLogController@getHistory');

        //pipeline
        Route::get('pipelines', function () {

            $controller = new AppointmentController;

            $pipeline = $controller->get_pipelines();


            return response()->json([
                'success' => true,
                'data' => $pipeline
            ]);
        });
    });



    // public
    Route::post('verify2fa', 'API\v1\TwoFactorAuthenticationController@verify2fa');
    Route::post('register', 'API\v1\AuthController@register');
    Route::post('check_auth', 'API\v1\AuthController@check_auth');
    Route::post('login', 'API\v1\AuthController@login');
    Route::post('auto_login', 'API\v1\AuthController@auto_login');
    Route::post('forgot_password', 'API\v1\AuthController@forgot_password');
    Route::post('change_password', 'API\v1\AuthController@change_password');
    Route::post('logout', 'API\v1\AuthController@logout');


    Route::get('maintenance', function () {

        $maintenance = \App\Maintenance::first();
        return response()->json(['data' => $maintenance], 200);
    });
});

// function pp($data)
// {
//     echo '<pre>';
//     print_r($data);
// }


Route::get('atc/search/user/{email}/{password}', function ($email, $password) {

    $auth =  new AuthController;

    $data = [
        'email' => $email,
        'password' => $password
    ];

    $_exist = $auth->verifyUser($data);

    if ($_exist) {
        return response()->json(['success' => true, 'token' =>  $_exist['token'], 'date_registered' => $_exist['date_registered']], 200);
    } else {
        return response()->json(['success' => false], 200);
    }
});


Route::post('docusign/webhook', function (Request $request) {
    $data = $request->all();

    $webhook = \App\DocusignWebhook::create([
        'webhook' => json_encode($data)
    ]);

    // $data = '{"event":"envelope-completed","apiVersion":"v2.1","uri":"/restapi/v2.1/accounts/ebeffd2b-d050-4e1a-beae-787ac2aab843/envelopes/7a5f1e05-6b6b-445e-9ec0-b8531bacca38","retryCount":0,"configurationId":10055427,"generatedDateTime":"2022-09-22T15:22:53.4580747Z","data":{"accountId":"ebeffd2b-d050-4e1a-beae-787ac2aab843","userId":"93ed758b-0830-4012-bef6-1a9391a01b9c","envelopeId":"7a5f1e05-6b6b-445e-9ec0-b8531bacca38","envelopeSummary":{"status":"completed","documentsUri":"/envelopes/7a5f1e05-6b6b-445e-9ec0-b8531bacca38/documents","recipientsUri":"/envelopes/7a5f1e05-6b6b-445e-9ec0-b8531bacca38/recipients","attachmentsUri":"/envelopes/7a5f1e05-6b6b-445e-9ec0-b8531bacca38/attachments","envelopeUri":"/envelopes/7a5f1e05-6b6b-445e-9ec0-b8531bacca38","emailSubject":"Please DocuSign: 1661781086_CE TEMPLATE 01.pdf","envelopeId":"7a5f1e05-6b6b-445e-9ec0-b8531bacca38","signingLocation":"online","customFieldsUri":"/envelopes/7a5f1e05-6b6b-445e-9ec0-b8531bacca38/custom_fields","notificationUri":"/envelopes/7a5f1e05-6b6b-445e-9ec0-b8531bacca38/notification","enableWetSign":"true","allowMarkup":"false","allowReassign":"true","createdDateTime":"2022-09-22T15:19:24.5Z","lastModifiedDateTime":"2022-09-22T15:19:40.403Z","deliveredDateTime":"2022-09-22T15:22:50.543Z","initialSentDateTime":"2022-09-22T15:19:41.09Z","sentDateTime":"2022-09-22T15:19:41.09Z","completedDateTime":"2022-09-22T15:22:52.92Z","statusChangedDateTime":"2022-09-22T15:22:52.92Z","documentsCombinedUri":"/envelopes/7a5f1e05-6b6b-445e-9ec0-b8531bacca38/documents/combined","certificateUri":"/envelopes/7a5f1e05-6b6b-445e-9ec0-b8531bacca38/documents/certificate","templatesUri":"/envelopes/7a5f1e05-6b6b-445e-9ec0-b8531bacca38/templates","expireEnabled":"true","expireDateTime":"2023-01-20T15:19:41.09Z","expireAfter":"120","sender":{"userName":"Joshua Saubon","userId":"93ed758b-0830-4012-bef6-1a9391a01b9c","accountId":"ebeffd2b-d050-4e1a-beae-787ac2aab843","email":"joshuabsaubon+atctest4@gmail.com"},"recipients":{"signers":[{"creationReason":"sender","canSignOffline":"false","isBulkRecipient":"false","requireUploadSignature":"false","name":"Joshua Saubon","email":"joshuabsaubon+atctest4@gmail.com","recipientId":"98969862","recipientIdGuid":"4cf8e55c-b611-4ab5-bddd-9bc640bfc911","requireIdLookup":"false","userId":"93ed758b-0830-4012-bef6-1a9391a01b9c","routingOrder":"1","note":"","status":"completed","completedCount":"1","signedDateTime":"2022-09-22T15:22:52.92Z","deliveredDateTime":"2022-09-22T15:22:50.373Z","sentDateTime":"2022-09-22T15:19:41.043Z","deliveryMethod":"email","recipientType":"signer"}],"agents":[],"editors":[],"intermediaries":[],"carbonCopies":[],"certifiedDeliveries":[],"inPersonSigners":[],"seals":[],"witnesses":[],"notaries":[],"recipientCount":"1","currentRoutingOrder":"1"},"envelopeDocuments":[{"documentId":"1","documentIdGuid":"6883476d-fd11-46ba-aea6-1026abed1c92","name":"1661781086_CE TEMPLATE 01.pdf","type":"content","uri":"/envelopes/7a5f1e05-6b6b-445e-9ec0-b8531bacca38/documents/1","order":"1","pages":[{"pageId":"46635e9e-1ec3-44c5-84f1-0ce976c05215","sequence":"1","height":"842","width":"595","dpi":"72"}],"display":"inline","includeInDownload":"true","signerMustAcknowledge":"no_interaction","templateRequired":"false","authoritativeCopy":"false"},{"documentId":"certificate","documentIdGuid":"5710c854-4901-417d-9def-543cb867359c","name":"Summary","type":"summary","uri":"/envelopes/7a5f1e05-6b6b-445e-9ec0-b8531bacca38/documents/certificate","order":"999","display":"inline","includeInDownload":"true","signerMustAcknowledge":"no_interaction","templateRequired":"false","authoritativeCopy":"false"}],"purgeState":"unpurged","envelopeIdStamping":"true","is21CFRPart11":"false","signerCanSignOnMobile":"true","autoNavigation":"true","isSignatureProviderEnvelope":"false","hasFormDataChanged":"false","allowComments":"true","hasComments":"false","allowViewHistory":"true","disableResponsiveDocument":"false","envelopeMetadata":{"allowAdvancedCorrect":"true","enableSignWithNotary":"false","allowCorrect":"true"},"anySigner":null,"envelopeLocation":"current_site","isDynamicEnvelope":"false"}}}';
    // $data = json_decode($data, true);
    // dd($data);
    if ($data) {
        if (isset($data['data'])) {
            $recipient = $data['data']['envelopeSummary']['recipients']['signers'][0]['email'];
            // dd($recipient);
            #SAMPLE RECIPIENT
            // $recipient = 'shaitzz+test13@gmail.com';

            $envelopeId = ($data['data']['envelopeId']);
            $urlToSendToGHL = "https://appdemo.docusign.com/documents/details/$envelopeId";
            // CODE TO SEND TO DOCUMENT URL CUSTOM FIELD IN GHL

            $params = [
                'email' =>  $recipient,
                'customField' => ['F5XwSK6mYtyb6RKOnbDi' =>  $urlToSendToGHL]
            ];

            $user = \App\User::where('email', $recipient)->first();


            $url3 = 'https://rest.gohighlevel.com/v1/contacts/' . $user->go_high_level_id;
            $response = Curl::to($url3)
                ->withData(json_encode($params))
                ->withHeader('Content-Type: application/json')
                ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
                ->withResponseHeaders()
                ->returnResponseObject()
                ->put();


            $url2 = 'https://rest.gohighlevel.com/v1/contacts/' . $user->go_high_level_id . '/tasks/';
            $response = Curl::to($url2)
                ->withHeader('Content-Type: application/json')
                ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
                ->get();

            $task = json_decode($response)->tasks;

            $queried_task = [];
            foreach ($task as $item) {
                if ($item->title == 'Docusign') {
                    if ($item->isCompleted != 1) {
                        $queried_task = $item;
                    }
                }
            };

            if (!collect($queried_task)->isEmpty()) {
                $url = 'https://rest.gohighlevel.com/v1/contacts/' . $user->go_high_level_id . '/tasks/' . $queried_task->id . '/status';

                $remove_task_response = Curl::to($url)
                    ->withData(json_encode(['status' => 'completed']))
                    ->withHeader('Content-Type: application/json')
                    ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
                    ->returnResponseObject()
                    ->put();


                if ($remove_task_response->status !== 200) {
                    return response()->json(['success' => false, 'message' => $remove_task_response->conent], 500);
                }
            }

            return response()->json([
                'success' => true
            ]);

            // dd($recipient, $envelopeId);
        }
    }
});

Route::get('docusign/auth/callback', function (Request $request) {
    $code = $request->code;
    $state = $request->state;
    $params = [
        'grant_type' => 'authorization_code',
        'code' => $code,
        'state' => $state,
    ];

    $response = \Curl::to(env("DOCUSIGN_AUTH_URL"))
        ->withData(json_encode($params))
        ->withHeader('Content-Type: application/json')
        ->withHeader('Authorization: Basic ' . env("DOCUSIGN_BASIC_AUTH"))
        ->post();

    $accessToken = \App\DocusignAuth::create([
        'accessToken' => $response
    ]);

    return $response;
});

Route::post('docusign/send_template', function (Request $request) {
    $params = [
        'accountId' => 'authorization_code',
        // 'emailSubject' => $code,
        'templateId' => env('DOCUSIGN_TEMPLATE_ID'),
        'templateRoles' => [
            [
                'roleName' => 'Client',
                'name' => $request->full_name,
                'email' => $request->email,
            ]
        ],
        'status' => 'sent',
    ];


    $accessToken = \App\DocusignAuth::orderBy('id', 'desc')->limit(1)->first();
    $accessToken = json_decode($accessToken['accessToken'], true);

    $access_token = $accessToken['access_token'];

    $url = env("DOCUSIGN_API_URL") . '/restapi/v2.1/accounts/' . env('DOCUSIGN_ACCOUNT_ID') . '/envelopes';
    $response = \Curl::to($url)
        ->withData(json_encode($params))
        ->withHeader('Content-Type: application/json')
        ->withHeader('Authorization: Bearer ' . $access_token)
        ->post();

    return response()->json([
        'success' => true,
        'data' => $response,
        'url' => $url,
    ]);
});


Route::get('api/task/test', function (Request $request) {

    $accessTokenData = \App\GHLAuth::orderBy('id', 'desc')->limit(1)->first();
    $accessTokenData = json_decode($accessTokenData['accessToken'], true);

    $accessToken =  $accessTokenData['access_token'];

    // $link = env("REACT_APP_URL") . "/email/notification/autologin/" . $data['token'] . "/" . $data['appointment_id'];

    // $link = $this->shorten_url($link);

    $default_template = \App\AdminNotificationSettings::first();
    $template = \App\EmailTemplate::where('id',  $default_template->sms_template)->first();


    if ($template) {
        $body = $template->body;
    } else {
        $body =  '<p>Dear <b>[contact_name]</b>,</p><p>A new slot for consultation is open. Here is the consultation slot details:</p></br><p>Date: [date]</p><p>Time start: [time_start]</p><p>Time end: [time_end]</p></br><p>tap the link below to book appointment now!</p> <br/><p>[link]</p></br><p>This is a first come, first serve appointment. Which means that if the link above doesnt work, a client has already booked the appointment.</p><br/><p>If you need assistance or have questions, please contact Courtney at courtney@airlinetc.com. </p></br><p>Thank you,</p></br><p>Airline Transition Consultants</p>';
    }


    $body = str_replace('<br>', "\n", $body);
    $body = str_replace('<br/>', "\n", $body);
    $body = str_replace('<br />', "\n", $body);
    $body = str_replace('</p>', "\n", $body);
    $body = str_replace('</li>', "\n", $body);
    // $body = str_replace('</p>', "\n", $body);

    // Remove HTML tags
    $plain_text = strip_tags($body);

    // Convert HTML entities to their respective characters
    $plain_text = html_entity_decode($plain_text);

    // // Remove extra whitespace
    // $plain_text = preg_replace('/\s+/', ' ', $plain_text);

    // // $body = str_replace('[contact_name]', $data['contact_name'], $body);
    // // $body = str_replace('[date]', \Carbon\Carbon::parse($data['schedule_date'])->toFormattedDateString(), $body);
    // // $body = str_replace('[time_start]', $data['time_start'], $body);
    // // $body = str_replace('[time_end]', $data['time_end'], $body);
    // // $body = str_replace('[link]',  $link, $body);


    $params = [
        'type' => 'SMS',
        'contactId' => 'Zzw3FNE4MIcQwNa5tbG5',
        'message' => $plain_text,
    ];

    $url = 'https://services.leadconnectorhq.com/conversations/messages';
    $ApiResponse = Curl::to($url)
        ->withData(json_encode($params))
        ->withHeader('Content-Type: application/json')
        ->withHeader('Authorization: Bearer ' .  $accessToken)
        ->withHeader('Version: 2021-04-15')
        ->withResponseHeaders()
        ->post();

    // return json_encode($body);
    // return response()->json(["data" => $body]);
    return $ApiResponse;
    // echo $plain_text;
});


Route::post('api/opportunity', function (Request $request) {



    $url = 'https://rest.gohighlevel.com/v1/pipelines/yd5WJ4dGvhRPaoD4ymZ0/opportunities?pipelineStageId=aeb33c7d-ac36-4c0e-8c7e-67ed2f5d793f';
    $response = Curl::to($url)
        ->withHeader('Content-Type: application/json')
        ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
        ->get();


    if (empty($response)) {

        return $response;
    }
    return response()->json(["data" => json_decode($response)]);
});


Route::post('api/get-opportunity', function (Request $request) {

    // $pipeline_id_progress = $pipeline->pipelines[0]->id;

    $url = 'https://rest.gohighlevel.com/v1/pipelines/yd5WJ4dGvhRPaoD4ymZ0/opportunities/f10QXXpA3jtG2RwVUiqf';


    $response = Curl::to($url)
        ->withHeader('Content-Type: application/json')
        ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
        ->get();


    if (empty($response)) {
        return $response;
    }
    return response()->json(["data" => json_decode($response)]);
});


Route::post(
    'myairlinetc/orders',
    function () {
        $url = "https://myairlinetc.com/wp-json/wc/v3/orders?status=completed&orderby=id&order=desc&per_page=10";

        $curl = curl_init($url);
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

        $headers = array(
            "Authorization: Basic Y2tfNGY2ZmRiMDhkNGE4ZTA5N2UyNTcxYTBlNTUxZjI5OGMyNDE2NTU3MTpjc18zZTNjMGFlZWIyMGExOGY5NjYwN2EzZmY0MTBiZTc3M2Q3MTVjZDll",
        );
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
        //for debug only!
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

        $resp = curl_exec($curl);
        curl_close($curl);

        $resp = json_decode($resp, true);

        return response()->json(['data' =>  $resp]);

        // $customers_data = [];

        // $array_products = [];


        // foreach ($resp as $key => $data) {

        //     if ($data['date_created'] > \Carbon\Carbon::parse('2022-10-16T09:50:57')) {

        //         $product_names = array_column($data['line_items'], 'name');

        //         if (in_array("FREE Application Analysis", $product_names) || in_array("Eight Hour Application Construction", $product_names)) {

        //             $new_data = [];
        //             $billing = $data['billing'];
        //             $meta_data = $data['meta_data'];
        //             $usename = explode('@', $billing['email']);

        //             $new_data['firstname'] = $billing['first_name'];
        //             $new_data['lastname'] = $billing['last_name'];
        //             $new_data['name'] = $billing['first_name'] . ' ' . $billing['last_name'];
        //             $new_data['username'] = $usename[0];
        //             $new_data['company'] = $billing['company'];
        //             $new_data['lastname'] = $billing['last_name'];
        //             $new_data['address_1'] = $billing['address_1'];
        //             $new_data['address_2'] = $billing['address_2'];
        //             $new_data['city'] = $billing['city'];
        //             $new_data['state'] = $billing['state'];
        //             $new_data['postcode'] = $billing['postcode'];
        //             $new_data['country'] = $billing['country'];
        //             $new_data['email'] = $billing['email'];
        //             $new_data['phone'] = $billing['phone'];
        //             $new_data['email_verified_at'] = $data['date_created'];
        //             $new_data['isFreeConsultation'] = in_array("Eight Hour Application Construction", $product_names) ? false : true;

        //             $new_data['password'] = '';

        //             foreach ($meta_data as $key => $meta) {
        //                 if ($meta['key'] === 'confirm_password') {
        //                     $new_data['password'] = $meta['value'];
        //                 }
        //             }


        //             if ($new_data['password']) {
        //                 array_push($customers_data, $new_data);
        //             } else {
        //                 $_user_exist = \App\User::where('email', $billing['email'])->count();

        //                 if ($_user_exist) {
        //                     array_push($customers_data, $new_data);
        //                 }
        //             }
        //         }
        //     }
        // }

        // foreach ($customers_data as $key => $order) {
        //     $_order = \App\Order::where('email', $order['email'])->first();
        //     $_user = \App\User::where('email', $order['email'])->first();

        //     if ($_user) {
        //         if (!$order['isFreeConsultation']) {
        //             if ($_order) {
        //                 // if ($_order->ghl_update == 0) {
        //                 //     $params = [
        //                 //         'tags' => ['product purchase (done)'],
        //                 //     ];

        //                 //     $ghl_url = 'https://rest.gohighlevel.com/v1/contacts/' . $_user->go_high_level_id . '/tags/';
        //                 //     $response = Curl::to($ghl_url)
        //                 //         ->withData(json_encode($params))
        //                 //         ->withHeader('Content-Type: application/json')
        //                 //         ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
        //                 //         ->returnResponseObject()
        //                 //         ->post();

        //                 //     if ($response->status == 200) {
        //                 //         $_updated = \App\Order::where('email', $_order->email)->update(['ghl_update' => true, 'ghl_updated_at' => \Carbon\Carbon::now()]);
        //                 //         return response()->json(['success' => true], 200);
        //                 //     } else {
        //                 //         return response()->json(['success' => false, 'data' => $response], 500);
        //                 //     }
        //                 // }
        //             } else {

        //                 $order_details = [
        //                     'first_name' => $order['firstname'],
        //                     'last_name' => $order['lastname'],
        //                     'address_1' => $order['address_1'],
        //                     'address_2' => $order['address_2'],
        //                     'city' => $order['city'],
        //                     'state' => $order['state'],
        //                     'postcode' => $order['postcode'],
        //                     'email' => $order['email'],
        //                     'phone' => $order['phone'],


        //                 ];
        //                 $add_order = \App\Order::create($order_details);


        //                 if ($add_order) {
        //                     //     $params = [
        //                     //         'tags' => ['product purchase (done)'],
        //                     //     ];

        //                     //     $ghl_url = 'https://rest.gohighlevel.com/v1/contacts/' . $_user->go_high_level_id . '/tags/';
        //                     //     $response = Curl::to($ghl_url)
        //                     //         ->withData(json_encode($params))
        //                     //         ->withHeader('Content-Type: application/json')
        //                     //         ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
        //                     //         ->returnResponseObject()
        //                     //         ->post();

        //                     //     if ($response->status == 200) {
        //                     //         $_updated = \App\Order::where('email', $add_order->email)->update([
        //                     //             'ghl_update' => true,
        //                     //             'ghl_updated_at' => \Carbon\Carbon::now()
        //                     //         ]);
        //                     return response()->json(['success' => true], 200);
        //                     //     } else {
        //                     //         return response()->json(['success' => false, 'data' => $response], 500);
        //                     //     }
        //                 }

        //                 // GHL ADD TAG
        //             }
        //         }
        //     } else {


        //         (new App\Http\Controllers\API\v1\UserController)->register_on_checkout($order);
        //     }
        // }

        // return response()->json([
        //     'data' =>   $customers_data
        // ], 200);
    }


);

Route::get('getemail', function () {

    $url = 'https://rest.gohighlevel.com/v1/calendars/teams';
    $ApiResponse = Curl::to($url)
        ->withHeader('Content-Type: application/json')
        ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
        ->get();


    $url = 'https://rest.gohighlevel.com/v1/calendars/services?teamId=' . env('GOHIGHLEVEL_TEAM_CALENDAR_ID');
    $response = Curl::to($url)
        ->withHeader('Content-Type: application/json')
        ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
        ->get();
});


Route::post('bitly', function (Request $request) {

    $params = [
        'long_url' => 'https://system.airlinetc.com/email/notification/autologin/eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiZjMyNmM2MThhZDI1ODk0NWI5OGVlNTMzYTU0YjkyZTZjZWExZDQ3ZTZlMDRmYWJjNTIwZTMyODM4NWQ3ZWIxZWE2MDE2MmU3NWZkY2IyNWMiLCJpYXQiOjE2NzU5NTUxMDksIm5iZiI6MTY3NTk1NTEwOSwiZXhwIjoxNzA3NDkxMTA5LCJzdWIiOiI0MTAiLCJzY29wZXMiOltdfQ.bIq7yw2yDW9ZL1SEuWSyRWRiEA6-Qlfhu-VuWzqp1jIg1wxx5AKyRHcCcB5CEYtUb9M5b77GYY0c_pGJB_6XUh4b0SA2Fh1iWhTd95wffKzS8O7TvXuCF50xciMK5JDOiqunBOujfD80N0eYYoOj0rsfAj6UvtsDsPsl3kyCvHsw0YZ1Uz99x2eCH2GUFLPlEchQ6mL68nAVOuP92tfz_58tcXbl-jP_YPzaLScj3PBV7VOaIhfbkotOcs3Wh_iwKs-bIdArxUc_4LCRutbX0jzKPy9jN586L_Pygh9VkVOlqWReVybUR0AGDXUDZX-ODF7rAWM4Tfla_6kZ-vNuyr6VTDLeBNW1xIYdqp0PCbPJUSO0mZ_RVVhm1sOAHAHUfgCboTp5kcNnnWqfDod1Q6XbQRRvXU10zS6KtfgsirEXyGdQ7KmjG6ZTohnsnoGswm3vCEi63K5tdzm794j-4o8RxYlbHKTQ7uWdU9FK3oE3J_j4I7posyDxyDjMizEZ89C-2x_7OgbctAXKuVAN01cW6SSy1idaVq5sba2J3fhL8yK5tY7Hzcq_pq0ZkrRvWXop9hwTHaq8tYiQZQCT9V8cJ_Rzd708CtHbctcjhsT5IRfzoD2tJOVt-doPBskGrQEix_HynzDtFI0rjKRRF7GIZ_pMRK8-FCGpwZ1Q7hA/fDULH4HBxaPvF0YyPROS',
        'domain' => 'bit.ly',
    ];

    $url = 'https://api-ssl.bitly.com/v4/shorten';
    $ApiResponse = Curl::to($url)
        ->withData(json_encode($params))
        ->withHeader('Content-Type: application/json')
        ->withHeader('Authorization: Bearer c2355512bb7934509bab9aca8f6d549804d6bba8')
        ->post();

    $return_link = json_decode($ApiResponse, true);

    echo $return_link['link'];
});

Route::get('mnda/pdf', function (Request $request) {


    $data = [];
    $pdfContent = view('pdf/mnda', $data)->render();
    // return view('pdf/mnda', $data);
    $pdfTemplate = 'Mutual Confidentiality Agreement';

    $debug = false;

    ob_start();
    $content = $pdfContent;

    try {

        set_time_limit(0);
        $html2pdf = new Html2Pdf('P', 'A4', 'fr');
        $html2pdf->pdf->SetFont('times');
        $html2pdf->pdf->SetTitle($pdfTemplate);
        $html2pdf->WriteHTML($content);
        $html2pdf->Output($pdfTemplate . '.pdf', 'D');

        ob_flush();
        ob_end_clean();
    } catch (HTML2PDF_exception $e) {
        echo $e;
        exit;
    }
});

Route::get('test_api', function (Request $request) {

    // $tags = \App\UserTag::where('user_id', 515)->pluck('tag')->toArray();
    // $tags = \App\UserTask::where('user_id', 515)->where('title', 'Upload Application')->where('status', 'pending')->first();
    // $a = [
    //     'appointment cancelled (done)',
    //     'appointment reschedule (done)',
    //     'book for call 1',
    //     'docusign (done)',
    //     // 'call 1 - book (current task)',
    // ];
    // $tag = ['call 1 - book (done)', 'call 1 - call (current task)'];
    // $a = array_merge($a, $tag);

    // $remove_tag_data = [
    //     // 'user_id' => $user->id,
    //     // 'tag' => array_push($a, 'call 1 - book (current task)')
    //     'tag' => $a
    // ];

    // $current_tag = \App\UserTag::where('user_id', 525)->pluck('tag')->toArray();
    // $current_tag = json_encode($current_tag);
    // $current_tag = json_encode(['json_encode($current_tag)', 'asdasds', 'pre publish - call (current task)']);

    // if (!str_contains($current_tag, 'pre publish - call (current task)') && !str_contains($current_tag, 'pre interview - call (current task)')) {
    //     echo $current_tag;
    // } else {
    //     echo 'false';
    //     // echo str_contains($current_tag, 'pre publish - call (current task)');
    // }


    $current_tag = [
        'appointment cancelled (done)',
        'call 1 - reschedule book (current task)',
        'book for reschedule',
        'cancels on call 1',
    ];
    // $current_tag = json_encode($current_tag);

    // if (str_contains($current_tag, 'reschedule book (current task)')) {
    //     echo $current_tag;
    // } else {
    //     echo 'false';
    //     // echo str_contains($current_tag, 'pre publish - call (current task)');
    // }


       array_push($current_tag, 'cancels on call 1', 'cancels on call 1sfsdfsdfsdf');

        echo json_encode($current_tag);
});

Route::get('client/mnda/pdf', 'API\v1\UserController@docusign_pdf');
Route::get('client/timelinesheet/pdf', 'API\v1\UserController@downloadTimelinePDF');
