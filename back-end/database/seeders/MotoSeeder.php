<?php

namespace Database\Seeders;

use App\Models\Moto;
use Illuminate\Database\Seeder;

class MotoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Moto::create([
            'moto_name' => 'Moto1',
            'brand' => 'Honda',
            'status' => 'available',
            'moto_license_plates' => 'ABC123',
            'moto_type' => 'Scooter',
            'rent_cost' => 50.00,
            'slug' => 'moto1',
            'description' => 'This is Moto 1.',
        ]);

        Moto::create([
            'moto_name' => 'Moto2',
            'brand' => 'Yamaha',
            'status' => 'available',
            'moto_license_plates' => 'XYZ789',
            'moto_type' => 'Sport',
            'rent_cost' => 60.00,
            'slug' => 'moto2',
            'description' => 'This is Moto 2.',
        ]);
    }
}
