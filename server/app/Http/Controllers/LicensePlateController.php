<?php

namespace App\Http\Controllers;

use App\Models\LicensePlate;
use App\Models\UserLicensePlate;
use Illuminate\Http\Request;

class LicensePlateController extends Controller
{
    // Get all license plates with pagination
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10); // Default to 10 items per page
        $licensePlates = LicensePlate::paginate($perPage);

        return response()->json($licensePlates);
    }

    // Get license plate by ID
    public function show($id)
    {
        $licensePlate = LicensePlate::find($id);

        if (!$licensePlate) {
            return response()->json(['message' => 'License plate not found'], 404);
        }

        return response()->json($licensePlate);
    }

    // Get license plate details by user id
    public function getByUser($userId)
    {
        $licensePlatesIds = UserLicensePlate::where('user_id', $userId)->pluck('license_plate_id');
        $licensePlates = LicensePlate::whereIn('id', $licensePlatesIds)->get();

        return response()->json($licensePlates);
    }

    // Get license plates by state with pagination
    public function getByState(Request $request, $state)
    {
        $perPage = $request->input('per_page', 10); // Default to 10 items per page
        $licensePlates = LicensePlate::where('state', $state)->paginate($perPage);

        return response()->json($licensePlates);
    }

    // Search license plates by name or state with pagination
    public function search(Request $request)
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
}
