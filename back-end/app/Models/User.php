<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Model
{
    use HasFactory;

    use SoftDeletes;
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
        'user_name',
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
}
