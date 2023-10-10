<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// use Auth;
use Illuminate\Support\Facades\Auth;
use App\User;
use App\HistoricalPasswordCount;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Handles Registration Request
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
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

        if ($error == false) {
            $dataGoHiLevel = [
                "email"  =>  $request->email,
                "phone" => $request->phone,
                "firstName" => $request->firstname,
                "lastName" => $request->lastname,
                "name" => $request->lastname . " " . $request->firstname,
                "dateOfBirth" => \Carbon\Carbon::parse($request->bithdate),
                "address1" => $request->address_1,
                "city" => $request->city,
                "state" =>  $request->state,
                "country" => $request->country,
                "postalCode" => $request->zip_code,

            ];

            $apiResponse = $this->postGoHighlevelAPI($dataGoHiLevel)['contact'];


            if ($apiResponse) {

                $data = [
                    'email'                 => $request->email,
                    'username'              => $request->username,
                    'firstname'             => $request->firstname,
                    'lastname'              => $request->lastname,
                    'phone'                 => $request->phone,
                    'role'                  => "User",
                    'status'                => 'Active',
                    'birthdate'             => \Carbon\Carbon::parse($request->bithdate),
                    'go_high_level_id'      => $apiResponse['id'],
                    'go_high_level_location_id'      => $apiResponse['locationId']
                ];

                // $data += [
                //     'email_verified_at' => now(),
                //     'password' => Hash::make('admin123'),
                //     'remember_token' => Str::random(10),
                // ];

                $userCreate = User::create($data);
                $default = urlencode('https://ui-avatars.com/api/' . $userCreate->firstname . '/100/789df9/fff/2/0/1');
                $img =  'https://www.gravatar.com/avatar/' . md5(strtolower(trim($userCreate->email))) . '?d=' . $default;
                $userCreate->profile_image = $img;
                $userCreate->save();

                if ($userCreate) {
                    $this->add_progress_timeline($userCreate->id); // add progress timeline

                    $tag_data = [
                        'user_id' => $userCreate->id,
                        'tag' => ['upload documents (current task)', 'just registered user']
                    ];

                    $this->add_new_tag($tag_data);
                    $task_data = [
                        [
                            'user_id' => $userCreate->id,
                            'title' => "Upload Application",
                            'description' => 'Upload Your Documents / Application
                            <br/>
                            <a href="'.env('REACT_APP_URL').'documents" >click here<a/>',
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
                            'description' => 'Purchase a product to proceed to next task. <a href="https://myairlinetc.com/product/full-consultation/" target="_blank">Click here to purchase product</a>',
                            'status' => ""
                        ],
                        [
                            'user_id' => $userCreate->id,
                            'title' => "MNDA",
                            'description' => 'Please click the button below to sign MNDA
                            <br/> <a href="'.env('REACT_APP_URL').'mnda">Click here</a>',
                            'status' => ""
                        ],
                        [
                            'user_id' => $userCreate->id,
                            'title' => "Book Appointment",
                            'description' => 'Schedule appointment for consultation
                            <br/> <a href="'.env('REACT_APP_URL').'appointment/book-a-consultant">Click here</a>',
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
            }
        }


        return response()->json($ret, 200);
    }


    /**
     * Handles Set Password Request
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function set_password(Request $request)
    {
        $ret = [
            "success" => false,
            "message" => "Something went wrong!",
            "Auth::guard('api')->user()" => Auth::guard('api')->user()
        ];

        $userData =  Auth::guard('api')->user();
        $findUser = User::find($userData->id);

        if ($findUser) {
            if ($findUser->email_verified_at == "") {
                $ret = [
                    "success" => false,
                    "message" => "Please setup password now!",
                    "already_verified" => false,
                ];

                if ($request->password) {
                    $data = [
                        'password'          => Hash::make($request->password),
                        'email_verified_at' => now(),
                        'remember_token'    => Str::random(10),

                    ];
                    if ($findUser->fill($data)->save()) {
                        $findUser->last_login =  \Carbon\Carbon::now();
                        $findUser->save();
                        $token = $findUser->createToken('atc')->accessToken;


                        $ret = [
                            "success" => true,
                            "message" => "Successfully setup password!",
                            "authUser" => [
                                'data' => $findUser,
                                'token' => $token,
                            ],
                        ];
                    }
                }
            } else {
                $ret = [
                    "success" => false,
                    "message" => "Email Already Verified!",
                    "already_verified" => true,
                ];
            }
        } else {
            $ret = [
                "success" => false,
                "message" => "Token Expired!",
            ];
        }

        return response()->json($ret, 200);
    }

    public function verifyUser($data)
    {
        $credentials = [
            'email' => $data['email'],
            'password' => $data['password']
        ];

        if (Auth::guard('web')->attempt($credentials)) {

            $user = Auth::guard('web')->user();
            $token = $user->createToken('atc')->accessToken;



            return  ['token' => $token, 'date_registered' => $user->created_at];
        } else {

            return false;
        }
    }


    public function viewas(Request $request)
    {

        $id = $request->id;
        $admin = auth()->user();

        if ($admin->role == "Admin" || $request->viewas == "true") {

            $user = \App\User::find($id);
            $img = $user->upload ? $user->upload : env('DEFAULT_IMAGE');
            $user['image_url'] = $img;
            $token = $user->createToken('atc')->accessToken;

            if ($admin->role == "Admin") {

                $subject = "<p class='history-data'><span><b>Field:</b>Login</span> <span><b>Old:</b> </span> <span><b>New:</b>  admin has viewed user $user->firstname $user->lastname </span></p>";
                $data = \App\HistoryLogs::create([
                    'page' => "View as",
                    'subject' => $subject,
                    'key' => "viewas",
                    'old_data' => "",
                    'new_data' =>  "admin has viewed user $user->firstname $user->lastname",
                    'updated_by_id' => auth()->user()->id,
                ]);
            }

            return response()->json([
                'success' => true,
                'data' => $user,
                'token' => $token,
                // 'asdsad' => $data

            ], 200);
        }
    }

    /**
     * Handles Login Request
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        if (filter_var($request->email, FILTER_VALIDATE_EMAIL)) {
            $credentials = [
                'email' => $request->email,
                'password' => $request->password
            ];
        } else {
            $credentials = [
                'username' => $request->email,
                'password' => $request->password
            ];
        }

        if (Auth::guard('web')->attempt($credentials)) {
            $user = Auth::guard('web')->user();
            if ($user->status == 'Active') {
                $token = $user->createToken('atc')->accessToken;
                $userDetails = User::where('id', $user->id)->with('user_address')->first();

                $userDetails->last_login = \Carbon\Carbon::now();
                $userDetails->save();



                $subject = "<p class='history-data'><span><b>Field:</b>Login</span> <span><b>Old:</b> </span> <span><b>New:</b> user logged in </span></p>";
                $data = \App\HistoryLogs::create([
                    'page' => "Login",
                    'subject' => $subject,
                    'key' => "/product pruchase",
                    'old_data' => "",
                    'new_data' =>  "user logged in",
                    'updated_by_id' => $userDetails->id,
                ]);


                // if ($user->profile_image) {
                //     $link = explode("/", $user->profile_image);
                //     if ($link[0] == "https:") {
                //         $user['profile_image'] = $user->profile_image;
                //     } else {
                //         $user['profile_image'] = env('APP_URL') . $user->profile_image;
                //     }
                // } else {
                //     $user['profile_image'] = env('APP_URL') . env('MIX_APP_DEFAULT_PROFILE');
                // }

                return response()->json([
                    'success' => true,
                    'data' => $userDetails,
                    'token' => $token,

                ], 200);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Account is not yet verified!',
                ], 200);
            }
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Error',
                'description' => 'Unrecognized username or password. <b>Forgot your password?</b>',
            ], 401);
        }
    }

    public function myatc_auto_login(Request $request)
    {
        $userData =  Auth::guard('api')->user();
        $findUser = User::find($userData->id);


        if (!$findUser) {
            $findUser = User::where('email', $request->email)->first();
        }


        if ($findUser->status == 'Active') {
            $token = $findUser->createToken('atc')->accessToken;
            $userDetails = User::where('id', $findUser->id)->with('user_address')->first();

            $userDetails->last_login = \Carbon\Carbon::now();
            $userDetails->save();

            return response()->json([
                'success' => true,
                'data' => $userDetails,
                'token' => $token,

            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Account is not yet verified!',
            ], 200);
        }
    }

    public function auto_login(Request $request)
    {
        // if (filter_var($request->email, FILTER_VALIDATE_EMAIL)) {
        //     $credentials = [
        //         'email' => $request->email,
        //         'password' => $request->password
        //     ];
        // } else {
        // }
        // $credentials = [
        //     'email' => $request->email,
        // ];
        // $userDetails = null;
        // do {
        $userDetails = User::where('email', $request->email)->with('user_address')->first();


        // } while ($userDetails == null);


        if ($userDetails) {

            if ($userDetails->one_time_link != 0) {
                // $user = Auth::guard('web')->user();
                $user = User::find($userDetails->id);
                $user->one_time_link = false;
                $user->save();

                if ($userDetails->status == 'Active') {
                    $token = $userDetails->createToken('atc')->accessToken;

                    $userDetails->last_login = \Carbon\Carbon::now();
                    $userDetails->save();
                    // $userDetails = User::where('id', $user->id)->with('user_address')->first();

                    return response()->json([
                        'success' => true,
                        'data' => $userDetails,
                        'token' => $token,
                    ], 200);
                } else {
                    return response()->json([
                        'success' => false,
                        'message' => 'Account is not yet verified!',
                    ], 200);
                }
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'One time link has expired',
                ], 200);
            }
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Error',
                'description' => 'Unrecognized username or password. <b>Forgot your password?</b>',
            ], 200);
        }
    }


    /**
     * Returns Authenticated User Details
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function details()
    {
        return response()->json(['user' => auth()->user()], 200);
    }

    public function registrationVerify(Request $request)
    {
        $user =  Auth::guard('api')->user();
        $user->status = 'Active';
        // $user->email_verified_at = date('Y-m-d H:i:s');
        $user->save();

        return response()->json([
            'success' => true
        ]);
    }

    public function verify(Request $request)
    {
        $this->validate($request, [
            'password' => 'required|min:6',
        ]);
        $user =  Auth::guard('api')->user();

        $hpc = HistoricalPasswordCount::create([
            'user_id' => $user->id,
            'password' => Hash::make($request->password)

        ]);

        $user->status = 'Active';
        $user->email_verified_at = date('Y-m-d H:i:s');
        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json([
            'success' => true
        ]);
    }

    public function auth(Request $request)
    {
        return response()->json(['success' => true], 200);
    }

    public function logout(Request $request)
    {
        $user_online = \App\User::find($request->user_id);
        // $user_online->online_status = 0;
        // $user_online->save();

        return response()->json(['success' => true, 'data' => $user_online], 200);
    }

    public function AccountPlan(Request $request)
    {
        $data = new \App\AccountPlan;

        if (isset($request->role)) {
            if ($request->role == 'Athlete') {
                $data = $data->where('account_type_id', 1);
            } else if ($request->role == 'Athlete Guardian') {
                $data = $data->where('account_type_id', 2);
            }
        }

        $data = $data->get();

        return response()->json([
            'success' => true,
            'data' => $data,
        ], 200);
    }
    public function AccountType(Request $request)
    {
        $data = \App\AccountType::with(['account_plan', 'privacy']);

        $data = $data->get();

        return response()->json([
            'success' => true,
            'data' => $data,
        ], 200);
    }

    public function forgot_password(Request $request)
    {
        $user = User::where('email', $request->email)->first();
        if ($user) {
            $token = $user->createToken('atc')->accessToken;

            $to_name = $user->firstname;
            // $to_email = $request->email;

            $email_temp1 = explode('+', $request->email);
            $email_temp2 = explode('@', $request->email);

            $to_email = count($email_temp1) == 2 ? $email_temp1[0] . "@" . $email_temp2[1] : $email_temp1[0];

            $data = [
                'to_name'       => $to_name,
                'to_email'      => $to_email,
                'link_origin'   => $request->link,
                'token'         => $token,
                'username'      => $user->username,
                'link'          => $request->link . '/forgot-password' . "/" . $token . '/' . $user->id,
            ];
            $this->setup_email_template(1, $data);

            // $data_email = [
            //     'to_name'   => $to_name,
            //     'to_email'  => $to_email,
            //     'subject'   => 'Email Confirmation',
            //     'from_name' => 'BFSS',
            //     'from_email' => 'contact@5ppsite.com',
            //     'template'  => 'admin.emails.reset-password',
            //     'body_data' => [
            //         "content"   => 'lapay content',
            //         "link"      => $request->link . '/forgot-password' . "/" . $token . '/' . $user->id,
            //         "email" => $request->email,
            //         "name" => $to_name
            //     ]
            // ];
            // event(new \App\Events\SendMailEvent($data_email));
            // event(new \App\Events\SendMailEvent($data));
            // $template = 'admin.emails.password-reset';
            // Mail::send($template, $data, function ($message) use ($to_name, $to_email, $data) {
            //     $message->to($to_email, $to_name)->subject('Ticket Submission Confirmed');
            //     $message->from('contact@5ppsite.com', 'CE.LIYA Support');
            // });
            return response()->json(['success' => true, 'token' => $token]);
        } else {
            return response()->json(['success' => false, 'error' => 'Email Address Not Foundssssss'], 401);
        }
    }

    public function change_password(Request $request)
    {
        $user = User::where('id', $request->id)->first();
        if ($user) {
            $user->password = Hash::make($request->new_password);
            if ($request->setup_consultant) {
                $user->email_verified_at = \Carbon\Carbon::now();
            }
            $user->save();
            return response()->json(['success' => true]);
        } else {
            return response()->json(['success' => false, 'error' => 'Email Address Not Found'], 401);
        }
    }

    public function ghl_user_tag()
    {
        $currentTag = $this->get_current_tag();

        return $currentTag;
    }
}
