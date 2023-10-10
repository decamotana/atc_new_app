<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\UserStages;

class StageController extends Controller
{
    public function get_stages()
    {
        $stages = UserStages::all();

        return response()->json([
            'success' => true,
            'data' => $stages
        ]);
    }


    public function update_stages(Request $request)
    {

        $response = UserStages::where('id', $request->id)->update(['description' => $request->value]);

        if (!$response) {
            return response()->json([
                'success' => false,
                'error' => $response,
            ], 500);
        }

        return response()->json([
            'success' => true,
            'data' => $response
        ]);
    }
}
