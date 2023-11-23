<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMotoRentalDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('moto_rental_details', function (Blueprint $table) {
            $table->increments('rental_detail_id');
            $table->unsignedInteger('moto_id');
            $table->foreign('moto_id')->references('moto_id')->on('motos');
            $table->unsignedInteger('received_staff_id')->nullable();
            $table->foreign('received_staff_id')->references('user_id')->on('users');
           
            // $table->foreign('violation_id')->references('violation_id')->on('violation_details');
            $table->unsignedInteger('rental_id');
            $table->foreign('rental_id')->references('rental_id')->on('moto_rentals');
            $table->decimal('rent_cost', 10, 2);
            $table->date('return_date');
           
            
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
        Schema::dropIfExists('moto_rental_details');
    }
}
