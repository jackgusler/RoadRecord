<?php

namespace App\Http\Controllers;

use App\Models\Trip;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class TripController extends Controller
{
    // Get trips that belong to the authenticated user
    public function getTripsByUser()
    {
        $user = Auth::user();
        $trips = Trip::where('user_id', $user->id)->get();

        return response()->json($trips);
    }

    // Get user trip by ID
    public function getTripById($id)
    {
        $user = Auth::user();
        $trip = Trip::where('user_id', $user->id)->where('id', $id)->first();

        if ($trip && $trip->started && !$trip->ended) {
            // Parse the starting date and time correctly
            $startDateTime = new \DateTime($trip->starting_date);

            // Get the current date and time
            $currentDateTime = new \DateTime();

            // Calculate the duration of the trip
            $duration = $startDateTime->diff($currentDateTime);

            // Set the duration in a suitable format (e.g., total minutes)
            $trip->time = $duration->format('%h:%i:%s');
            $trip->save();
        }

        return response()->json($trip);
    }

    // Get current trip
    public function getCurrentTrip()
    {
        $user = Auth::user();
        $trip = Trip::where('user_id', $user->id)
            ->where('started', true)
            ->where('ended', false)
            ->first();

        return response()->json($trip);
    }

    // Create a new trip
    public function createTrip(Request $request)
    {
        $validatedData = $request->validate([
            'starting_location' => 'required|string|max:255',
            'ending_location' => 'required|string|max:255',
            'time' => 'required|date_format:H:i:s',
            'starting_date' => 'required|date',
            'ending_date' => 'required|date|after_or_equal:starting_date',
            'name' => 'required|string|max:255',
            'started' => 'required|boolean',
            'ended' => 'required|boolean',
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
            'name' => 'required|string|max:255',
            'starting_location' => 'required|string|max:255',
            'ending_location' => 'required|string|max:255',
        ]);

        $trip = Trip::findOrFail($id);
        $trip->update($validatedData);

        return response()->json(['message' => 'Trip updated successfully', 'trip' => $trip]);
    }

    // Start a trip
    public function startTrip($id)
    {
        $userId = Auth::id();

        // Check if there is an existing started trip for the user
        $existingTrip = Trip::where('user_id', $userId)
            ->where('started', true)
            ->where('ended', false)
            ->first();

        if ($existingTrip) {
            // End the existing trip
            $this->endTrip($existingTrip->id);
        }

        // Start the new trip
        $trip = Trip::findOrFail($id);
        $trip->started = true;
        $trip->starting_date = date('Y-m-d H:i:s');
        $trip->save();

        return response()->json(['message' => 'Trip started successfully', 'trip' => $trip]);
    }

    // End a trip
    public function endTrip($id)
    {
        $trip = Trip::findOrFail($id);

        // Set ending date to current date and time
        $trip->ending_date = date('Y-m-d H:i:s');

        // Parse the starting date and time correctly
        $startDateTime = new \DateTime($trip->starting_date);

        // Get the current date and time
        $endDateTime = new \DateTime($trip->ending_date);

        // Calculate the duration of the trip
        $duration = $startDateTime->diff($endDateTime);

        // Set the duration in a suitable format (e.g., total hours, minutes, and seconds)
        $trip->time = $duration->format('%h:%i:%s');

        // Set started to false and ended to true
        $trip->started = false;
        $trip->ended = true;
        $trip->save();

        return response()->json(['message' => 'Trip ended successfully', 'trip' => $trip]);
    }

    // Delete a trip
    public function deleteTrip($id)
    {
        $trip = Trip::findOrFail($id);
        $trip->delete();

        return response()->json(['message' => 'Trip deleted successfully']);
    }
}
