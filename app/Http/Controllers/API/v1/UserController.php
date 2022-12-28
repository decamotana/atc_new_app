<?php

namespace App\Http\Controllers\API\V1;

use Illuminate\Http\Request;
use App\User;
use App\Http\Controllers\Controller;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        
        $users = \App\User::select(['users.*'])->where(function($q) use ($request) {
            if($request->search) {
                $search = str_replace(' ','+',$request->search);
                $q->where(\DB::raw('CONCAT(first_name," ",last_name)'),'LIKE',"%$search%")
                ->orWhere('role','LIKE',"%$search%")
                // ->orWhere('COMPANY','LIKE',"%$search%")
                ->orWhere('created_at','LIKE',"%$search%");
            }
        });

        if(isset($request->role)) {
            $users->where('role',$request->role);
        }
        if(isset($request->status)) {
            $users->where('status',$request->status);
        }

        if($request->sort_order != '') {
            $users->orderBy($request->sort_field, $request->sort_order == 'ascend' ? 'asc' : 'desc');
        } else {
            $users->orderBy('id','desc');
        }

        if(isset($request->pagination)) {
            $users = $users->paginate($request->pageSize);
        } else {
            $users = $users->get();
        }
        
        
        return response()->json([
            'success' => true,
            'data' => $users
        ],200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if(!$request->id) {
            $this->validate($request, [
                'email' => 'required|email|unique:users',
                'username' => 'required|unique:users',
                'password' => 'required|min:6',
            ]);
        } else {
            // $this->validate($request, [
            //     'email' => 'required|email',
            //     'username' => 'required',
            // ]);
        }
        

        $profile_picture = $request->profile_picture;
        if(strpos($profile_picture,'data:image') !== false) {
            $extension = explode('/', mime_content_type($profile_picture))[1];
            $profile_picture = str_replace('data:image/png;base64,', '', $profile_picture);
            $profile_picture = str_replace('data:image/jpeg;base64,', '', $profile_picture);
            $profile_picture = str_replace('data:image/jpg;base64,', '', $profile_picture);
            $profile_picture = str_replace(' ', '+', $profile_picture);
            $data = base64_decode($profile_picture);
            $profile_picture_path = "images/".time().".".$extension;
            file_put_contents($profile_picture_path, $data);
            $profile_picture = $profile_picture_path;
        }

        $userdata = $request->except([
            'user_id',
            'company_name',
            'company_address1',
            'company_address2',
            'company_city',
            'company_state',
            'company_zip',
            'company_state_license_no',
            'company_nmls_license_no',
        ]);
        $userdata['profile_picture'] = $profile_picture;
        $user = User::updateOrCreate(
            [
                'id' => $request->id,
            ],
            $userdata
        );

        // $business_info = $request->only([
        //     'user_id',
        //     'company_name',
        //     'company_address1',
        //     'company_address2',
        //     'company_city',
        //     'company_state',
        //     'company_zip',
        //     'company_state_license_no',
        //     'company_nmls_license_no',
        // ]);

        // $business_info = \App\UserBusinessInfo::updateOrCreate(
        //     [
        //         'user_id' => $user->id,
        //     ],
        //     $business_info
        // );

        if(isset($request->password)) {
            $user->password = bcrypt($request->password);
            $user->save();
        }

       
        return response()->json([
            'success' => true,
            'data' => $user
        ],200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $user = User::find($id);


        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User with id ' . $id . ' not found'
            ], 400);
        }

        return response()->json([
            'success' => true,
            'data' => $user
        ],200);
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
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User with id ' . $id . ' not found'
            ], 400);
        }

        $updated = $user->fill($request->all())->save();

        if($request->password != '') {
            $user->password = bcrypt($request->password);
            $user->save();
        }

        if ($updated)
            return response()->json([
                'success' => true,
            ],200);
        else
            return response()->json([
                'success' => false,
                'message' => 'User could not be updated'
            ], 500);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User with id ' . $id . ' not found'
            ], 400);
        }
        $user->status = $user->status == 'Deactivated' ? 'Active' : 'Deactivated';
        if ($user->save()) {
            return response()->json([
                'success' => true,
            ],200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'User could not be Deactivated'
            ], 500);
        }
    }


    public function getLoanOfficers() {
        $loan_officers = \App\User::whereIn('role',['Loan Officer','Loan Officer Assistant'])->get();

        return response()->json([
            'success' => true,
            'data' => $loan_officers
        ]);
    }
   
}
