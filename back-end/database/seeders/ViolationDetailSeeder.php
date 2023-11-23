<?php

namespace Database\Seeders;

use App\Models\ViolationDetail;
use Illuminate\Database\Seeder;

class ViolationDetailSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        ViolationDetail::create([
            'violation_type_id' => 1,
            'rental_detail_id' => 1,
            'note' => 'Exceeded speed limit',
            'violation_cost' => 20.00,
        ]);

        ViolationDetail::create([
            'violation_type_id' => 2,
            'rental_detail_id' => 2,
            'note' => 'Illegal parking',
            'violation_cost' => 30.00,
        ]);
    }
}
