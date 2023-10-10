<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\User;
use Google2FA;
use Auth;

class TwoFactorAuthenticationController extends Controller
{
     /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }


    public function generate2faSecret(Request $request)
    {
        $user = auth()->user();
        // Initialise the 2FA class
        $google2fa = (new \PragmaRX\Google2FAQRCode\Google2FA());;

        //generate
        $key = $google2fa->generateSecretKey();

        $QR_Image =  Google2FA::getQRCodeInline(
            'Airline Transition Consultant',
            $user->email,
            $key
        );

        //save key to user db
        $user->google2fa_secret = $key;
        $user->save();

        return response()->json([
            'success' => true,
            'data' => $key,
            'google_url' => $QR_Image
        ], 200);
    }




    public function enable2fa(Request $request)
    {

        $user =  auth()->user();
        // Initialise the 2FA class
        $google2fa = (new \PragmaRX\Google2FAQRCode\Google2FA());

        $code = $request->code;
        $valid = $google2fa->verifyKey($user->google2fa_secret, $code);

        $mess = "";
        if ($valid) {
            $user->google2fa_enable = 1;
            $user->save();
            $mess = "2FA is enabled successfully";
            return response()->json([
                'success' => true,
                'data' => $mess,
                'valid' => $valid

            ], 200);
        } else {
            $mess = "Invalid verification Code, Please try again.";
            return response()->json([
                'success' => false,
                'data' => $mess,
                'valid' => $valid

            ], 200);
        }
    }

    public function disable2fa(Request $request)
    {

        $user =  auth()->user();
        $user->google2fa_enable = 0;
        $user->google2fa_secret = null;
        $user->save();
        return response()->json([
            'success' => true,
        ], 200);
    }

    public function verify2fa(Request $request)
    {

        $user = User::with('user_address')->find($request->id);

        //  Initialise the 2FA class
        $google2fa = (new \PragmaRX\Google2FAQRCode\Google2FA());

        $code = $request->code;
        $valid = $google2fa->verifyKey($user->google2fa_secret, $code);

        if ($valid) {
            $token = $user->createToken('atc')->accessToken;
            $img = "";
            $img = $user->upload ? $user->upload : env('DEFAULT_IMAGE');
            $user['image_url'] = $img;

            return response()->json([
                'success' => true,
                'data' => $user,
                'token' => $token,

            ], 200);
        } else {

            return response()->json([
                'success' => false,
            ], 200);
        }
    }
}
