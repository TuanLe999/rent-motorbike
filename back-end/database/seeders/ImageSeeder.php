<?php

namespace Database\Seeders;

use App\Models\Image;
use Illuminate\Database\Seeder;

class ImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Image::create([
            'moto_id' => 1,
            'url' => 'path/to/image1.jpg',
        ]);

        Image::create([
            'moto_id' => 2,
            'url' => 'path/to/image2.jpg',
        ]);
    }
}
