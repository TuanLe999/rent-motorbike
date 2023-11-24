<?php

namespace Database\Seeders;

use App\Models\Image;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $motoId = DB::table('motos')->where('moto_id', '1')->value('moto_id');
        $motoId2 = DB::table('motos')->where('moto_id', '2')->value('moto_id');

        // Thêm dữ liệu cho bảng images
        DB::table('images')->insert([
            'moto_id' => $motoId,
            'url' => 'getUrlImg/imgXe/vario1.png',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('images')->insert([
            'moto_id' => $motoId,
            'url' => 'getUrlImg/imgXe/vario2.png',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('images')->insert([
            'moto_id' => $motoId2,
            'url' => 'getUrlImg/imgXe/vario1.png',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('images')->insert([
            'moto_id' => $motoId2,
            'url' => 'getUrlImg/imgXe/vario2.png',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

    }
}
