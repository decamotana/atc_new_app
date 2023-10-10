<?php

use App\AssessorInfo;
use App\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $default = urlencode('https://ui-avatars.com/api/john/100/0D8ABC/fff/2/0/1');
        $img =  'https://www.gravatar.com/avatar/' . md5(strtolower(trim('admin@test.com'))) . '?d=' . $default;
        User::create([
            'email' => 'admin@test.com',
            'username' => 'admin',
            'email_verified_at' => now(),
            'password' => Hash::make('Admin123!'),
            'firstname' => 'John',
            'lastname' => 'Admin',
            'role' => 'Admin',
            'status' => 'Active',
            'remember_token' => Str::random(10),
            'profile_image' => $img
        ]);

        // $default = urlencode('https://ui-avatars.com/api/caregiver/100/0D8ABC/fff/2/0/1');
        // $img =  'https://www.gravatar.com/avatar/' . md5(strtolower(trim('caregiver@test.com'))) . '?d=' . $default;
        // User::create([
        //     'email' => 'caregiver@test.com',
        //     'username' => 'caregiver',
        //     'email_verified_at' => now(),
        //     'password' => Hash::make('admin123'),
        //     'firstname' => 'Jane',
        //     'lastname' => 'CareGiver',
        //     'role' => 'Cancer Caregiver',
        //     'status' => 'Active',
        //     'remember_token' => Str::random(10),
        //     'profile_image' => $img
        // ]);

        // $default = urlencode('https://ui-avatars.com/api/careprofessional/100/0D8ABC/fff/2/0/1');
        // $img =  'https://www.gravatar.com/avatar/' . md5(strtolower(trim('careprofessional@test.com'))) . '?d=' . $default;
        // User::create([
        //     'email' => 'careprofessional@test.com',
        //     'username' => 'careprofessional',
        //     'email_verified_at' => now(),
        //     'password' => Hash::make('admin123'),
        //     'firstname' => 'John',
        //     'lastname' => 'CareProfessional',
        //     'role' => 'Cancer Care Professional',
        //     'status' => 'Active',
        //     'remember_token' => Str::random(10),
        //     'profile_image' => $img
        // ]);
    }
}
