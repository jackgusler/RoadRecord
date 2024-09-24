<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Trip extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'trip'; // Specify the correct table name

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'start_location',
        'end_location',
        'time',
        'starting_date',
        'ending_date',
        'name',
        'still_driving',
    ];

    /**
     * Define a relationship with the User model.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Define a relationship with the LicensePlate model.
     */
    public function licensePlates()
    {
        return $this->belongsToMany(LicensePlate::class, 'trip_lp');
    }
}
