<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $guarded = [];

    public function notification_user()
    {
        return $this->hasMany('\App\NotificationUser', 'notification_id', 'id');
    }
}

