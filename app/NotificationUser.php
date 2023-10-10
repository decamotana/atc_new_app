<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class NotificationUser extends Model
{
    protected $guarded = [];

    public function notification()
    {
        return $this->belongsTo('\App\Notification', 'notification_id');
    }

    public function user()
    {
        return $this->belongsTo('\App\User', 'user_id');
    }
}
