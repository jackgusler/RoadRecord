<?php

namespace App\Http\Controllers;

use App\Models\LicensePlate;
use Illuminate\Http\Request;

class LicensePlateController extends Controller
{
    // Get all license plates with pagination
    public function getAllLicensePlates(Request $request)
    {
        $perPage = $request->input('per_page', 10); // Default to 10 items per page
        $licensePlates = LicensePlate::orderBy('plate_title', 'asc')->paginate($perPage);

        return response()->json($licensePlates);
    }

    // Search license plates by name or state with pagination
    public function searchLicensePlates(Request $request)
    {
        $search = $request->input('search');
        $page = $request->input('page', 1);
        $perPage = $request->input('per_page', 10);

        $query = LicensePlate::query();

        if ($search) {
            $query->where('plate_title', 'LIKE', "%{$search}%")
                ->orWhere('state', 'LIKE', "%{$search}%");
        }

        $results = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json($results);
    }

    // Get license plate by ID
    public function getLicensePlateById($id)
    {
        $licensePlate = LicensePlate::findOrFail($id);
        return response()->json($licensePlate);
    }

    // Get license plates by state with pagination
    public function getLicensePlatesByState(Request $request, $state)
    {
        $perPage = $request->input('per_page', 10);
        $licensePlates = LicensePlate::where('state', $state)->paginate($perPage);

        return response()->json($licensePlates);
    }
}
