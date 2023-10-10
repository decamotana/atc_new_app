<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeTypeUploadedByOnDropboxUploadedFilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('dropbox_uploaded_files', function (Blueprint $table) {
            \DB::statement("ALTER TABLE `dropbox_uploaded_files` CHANGE `uploaded_by` `uploaded_by` int;");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
