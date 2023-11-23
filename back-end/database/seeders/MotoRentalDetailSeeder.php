<?php

namespace Database\Seeders;

use App\Models\MotoRentalDetail;
use Illuminate\Database\Seeder;

class MotoRentalDetailSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        MotoRentalDetail::create([
            'rental_id' => 1,
            'moto_id' => 1,
            'rent_cost' => 60.00,
            'return_date' => '2023-01-15',
            'received_staff_id' => 1,
        ]);

        MotoRentalDetail::create([
            'rental_id' => 2,
            'moto_id' => 1,
            'rent_cost' => 70.00,
            'return_date' => '2023-02-01',
            'received_staff_id' => 1,
        ]);
    }
}
