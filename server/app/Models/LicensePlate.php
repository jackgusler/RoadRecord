<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LicensePlate extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'license_plate'; // Specify the correct table name

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'state',
        'plate_title',
        'plate_name',
        'plate_img',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'id',
    ];

    /**
     * Accessor for the plate_img attribute.
     *
     * @return string|null
     */
    public function getPlateImgAttribute($value)
    {
        return $value ? base64_encode($value) : null;
    }

    /**
     * Mutator for the plate_img attribute.
     *
     * @param string|null $value
     */
    public function setPlateImgAttribute($value)
    {
        $this->attributes['plate_img'] = $value ? base64_decode($value) : null;
    }
}