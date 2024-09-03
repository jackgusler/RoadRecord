<?php

namespace App\Http\Controllers;

use App\Models\LicensePlate;
use Illuminate\Http\Request;

class LicensePlateController extends Controller
{
    // Get license plates by state with pagination
    public function getByState(Request $request, $state)
    {
        $perPage = $request->input('per_page', 10); // Default to 10 items per page
        $licensePlates = LicensePlate::where('state', $state)->paginate($perPage);

        return response()->json($licensePlates);
    }
}