<?php

namespace App\Http\Controllers\Api;

use App\Models\PasswordReset;
use App\Models\User;
use App\Mail\PasswordReset as ResetPasswordMail;
use Carbon\Carbon;
use Illuminate\Support\Str;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ResetPasswordController extends Controller
{
    //send mail
    public function sendMail(Request $request)
    {
        $user = User::where('email', $request->email)->firstOrFail();

        $passwordReset = PasswordReset::create([
            'email' => $user->email,
            'token' => Str::random(60),
        ]);

        if ($passwordReset) {
            Mail::to($request->email)->send(new ResetPasswordMail($passwordReset->token));
        }

        return response()->json([
            'message' => 'We have e-mailed your password reset token!'
        ]);
    }

    public function resetPassword(Request $request, $token)
    {
        $passwordReset = PasswordReset::where('token', $token)->firstOrFail();
        if (Carbon::parse($passwordReset->updated_at)->addMinutes(720)->isPast()) {
            $passwordReset->delete();

            return response()->json([
                'message' => 'This password reset token is invalid.',
            ], 422);
        }
        $user = User::where('email', $passwordReset->email)->firstOrFail();
        $user->update($request->only('password'));
        $passwordReset->delete();

        return response()->json([
            'message' => 'Change password was successfully',
            'user' => $user
        ]);
    }
}
