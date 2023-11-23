<?php

namespace App\Http\Controllers;


use App\Models\MotoRental;
use App\Models\MotoRentalDetail;
use App\Models\User;
use App\Models\Moto;
use App\Models\ViolationDetail;
use App\Models\ViolationType;
use App\Models\Image;
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
        $so_item = 10;
        $vt = ($page - 1) * $so_item;

        // Lấy danh sách đơn
        $data_don = MotoRental::join('users', 'moto_rentals.customer_id', '=', 'users.user_id')
            ->select('moto_rentals.*', 'users.fullname')
            ->orderByDesc('start_date')
            ->when($q, function ($query) use ($q) {
                return $query->where('fullname', 'LIKE', '%' . $q . '%');
            })
            ->offset($vt)
            ->limit($so_item)
            ->get();

        // Đếm số lượng đơn
        $soLuong = MotoRental::when($q, function ($query) use ($q) {
            return $query->whereHas('customer', function ($subquery) use ($q) {
                $subquery->where('fullname', 'LIKE', '%' . $q . '%');
            });
        })
        ->count();

        // Tính số trang
        $soTrang = $this->getSoTrang($soLuong, $so_item);

        // Lấy chi tiết đơn
        $data_chitiet = MotoRentalDetail::join('motos', 'moto_rental_details.moto_id', '=', 'motos.moto_id')
            ->select('moto_rental_details.*', 'motos.moto_name', 'motos.moto_type', 'motos.brand', 'motos.moto_license_plates')
            ->get();

        // Lấy thông tin lỗi
        $data_loi = ViolationDetail::select('violation_details.violation_id', 'violation_types.violation_content', 'violation_details.note', 'violation_details.violation_cost')
            ->join('violation_types', 'violation_details.violation_type_id', '=', 'violation_types.violation_type_id')
            ->get();

        // Merge dữ liệu
        $new_data_chitiet = $data_chitiet->map(function ($item) use ($data_loi) {
            $item->violation = $data_loi->where('violation_id', $item->violation_id)->toArray();
            return $item;
        });

        $new_data = $data_don->map(function ($item) use ($new_data_chitiet) {
            $item->detail = $new_data_chitiet->where('rental_id', $item->rental_id)->map(function ($detailItem) {
                return (object) $detailItem;
            })->values()->toArray();
            return $item;
        });

        return $this->printRs("SUCCESS", null, $new_data, true);
    }



    // Get order by id
    public function getOrderByIdUser($id_user, $trang_thai = null)
    {
        $data_don = MotoRental::where('customer_id', $id_user)
            ->when($trang_thai !== null, function ($query) use ($trang_thai) {
                return $query->where('status', $trang_thai);
            })
            ->orderByDesc('start_date')
            ->get();

        $data_chitiet = MotoRentalDetail::join('motos', 'moto_rental_details.moto_id', '=', 'motos.moto_id')
            ->join('images', 'moto_rental_details.moto_id', '=', 'images.moto_id')
            ->select('moto_rental_details.*', 'motos.moto_name', 'motos.moto_type', 'motos.brand', 'motos.moto_license_plates', 'images.url')
            ->get();

        $data_loi = ViolationDetail::join('violation_types', 'violation_details.violation_type_id', '=', 'violation_types.violation_type_id')
            ->select('violation_details.violation_id', 'violation_types.violation_content', 'violation_details.note', 'violation_details.violation_cost')
            ->get();

        // $dataHinhAnh = Image::all();

        // foreach ($data_chitiet as $xe) {
        //     $xe->url = $dataHinhAnh->where('moto_id', $xe->moto_id)->pluck('url')->map(function ($url) {
        //         return getURLImg('url', $url);
        //     })->toArray();
        // }

        // Merge dữ liệu
        $new_data_chitiet = $data_chitiet->map(function ($item) use ($data_loi) {
            $item->violation = $data_loi->where('violation_id', $item->violation_id)->toArray();
            return $item;
        });

        $new_data = $data_don->map(function ($item) use ($new_data_chitiet) {
            $item->detail = $new_data_chitiet->where('rental_id', $item->rental_id)->map(function ($detailItem) {
                return (object) $detailItem;
            })->values()->toArray();
            return $item;
        });

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

    public function getOrder($id_order)
    {
        // Lấy thông tin đơn thuê xe
        $data_don = MotoRental::join('users', 'moto_rentals.customer_id', '=', 'users.user_id')
            ->select('moto_rentals.*', 'users.fullname')
            ->where('rental_id', $id_order)
            ->get();

        // Lấy thông tin chi tiết đơn thuê xe
        $data_chitiet = MotoRentalDetail::join('motos', 'moto_rental_details.moto_id', '=', 'motos.moto_id')
            ->select('moto_rental_details.*', 'motos.moto_name', 'motos.moto_type', 'motos.brand', 'motos.moto_license_plates')
            ->where('moto_rental_details.rental_id', $data_don[0]->rental_id)
            ->get();

        // Lấy thông tin lỗi phạt
        $data_loi = ViolationDetail::join('violation_types', 'violation_details.violation_type_id', '=', 'violation_types.violation_type_id')
            ->select('violation_details.violation_id', 'violation_types.violation_content', 'violation_details.note', 'violation_details.violation_cost')
            ->where('violation_details.violation_id', $data_chitiet[0]->violation_id)
            ->get();

        // Merge dữ liệu
        $new_data_chitiet = $data_chitiet->map(function ($item) use ($data_loi) {
            $item->violation = $data_loi->toArray();
            return $item;
        });

        $new_data = $data_don->map(function ($item) use ($new_data_chitiet) {
            $item->detail = $new_data_chitiet->toArray();
            return $item;
        });

        $rs = $this->printRs('SUCCESS', null, $new_data, true);

        return $rs;
    }

    public function confirmOrder(Request $request)
    {
        try {
            // Lấy dữ liệu từ request
            $censorId = $request->input('censor_id');
            $rentalId = $request->input('rental_id');
            $status = $request->input('status');

            // Tìm đơn thuê xe dựa trên rental_id
            $motoRental = MotoRental::find($rentalId);

            // Kiểm tra xem đơn thuê có tồn tại không
            if (!$motoRental) {
                return response()->json(['status' => 'error', 'message' => 'Order not found'], 404);
            }

            // Cập nhật thông tin đơn thuê
            $motoRental->censor_id = $censorId;
            $motoRental->status = $status;
            $motoRental->save();

            return response()->json(['status' => 'success', 'message' => 'Success'], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}
