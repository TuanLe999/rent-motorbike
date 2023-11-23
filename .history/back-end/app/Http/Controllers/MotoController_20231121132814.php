<?php

namespace App\Http\Controllers;

use App\Models\Moto;
use Illuminate\Http\Request;

class MotoController extends Controller
{
    public function GetAllMoto()
    {
        $data = Moto::all() ;
        return response()->json($data);
    }
}
