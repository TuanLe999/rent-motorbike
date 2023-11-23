<?php

namespace Database\Seeders;

use App\Models\ViolationType;
use Illuminate\Database\Seeder;

class ViolationTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        ViolationType::create([
            'violation_content' => 'Mất xe',
        ]);
        ViolationType::create([
            'violation_content' => 'Trễ hạn',
        ]);
        ViolationType::create([
            'violation_content' => 'Hư phụ tùng',
        ]);
        ViolationType::create([
            'violation_content' => 'Trầy xước xe',
        ]);
        ViolationType::create([
            'violation_content' => 'Khác',
        ]);
    }
}
