<?php

namespace App\Http\Controllers\API\v1;

use App\Client;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        
        $users = \App\Client::select([
                \DB::raw("(SELECT GROUP_CONCAT( CONCAT(first_name,' ',last_name) SEPARATOR ', ' )  FROM  users  WHERE id IN ( SELECT user_id FROM client_real_estate_agents WHERE client_id = clients.id )) as `real_estate_agents`"),
                'clients.*'
            ])->where(function($q) use ($request) {
            if($request->search) {
                $search = str_replace(' ','+',$request->search);
                $q->orWhere('client_name','LIKE',"%$search%");
                $q->orwhere(\DB::raw("(SELECT GROUP_CONCAT( CONCAT(first_name,' ',last_name) SEPARATOR ', ' )  FROM  users  WHERE id IN ( SELECT user_id FROM client_real_estate_agents WHERE client_id = clients.id ))"),'LIKE',"%$search%");
                $q->orwhere(\DB::raw('CONCAT(borrower1_first_name," ",borrower1_last_name)'),'LIKE',"%$search%");
                $q->orwhere(\DB::raw('CONCAT(borrower2_first_name," ",borrower2_last_name)'),'LIKE',"%$search%");
                $q->orwhere(\DB::raw('CONCAT(borrower3_first_name," ",borrower3_last_name)'),'LIKE',"%$search%");
                // $q->orWhere(\DB::raw('(SELECT CONCAT(first_name," ",last_name) FROM users WHERE id=clients.real_estate_agent_id)'),'LIKE',"%$search%");
                $q->orWhere('created_at','LIKE',"%$search%");
            }
        });

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
                'client_name' => 'required',
            ]);
        } else {
            // $this->validate($request, [
            //     'email' => 'required|email',
            //     'username' => 'required',
            // ]);
        }
        
        $client_data = $request->except(['loan_officers','loan_officer_assistants','real_estate_agents']);
        $client = Client::updateOrCreate(
            [
                'id' => $request->id,
            ],
            $client_data
        );

        // LOAN OFFICERS
        
        if(isset($request->loan_officers)) {
            $loan_officers_data = [];
            foreach ($request->loan_officers as $key => $loan_officer) {
                $loan_officers_data[] = [
                    'client_id' => $client->id,
                    'user_id' => $loan_officer
                ];
            }
    
            $loan_officers = \App\ClientLoanOfficer::where('client_id',$client->id)->delete();
            $loan_officers = \App\ClientLoanOfficer::insert($loan_officers_data);
        }
        

        // LOAN OFFICER ASSISTANTS
        
        if(isset($request->loan_officer_assistants)) {
            $loan_officer_assistants_data = [];
            foreach ($request->loan_officer_assistants as $key => $loan_officer_assistant) {
                $loan_officer_assistants_data[] = [
                    'client_id' => $client->id,
                    'user_id' => $loan_officer_assistant
                ];
            }
    
            $loan_officer_assistants = \App\ClientLoanOfficerAssistant::where('client_id',$client->id)->delete();
            $loan_officer_assistants = \App\ClientLoanOfficerAssistant::insert($loan_officer_assistants_data);
        }
        

        // REAL ESTATE AGENT
        
        if(isset($request->real_estate_agents)) {
            $real_estate_agents_data = [];
            foreach ($request->real_estate_agents as $key => $real_estate_agent) {
                $real_estate_agents_data[] = [
                    'client_id' => $client->id,
                    'user_id' => $real_estate_agent
                ];
            }

            $real_estate_agents = \App\ClientRealEstateAgent::where('client_id',$client->id)->delete();
            $real_estate_agents = \App\ClientRealEstateAgent::insert($real_estate_agents_data);
        }
        

       
       
        return response()->json([
            'success' => true,
            'data' => $client
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
        $user = Client::with(['loan_officers','loan_officer_assisstants','real_estate_agents'])->find($id);


        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Client with id ' . $id . ' not found'
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
        $user = Client::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Client with id ' . $id . ' not found'
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
                'message' => 'Client could not be updated'
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
        $user = Client::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Client with id ' . $id . ' not found'
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
                'message' => 'Client could not be Deactivated'
            ], 500);
        }
    }


    public function getLoanOfficers() {
        $loan_officers = \App\Client::whereIn('role',['Loan Officer','Loan Officer Assistant'])->get();

        return response()->json([
            'success' => true,
            'data' => $loan_officers
        ]);
    }
   
}
