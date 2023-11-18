<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ViolationType extends Model
{
    use SoftDeletes;
    use HasFactory;
    protected $table = 'violation_types';

    protected $primaryKey = 'violation_type_id';

    protected $fillable = [
        'violation_content'
    ];

    public function ViolationDetails()
    {
        return $this->hasMany(ViolationDetail::class,'violation_type_id','violation_type_id');
    }
}
