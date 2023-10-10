<?php

use Illuminate\Database\Seeder;
use App\AdminNotificationSettings;
use App\User;


class AdminNotificationSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $admin = User::where('role', 'Admin')->first();

        AdminNotificationSettings::create([
            'user_id' => $admin->id

        ]);
    }
}
