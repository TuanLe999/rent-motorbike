<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MotoRental extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'moto_rentals';

    protected $primaryKey = 'rental_id';

    protected $fillable = [
        'customer_id',
        'status',
        'censor_id',
        'start_date',
        'end_date',
        'censorship_date',
    ];

    public function Customer()
    {
        return $this->belongsTo(User::class,'customer_id','user_id');
    }
    public function Censor()
    {
        return $this->belongsTo(User::class,'customer_id','user_id');
    }
}
