<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ConsultantSchedule extends Model
{
    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo('App\User', 'user_id', 'id');
    }

    public function client()
    {
        return $this->belongsTo('App\User', 'booked_by', 'id');
    }

}
