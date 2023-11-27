<?php

namespace Database\Seeders;

use App\Models\Moto;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MotoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // DB::table('motos')->insert([
        //     'moto_name' => 'Honda VARIO 160',
        //     'brand' => 'Honda',
        //     'status' => 'Hoạt động',
        //     'moto_license_plates' => '92F1-128.46',
        //     'moto_type' => 'Xe ga',
        //     'rent_cost' => 180.00,
        //     'slug' => 'Honda-VARIO-160',
        //     'description' => 'Honda VARIO 160',
        //     'created_at' => now(),
        //     'updated_at' => now(),
        // ]);

        // DB::table('motos')->insert([
        //     'moto_name' => 'Honda Lead',
        //     'brand' => 'Honda',
        //     'status' => 'Hoạt động',
        //     'moto_license_plates' => '92F1-835.12',
        //     'moto_type' => 'Xe ga',
        //     'rent_cost' => 175.00,
        //     'slug' => 'Honda-Lead',
        //     'description' => 'Honda Lead',
        //     'created_at' => now(),
        //     'updated_at' => now(),
        // ]);
    }
}
