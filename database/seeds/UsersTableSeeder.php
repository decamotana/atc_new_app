<?php

use Illuminate\Database\Seeder;
use App\User;
class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create(
            [
                'first_name' => 'Super',
                'last_name' => 'Admin',
                'email' => 'admin@test.com',
                'username' => 'admin',
                'role' => 'Super Admin',
                'status' => 'Active',
                'password' => bcrypt('admin123')
            ] 
        );
    }
}
