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
    // protected $indexConfigurator = \App\Scout\UserIndexConfigurator::class;
    // protected $searchRules = [
    //     \App\Scout\Rules\UsersSearchRule::class
    // ];



    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'email_verified_at',
        'username',
        'password',
        'firstname',
        'middlename',
        'lastname',
        'name_ext',
        'nick_name',
        'gender',
        'birthdate',
        'phone_number',
        'role',
        'status',
        'profile_image',
        'one_time_modal',
        'remember_token',
        'stripe_customer_id',
        'go_high_level_id',
        'go_high_level_location_id',
        'phone',
        'assigned_consultant'
    ];

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
    // protected $casts = [
    //     'email_verified_at' => 'datetime',
    //     'init_login' => 'boolean',
    //     'online_status' => 'boolean',
    //     'receive_alerts' => 'boolean',
    // ];

    // public function formdataresponse() {
    //     return $this->hasMany('App\FormDataResponse','created_by');
    // }

    public function user_address()
    {
        return $this->hasOne('App\UserAddress', 'user_id');
    }


    public function appointment_consultant()
    {
        return $this->hasMany('App\AppointmentConsultant', 'user_id');
    }

    public function user_consultant()
    {
        return $this->belongsTo('App\Consultants', 'assigned_consultant');
    }

    public function user_billing_address()
    {
        return $this->hasMany('App\UserBillingAddress', 'user_id');
    }

    public function user_notification()
    {
        return $this->hasMany('App\UserNotification', 'user_id');
    }

    public function user_plan()
    {
        return $this->hasMany('App\UserPlan', 'user_id');
    }

    public function user_payment()
    {
        return $this->hasMany('App\UserPayment', 'user_id');
    }

    public function attachments()
    {
        return $this->morphMany(Attachment::class, 'attachmentable');
    }

    public function historyable()
    {
        return $this->morphMany(History::class, 'historyable');
    }

    public function getTableColumns()
    {
        return $this->getConnection()->getSchemaBuilder()->getColumnListing($this->getTable());
    }

    public function submitted()
    {
        return $this->belongsTo('App\TicketResponse', 'submitted_by', 'id');
    }

    public function requester()
    {
        return $this->belongsTo('App\Tickets', 'requester');
    }

    public function asssigned()
    {
        return $this->belongsTo('App\Tickets', 'asssigned');
    }
    public function task()
    {
        return $this->hasMany('App\UserTask', 'id', 'user_id');
    }
    public function schedule()
    {
        return $this->hasMany('App\ConsultantSchedule', 'id', 'user_id');
    }
    public function consultant()
    {
        return $this->belongsTo('App\User', 'assigned_consultant');
    }

    public function consultant_schedule()
    {
        return $this->hasMany('App\ConsultantSchedule', 'user_id');
    }
}
