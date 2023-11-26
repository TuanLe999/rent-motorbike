<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ViolationDetail;
use App\Models\ViolationType;
use App\Models\Moto;

class ViolationController extends Controller
{
    //
    public function addViolation(Request $request){

        try {
            $data = $request->all();

            $violation_type = ViolationType::where('violation_type_id','=', $data['violation_type_id'])->first();

            if (!$violation_type) {
                return response()->json(['status' => 'error', 'message' => 'violation_type not found'], 404);
            }

            $violationDetail = new ViolationDetail;
            $violationDetail->rental_detail_id = $data['rental_detail_id'];
            $violationDetail->violation_type_id = $data['violation_type_id'];
            $violationDetail->note = $data['note'];
            $violationDetail->violation_cost = $data['cost'];
            $violationDetail->save();

            $moto = Moto::find($data['moto_id']);

            if (!$moto) {
                return response()->json(['status' => 'error', 'message' => 'Moto not found'], 404);
            }

            $moto->status = $violation_type->violation_content;
            $moto->save();

            return response()->json(['status' => 'success', 'message' => 'Success'], 200);
        } catch(\Exception $e){
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function getAllViolation(Request $request)
    {
        $query = ViolationDetail::join('moto_rental_details', 'moto_rental_details.rental_detail_id', '=', 'violation_details.rental_detail_id')
            ->join('motos', 'motos.moto_id', '=', 'moto_rental_details.moto_id')
            ->join('violation_types', 'violation_types.violation_type_id', '=', 'violation_details.violation_id')
            ->select('violation_details.*', 'motos.moto_name', 'violation_types.violation_content');

        if ($request->has('q')) {
            $query->where(function ($query) use ($request) {
                $query->where('motos.moto_name', 'like', '%' . $request->input('q') . '%')
                    ->orWhere('violation_types.violation_content', 'like', '%' . $request->input('q') . '%');
            });
        }

        $data = $query->get();

        return response()->json($data);
    }
}
