<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('user_id')->unsigned(); // Khóa chính không tự động tăng
            $table->string('email')->unique();
            $table->string('password');
            $table->string('fullname');
            $table->string('role')->nullable();
            $table->string('status')->nullable();
            $table->date('dob')->nullable();
            $table->string('card_id')->nullable();
            $table->string('phone_number')->nullable();
            $table->string('address')->nullable();
            $table->string('gender')->nullable();
            $table->string('avatar')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('verification_token')->nullable();
            $table->rememberToken();
            $table->softDeletes(); // Thêm cột deleted_at để theo dõi trạng thái xóa mềm
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
        Schema::dropIfExists('User');
    }
}
