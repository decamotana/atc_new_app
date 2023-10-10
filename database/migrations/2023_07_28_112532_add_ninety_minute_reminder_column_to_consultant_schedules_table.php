<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddNinetyMinuteReminderColumnToConsultantSchedulesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('consultant_schedules', function (Blueprint $table) {
            $table->tinyInteger('sent_ninety_minutes_reminder')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('consultant_schedules', function (Blueprint $table) {
            //
        });
    }
}
