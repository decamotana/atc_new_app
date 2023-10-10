<?php

use App\UserStages;
use Illuminate\Database\Seeder;

class UserStageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $stages = [
            "App Analysis",
            "Client Stage",
            "Set Appt.",
            "Development",
            "Publish",
            "Complete",
        ];


        $stages_description = [
            '<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry.</p>',
            '<p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. </p>',
            '<p>Various versions have <strong>evolved over the years</strong>, sometimes by accident, sometimes on purpose (injected humour and the like).</p>',
            '<p>discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero</p>',
            '<p>The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum"</p>',
            '<p>to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc</p>',
        ];

        foreach ($stages as $key => $stage) {

            UserStages::create([
                'title' => $stage,
                'description' =>  $stages_description[$key]

            ]);
        }
    }
}
