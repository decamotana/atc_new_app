<?php

namespace App\Http\Middleware;

use Closure;

class GCApiToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $api_key = $request->header('Authorization');
        if ($api_key) {
            $api_key = \App\GiftCardApiKey::where('api_key', $api_key)->get();
            if($api_key->isEmpty()) {
                return response()->json('Unauthorized', 401);
            }
            return $next($request);
        } else {
            return response()->json('Unauthorized', 401);
        }
    
        
    }
}
