<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    { }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    { }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $user = \App\User::where('id', $request->id)->first();



        $data = [
            "id" => $user->go_high_level_id,
            "title" => $request->title,
            "description" => $request->description,
            "dueDate" => $request->dueDate,
        ];

        $response = $this->postGoHighLevelTask($data);

        if (in_array('message', $response['id'])) {
            return response()->json([
                'error' => true,
                'data' =>   $response['id']['message'],
            ], 200);
        }

        //     $task =  \App\UserTask::create([
        //         "user_id"                   => $user->id,
        //         "task_go_high_level_id"     => $response['id'],
        //         "title"                     => $response['title'],
        //         "description"               => $response['description'],
        //         "dueDate"                   => $response['dueDate']
        //    ]);

        //    return response()->json([
        //     'success' => true,
        //     'data' =>   $task,
        // ], 200);


    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        if (auth()->user()->role === "User") {
            $user = auth()->user();
        } else {
            // $user = \App\User::where('id', '<>', 0)->where('id', $id)->orWhere('go_high_level_id', $id)->first();
            $user = \App\User::find($id);
        }

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'No user records found!'], 200);
        }


        // $checkUser = $this->checkGoHighlevelAPI($user->go_high_level_id);


        // if ($checkUser == null) {
        //     return response()->json([
        //         'error' => true,
        //     ], 500);
        // }

        // if (auth()->user()->role === "User") {
        //     $this->get_current_tag();
        // }


        // $data = $this->getGoHighlevelTask($user->go_high_level_id);
        $data = \App\UserTask::where("user_id", $user->id)->get();
        $tags = \App\UserTag::where('user_id', $user->id)->pluck('tag')->toArray();

        return response()->json([
            'success' => true,
            'data' => $data,
            'user_id' => $user,
            'tags' => $tags
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
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
}
