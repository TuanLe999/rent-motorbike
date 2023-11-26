<?php

namespace App\Http\Controllers;

use App\Models\Moto;
use App\Models\MotoRental;
use App\Models\MotoRentalDetail;
use App\Models\ViolationDetail;
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

        $data_don = MotoRental::join('users', 'moto_rentals.customer_id', '=', 'users.user_id')
            ->join('users as censor', 'moto_rentals.censor_id', '=', 'censor.user_id')
            ->select('moto_rentals.*','censor.fullname as name_censor', 'users.fullname as name_customer',)
            ->orderByDesc('start_date')
            ->when($q, function ($query) use ($q) {
                return $query->where('fullname', 'LIKE', '%' . $q . '%');
            })
            ->offset($vt)
            ->limit($so_item)
            ->get();

        $soLuong = MotoRental::when($q, function ($query) use ($q) {
            return $query->whereHas('customer', function ($subquery) use ($q) {
                $subquery->where('fullname', 'LIKE', '%' . $q . '%');
            });
        })
        ->count();

        $soTrang = $this->getSoTrang($soLuong, $so_item);

        $data_chitiet = MotoRentalDetail::join('motos', 'moto_rental_details.moto_id', '=', 'motos.moto_id')
            ->join('users as censor', 'moto_rental_details.received_staff_id', '=', 'censor.user_id')
            ->select('moto_rental_details.*','censor.fullname as name_censor', 'motos.moto_name', 'motos.moto_type', 'motos.brand', 'motos.moto_license_plates')
            ->get();

        $data_loi = ViolationDetail::select('violation_details.violation_id', 'violation_types.violation_content', 'violation_details.note', 'violation_details.violation_cost')
            ->join('violation_types', 'violation_details.violation_type_id', '=', 'violation_types.violation_type_id')
            ->get();

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

        return $this->printRs("SUCCESS", null, $new_data, true,$soTrang);
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


    private function printRs($status, $message, $data, $hasPagination,$totalPage = 1)
    {
        $response = [
            'status' => $status,
            'message' => $message,
            'data' => $data,
        ];

        if ($hasPagination) {
            $response['totalPage'] = $totalPage; 
        }

        return response()->json($response);
    }

    private function getSoTrang($soLuong, $so_item)
    {
        return ceil($soLuong / $so_item);
    }

    public function addOrder(Request $request)
    {
        try {
            DB::beginTransaction();

            $data = $request->all();
            $listMoto = $data["listMoto"];

            $newRental = new MotoRental();
            $newRental->customer_id = $data["id_customer"];
            $newRental->status = 'Chưa duyệt';
            $newRental->start_date = Carbon::createFromFormat('d-m-Y', $data["startDate"]);
            $newRental->end_date = Carbon::createFromFormat('d-m-Y', $data["endDate"]);
            $newRental->save();

            foreach ($listMoto as $moto) {
                $newRentalDetail = new MotoRentalDetail();
                $newRentalDetail->rental_id = $newRental->rental_id;
                $newRentalDetail->moto_id = $moto;
                $newRentalDetail->rent_cost = Moto::find($moto)->rent_cost;
                $newRentalDetail->return_date = null;
                $newRentalDetail->received_staff_id = null;
                $newRentalDetail->save();
            }

            DB::commit();
            return $this->printRs("success", "Thuê xe thành công!", null, null);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->printRs("error", "Thuê xe thất bại, lỗi xảy ra trong quá trình thực hiện!", null, null);
        }
    }

    public function payOrder(Request $request)
    {
            $data = $request->all();
            // DB::beginTransaction();
            foreach ($data['listMoto'] as $moto) {

                $rentalDetail = MotoRentalDetail::where('rental_id', $data['rental_id'])->where('moto_id', $moto['moto_id'])->first();
                if (!$rentalDetail) {
                    // DB::rollBack();
                    return $this->printRs("error", "Không tìm thấy hóa đơn cần thanh toán!", $moto['moto_id'], null);
                }
                if ($rentalDetail->return_date != null) {
                    // DB::rollBack();
                    return $this->printRs("error", "Xe đã được thanh toán!", $moto['moto_id'], null);
                } else {
                    $rentalDetail->received_staff_id = $data['received_staff_id'];
                    $rentalDetail->return_date = Carbon::now();
                    $rentalDetail->save();
                }
            }

            DB::commit();
            $motoRental = MotoRental::find($data['rental_id']);

            $allReturned = $motoRental->RentalDetails->every(function ($detail) {
                return $detail->return_date !== null;
            });

            if($allReturned){
                $motoRental->status = "Hoàn tất";
                $motoRental->save();
            }
            return $this->printRs("success", "Thanh toán thành công", $data['listMoto'], null);
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

    public function cancelOrder(Request $request)
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

            // Tìm tất cả đơn thuê chi tiết dựa trên rental_id
            $motoRentalDetails = MotoRentalDetail::where('rental_id', $rentalId)->get();

            // Cập nhật dữ liệu return_date cho từng đơn thuê chi tiết
            foreach ($motoRentalDetails as $motoRentalDetail) {
                $motoRentalDetail->return_date = Carbon::now();

                $motoRentalDetail->save();
            }

            return response()->json(['status' => 'success', 'message' => 'Success'], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}
