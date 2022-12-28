<?php

namespace App;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
class User extends Authenticatable
{
    // use HasApiTokens, Notifiable;

    use HasApiTokens, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    // protected $fillable = [
    //     'first_name','last_name', 'username', 'email', 'password','role','status','init_login'
    // ];

    protected $guarded = [];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'init_login' => 'boolean',
    ];

    public function findForPassport($identifier) {
            return $this->orWhere('email', $identifier)->orWhere('username', $identifier)->first();
    }

    public function user_business_info() {
        return $this->hasOne('App\UserBusinessInfo','user_id');
    }
}
