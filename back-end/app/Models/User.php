<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'users';

    protected $primaryKey = 'user_id';
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */

    const STATUS_ACTIVE = 'Hoạt động';
    const STATUS_LOCKED = 'Khoá';

    protected $fillable = [
        'password',
        'email',
        'role',
        'status',
        'fullname',
        'dob',
        'card_id',
        'phone_number',
        'address',
        'gender',
        'avatar',
        'verification_token',
    ];

    //List Motos was Rented by user
    public function RentedMotos()
    {
        return $this->hasMany(MotoRental::class, 'customer_id', 'user_id');
    }

    //List Motos was Censored by user
    public function CensoredMotos()
    {
        return $this->hasMany(MotoRental::class, 'censor_id', 'user_id');
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];
  
      /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

}
