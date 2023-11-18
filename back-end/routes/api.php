<?php


use App\Http\Controllers\Api\ResetPasswordController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Auth
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::get('verify/{token}', [AuthController::class, 'verifyToken']);

// Reset password
Route::post('reset-password', [ResetPasswordController::class, 'sendMail']);
Route::put('reset-password/{token}', [ResetPasswordController::class,'resetPassword']);

// User
Route::post('updateProfileUser', [UserController::class, 'updateProfileUser']);
Route::post('lockAccount', [UserController::class,'lockAccount']);


