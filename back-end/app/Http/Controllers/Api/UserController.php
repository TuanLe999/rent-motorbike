<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Storage;
use File;


class UserController extends Controller
{
    //
    public function updateProfileUser(Request $request)
    {
        $user = User::where('user_id', $request->user_id)->first();

        $user->fullname = $request->fullname;
        $user->gender = $request->gender;
        $user->address = $request->address;

        if($request->hasFile('avatar')){
            // save file to public/Image/Avatar
            $uploadAvatar = $request->file('avatar');
            $path = public_path('Image/Avatar');
            $fileName = $user->user_id . '.' . $uploadAvatar->getClientOriginalExtension();
            $uploadAvatar->move($path, $fileName);
            // 
            // upload to drive
            $filePath = 'Image/Avatar/' . $fileName;
            $fileData = File::get(public_path($filePath));
            Storage::disk('avatar')->put($fileName, $fileData);

            $storagePath = Storage::disk('avatar')->url($fileName);
            $user->avatar = $storagePath;
        }


        
        
        if(User::where('card_id', $request->card_id)->first()) {
            return response()->json([
                'message' => 'CCCD already exist',
            ]);
        }

        if(User::where('phone_number', $request->phone_number)->first()) {
            return response()->json([
                'message' => 'Phone number already exist',
            ]);
        }

        $user->phone_number = $request->phone_number;
        $user->card_id = $request->card_id;
        $user->update();

        return response()->json([
            'message' => 'Update profile user success',
            'user' => $user
        ]);
    }

    public function lockAccount(Request $request)
    {
        $user = User::where('id', $request->id)->first();
        $userLock = User::where('id', $request->idUserLock)->first();

        if(!$user->exists() || !$userLock->exists()) {
            return response()->json([
                'message'=> 'Not found account',
            ]);
        }
        
        if($user->role != 'Admin') {
            return response()->json([
                'message' => 'You don\'t have permission to access this url',
            ], 403);
        }

        $userLock->status = User::STATUS_LOCKED;
        $userLock->update();

        return response()->json([
            'message' => 'Lock account user success',
        ]);
    }

    public function getAllUser(Request $request)
    {
        $type = $request->input('type');
        $q = $request->input('q');

        $query = User::query();

        if ($type) {
            $query->where('role', $type);
        }

        if ($q) {
            $query->where(function ($subquery) use ($q) {
                $subquery->where('fullname', 'like', '%' . $q . '%')
                        ->orWhere('email', 'like', '%' . $q . '%');
            });
        }

        if (!$type && !$q) {
            $users = $query->get();
        } else {
            $users = $query->get();
        }

        // Lấy kết quả với phân trang
        $perPage = $request->input('per_page', 10);
        $users = $query->paginate($perPage);

        $totalPages = $users->lastPage();

        return response()->json([
            'message' => 'Success',
            'data' => $users,
            'total_pages' => $totalPages,
        ]);
    }

}
