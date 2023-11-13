<?php

namespace App\Http\Controllers\Api;

use App\Mail\VerificationMail;
use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    // Register account
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|max:255|email|unique:users',
            'password' => 'required',
        ]);

        $data['verification_token'] = Str::random(40);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'verification_token' => $data['verification_token'],
        ]);

        // Gửi email với token
        Mail::to($user->email)->send(new VerificationMail($user));

        return response()->json([
            'message' => 'User Registered',
            'data' => ['user' => $user],
        ]);
    }
}
