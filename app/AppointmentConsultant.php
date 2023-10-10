<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AppointmentConsultant extends Model
{
    protected $guarded = [];

    public function consulatant()
    {
        return $this->belongsTo('App\Consultant', 'user_id', 'id');
    }
}
