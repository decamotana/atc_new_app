<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Consultants extends Model
{
    protected $guarded = [];

    public function consulatant()
    {
        return $this->hasMany('App\AppointmentConsultant', 'id', 'user_id');
    }
}
