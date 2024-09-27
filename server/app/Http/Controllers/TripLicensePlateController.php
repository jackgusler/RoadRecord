<?php

namespace App\Http\Controllers;

use App\Models\TripLicensePlate;
use App\Models\LicensePlate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TripLicensePlateController extends Controller
{
    // Get trip license plates by trip ID
    public function getTripLicensePlatesByTrip($tripId)
    {
        $tripLicensePlates = TripLicensePlate::where('trip_id', $tripId)->get();

        return response()->json($tripLicensePlates);
    }

    // Get trip license plate details by trip ID
    public function getTripLicensePlateDetailsByTrip($tripId)
    {
        $tripLicensePlates = TripLicensePlate::where('trip_id', $tripId)->pluck('license_plate_id');
        $licensePlates = LicensePlate::whereIn('id', $tripLicensePlates)->orderBy('plate_name', 'asc')->get();

        return response()->json($licensePlates);
    }

    // Get trip license plate by ID
    public function getTripLicensePlateById($tripId, $licensePlateId)
    {
        $tripLicensePlate = TripLicensePlate::where('trip_id', $tripId)->where('license_plate_id', $licensePlateId)->firstOrFail();

        return response()->json($tripLicensePlate);
    }

    // Create a new trip license plate
    public function createTripLicensePlate(Request $request, $tripId)
    {
        $validatedData = $request->validate([
            'license_plate_id' => 'required|integer',
            'location_during_recording' => 'required|string',
        ]);

        $validatedData['trip_id'] = $tripId;
        $validatedData['recorded_at'] = date('Y-m-d H:i:s');

        $tripLicensePlate = TripLicensePlate::create($validatedData);

        return response()->json($tripLicensePlate);
    }

    // Delete trip license plate by ID
    public function deleteTripLicensePlateById($id)
    {
        $tripLicensePlate = TripLicensePlate::findOrFail($id);
        $tripLicensePlate->delete();

        return response()->json(['message' => 'Trip license plate deleted successfully']);
    }
}
