<?php


use App\Http\Controllers\Api\ResetPasswordController;
use App\Http\Controllers\Api\StatisticController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\MotoController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\TestAPIController;
use Illuminate\Http\Request;
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
Route::post('change-password', [ResetPasswordController::class,'resetPassword']);

// User
Route::post('updateProfileUser', [UserController::class, 'updateProfileUser']);
Route::post('updateAvatar', [UserController::class, 'updateAvatar']);
Route::post('lockAccount', [UserController::class,'lockAccount']);
Route::get('getAllUser', [UserController::class, 'getAllUser']);

// Statistic
Route::get('statisticMoto', [StatisticController::class,'Moto']);
Route::get('statisticOrder', [StatisticController::class,'Order']);
Route::get('statisticUser', [StatisticController::class,'User']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/test',[TestAPIController::class, 'index']);
Route::get('/test/hello',[TestAPIController::class, 'hello']);

Route::get('/image',[ImageController::class, 'index']);

Route::get('/moto',[MotoController::class, 'GetAllMoto']);

//Order

Route::get('/getAllOrder',[OrderController::class, 'getAllOrder']);

Route::post('/addOrder', [OrderController::class, 'addOrder']);

Route::get('/GetOrderByIdUser/{id_user}', [OrderController::class, 'GetOrderByIdUser']);

Route::post('/payOrder', [OrderController::class, 'payOrder']);


//ROUTE ABOUT MOTOR
Route:: prefix('/admin') -> group(function () {
    Route::get('/getAllMotorbike',[MotoController::class, 'getAllMoto']);
    Route::get('/getMotorBySlug/{slug}', [MotoController::class, 'getMotorBySlug']);
    Route::post('/addMotorbike',[MotoController::class, 'createMoto']);
    Route::post('/updateMotorbike/{moto_id}',[MotoController::class, 'updateMoto']);
});