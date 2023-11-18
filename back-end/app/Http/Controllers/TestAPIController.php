<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TestAPIController extends Controller
{
    public function index()
    {
        $data =  "tuanlee";
        return response()->json($data);
    }
    public function hello(Request $request)
    {
        $id = $request->input('id');
        
        $data =  "hello $id";
        return response()->json($data);
    }


}
