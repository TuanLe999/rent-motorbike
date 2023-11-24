<?php

namespace App\Http\Controllers;

use App\Models\Moto;
use App\Models\Image;
use Illuminate\Http\Request;
use File;
use Storage;

class MotoController extends Controller
{
    //GET ALL MOTORBIKE
    public function getAllMoto(Request $request){
        $query = Moto::with('Images');

        // Kiểm tra xem có truyền tham số 'q' không
        if ($request->has('q')) {
            $query->where('moto_name', 'like', '%' . $request->input('q') . '%');
        }

        if ($request->has('type')) {
            $query->where('moto_type', 'like', '%' . $request->input('type') . '%');
        }

        $motos = $query->get();

        $motosInfo = [];
        foreach ($motos as $moto) {
            $motosInfo[] = [
                'moto_id' => $moto->moto_id,
                'moto_name' => $moto->moto_name,
                'brand' => $moto->brand,
                'status' => $moto->status,
                'moto_license_plates' => $moto->moto_license_plates,
                'moto_type' => $moto->moto_type,
                'rent_cost' => $moto->rent_cost,
                'slug' => $moto->slug,
                'description' => $moto->description,
                'images' => $this->getImageUrls($moto->Images),
            ];
            $motosInfo[] = $this->formatMotoData($moto);
        }

        return response()->json([
            'status' => 'success',
            'data' => $motosInfo
        ]);
    }

    //GET MOTORBIKE BY SLUG
    public function getMotorBySlug($slug){
        $moto = Moto::with('Images')->where('slug', $slug)->first();
        if (!$moto) {
            return response()->json(['error' => 'Moto not found'], 404);
        }
        $motoInfo = $this->formatMotoDataBySlug($moto);
        return response()->json([
            'status' => 'success',
            'data' => $motoInfo
        ]);
    }


    //CREATE A NEW MOTORBIKE
    public function createMoto(Request $request){
        if ($request->hasFile('images')) {
            $images = $request->file('images');
            $imageUrls = [];

            foreach ($images as $image) {
                $fileName = time() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('Image/Motorbike'), $fileName);
                $fileData = File::get(public_path('Image/Motorbike/' . $fileName));
                Storage::disk('motorbike')->put($fileName, $fileData);
                $storagePath = Storage::disk('motorbike')->url($fileName);
                array_push($imageUrls, $storagePath);
            }

            $moto = Moto::create([
                'moto_name' => $request->input('moto_name'),
                'brand' => $request->input('brand'),
                'status' => $request->input('status'),
                'moto_license_plates' => $request->input('moto_license_plates'),
                'moto_type' => $request->input('moto_type'),
                'rent_cost' => $request->input('rent_cost'),
                'slug' => $request->input('slug'),
                'description' => $request->input('description'),
            ]);

            foreach ($imageUrls as $imageUrl) {
                Image::create([
                    'moto_id' => $moto->moto_id,
                    'url' => $imageUrl,
                ]);
            }

            return response()->json([
                'status' => 'success',
                'data' => 'Images received',
            ]);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'No image provided',
            ], 400);
        }
    }


    //UPDATE MOTORBIKE BY ID
    public function updateMoto(Request $request, $id){
        $moto = Moto::find($id);
        if (!$moto) {
            return response()->json(['error' => 'Moto not found'], 404);
        }
        $moto->images()->delete();

        if ($request->hasFile('images')) {
            $images = $request->file('images');
            $imageUrls = [];
            foreach ($images as $image) {
                $fileName = time() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('Image/Motorbike'), $fileName);
                $fileData = File::get(public_path('Image/Motorbike/' . $fileName));
                Storage::disk('motorbike')->put($fileName, $fileData)
                $storagePath = Storage::disk('motorbike')->url($fileName);
                array_push($imageUrls, $storagePath);
                $imageUrls[] = asset('Image/motorbike/' . $fileName);;
            }

            $moto->update([
                'moto_name' => $request->input('moto_name', $moto->moto_name),
                'brand' => $request->input('brand', $moto->brand),
                'status' => $request->input('status', $moto->status),
                'moto_license_plates' => $request->input('moto_license_plates', $moto->moto_license_plates),
                'moto_type' => $request->input('moto_type', $moto->moto_type),
                'rent_cost' => $request->input('rent_cost', $moto->rent_cost),
                'slug' => $request->input('slug', $moto->slug),
                'description' => $request->input('description', $moto->description),
            ]);

            foreach ($imageUrls as $imageUrl) {
                Image::create([
                    'moto_id' => $moto->moto_id,
                    'url' => $imageUrl,
                ]);
            }
        }
        return response()->json([
            'status' => 'success',
            'message' => 'Moto updated successfully',
        ]);
    }


    //GET FIELD URL ABOUT TABLE IMAGES
    private function getImageUrls($images){
        return $images->pluck('url')->toArray();
    }


    //GET THE RENTAL TIME
    private function getMotoCalendar($motoId) {
        $result = Moto::select('motos.moto_id', 'moto_rentals.ngayBD', 'moto_rentals.ngayKT')
            ->join('moto_rental_details', 'motos.moto_id', '=', 'moto_rental_details.moto_id')
            ->join('moto_rentals', 'moto_rental_details.rental_id', '=', 'moto_rentals.rental_id')
            ->where('motos.moto_id', $motoId)
            ->whereDate('moto_rentals.ngayKT', '>', now())
            ->get();

        return $result;
    }


    //FORMAT DATA FROM MOTORBIKE TO BE RETURNED TO UI
    private function formatMotoData($moto){
        return [
            'moto_id' => $moto->moto_id,
            'moto_name' => $moto->moto_name,
            'brand' => $moto->brand,
            'status' => $moto->status,
            'moto_license_plates' => $moto->moto_license_plates,
            'moto_type' => $moto->moto_type,
            'rent_cost' => $moto->rent_cost,
            'slug' => $moto->slug,
            'description' => $moto->description,
            'images' => $this->getImageUrls($moto->Images),
        ];
    }


    private function formatMotoDataBySlug($moto){
        return [
            'moto_name' => $moto->moto_name,
            'brand' => $moto->brand,
            'status' => $moto->status,
            'moto_license_plates' => $moto->moto_license_plates,
            'moto_type' => $moto->moto_type,
            'rent_cost' => $moto->rent_cost,
            'slug' => $moto->slug,
            'description' => $moto->description,
            'images' => $this->getImageUrls($moto->Images),
            'calendar' => $this->getMotoCalendar($moto),
        ];
    }
}
