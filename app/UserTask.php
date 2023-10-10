<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserTask extends Model
{
    protected $guarded = [];

    public function user(){
       return $this->belongsTo('App\User', 'user_id');
    }
}
