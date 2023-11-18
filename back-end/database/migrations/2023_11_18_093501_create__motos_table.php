<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMotosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('motos', function (Blueprint $table) {
            $table->increments('moto_id')->unsigned(); // Khóa chính không tự động tăng
            $table->string('moto_name');
            $table->string('brand');
            $table->string('status');
            $table->string('moto_license_plates');
            $table->string('moto_type');
            $table->decimal('rent_cost', 10, 2); // Giả sử RentCost là kiểu số có 2 chữ số thập phân
            $table->string('slug');
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('Moto');
    }
}
