<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ViolationDetail extends Model
{
    use SoftDeletes;
    use HasFactory;
    protected $table = 'violation_details';

    protected $primaryKey = 'violation_id';

    protected $fillable = [
        'violation_type_id',
        'rental_detail_id',
        'note',
        'violation_cost',
    ];

    public function MotoRentalDetail()
    {
        return $this->belongsTo(MotoRentalDetail::class,'rental_detail_id','rental_detail_id');
    }

    public function ViolationType()
    {
        return $this->belongsTo(ViolationType::class,'violation_type_id','violation_type_id');
    }
}
