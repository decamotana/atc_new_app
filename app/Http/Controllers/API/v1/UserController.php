<?php

namespace App\Http\Controllers\API\v1;

use App\AthleteOrganization;
use App\AthleteWebsite;
use App\CoachOrganization;
use App\Consultants;
use App\DropboxUploadedFiles;
use App\Http\Controllers\Controller;
use App\Organization;
use Illuminate\Http\Request;
use App\User;
use App\UserAddress;
use App\UserPayment;
use App\UserStages;
use Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Dcblogdev\Dropbox\Facades\Dropbox;
use File;
use Ixudra\Curl\Facades\Curl;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
use Spipu\Html2Pdf\Html2Pdf;
use Spipu\Html2Pdf\Exception\Html2PdfException;
use Spipu\Html2Pdf\Exception\ExceptionFormatter;

use function GuzzleHttp\json_decode;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $data = new User;
        $data = $data->with(['consultant']);
        $data = $data->select([
            "users.*",
            DB::raw("CONCAT(`firstname`, ' ', `lastname`) as `name`"),
            // DB::raw("(SELECT IF(firstname IS NOT NULL, firstname, CONCAT(`firstname`, ' ', `lastname`))) as `name`"),
            DB::raw("(SELECT country FROM `user_addresses` WHERE user_addresses.user_id = users.id) as `country`"),
            DB::raw("(SELECT state FROM `user_addresses` WHERE user_addresses.user_id = users.id) as `state`"),
            DB::raw("(SELECT city FROM `user_addresses` WHERE user_addresses.user_id = users.id) as `city`"),
        ]);

        if ($request->search) {

            if (is_array($request->search)) {
                $request->search =  $request->search['search'];
            }


            $data = $data->where(function ($q) use ($request) {
                $q->orWhere("role", 'LIKE', "%$request->search%");
                $q->orWhere("firstname", 'LIKE', "%$request->search%");
                $q->orWhere("lastname", 'LIKE', "%$request->search%");
                $q->orWhere("go_high_level_id", 'LIKE', "%$request->search%");
                $q->orWhere("email", 'LIKE', "%$request->search%");
                $q->orWhere("phone", 'LIKE', "%$request->search%");
                $q->orWhere("status", 'LIKE', "%$request->search%");
                $q->orWhere(DB::raw("CONCAT(`firstname`, ' ', `lastname`)"), 'LIKE', "%$request->search%");
                // $q->orWhere(DB::raw("(SELECT country FROM `user_addresses` WHERE user_addresses.user_id = users.id)"), 'LIKE', "%$request->search%");
                // $q->orWhere(DB::raw("(SELECT state FROM `user_addresses` WHERE user_addresses.user_id = users.id)"), 'LIKE', "%$request->search%");
                // $q->orWhere(DB::raw("(SELECT city FROM `user_addresses` WHERE user_addresses.user_id = users.id)"), 'LIKE', "%$request->search%");
            });
        }

        if (isset($request->status)) {
            $data = $data->where('status', $request->status);
        }

        if (isset($request->role)) {
            $data = $data->where('role', $request->role);
        }

        if (auth()->user()->role == 'Admin' || auth()->user()->role == 'Consultant') {
            $data = $data->where('role', 'user');
        } else {
            if (isset($request->from)) {
                $data = $data->where('role', '<>', 'Admin');
            }
        }

        // if (isset($request->for_messages)) {
        //     $blocklist = \App\MessageBlocked::where('user_id', auth()->user()->id)->get()->toArray();
        //     $data->whereNotIn('id', array_column($blocklist, 'blocked_id'));
        // }

        if ($request->sort_field && $request->sort_order) {
            if (
                $request->sort_field != '' && $request->sort_field != 'undefined' && $request->sort_field != 'null'  &&
                $request->sort_order != ''  && $request->sort_order != 'undefined' && $request->sort_order != 'null'
            ) {
                // if ($request->sort_field == "name") {
                //     $data->orderBy(DB::raw("(SELECT IF(firstname IS NOT NULL, firstname, CONCAT(`firstname`, ' ', `lastname`)))"), isset($request->sort_order)  ? $request->sort_order : 'desc');
                // } else
                if ($request->sort_field == "country") {
                    $data->orderBy(DB::raw("(SELECT country FROM `user_addresses` WHERE user_addresses.user_id = users.id)"), isset($request->sort_order)  ? $request->sort_order : 'desc');
                } else if ($request->sort_field == "state") {
                    $data->orderBy(DB::raw("(SELECT state FROM `user_addresses` WHERE user_addresses.user_id = users.id)"), isset($request->sort_order)  ? $request->sort_order : 'desc');
                } else if ($request->sort_field == "city") {
                    $data->orderBy(DB::raw("(SELECT city FROM `user_addresses` WHERE user_addresses.user_id = users.id)"), isset($request->sort_order)  ? $request->sort_order : 'desc');
                } else {
                    $data->orderBy(isset($request->sort_field) ? $request->sort_field : 'id', isset($request->sort_order)  ? $request->sort_order : 'desc');
                }
            }
        } else {
            $data->orderBy('id', 'desc');
        }

        if ($request->page_size) {
            $data = $data
                ->limit($request->page_size)
                ->paginate($request->page_size, ['*'], 'page', $request->page_number)->toArray();
        } else {
            $data = $data->get();
        }


        return response()->json([
            'success' => true,
            'data' => $data,
            // 'search' => $request->search,
            // 'role' => $request->role,
            // 'request' => $request->all(),
        ], 200);
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    { }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $update_query = User::find($id);

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
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {

        if (is_numeric($id)) {
            $data = User::with(['user_address'])->where('id', $id)->first();
        } else {
            $data = User::with(['user_address'])->where('go_high_level_id', 'like', $id)->first();
        }


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
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    { }

    public function get_by_id(Request $request)
    {
        if ($request->id) {

            $data = User::where('id', $request->id)->where('id', '<>', 0)->orWhere('go_high_level_id', $request->id)->with(['user_business_infos', 'user_socials', 'user_plans.account_type_plans', 'member_company'])->get();
            return response()->json([
                'success' => true,
                'data' => $data,
            ], 200);
        }
    }

    public function user_password(Request $request)
    {
        $current_password = Hash::make($request->current_password);
        $new_password = $request->new_password;
        $check = User::where('id', $request->id)->first();

        if ($check) {
            if (Hash::check($request->current_password, $check->password)) {
                $check->password = Hash::make($new_password);
                $check->save();
                return response()->json([
                    'success' => true,
                    'message' => 'Success',
                    'description' => 'Successfully change password!'
                ], 200);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Error',
                    'description' => 'Current password mismatch!'
                ], 200);
            }
        }
    }

    public function update_profile(Request $request)
    {
        $user = User::updateOrCreate(
            ['id' => $request->id],
            [
                'firstname' => $request->firstname,
                'lastname' => $request->lastname,
                'phone' => $request->phone,
            ]
        );
        if ($request->file('profile_image')) {
            $userImageFile = $request->file('profile_image');
            $userImageFilePath = time() . '_' . $userImageFile->getClientOriginalName();
            $userImageFilePath = $userImageFile->storeAs('uploads/profile_image', $userImageFilePath, 'public');

            $user->profile_image = 'storage/' . $userImageFilePath;
            $user->save();
        }



        $user_address = \App\UserAddress::updateOrCreate(
            ['user_id' => $request->id],
            [
                'country' => $request->country,
                'address1' => $request->address1,
                'address2' => isset($request->address2) ? $request->address2 : '',
                'city' => $request->city,
                'state' => $request->state,
                'unit' => $request->unit,
                'zip_code' => $request->zip,
                'is_primary' => 1,
            ]
        );


        $dataGoHiLevel = [
            "email"  =>  $request->email,
            "phone" => $request->phone,
            "firstName" => $request->firstname,
            "lastName" => $request->lastname,
            "name" => $request->lastname . " " . $request->firstname,
            "dateOfBirth" => $request->dateofBirth,
            "address1" => $request->address_1,
            "city" => $request->city,
            "state" =>  $request->state,
            "country" => $request->country,
            "postalCode" => $request->zip,

        ];

        $apiResponse = $this->postGoHighlevelAPI($dataGoHiLevel)['contact'];

        $userDetails = User::with('user_address')->find($request->id);

        return response()->json([
            'success' => true,
            'message' => 'Success',
            'data' => $userDetails
        ], 200);
    }

    public function update_user(Request $request)
    {
        $user = User::updateOrCreate(
            ['id' => $request->id],
            [
                'firstname' => $request->firstname,
                'lastname' => $request->lastname,
                'birthdate' => $request->birthdate,
                'phone' => $request->phone,
            ]
        );

        if ($request->file('profile_image')) {
            $userImageFile = $request->file('profile_image');
            $userImageFilePath = time() . '_' . $userImageFile->getClientOriginalName();
            $userImageFilePath = $userImageFile->storeAs('uploads/profile_image', $userImageFilePath, 'public');

            $user->profile_image = 'storage/' . $userImageFilePath;
            $user->save();
        }



        return response()->json([
            'success' => true,
            'message' => 'Success',

        ], 200);
    }

    public function uppdate_profile_image(Request $request)
    {
        $data = User::find($request->id);

        if ($request->file('upload')) {
            $userImageFile = $request->file('upload');
            $userImageFileName = $userImageFile->getClientOriginalName();
            $userImageFilePath = time() . '_' . $userImageFile->getClientOriginalName();
            $userImageFilePath = $userImageFile->storeAs('uploads/profile', $userImageFilePath, 'public');
            $userImageFileSize = $this->formatSizeUnits($userImageFile->getSize());

            $data->upload = $userImageFilePath;
            $data->save();
        }

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'Success',
            'description' => 'Successfully save!'
        ], 200);
    }

    public function user_deactivate(Request $request)
    {

        $data =  User::find($request->user_id);


        $data->status = 'Deactivated';
        $data->save();

        return response()->json([
            'success' => true,
            'message' => 'Success',
            'description' => 'Successfully Deactivated!'
        ], 200);
    }

    public function user_activate(Request $request)
    {
        $data = User::find($request->user_id);

        $data->status = 'Active';
        $data->save();

        return response()->json([
            'data' => $data,
            'success' => true,
            'message' => 'Success',
            'description' => 'Successfully Reactivated!'
        ], 200);
    }

    public function user_assigned_tickets(Request $request)
    {
        $data = User::all();

        return response()->json([
            'success' => true,
            'data' => $data,
        ], 200);
    }

    public function profile_change_password(Request $request)
    {
        $current_password = Hash::make($request->current_password);
        $new_password = $request->password_1;
        $check = User::where('id', $request->id)->first();
        // if (isset($request->current_password)) {
        //     if ($check) {
        //         if (Hash::check($request->current_password, $check->password)) {
        //             $check->password = Hash::make($new_password);
        //             $check->save();
        //             return response()->json([
        //                 'success' => true,
        //                 'message' => 'Success',
        //                 'description' => 'Successfully change password!'
        //             ], 200);
        //         } else {
        //             return response()->json([
        //                 'success' => false,
        //                 'message' => 'Error',
        //                 'description' => 'Current password mismatch!'
        //             ], 200);
        //         }
        //     }
        // } else {
        $check->password = Hash::make($new_password);
        $check->save();
        return response()->json([
            'success' => true,
            'message' => 'Success',
            'description' => 'Successfully change password!'
        ], 200);
        // }
    }

    public function edit_permission(Request $request)
    {
        $user = User::find($request->id);

        if ($user) {
            $updated = $user->fill([
                'edit_permission' => $request->edit_permission,
            ]);

            if ($updated->save()) {
                return response()->json([
                    'success' => true,
                    'message' => 'User',
                    'description' => 'Edit Permission Successfully Updated!'
                ], 200);
            }
        } else {
            return response()->json([
                'success' => false,
                'message' => 'User',
                'description' => 'Edit Permission Not Updated!'
            ], 200);
        }
    }



    public function update_user_athlete_profile(Request $request)
    {
        $user = User::updateOrCreate(
            ['id' => $request->id],
            [
                'phone_number' => $request->phone_number,
                'email' => $request->email,
            ]
        );

        if ($request->file('profile_image')) {
            $userImageFile = $request->file('profile_image');
            $userImageFilePath = time() . '_' . $userImageFile->getClientOriginalName();
            $userImageFilePath = $userImageFile->storeAs('uploads/profile_image', $userImageFilePath, 'public');

            $user->profile_image = 'storage/' . $userImageFilePath;
            $user->save();
        }


        return response()->json([
            'success' => true,
            'message' => 'Success',
            'data' => $user
        ], 200);
    }

    public function user_athlete_parent_guardian(Request $request)
    {
        # code...
    }

    public function add_assessor(Request $request)
    {
        $user = User::updateOrCreate(
            ['id' => $request->id],
            [
                'username' => $request->username,
                'firstname' => $request->username,
                'lasstname' => ' ',
                'email' => $request->email,
                'is_primary' => '1',
                // 'password' => Hash::make($request->password),
                'role' => $request->role,
                'manager_id' => auth()->user()->id,
            ]
        );

        if (isset($request->password)) {
            $user->password = Hash::make($request->password);
            $user->save();
        }

        if ($request->file('profile_image')) {
            $userImageFile = $request->file('profile_image');
            $userImageFilePath = time() . '_' . $userImageFile->getClientOriginalName();
            $userImageFilePath = $userImageFile->storeAs('uploads/profile_image', $userImageFilePath, 'public');

            $user->profile_image = 'storage/' . $userImageFilePath;
            $user->save();
        } else {
            $default = urlencode('https://ui-avatars.com/api/' . $user->firstname . '/100/ba5b25/fff/2/0/1');
            $img =  'https://www.gravatar.com/avatar/' . md5(strtolower(trim($user->email))) . '?d=' . $default;
            $user->profile_image = $img;
        }

        $user_address = \App\UserAddress::updateOrCreate(
            ['user_id' => $user->id],
            [
                'address1' => $request->address1,
                'address2' => $request->address2,
                'country' => $request->country,
                'city' => $request->city,
                'state' => $request->state,
                'zip_code' => $request->zip_code,
            ]
        );

        return response()->json([
            'success' => true,
            'data' => $user
        ], 200);
    }

    public function check_manager_state(Request $request)
    {
        $getManagerByState = $this->getManagerByState($request->state);
        return response()->json([
            'success' => true,
            'count' => $getManagerByState ? 1 : 0,
        ], 200);
    }

    private function getManagerByState($state)
    {
        $UserAddress = UserAddress::where('state', $state)->first();
        return $UserAddress ? $UserAddress->user_id : "";
    }

    public function get_athlete(Request $request)
    {
        $data = new User;
        $data = $data->with(['athlete_website']);
        $data = $data->select([
            "users.*",
            DB::raw("(CONCAT(`firstname`, ' ', `lastname`)) as `name`"),
            DB::raw("(SELECT (SELECT name FROM `organizations` WHERE organizations.id = athlete_organizations.organization_id) FROM `athlete_organizations` WHERE athlete_organizations.user_id = users.id) as `organization`"),
            DB::raw("(SELECT state FROM `user_addresses` WHERE user_addresses.user_id = users.id) as `state`"),
            DB::raw("(SELECT city FROM `user_addresses` WHERE user_addresses.user_id = users.id) as `city`"),
            // DB::raw("(SELECT sport FROM `athlete_organizations` WHERE athlete_organizations.user_id=assessments.user_id) as `sport`"),
            // DB::raw("(SELECT position FROM `athlete_organizations` WHERE athlete_organizations.user_id=assessments.user_id) as `position`"),
            // DB::raw("(SELECT CONCAT(username, ' - ', assessments.assessor_name) FROM `users` WHERE users.id=assessments.assessor_id) as `assessed_by`"),
        ]);
        $data = $data->where(function ($q) use ($request) {
            $q->orWhere(DB::raw("(CONCAT(`firstname`, ' ', `lastname`))"), 'LIKE', "%$request->search%");
            $q->orWhere(DB::raw("(SELECT (SELECT name FROM `organizations` WHERE organizations.id = athlete_organizations.organization_id) FROM `athlete_organizations` WHERE athlete_organizations.user_id = users.id)"), 'LIKE', "%$request->search%");
            $q->orWhere(DB::raw("(SELECT state FROM `user_addresses` WHERE user_addresses.user_id = users.id)"), 'LIKE', "%$request->search%");
            $q->orWhere(DB::raw("(SELECT city FROM `user_addresses` WHERE user_addresses.user_id = users.id)"), 'LIKE', "%$request->search%");
        });

        $data = $data->where('role', 'Athlete');

        if (isset($request->manager_id)) {
            $data = $data->where(DB::raw("(SELECT user_id FROM `events` WHERE events.id=assessments.event_id)"), $request->manager_id);
        }

        if ($request->sort_field && $request->sort_order) {
            if (
                $request->sort_field != '' && $request->sort_field != 'undefined' && $request->sort_field != 'null'  &&
                $request->sort_order != ''  && $request->sort_order != 'undefined' && $request->sort_order != 'null'
            ) {
                if ($request->sort_field == "name") {
                    $data->orderBy(DB::raw("(CONCAT(`firstname`, ' ', `lastname`))"), isset($request->sort_order)  ? $request->sort_order : 'desc');
                } else if ($request->sort_field == "organization") {
                    $data->orderBy(DB::raw("(SELECT (SELECT name FROM `organizations` WHERE organizations.id = athlete_organizations.organization_id) FROM `athlete_organizations` WHERE athlete_organizations.user_id = users.id)"), isset($request->sort_order)  ? $request->sort_order : 'desc');
                } else if ($request->sort_field == "state") {
                    $data->orderBy(DB::raw("(SELECT state FROM `user_addresses` WHERE user_addresses.user_id = users.id)"), isset($request->sort_order)  ? $request->sort_order : 'desc');
                } else if ($request->sort_field == "city") {
                    $data->orderBy(DB::raw("(SELECT city FROM `user_addresses` WHERE user_addresses.user_id = users.id)"), isset($request->sort_order)  ? $request->sort_order : 'desc');
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

    public function get_user_notes()
    {
        $user = auth()->user();
        $data = $this->getGoHighlevelNotes($user->go_high_level_id);

        return response()->json([
            'success' => true,
            'data' =>   $data['notes'],
        ], 200);
    }

    public function get_user_notes_by_id($id)
    {
        $user = User::find($id);
        $data = $this->getGoHighlevelNotes($user->go_high_level_id);

        return response()->json([
            'success' => true,
            'data' =>   $data['notes'],
        ], 200);
    }


    public function uploadFiles(Request $request)
    {

        $logged_user = auth()->user();
        // if ($logged_user->role == "User") {
        //     $user = $logged_user;
        //     $current_tag = $this->get_current_tag();
        //     if (is_array($current_tag)) {
        //         $current_tag = json_encode($current_tag);
        //     }
        // } else {
        //     if (is_numeric($request->user_id)) {
        //         $user = \App\User::find($request->user_id);
        //     } else {
        //         $user = \App\User::where('id', $request->user_id)->first();
        //     }
        // }
        $current_stage = "";
        if ($logged_user->role == "User") {
            $user = $logged_user;
            $current_tag = $this->get_current_tag();
            $current_task = "";

            if (is_array($current_tag)) {
                foreach ($current_tag as $key => $value) {
                    if (str_contains($value, 'current task')) {
                        $current_stage = explode('-', $value);
                        $current_stage = $current_stage[0];
                        if (str_contains($current_stage, "reschedule")  || str_contains($current_stage, "1 hr update reschedule")) {
                            $get_prev_stage = \App\DropboxUploadedFiles::where("uploaded_by", $logged_user->id)->where('stage', '<>', "reschedule ")->orderBy('id', 'desc')->first();
                            $last_uploaded_stage = $get_prev_stage->stage;
                        } else if (str_contains($current_stage, "upload documents")) {
                            $current_stage = "upload documents ";
                        }
                        $currrent_task = $value;
                    } else if ($value === "pre publish") {
                        $get_prev_stage = \App\DropboxUploadedFiles::where("uploaded_by", $logged_user->id)->orderBy('id', 'desc')->first();
                        if ($get_prev_stage && $get_prev_stage->stage) {
                            $current_stage = $get_prev_stage->stage;
                        } else {
                            $current_stage = $this->get_user_stage($user->id);
                        }
                    }
                };
                $current_tag = json_encode($current_tag);
            } else {
                if (str_contains($current_tag, 'current task')) {
                    $current_stage = explode('-', $current_tag);
                    $current_stage = $current_stage[0];
                    if (str_contains($current_stage, "reschedule")) {
                        $get_prev_stage = \App\DropboxUploadedFiles::where("uploaded_by", $logged_user->id)->orderBy('id', 'desc')->first();
                        $last_uploaded_stage = $get_prev_stage->stage;
                    } else if ($current_stage == "upload documents (current task)") {
                        $current_stage = "upload documents";
                    }
                    $currrent_task = $current_tag;
                }
            }
        } else {
            if (is_numeric($request->user_id)) {
                $user = \App\User::find($request->user_id);
            } else {
                $user = \App\User::where('go_high_level_id', $request->user_id)->first();
            }
            $current_tag = $this->get_current_tag($user->id);
            // $current_stage = $this->get_user_stage($user->id);

            if (is_array($current_tag)) {
                foreach ($current_tag as $key => $value) {
                    if (str_contains($value, 'current task')) {
                        $current_stage = explode('-', $value);
                        $current_stage = $current_stage[0];
                        if (str_contains($current_stage, "reschedule")) {
                            $get_prev_stage = \App\DropboxUploadedFiles::where("uploaded_by", $user->id)->orderBy('id', 'desc')->first();
                            $current_stage = $get_prev_stage->stage;
                        } else if (str_contains($current_stage, "upload documents")) {
                            $current_stage = "upload documents ";
                        }
                        $currrent_task = $value;
                    } else if ($value == "pre publish") {
                        $get_prev_stage = \App\DropboxUploadedFiles::where("uploaded_by", $logged_user->id)->orderBy('id', 'desc')->first();
                        if ($get_prev_stage && $get_prev_stage->stage) {
                            $current_stage = $get_prev_stage->stage;
                        } else {
                            $current_stage = $this->get_user_stage($user->id);
                        }
                    }
                };
            } else {
                if (str_contains($current_tag, 'current task')) {
                    $current_stage = explode('-', $current_tag);
                    $current_stage = $current_stage[0];
                    if (str_contains($current_stage, "reschedule")) {
                        $get_prev_stage = \App\DropboxUploadedFiles::where("uploaded_by", $logged_user->id)->orderBy('id', 'desc')->first();
                        $last_uploaded_stage = $get_prev_stage->stage;
                    } else if ($current_stage == "upload documents (current task)") {
                        $current_stage = "upload documents";
                    }
                    $currrent_task = $current_tag;
                }
            }
        }


        $files = [];
        if ($request->images_count !== 0) {
            $dropboxFileInfo = [];
            $uploaded = [];
            for ($i = 0; $i < $request->images_count; $i++) {
                $fileNew = $request->file('images_' . $i);
                if ($fileNew) {
                    $fileFormat = explode(".", $fileNew->getClientOriginalName());
                    $current_time = Carbon::now();
                    //   $newFileName = $user->firstname . $user->lastname . "_" . time() . "." . $fileFormat[count($fileFormat) - 1];
                    $newFileName = $user->firstname . " " . $user->lastname . ' ' .  $current_time->format('mdy His') . "." . $fileFormat[count($fileFormat) - 1];

                    $filePath = $newFileName;

                    $filePath = $fileNew->storeAs('uploads/dropbox', $filePath, 'public');


                    // $path = '../storage/app/public/' . $filePath;
                    $path = storage_path('app/public/' . $filePath);

                    if ($logged_user->role == "User") {
                        $dropbox_response = Dropbox::files()->upload("/Client Applications/1GHLATCCLIENTAPPS/$user->firstname $user->lastname/CLIENT", $path);
                    } else {
                        $dropbox_response = Dropbox::files()->upload("/Client Applications/1GHLATCCLIENTAPPS/$user->firstname $user->lastname/CONSULTANT", $path);
                    }

                    if (property_exists($dropbox_response, 'error') == false) {

                        $returned_data = json_decode($dropbox_response);
                        array_push($dropboxFileInfo, json_decode($dropbox_response));

                        array_push($uploaded, DropboxUploadedFiles::create([
                            'user_id' => $user->id,
                            'file_name' => $returned_data->name,
                            'file_path' => $returned_data->path_lower,
                            'original_file_name' => $fileNew->getClientOriginalName(),
                            'uploaded_by' => $logged_user->role == "User" ? $user->id : $logged_user->id,
                            'stage' => $current_stage ? $current_stage : "",
                            'last_uploaded_stage' => $last_uploaded_stage ?? null
                        ]));

                        File::delete($path);
                    } else {
                        return response()->json([
                            'error' => true,
                            'location' => 'dropboxapi',
                            'data' =>   json_decode($dropbox_response),
                        ], 500);
                    }
                }
            }

            if ($logged_user->role == "User") {
                if (str_contains($current_tag, 'upload documents') == true  || str_contains($current_tag, 'upload requirements') == true) {
                    //   $current_task = json_decode($request->current_task)[0];

                    if (str_contains($current_tag, 'requirements (current task)') == true) {
                        $upload_task = $this->get_task_details('Upload Requirements / Homework');
                        // $docu = $this->upload_requirements($dropboxFileInfo);
                        // $data = ['ghl_id' => $user->go_high_level_id, 'task_id' => $upload_task->id];
                        // $this->marktask($data);
                    } else if (str_contains($current_tag, 'documents (current task)') == true) {
                        // $upload_task = $this->get_task_details('Upload Application');
                        // $data = ['ghl_id' => $user->go_high_level_id, 'task_id' => $upload_task->id];
                        // $data = ['user_id' => $request->user_id, 'title' => "Upload Application"];

                        // $docu = $this->document_url($dropboxFileInfo);
                        $data = ['ghl_id' => $user->id, 'task_id' => "Upload Application"];
                        $this->marktask($data);

                        $remove_tag_data = [
                            'user_id' => $user->id,
                            'tag' => ['upload documents (current task)', 'just registered user']
                        ];
                        $this->remove_tag($remove_tag_data);

                        $add_tag_data = [
                            'user_id' => $user->id,
                            'tag' => ['upload documents (done)', 'waiting for atc rep call (current task)']
                        ];
                        $this->add_new_tag($add_tag_data);
                    } else {
                        // $docu = $this->upload_requirements($dropboxFileInfo);
                    }
                }
            }
        }

        return response()->json([
            'success' => true,
            'file_data' => $uploaded,
            'data' => $dropboxFileInfo,
            'ghl_response' => $docu ?? [],
        ], 200);
    }


    public function get_user_stage($user_id)
    {

        // $data = json_decode(json_encode($this->get_consultant_opportunity($user_id)), true);

        // // $user_apt_stage = $user_pipeline->data->pipelines;

        // $appointmentProgressData = $data['original'];

        // $appointmentStages = $appointmentProgressData['pipeline_stages_appointment'];
        // $user_app_stage = "";
        // foreach ($appointmentStages as $stage) {

        //     if ($stage['status'] === "process") {
        //         $user_app_stage = $stage['name'];
        //     }
        // }
        // return  strtolower($user_app_stage);

        $data = \App\UserAppointmentProgress::where('user_id', $user_id)->where('status', 'process')->first();
        $user_app_stage = '';
        if (isset($data)) {
            $user_app_stage = $data->name;
        }
        return strtolower($user_app_stage);
    }



    public function dropbox_connect()
    {
        $url =  Dropbox::connect('');

        return $url;
    }

    public function savetoken(Request $request)
    {
        if (!Dropbox::isConnected()) {

            $data = Dropbox::connect($request->token);
        } else {

            $data =  Dropbox::post('users/get_current_account');
        }
        return response()->json([
            'success' => true,
            'data' =>   $data,
        ], 200);
        // return $url;
    }


    public function dropbox()
    {

        if (!Dropbox::isConnected()) {
            $connection_response = $this->dropbox_connect();

            return response()->json([
                'success' => true,
                'type' => 'url',
                'data' => $connection_response,
            ], 200);
        } else {
            $dropbox_info = Dropbox::post('users/get_current_account');
            return response()->json([
                'success' => true,
                'type' => 'data',
                'data' => $dropbox_info,
            ], 200);
        }
    }

    public function markcomplete(Request $request)
    {

        $response = $this->marktask($request->id);

        return response()->json([
            'success' => true,
            'data' => $response
        ], 200);
    }

    public function create_update_consultants()
    {
        $team = $this->getGoHighlevelTeamCalendar();

        $consultants = Collect($team)->map(function ($q) {
            $consultant_info = [];
            $consultant_info['name'] = $q->name;
            $consultant_info['calendar_id'] = $q->id;

            return $consultant_info;
        });
        $data = [];

        foreach ($consultants as $consultant) {
            $doesExist = Consultants::where('name', $consultant['name']);
            if ($doesExist->count() == 0) {
                array_push($data, Consultants::create([
                    'name' => $consultant['name'],
                    'calendar_id' => $consultant['calendar_id'],
                ]));
            }
        }
        return response()->json([
            'success' => true,
            'data' =>  $data,
            'update_count' => Collect($data)->count()
        ]);
    }

    public function get_consultants(Request $request)
    {
        $data = new User;
        $data = $data->with(['consultant', 'appointment_consultant']);
        $data = $data->select([
            "users.*",
            DB::raw("CONCAT(`firstname`, ' ', `lastname`) as `name`"),
        ])->whereIn('role', ['Consultant', 'Special consultant']);

        if ($request->search) {
            $data = $data->where(function ($q) use ($request) {
                $q->orWhere('role', 'LIKE', "%$request->search%");
                $q->orWhere("firstname", 'LIKE', "%$request->search%");
                $q->orWhere("lastname", 'LIKE', "%$request->search%");
            });
        }

        if ($request->sort_field && $request->sort_order) {
            if (
                $request->sort_field != '' && $request->sort_field != 'undefined' && $request->sort_field != 'null'  &&
                $request->sort_order != ''  && $request->sort_order != 'undefined' && $request->sort_order != 'null'
            ) {
                if ($request->sort_field == "country") {
                    $data->orderBy(DB::raw("(SELECT country FROM `user_addresses` WHERE user_addresses.user_id = users.id)"), isset($request->sort_order)  ? $request->sort_order : 'desc');
                } else if ($request->sort_field == "state") {
                    $data->orderBy(DB::raw("(SELECT state FROM `user_addresses` WHERE user_addresses.user_id = users.id)"), isset($request->sort_order)  ? $request->sort_order : 'desc');
                } else if ($request->sort_field == "city") {
                    $data->orderBy(DB::raw("(SELECT city FROM `user_addresses` WHERE user_addresses.user_id = users.id)"), isset($request->sort_order)  ? $request->sort_order : 'desc');
                } else {
                    $data->orderBy(isset($request->sort_field) ? $request->sort_field : 'id', isset($request->sort_order)  ? $request->sort_order : 'desc');
                }
            }
        } else {
            $data->orderBy('id', 'desc');
        }

        if ($request->page_size) {
            $data = $data
                ->limit($request->page_size)
                ->paginate($request->page_size, ['*'], 'page', $request->page_number)->toArray();
        } else {
            $data = $data->get();
        }

        return response()->json([
            'success' => true,
            'data' => $data,
        ], 200);
    }

    public function add_consultant(Request $request)
    {

        $user = User::where('id', $request->user_id)->update(['assigned_consultant' => $request->consultant]);

        return response()->json([
            'success' => true,
            'data' => $user,

        ], 200);
    }

    public function change_consultant_role(Request $request)
    {
        $user = User::where('id', $request->id)->update(['role' => $request->role]);

        return response()->json([
            'success' => true,
            'data' => $request->consultant,

        ], 200);
    }

    public function verifypass(Request $request)
    {

        $check = User::where('id', $request->user_id)->first();

        if (isset($request->password)) {
            if ($check) {
                if (Hash::check($request->password, $check->password)) {
                    return response()->json([
                        'success' => true,
                        'dawd' => $request->password

                    ], 200);
                } else {
                    return response()->json([
                        'success' => false,
                        'dawd' => $check
                    ], 200);
                }
            }
        }
    }



    public function register_consultant(Request $request)
    {
        $ApiResponse = $this->sync_register_consultant($request);


        return response()->json([
            'success' => true,
        ], 200);
    }

    public function current_tag($id = null)
    {
        $loggedUser = auth()->user();
        $current_tag = $this->get_current_tag($id);
        $lastStageUploaded = \App\DropboxUploadedFiles::where("uploaded_by", $loggedUser->id)->orderBy('id', 'desc')->first();

        return response()->json([
            'success' => true,
            'data' =>  $current_tag,
            'lastStageUploaded' => $lastStageUploaded,
            'id' => $loggedUser->id
        ]);
    }

    public function update_allow_video(Request $request)
    {
        $response = User::where('id', $request->id)->update([
            'isAllowVideo' => 1
        ]);

        if (!$response) {
            return response()->json([
                'success' => false,
                'message' => 'error while updating'
            ]);
        }

        $user = User::with('user_address')->find($request->id);


        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }


    public function allow_mnda()
    {
        $user = User::with('user_address')->find(auth()->user()->id);

        $user->has_mnda = true;

        if ($user->save()) {
            return response()->json(['success' => true, 'data' => $user]);
        } else {
            \Log::error("something went wrong while allowing mnda");
        }
    }

    // public function get_allow_video(Request $request)
    // {
    //     $response = Users::where('id', $request->id)->update([
    //         'isAllowVideo' => 1
    //     ]);

    //     if (!$response) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'error while updating'
    //         ]);
    //     }

    //     return response()->json([
    //         'success' => true,
    //         'data' => $response
    //     ]);
    // }

    public function register_on_checkout($order)
    {


        $dataGoHiLevel = [
            "email"  =>  $order['email'],
            "phone" => $order['phone'],
            "firstName" => $order['firstname'],
            "lastName" => $order['lastname'],
            "name" => $order['name'],
            "address1" => $order['address_1'],
            "city" => $order['city'],
            "state" =>  $order['state'],
            "country" => $order['country'],
            "postalCode" => $order['city'],
        ];


        $url = 'https://rest.gohighlevel.com/v1/contacts/';

        $response = Curl::to($url)
            ->withData(json_encode($dataGoHiLevel))
            ->withHeader('Content-Type: application/json')
            ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
            ->post();



        $apiResponse = json_decode($response, true)['contact'];


        if ($apiResponse) {

            $username = explode('@', $order['email']);

            $data = [
                'email'                 => $order['email'],
                'username'              => $username[0],
                'firstname'             => $order['firstname'],
                'lastname'              => $order['lastname'],
                'phone'                 => $order['phone'],
                'role'                  => "User",
                'status'                => 'Active',
                'email_verified_at' => now(),
                'remember_token'    => Str::random(10),
                'password'          => Hash::make($order['password']),
                'go_high_level_id'      => $apiResponse['id'],
                'go_high_level_location_id'      => $apiResponse['locationId']
            ];

            $userCreate = \App\User::create($data);
            $default = urlencode('https://ui-avatars.com/api/' . $userCreate->firstname . '/100/0D8ABC/fff/2/0/1');
            $img =  'https://www.gravatar.com/avatar/' . md5(strtolower(trim($userCreate->email))) . '?d=' . $default;
            $userCreate->profile_image = $img;
            $userCreate->save();

            if ($userCreate) {

                if (!$order['isFreeConsultation'] && !in_array("1 Hour Update", $order['product'])) {
                    $tag_data = [
                        'email' => $order['email'],
                        'tag' => ['registered on 8 hour purchase']
                    ];
                } else if ($order['isFreeConsultation']) {
                    $tag_data = [
                        'email' => $order['email'],
                        'tag' => ['upload documents (current task)', 'just registered user']
                    ];
                }

                $tag_data = [
                    'user_id' => $userCreate->id,
                    'tag' => ['upload documents (current task)', 'just registered user']
                ];
                $this->add_new_tag($tag_data);

                $task_data = [
                    [
                        'user_id' => $userCreate->id,
                        'title' => "Upload Application",
                        'description' => "Upload Your Documents / Application",
                        'status' => "pending"
                    ],
                    [
                        'user_id' => $userCreate->id,
                        'title' => "Wait For ATC Rep",
                        'description' => "Wait for an ATC representative to call.",
                        'status' => "upcoming"
                    ],
                    [
                        'user_id' => $userCreate->id,
                        'title' => "Product Purchase",
                        'description' => "Purchase a product to proceed to next task.",
                        'status' => ""
                    ],
                    [
                        'user_id' => $userCreate->id,
                        'title' => "MNDA",
                        'description' => "Please click the button below to sign MNDA",
                        'status' => ""
                    ],
                    [
                        'user_id' => $userCreate->id,
                        'title' => "Book Appointment",
                        'description' => "Schedule appointment for consultation",
                        'status' => ""
                    ],
                    [
                        'user_id' => $userCreate->id,
                        'title' => "Consultation Call",
                        'description' => "Wait for a consultation call.",
                        'status' => ""
                    ],
                ];
                $this->add_task($task_data);

                $dataUserAddress = [
                    "address1"             => $order['address_1'],
                    "city"                 => $order['city'],
                    "state"                => $order['state'],
                    // "country"              => $request->country,
                    "zip_code"            => $order['postcode'],
                    "is_primary"    => 1
                ];
                $userCreate->user_address()->create($dataUserAddress);


                $token = $userCreate->createToken('atc')->accessToken;

                $email_temp1 = explode('+', $order['email']);
                $email_temp2 = explode('@', $order['email']);

                $email_new = count($email_temp1) == 2 ? $email_temp1[0] . "@" . $email_temp2[1] : $email_temp1[0];
                $to_name = $order['firstname'] . " " . $order['lastname'];

                $link_origin = 'https://system.airlinetc.com/';

                $data = [
                    'to_name'       => $to_name,
                    'to_email'      => $email_new,
                    'link_origin'   => $link_origin . '?email=' . $order['email'],
                    'token'         => $token,
                    'username'      => $order['username'],
                    'password'      => $order['password'],
                    'link'          => $link_origin . '?email=' . $order['email'],
                ];

                $this->setup_email_template(4, $data);

                $ret = [
                    "success" => true,
                    "message" => "Successfully registered!",
                ];
            }
        }
        return $ret;
    }

    public function add_new_consulatant(Request $request)
    {
        $ret = [
            "success" => false,
            "message" => "Something went wrong!",

        ];

        $checkEmail = User::where('email', $request->email)->count();
        $checkuser = User::where('username', $request->username)->count();
        $checkphone = User::where('phone', $request->phone)->count();

        $error = false;

        if ($checkEmail > 0) {
            $error = true;
            $ret = [
                "success" => false,
                "message" => "Email already taken!",
            ];
        }

        if ($checkuser > 0) {
            $error = true;
            $ret = [
                "success" => false,
                "message" => "Username already taken!",

            ];
        }
        if ($checkphone > 0) {
            $error = true;
            $ret = [
                "success" => false,
                "message" => "Phone number already registered!",
            ];
        }


        $data = [
            'email'                 => $request->email,
            'username'              => $request->username,
            'firstname'             => $request->firstname,
            'lastname'              => $request->lastname,
            'phone'                 => $request->phone,
            'role'                  => $request->role,
            'status'                => 'Active',
            'birthdate'         => $request->dateofBirth,
            'go_high_level_id'      => $request->ghl_calendar_id,
            'go_high_level_location_id'      => ""
        ];

        // $data += [
        //     'email_verified_at' => now(),
        //     'password' => Hash::make('admin123'),
        //     'remember_token' => Str::random(10),
        // ];

        $userCreate = User::create($data);
        $default = urlencode('https://ui-avatars.com/api/' . $userCreate->firstname . '/100/0D8ABC/fff/2/0/1');
        $img =  'https://www.gravatar.com/avatar/' . md5(strtolower(trim($userCreate->email))) . '?d=' . $default;
        $userCreate->profile_image = $img;
        $userCreate->save();

        if ($userCreate) {
            $dataUserAddress = [
                "address1"             => $request->address_1,
                "city"                 => $request->city,
                "state"                => $request->state,
                // "country"              => $request->country,
                "zip_code"            => $request->zip_code,
                "is_primary"    => 1
            ];
            $userCreate->user_address()->create($dataUserAddress);


            $token = $userCreate->createToken('atc')->accessToken;

            $email_temp1 = explode('+', $request->email);
            $email_temp2 = explode('@', $request->email);

            $email_new = count($email_temp1) == 2 ? $email_temp1[0] . "@" . $email_temp2[1] : $email_temp1[0];
            $to_name = $request->firstname . " " . $request->lastname;

            $data = [
                'to_name'       => $to_name,
                'to_email'      => $email_new,
                'link_origin'   => $request->link_origin,
                'token'         => $token,
                'username'      => $request->username,
                'link'          => $request->link_origin . '/register/setup-password' . '/' . $token,
            ];
            $this->setup_email_template(2, $data);

            $ret = [
                "success" => true,
                "message" => "Successfully registered!",
            ];
        }




        return response()->json($ret, 200);
    }


    public function add_note(Request $request)
    {


        $addNote =  $this->add_user_note($request);

        if ($addNote->status == 200) {

            return response()->json(['success' => true]);
        } else {
            return response()->json(['success' => false, 'message' => 'Something went wrong while adding note!']);
        }
    }

    public function delete_note(Request $request)
    {

        $deleteNote =  $this->delete_user_note($request);

        if ($deleteNote->status == 200) {

            return response()->json(['success' => true]);
        } else {
            return response()->json(['success' => false, 'message' => 'Something went wrong while deleting note!']);
        }
    }

    public function add_one_hour_update_tag()
    {

        $user = auth()->user();

        $data = (object) [];

        $data->tag = '1 hour update';

        $hasAdded = $this->add_tag($data);

        if ($hasAdded == 200) {


            $updateFreeOneHourUpdate = \App\User::where('id', $user->id)->update([
                'free_one_hour_update' => 0
            ]);

            if ($updateFreeOneHourUpdate) {
                return response()->json(['success' => true, 'message' => 'Successfully added tag']);
            } else {
                return response()->json(['success' => false, 'message' => 'Something went wrong while updating data']);
            }
        } else {
            return response()->json(['success' => false, 'message' => 'Something went wrong while adding tag']);
        }
    }

    public function get_user_tags(Request $request)
    {
        $get_all_tags = ['user_id' => $request->user_id];
        $alltags = $this->get_all_tags($get_all_tags);
        $alltags = json_decode($alltags);
        return response()->json(['success' => true, 'dataAllTask' => $alltags], 200);
    }

    public function interview_feedback(Request $request)
    {
        if (isset($request->tag)) {
            // $data = (object) [];
            // $data->tag = $request->tag;
            // $removeTag = [$];
            $remove_tag = [
                'user_id' => $request->user_id,
                'tag' => [
                    'status',
                    'qualified and completed',
                    'hired',
                    'interview soon',
                    'still waiting',
                    'end of job search'
                ]
            ];
            $this->remove_tag($remove_tag);

            $add_tag = ['user_id' => $request->user_id, 'tag' => [$request->tag]];
            $hasAdded = $this->add_new_tag($add_tag);

            if (isset($hasAdded)) {
                return response()->json(['success' => true, 'message' => 'Thank you for letting us know !']);
            } else {
                return response()->json(['success' => false, 'message' => 'Something went wrong while adding tag']);
            }
        }
    }

    public function consultant_add_new_tag(Request $request)
    {

        if (is_numeric($request->id)) {
            $user = \App\User::find($request->id);
        } else {
            $user = \App\User::find($request->id);
            // $user = \App\User::where('go_high_level_id', $request->id)->first();
        }

        $data = [
            'user_id' => $user->id,
            'tag' => $request->tag
        ];
        $isTagAdded = $this->add_new_tag($data);

        $dataRemove = [
            'user_id' => $user->id,
            'tag' => ['upload documents (done)', 'waiting for atc rep call (current task)']
        ];
        $this->remove_tag($dataRemove);

        $data = ['ghl_id' => $user->id, 'task_id' => "Wait For ATC Rep"];
        $this->marktask($data);


        if ($isTagAdded == 200) {
            return response()->json(['success' => true, 'message' => 'Tag added']);
        } else {
            return response()->json(['success' => false, 'message' => 'Something went wrong']);
        }
    }

    public function get_new_clients()
    {
        $new_users_raw = User::selectRaw("count(id) as new_client_count,DATE_FORMAT(created_at, '%Y-%m') AS new_date,DATE_FORMAT(created_at, '%M') AS month_name,  year(created_at) as year, month(created_at) as month")->whereYear('created_at', 2023)->groupBy('month')->get();

        $new_users = $new_users_raw->map(function ($query) {
            $data = [];

            $data['client_count'] = $query->new_client_count;
            $data['month'] = $query->month_name;
            $data['year'] = $query->year;

            return $data;
        });

        return response()->json(['success' => true, 'data' => $new_users]);
    }


    public function get_clients_last_login(Request $request)
    {
        $clients_last_login = User::selectRaw('id, firstname, lastname,phone, email, go_high_level_id, last_login');

        $clients_last_login = $clients_last_login->where('role', 'User')->where('status', 'Active')->whereNotNull("last_login")->orderBy('last_login', $request->sort_order);

        $clients_last_login = $clients_last_login->limit($request->page_size)->paginate($request->page_size, ['*'], 'page', $request->page)->toArray();

        $clients_last_login['data'] = collect($clients_last_login['data'])->map(function ($query) {

            $query['last_login_dif'] = \Carbon\Carbon::parse($query['last_login'])->diffForHumans();

            return $query;
        });

        //   error_log(json_encode($clients_last_login));


        return response()->json(['success' => true, 'data' =>  $clients_last_login]);
    }


    public function get_opportunity_per_id(Request $request)
    {

        $url = $request->url;
        $response = Curl::to($url)
            ->withHeader('Content-Type: application/json')
            ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
            ->get();

        $new_data = json_decode($response, true);


        return response()->json([
            'success' => true,
            'data' => $new_data
        ], 200);
    }

    public function consultants()
    {
        $consultants = \App\User::where('role', 'Consultant')->get();


        return response()->json([
            'success' => true,
            'data' => $consultants
        ], 200);
    }

    public function user_tags(Request $request)
    {

        // $user = \App\User::where('id', $request->id)->first();

        // $url = 'https://rest.gohighlevel.com/v1/contacts/' . $user->go_high_level_id;

        // $response = Curl::to($url)
        //     ->withHeader('Content-Type: application/json')
        //     ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
        //     ->returnResponseObject()
        //     ->get();

        $tags = \App\UserTag::where('user_id', $request->id)->pluck('tag')->toArray();


        if (isset($tags)) {
            // $content = json_decode($response->content, true);
            // $tags = $content['contact']['tags'];
            return response()->json(['success' => true, 'data' => $tags], 200);
        } else {
            \Log::info("response: " . json_encode($tags));
            return response()->json(['success' => false, 'message' => 'Unable to get user tags from go high level']);
        }
    }

    public function save_client_signature(Request $request)
    {
        $logged_user = auth()->user();

        if ($logged_user->role == "User") {
            $user = User::find(auth()->user()->id);
        }
        $prev_signature = $user->signature;
        $user->signature = $request->signature;
        $user->mda_address = $request->address;
        $user->mda_city = $request->city;
        $user->mda_state = $request->state;
        $user->mda_zip = $request->zip_code;

        $save = $user->save();

        if ($save) {
            $pdf_link = '';
            function generateRandomString($chars)
            {
                return substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, $chars);
            }

            $user_id = generateRandomString(26) . $user->id . generateRandomString(26);;

            $origin_path = env("APP_URL");
            $link = $origin_path . "client/mnda/pdf?user_id=$user_id&type=embed";
            $linkDownload = $origin_path . "client/mnda/pdf?user_id=$user_id";
            // $pdf_content = file_get_contents($link);
            //Specify that the content has PDF Mime Type
            //Display it

            return response()->json(['success' => true, "link" => $link, 'downloadLink' => $linkDownload], 200);
        } else {
            return response()->json(['success' => false, 'message' => 'something went wrong while saving signature'], 500);
        }
    }


    public function generate_link(Request $request)
    {

        $pdf_link = '';
        $user_id = $this->generateRandomString(26) . $request->user_id . $this->generateRandomString(26);;

        $origin_path = env("APP_URL");
        $link = $origin_path . "client/mnda/pdf?user_id=$user_id&type=embed";
        $linkDownload = $origin_path . "client/mnda/pdf?user_id=$user_id";


        return response()->json(['success' => true, 'downloadLink' => $linkDownload], 200);
    }


    public function docusign_pdf(Request $request)
    {
        $user_id = $request->user_id;
        $user_id = substr($user_id, 26, -26);

        $user = \App\User::with('user_address')->find($user_id);
        $signature = $user->signature;
        $name = $user->firstname . ' ' . $user->lastname;
        $date = \Carbon\Carbon::now()->format('M d, Y');

        $mainAddress = $user->mda_address;
        $cityAndZip = $user->mda_city . ', ' . $user->mda_state . ' ' . $user->mda_zip;

        $data = [
            'signature' => $signature,
            'name' => $name,
            'date' => $date,
            'mainAddress' => $mainAddress,
            'cityStateAndZip' => $cityAndZip,
        ];
        $pdfContent = view('pdf/mnda', $data)->render();
        //    return view('pdf/mnda', $data);
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
            if ($request->type == 'embed') {
                $pdf_data = $html2pdf->Output($pdfTemplate . '.pdf', 'S');

                header("Content-type:application/pdf");
                echo $pdf_data;
            } else {
                $html2pdf->Output($pdfTemplate . '.pdf', 'D');
            }

            ob_flush();
            ob_end_clean();
        } catch (HTML2PDF_exception $e) {
            echo $e;
            exit;
        }
    }



    public function downloadTimelinePDF()
    {

        $filename = "timeline_sheet_2018.pdf";
        $path = storage_path('app/public/' . $filename);

        return response()->download($path, 'timeline_sheet_2018.pdf', [
            'Content-Type' => 'application/pdf',
        ]);
    }

}
