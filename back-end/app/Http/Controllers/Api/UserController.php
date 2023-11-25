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
        $user->dob = $request->dob;
        $user->gender = $request->gender;
        $user->address = $request->address;

        if(!$user->card_id == $request->card_id) {
            if(User::where('card_id', $request->card_id)->first()) {
                return response()->json([
                    'message' => 'CCCD already exist',
                    'type' => 'error',
                    'data' => $user
                ]);
            } else {
                $user->card_id = $request->card_id;
            }
        }

        if(!$user->phone_number == $request->phone_number) {
            if(User::where('phone_number', $request->phone_number)->first()) {
                return response()->json([
                    'message' => 'Phone number already exist',
                    'type' => 'error',
                    'data' => $user
                ]);
            } else {
                $user->phone_number = $request->phone_number;
            }
        }
        
        $user->update();

        return response()->json([
            'message' => 'Update profile user success',
            'type' => 'success',
            'data' => $user
        ]);
    }

    public function updateAvatar(Request $request) {
        $user = User::where('user_id', $request->user_id)->first();

        if($request->hasFile('avatar')) {
            // save file to public/Image/Avatar
            $uploadAvatar = $request->file('avatar');
            $path = public_path('Image/Avatar');
            $fileName = $user->user_id . '.' . $uploadAvatar->getClientOriginalExtension();
            $uploadAvatar->move($path, $fileName);
            // upload to drive
            $filePath = 'Image/Avatar/' . $fileName;
            $fileData = File::get(public_path($filePath));
            Storage::disk('avatar')->put($fileName, $fileData);
            $storagePath = Storage::disk('avatar')->url($fileName);
            $user->avatar = $storagePath;
        }
        
        $user->update();

        return response()->json([
            'message' => 'Update profile user success',
            'type'=> 'success',
            'data' => $user
        ]);
    }
    public function lockAccount(Request $request)
    {
        $user = User::where('user_id', $request->user_id)->first();
        $userLock = User::where('user_id', $request->userLock)->first();
        $status = $request->status;

        if(!User::where('user_id', $request->user_id)->first() 
                || 
            !User::where('user_id', $request->userLock)->first()) {
            return response()->json([
                'message'=> 'Not found account',
                'type' => 'error',
            ]);
        }
        
        if($user->role != 'Admin') {
            return response()->json([
                'message' => 'You don\'t have permission to access this url',
                'type' => 'error',
            ]);
        }

        if($status == 'Hoạt động') {
            $userLock->status = User::STATUS_ACTIVE;
        } else {
            $userLock->status = User::STATUS_LOCKED;
        }
        $userLock->update();

        return response()->json([
            'message' => 'Change status account user success',
            'type' => 'success',
        ]);
    }

    public function getAllUser(Request $request)
    {
        $role = $request->input('role');
        $q = $request->input('q');

        $query = User::query();

        if ($role) {
            $query->where('role', $role);
        }

        if ($q) {
            $query->where(function ($subquery) use ($q) {
                $subquery->where('fullname', 'like', '%' . $q . '%')
                        ->orWhere('email', 'like', '%' . $q . '%');
            });
        }

        if (!$role && !$q) {
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
