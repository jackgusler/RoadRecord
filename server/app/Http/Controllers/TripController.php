<?php

namespace App\Http\Controllers;

use App\Models\Trip;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TripController extends Controller
{
    // Get trips that belong to the authenticated user
    public function getTripsByUser()
    {
        $user = Auth::user();
        $trips = Trip::where('user_id', $user->id)->get();
        
        return response()->json($trips);
    }

    // Create a new trip
    public function createTrip(Request $request)
    {
        $validatedData = $request->validate([
            'start_location' => 'required|string|max:255',
            'end_location' => 'required|string|max:255',
            'time' => 'required|date_format:H:i',
            'starting_date' => 'required|date',
            'ending_date' => 'required|date|after_or_equal:starting_date',
            'name' => 'required|string|max:255',
            'still_driving' => 'required|boolean',
        ]);

        $trip = new Trip($validatedData);
        $trip->user_id = Auth::id();
        $trip->save();

        return response()->json(['message' => 'Trip created successfully', 'trip' => $trip], 201);
    }

    // Update a trip
    public function updateTrip(Request $request, $id)
    {
        $validatedData = $request->validate([
            'start_location' => 'required|string|max:255',
            'end_location' => 'required|string|max:255',
            'time' => 'required|date_format:H:i',
            'starting_date' => 'required|date',
            'ending_date' => 'required|date|after_or_equal:starting_date',
            'name' => 'required|string|max:255',
            'still_driving' => 'required|boolean',
        ]);

        $trip = Trip::findOrFail($id);
        $trip->update($validatedData);

        return response()->json(['message' => 'Trip updated successfully', 'trip' => $trip]);
    }

    // Delete a trip
    public function deleteTrip($id)
    {
        $trip = Trip::findOrFail($id);
        $trip->delete();

        return response()->json(['message' => 'Trip deleted successfully']);
    }
}