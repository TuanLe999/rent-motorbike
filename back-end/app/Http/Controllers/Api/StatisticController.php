<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Moto;
use App\Models\MotoRental;
use App\Models\MotoRentalDetail;
use App\Models\User;
use Illuminate\Http\Request;

class StatisticController extends Controller
{
    //
    public function Moto()
    {

        $totalMoto = Moto::count();

        $totalMotoActive = Moto::where('status', 'Hoạt động')->count();

        $totalMotoUnActive = Moto::where('status', 'Ngưng hoạt động')->count();

        $totalMotoLost = Moto::where('status', 'Đã mất')->count();

        return response()->json([
                'message' => 'Successfully',
                'moto' => [
                    'totalMoto' => $totalMoto,
                    'totalMotoActive' => $totalMotoActive,
                    'totalMotoUnActive' => $totalMotoUnActive,
                    'totalMotoLost' => $totalMotoLost
                ]
        ]);
    }

    public function Order() 
    {
        $totalOrder = MotoRental::count();

        $totalOrderConfirmed = MotoRental::where('status', 'Đã duyệt')->count();

        $totalOrderReturned = MotoRental::where('status', 'Hoàn tất')->count();

        $totalMoney = MotoRentalDetail::whereNotNull('return_date')->sum('rent_cost');
        
        return response()->json([
                'message' => 'Successfully',
                'order' => [
                    'totalOrder' => $totalOrder,
                    'totalOrderConfirmed' => $totalOrderConfirmed,
                    'totalOrderReturned' => $totalOrderReturned,
                    'totalMoney' => $totalMoney
                ]
        ]);
    }

    public function User()
    {
        $totalUser = User::count();

        $totalEmployee = User::where('role', 'Nhân viên')->count();

        $totalCustomer = User::where('role', 'Khách hàng')->count();

        $totalUserVerifyYet = User::whereNotNull('email_verified_at')->count();

        return response()->json([
                'message' => 'Successfully',
                'user' => [
                    'totalUser' => $totalUser,
                    'totalEmployee' => $totalEmployee,
                    'totalCustomer' => $totalCustomer,
                    'totalUserVerifyYet' => $totalUserVerifyYet
                ]
        ]);

    }
}
