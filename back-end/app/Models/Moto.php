<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Moto extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'motos';

    protected $primaryKey = 'moto_id';

    protected $fillable = [
        'moto_name',
        'brand',
        'status',
        'moto_license_plates',
        'moto_type',
        'rent_cost',
        'slug',
        'description',
    ];

    public function Images()
    {
        return $this->hasMany(Image::class, 'moto_id','moto_id');
    }

    public function MotoRentals(){
        return $this->hasMany(MotoRental::class,'moto_id','moto_id');
    }

}
