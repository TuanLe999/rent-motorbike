<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMotoRentalsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('moto_rentals', function (Blueprint $table) {
            $table->increments('rental_id')->unsigned(); 
            $table->unsignedInteger('customer_id')->nullable();
            $table->foreign('customer_id')->references('user_id')->on('users'); // Khóa ngoại liên kết với bảng 'users' cho trường 'CustomerId'
            $table->string('status')->nullable();
            $table->unsignedInteger('censor_id')->nullable();
            $table->foreign('censor_id')->references('user_id')->on('users')->nullable(); // Khóa ngoại liên kết với bảng 'users' cho trường 'CensorId'
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->date('censorship_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('MotoRental');
    }
}
