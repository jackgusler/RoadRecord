<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TripLicensePlate extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     * 
     * @var string
     */
    protected $table = 'trip_lp';

    /**
     * The attributes that are mass assignable.
     * 
     * @var array
     */
    protected $fillable = [
        'trip_id',
        'license_plate_id',
        'recorded_at',
        'location_during_recording',
    ];

    /**
     * Define the relationship with the Trip model.
     */
    public function trip()
    {
        return $this->belongsTo(Trip::class);
    }

    /**
     * Define the relationship with the LicensePlate model.
     */
    public function licensePlate()
    {
        return $this->belongsTo(LicensePlate::class);
    }
}
