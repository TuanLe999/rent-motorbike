<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MotoRentalDetail extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'moto_rental_details';

    protected $primaryKey = ['rental_id','moto_id'];

    protected $fillable = [
        'rent_cost',
        'return_date',
        'received_staff_id',
        'violation_id', 
    ];

    public function Moto()
    {
        return $this->belongsTo(Moto::class,'moto_id','moto_id');
    }

    public function MotoRental()
    {
        return $this->belongsTo(MotoRental::class,'rental_id','rental_id');
    }

    public function ReceivedStaff()
    {
        return $this->belongsTo(User::class,'received_staff_id','user_id');
    }

    public function ViolationDetails()
    {
        return $this->hasMany(ViolationDetail::class,'violation_id','violation_id');
    }

}
