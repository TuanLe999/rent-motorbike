<?php

namespace App\Http\Controllers;

use App\Models\MotoRental;
use App\Models\MotoRentalDetail;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    //get all order
    public function getAllOrder(Request $request)
    {
        $page = $request->input('page', 1);
        $q = $request->input('q');
        $user_id = $request->input('user_id');

        $so_item = 10;
        $vt = ($page - 1) * $so_item;

        $data_don = DB::table('moto_rentals')
            ->join('users', 'moto_rentals.customer_id', '=', 'users.user_id')
            ->select('moto_rentals.*', 'users.fullname')
            ->orderByDesc('start_date')
            ->offset($vt)
            ->limit($so_item)
            ->when($q, function ($query) use ($q) {
                return $query->where('fullname', 'LIKE', '%' . $q . '%');
            })
            ->get();

        $soLuong = DB::table('moto_rentals')
            ->join('users', 'moto_rentals.customer_id', '=', 'users.user_id')
            ->when($q, function ($query) use ($q) {
                return $query->where('fullname', 'LIKE', '%' . $q . '%');
            })
            ->count();

        $soTrang = $this->getSoTrang($soLuong, $so_item);

        $data_chitiet = DB::table('moto_rental_details')
            ->join('motos', 'moto_rental_details.moto_id', '=', 'motos.moto_id')
            ->select('moto_rental_details.*', 'motos.moto_name', 'motos.moto_type', 'motos.brand', 'motos.moto_license_plates')
            ->get();

        $data_loi = DB::table('violation_details as ct')
            ->join('violation_types as lp', 'ct.violation_type_id', '=', 'lp.violation_type_id')
            ->select('ct.violation_id', 'lp.violation_content', 'ct.note', 'ct.violation_cost')
            ->get();

        $new_data_chitiet = $this->mergeData($data_chitiet, $data_loi, 'violation_id', 'loi');
        $new_data = $this->mergeData($data_don, $new_data_chitiet, 'rental_id', 'detail');

        return response()->json([
            'status' => 'success',
            'data' => $new_data->toArray(),
            'page' => $soTrang,
        ]);
    }


    // Get order by id
    public function getOrderByIdUser($id_user, $trang_thai = null)
    {
        $strSearch = ($trang_thai !== null) ? " AND status = '$trang_thai'" : "";

        $data_don = DB::select("SELECT * FROM moto_rentals WHERE customer_id = ?" . $strSearch . " ORDER BY start_date DESC", [$id_user]);

        $data_chitiet = DB::select("SELECT moto_rental_details.*, moto_name, moto_type, brand, moto_license_plates, images.url
                                    FROM moto_rental_details
                                    JOIN motos ON moto_rental_details.moto_id = motos.moto_id
                                    LEFT JOIN images ON moto_rental_details.moto_id = images.moto_id");

        $data_loi = DB::select("SELECT ct.violation_id as violation_id, lp.violation_content as violation_content, ct.note as note, ct.violation_cost as violation_cost
                                FROM violation_details as ct
                                JOIN violation_types as lp ON ct.violation_type_id = lp.violation_type_id");

        $dataHinhAnh = DB::select('SELECT * FROM images');

        foreach ($data_chitiet as $xe) {
            $xe->hinhAnh = [];
            foreach ($dataHinhAnh as $hinhAnh) {
                if ($xe->moto_id == $hinhAnh->moto_id) {
                    $xe->hinhAnh[] = getURLImg('url', $hinhAnh->url);
                }
            }
        }

        $new_data_chitiet = $this->mergeData($data_chitiet, $data_loi, "violation_id", "vialation");
        $new_data = $this->mergeData($data_don, $new_data_chitiet, "rental_id", "detail");

        return $this->printRs("SUCCESS", null, $new_data, true);
    }


    private function printRs($status, $message, $data, $hasPagination)
    {
        $response = [
            'status' => $status,
            'message' => $message,
            'data' => $data,
        ];

        if ($hasPagination) {
            $response['soTrang'] = 1; // Thay 1 bằng số trang thực tế nếu có
        }

        return response()->json($response);
    }

    private function getSoTrang($soLuong, $so_item)
    {
        return ceil($soLuong / $so_item);
    }

    private function mergeData($data, $dataToMerge, $key, $newKey)
    {
        foreach ($data as $item) {
            $item->$newKey = [];
            foreach ($dataToMerge as $mergeItem) {
                if ($item->$key == $mergeItem->$key) {
                    $item->$newKey[] = $mergeItem;
                }
            }
        }
        return $data;
    }

    private function connect()
    {
        try {
            // Lấy thông tin kết nối từ file cấu hình
            $databaseConfig = config('database.connections.mysql');

            // Kết nối đến cơ sở dữ liệu
            $connection = DB::connection('rentmoto');

            return $connection;
        } catch (\Exception $e) {
            // Xử lý nếu có lỗi kết nối
            return response()->json(['status' => 'error', 'message' => 'Lỗi kết nối cơ sở dữ liệu', 'data' => null]);
        }
    }


    public function addOrder(Request $request)
    {
       
        $data = $request->all();
        $newRental = new MotoRental();
        $newRental->customer_id = $data["maKH"];
        $newRental->status = 'active';
        $newRental->start_date = Carbon::createFromFormat('d-m-Y', $data["ngayBD"]);
        $newRental->end_date = Carbon::createFromFormat('d-m-Y', $data["ngayKT"]);;
        $newRental->save();
        
        $newRecordId = $newRental->rental_id;
        $newRecord = MotoRental::find($newRecordId);

        return response()->json(['data' => $newRecord]);
    }
}
