<?php

namespace Database\Seeders;

use App\Models\ViolationType;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(UserSeeder::class);
        $this->call(MotoSeeder::class);
        $this->call(ImageSeeder::class);
        $this->call(ViolationTypeSeeder::class);
        $this->call(MotoRentalSeeder::class);
        $this->call(MotoRentalDetailSeeder::class);
        $this->call(ViolationDetailSeeder::class);
    }
}
