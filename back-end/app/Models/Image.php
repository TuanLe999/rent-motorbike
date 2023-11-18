<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Image extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $table = 'images';

    protected $primaryKey = 'images_id';

    protected $fillable = [
        'moto_id',
        'url',  
    ];

    public function Moto()
    {
        return $this->belongsTo(Moto::class,'moto_id','moto_id' );
    }


}
