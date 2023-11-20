<?php

namespace App\Http\Controllers\Api;

use App\Mail\VerificationMail;
use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    // Verify Token
    public function verifyToken($token)
    {
        $user = User::where('verification_token', $token)->first();
        if ($user) {
            $user->email_verified_at = now();
            $user->verification_token = null;
            $user->save();

            return response()->json([
                'message' => 'Email verified successfully',
                'user' => $user
            ]);
        }
        return response()->json(['message' => 'Invalid verification token'], 422);
    }
    
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

    // Register account
    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|string|max:255|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $data['email'])->first();
        
        if($user && $user->exists()) {
            if($user->email_verified_at == null) {
                return response()->json(['message' => 'Account has not been verified']);
            } 
            else {
                if(password_verify($data['password'], $user->password)) {
                    return response()->json([
                    'message' => 'Login successfully',
                    'user' => $user
                    ]);
                }
                else {
                    return response()->json(['message' => 'Password wrong']);
                }
            }
        }
        else {
            return response()->json(['message' => 'Not found account']);
        }
    }
}
