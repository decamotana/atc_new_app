<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\UserTag;

class UserTagController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $data = new UserTag();

        if ($request->search) {
            $data = $data->where(function ($q) use ($request) {
                $q->orWhere('sport', 'LIKE', "%$request->search%");
            });
        }

        if ($request->sort_field && $request->sort_order) {
            if (
                $request->sort_field != '' && $request->sort_field != 'undefined' && $request->sort_field != 'null'  &&
                $request->sort_order != ''  && $request->sort_order != 'undefined' && $request->sort_order != 'null'
            ) {
                // if ($request->sort_field == "title") {
                //     //
                // } else {
                // }
                $data = $data->orderBy(isset($request->sort_field) ? $request->sort_field : 'id', isset($request->sort_order)  ? $request->sort_order : 'desc');
            }
        } else {
            $data = $data->orderBy('id', 'asc');
        }

        if ($request->page_size) {
            $data = $data->limit($request->page_size)
                ->paginate($request->page_size, ['*'], 'page', $request->page)
                ->toArray();
        } else {
            $data = $data->get();
        }

        return response()->json([
            'success' => true,
            'data' => $data,
            'request' => $request->all()
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
        if (isset($request->id)) {
            $sport = UserTag::updateOrCreate([
                'id' => $request->id
            ], [
                'sport' => $request->sport,
            ]);

            return response()->json([
                'success' => true,
                'data' =>  $sport
            ], 200);
        } else {
            $find = UserTag::where('sport', $request->sport)->first();

            if ($find) {
                return response()->json([
                    'success' => false,
                ], 200);
            }

            $sport = UserTag::create([
                'sport' => $request->sport,
            ]);
            return response()->json([
                'success' => true,
                'data' =>  $sport
            ], 200);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $sport = UserTag::find($id);
        if (!$sport) {
            return response()->json([
                'success' => false,
                'message' => 'Data not found'
            ], 400);
        }

        return response()->json([
            'success' => true,
            'data' => $sport
        ], 200);
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
        $update_query = UserTag::find($id);

        $updated_result = $update_query->fill($request->all());
        $updated_result = $updated_result->save();

        if ($updated_result)
            return response()->json([
                'success'       => true,
                'message'       => 'Sport',
                'description'   => 'Data updated successfully'
            ], 200);
        else
            return response()->json([
                'success'       => false,
                'message'       => 'Sport',
                'description'   => 'Data not updated'
            ], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $device = UserTag::find($id);

        if (!$device) {
            return response()->json([
                'success' => false,
                'message' => 'Sport not found'
            ], 400);
        } else {
            // \App\EventTag::where('tag', $device->sport)->delete();
            // \App\AthleteOrganization::where('sport', $device->sport)->update(['sport' => '']);
            // \App\CoachOrganization::where('sport', $device->sport)->update(['sport' => '']);
            // \App\AthleteWebsite::where('sport', $device->sport)->update(['sport' => '']);
        }

        if ($device->delete()) {
            return response()->json([
                'success' => true
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Sport could not be deleted'
            ], 500);
        }
    }
}
