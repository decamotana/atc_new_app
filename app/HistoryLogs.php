<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class HistoryLogs extends Model
{
    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo('App\User', 'updated_by_id', 'id');
    }
}
