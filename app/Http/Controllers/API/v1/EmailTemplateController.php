<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\EmailTemplate;

class EmailTemplateController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = EmailTemplate::all();

        return response()->json([
            'success' => true,
            'data' => $data
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if ($request->list) {
            foreach ($request->list as $value) {
                if (!empty($value['id'])) {
                    $EmailTemplate = EmailTemplate::find($value['id']);

                    $data = ['title' => $value['title']];

                    if (!empty($value['subject'])) {
                        $data['subject'] = $value['subject'];
                    }
                    if (!empty($value['body'])) {
                        $data['body'] = $value['body'];
                    }

                    $EmailTemplate->fill($data)->save();
                } else {
                    $data = ['title' => $value['title']];

                    if (!empty($value['subject'])) {
                        $data['subject'] = $value['subject'];
                    }
                    if (!empty($value['body'])) {
                        $data['body'] = $value['body'];
                    }
                    EmailTemplate::create($data);
                }
            }
        }

        $data = EmailTemplate::all();
        return response()->json([
            'success' => true,
            'data' => $data
        ], 200);
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


    public function add_email_template(Request $request)
    {

        $add_email = \App\EmailTemplate::create([
            'title' => $request->title,
            'subject' => $request->subject,
            'body' => $request->content
        ]);


        if ($add_email) {
            return response()->json([
                'success' => true,
                'message' => 'New template successfully added'
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong while adding template'
            ], 200);
        }
    }
}
