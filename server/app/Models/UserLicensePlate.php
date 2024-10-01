<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserLicensePlate extends Model
{
    use HasFactory;

    protected $table = 'user_lp';

    protected $fillable = [
        'user_id',
        'license_plate_id',
        'location',
        'favorite',
        'seen'
    ];

    protected $casts = [
        'favorite' => 'boolean',
        'seen' => 'boolean'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function licensePlate()
    {
        return $this->belongsTo(LicensePlate::class);
    }

    public $timestamps = true;
}
