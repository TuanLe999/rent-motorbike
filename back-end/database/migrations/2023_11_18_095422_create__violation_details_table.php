<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateViolationDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        Schema::create('violation_details', function (Blueprint $table) {
            $table->increments('violation_id');
            $table->unsignedInteger('rental_detail_id');
            $table->foreign('rental_detail_id')->references('rental_detail_id')->on('moto_rental_details');
            $table->unsignedInteger('violation_type_id');
            $table->text('note')->nullable();
            $table->decimal('violation_cost', 10, 2)->nullable();
            $table->timestamps();
            $table->foreign('violation_type_id')->references('violation_type_id')->on('violation_types');
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
        Schema::dropIfExists('ViolationDetail');
    }
}
