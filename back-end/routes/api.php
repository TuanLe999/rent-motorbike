<?php

use App\Http\Controllers\ImageController;
use App\Http\Controllers\MotoController;
use App\Http\Controllers\TestAPIController;
use App\Models\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/test',[TestAPIController::class, 'index']);
Route::get('/test/hello',[TestAPIController::class, 'hello']);

Route::get('/image',[ImageController::class, 'index']);

Route::get('/moto',[MotoController::class, 'GetAllMoto']);
