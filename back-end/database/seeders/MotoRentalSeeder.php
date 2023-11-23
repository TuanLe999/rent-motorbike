<?php

namespace Database\Seeders;

use App\Models\MotoRental;
use Illuminate\Database\Seeder;

class MotoRentalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        MotoRental::create([
            'customer_id' => 1,
            'status' => 'active',
            'censor_id' => null,
            'start_date' => '2023-01-01',
            'end_date' => '2023-01-31',
            'censorship_date' => null,
        ]);

        MotoRental::create([
            'customer_id' => 2,
            'status' => 'inactive',
            'censor_id' => null,
            'start_date' => '2023-02-01',
            'end_date' => '2023-02-28',
            'censorship_date' => null,
        ]);
    }
}
