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
        $this->validate($request, [
            'first_name' => 'required',
            'last_name' => 'required',
            'username' => 'required|unique:users',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'role' => 'required',
            'primary_loan_officer_id' => 'required'
        ]);

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'primary_loan_officer_id' => $request->primary_loan_officer_id,
            'status' => 'Pending'
        ]);



        // $token = $user->createToken('davidinvoice2022')->accessToken;

        // $to_name = $request->name;
        // $to_email = $request->email;
        // $id = $user->id;
        // $from= "registration";

        // $data = array(
        //     'to_name' => $to_name,
        //     'to_email' => $to_email,
        //     'subject' => 'Welcome to Promise Network',
        //     'from_name' => env('MAIL_FROM_NAME'),
        //     'from_email' => env('MAIL_FROM_ADDRESS'),
        //     'template' => 'admin.emails.email-confirmation',
        //     'body_data' => array(
        //         'name' => $request->name,
        //         "email"=>$to_email,
        //         'link'=> url("/verify/$token/$from")
        //     )
        // );


        // event(new \App\Events\SendMailEvent($data));


       
        return response()->json(['success'=> true,'data' => $user], 200);
    }

    /**
     * Handles Login Request
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $credentials = [
            'username' => $request->email,
            'password' => $request->password
        ];

        if (auth()->attempt($credentials)) {
            if(auth()->user()->status == 'Active') {
                $token = auth()->user()->createToken('davidinvoice2022')->accessToken;
                return response()->json(['token' => $token,'data' => auth()->user()], 200);
            
            } else {
                return response()->json(['error' => 'Username or Password is Invalid', 'data' => $credentials], 401);    
            }
        } else {
            return response()->json(['error' => 'Username or Password is Invalid1', 'data' => $credentials], 401);
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

    public function registrationVerify(Request $request) {


            $user=  Auth::guard('api')->user();
            $user->status = 'Active';
            $user->email_verified_at = date('Y-m-d H:i:s');
            $user->save();

        return response()->json([
            'success' => true
        ]);
    }


    public function verify(Request $request) {

        $this->validate($request, [
            'password' => 'required|min:6',
              ]);
             $user=  Auth::guard('api')->user();

            $user->status = 'Active';
            $user->email_verified_at = date('Y-m-d H:i:s');
            $user->password = Hash::make($request->password) ;
            $user->save();




        return response()->json([
            'success' => true
        ]);
    }

    public function auth(Request $request){

        return response()->json(['success'=> true],200);
    }

    public function logout(Request $request) {
        $user_online = \App\User::find($request->user_id);
        // $user_online->online_status = 0;
        // $user_online->save();

        return response()->json(['success'=> true,'data' => $user_online], 200);
    }
}
