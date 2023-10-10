<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\DropboxUploadedFiles;
use Dcblogdev\Dropbox\Facades\Dropbox;
use Ixudra\Curl\Facades\Curl;
use File;

class DropboxController extends Controller
{
    public function download_file(Request $request)
    {
       $user = \App\User::where('id', $request->id)->where('id', '<>', 0)->orWhere('go_high_level_id', $request->id)->first();

       $filePath = DropboxUploadedFiles::select('file_path')->where('id', $request->id)->first();

       $url = 'https://api.dropboxapi.com/2/files/get_temporary_link';

       $token = dropbox::getAccessToken();

       $params = [
          "path" =>  $filePath->file_path,
       ];

       $response = Curl::to($url)
          ->withData(json_encode($params))
          ->withHeader('Content-Type: application/json')
          ->withHeader('Authorization: Bearer ' . $token)
          ->post();

       \Log::info('Download _____');
       \Log::info($response);
       $link = json_decode($response)->link;

       $image_data = base64_encode(file_get_contents($link));


       return response()->json(['success' => true, 'image_data' => $image_data, 'data'  =>  $link], 200);
    }

    public function preview_file(Request $request)
    {

       $filePath = DropboxUploadedFiles::select('file_path')->where('id', $request->id)->first();

       $url = 'https://api.dropboxapi.com/2/files/get_temporary_link';

       $token = dropbox::getAccessToken();

       $params = [
          "path" =>  $filePath->file_path,
       ];

       $response = Curl::to($url)
          ->withData(json_encode($params))
          ->withHeader('Content-Type: application/json')
          ->withHeader('Authorization: Bearer ' . $token)
          ->post();

       $file_data = json_decode($response);
       $link = $file_data->link;

       $extension = explode('.', $file_data->metadata->name);

       $image_data = base64_encode(file_get_contents($link));


       return response()->json(['success' => true, 'file_data' => $file_data, 'filename' =>  $extension[1], 'data'  =>  $image_data], 200);
    }


    public function get_dropbox_list(Request $request)
    {

       $get_user = auth()->user();

       if ($get_user->role != 'User') {
          if (is_numeric($request->id)) {

             $user = \App\User::where('id', $request->id)->first();
          } else {

             $user = \App\User::where('go_high_level_id', $request->id)->first();
          }
       } else {
          $user = $get_user;
       }

       if (isset($request->sort_field)) {
          $sort_field = $request->sort_field != 'created_date' ? $request->sort_field : 'created_at';
       }

       $uploadedFiles = DropboxUploadedFiles::where('user_id', $user->id);
       $uploadedFiles = $uploadedFiles->with('user');


       if ($get_user->role == "User") {
          $uploadedFiles =  $uploadedFiles->whereHas('user', function ($q) {
             $q->where('role', 'User');
          });
       } else { }
       $uploadedFiles =  $uploadedFiles->orderBy(isset($sort_field)  ? $sort_field : 'id', isset($request->sort_order)  ? $request->sort_order : 'desc')->limit($request->page_size)
          ->paginate($request->page_size, ['*'], 'page', $request->page_number);

       $uploadedFiles->data =  $uploadedFiles->map(function ($q) {
          $q->uploader = $q->user['firstname'] . " " . $q->user['lastname'];
          $q->uploder_role = $q->user['role'];
          $q->created_date = \Carbon\Carbon::parse($q->created_at)->format('Y-m-d g:i A');
          return $q;
       });


       return response()->json([
          'success' => true,
          'data' => $uploadedFiles
       ], 200);
    }


    public function get_last_uploaded_stage()
    {
         $loggedUser = auth()->user();
         $lastStageUploaded = \App\DropboxUploadedFiles::where("uploaded_by", $loggedUser->id)->orderBy('id', 'desc')->first();

         return response()->json([
             'success' => true,
             'data' => $lastStageUploaded
         ]);
    }
}
