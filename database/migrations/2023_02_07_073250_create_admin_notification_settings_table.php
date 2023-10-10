<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAdminNotificationSettingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {



        Schema::create('admin_notification_settings', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id');
            $table->boolean('sms_notif_90_under')->default(false)->nullable();
            $table->boolean('sms_notif_90_over')->default(false)->nullable();
            $table->boolean('email_notif_90_under')->default(false)->nullable();
            $table->boolean('email_notif_90_over')->default(false)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('admin_notification_settings');
    }
}
