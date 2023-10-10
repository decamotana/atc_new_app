<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddLastStageUploadedColumnOnDropboxUploadedFilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('dropbox_uploaded_files', function (Blueprint $table) {
            $table->string('last_uploaded_stage')->after('stage')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('dropbox_uploaded_files', function (Blueprint $table) {
            Schema::dropIfExists('last_uploaded_stage');
        });
    }
}
