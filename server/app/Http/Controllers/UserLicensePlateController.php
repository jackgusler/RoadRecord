<?php

namespace App\Http\Controllers;

use App\Models\UserLicensePlate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class UserLicensePlateController extends Controller
{
    // Get license plates based on user
    public function getLicensePlatesByUser($userId)
    {
        $licensePlates = UserLicensePlate::where('user_id', $userId)->get();
        return response()->json($licensePlates);
    }

    // Get user license plate based on license plate id
    public function getUserLicensePlate($id)
    {
        $userLicensePlate = UserLicensePlate::findOrFail($id);
        return response()->json($userLicensePlate);
    }

    // Batch update license plates
    public function batchUpdate(Request $request)
    {
        $userSelections = $request->userSelections;
        try {
            foreach ($userSelections as $id => $selection) {
                $selection = json_decode($selection, true);
                $favorite = $selection['favorite'];
                $seen = $selection['seen'];

                if ($favorite) {
                    $this->favoriteLicensePlate($id);
                } else {
                    $this->unfavoriteLicensePlate($id);
                }

                if ($seen) {
                    $this->seenLicensePlate($id);
                } else {
                    $this->unseenLicensePlate($id);
                }
            }

            return response()->json(['message' => 'License plates batch updated successfully']);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['message' => 'Error updating license plates'], 500);
        }
    }

    // Favorite a license plate
    public function favoriteLicensePlate($id)
    {
        $userId = Auth::id();

        $userLicensePlate = UserLicensePlate::where('user_id', $userId)
            ->where('license_plate_id', $id)
            ->first();

        if ($userLicensePlate) {
            UserLicensePlate::where('user_id', $userId)
                ->where('license_plate_id', $id)
                ->update(['favorite' => true]);
        } else {
            // Create a new record
            UserLicensePlate::create([
                'user_id' => $userId,
                'license_plate_id' => $id,
                'favorite' => true,
                'seen' => false, // Assuming default value for 'seen'
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        return response()->json(['message' => 'License plate favorited successfully']);
    }

    // Unfavorite a license plate
    public function unfavoriteLicensePlate($id)
    {
        $userId = Auth::id();

        $userLicensePlate = UserLicensePlate::where('user_id', $userId)
            ->where('license_plate_id', $id)
            ->first();

        if ($userLicensePlate) {
            UserLicensePlate::where('user_id', $userId)
                ->where('license_plate_id', $id)
                ->update(['favorite' => false]);
        } else {
            return response()->json(['message' => 'License plate not found in user_lp'], 404);
        }

        // If both 'favorite' and 'seen' are false, delete the record
        UserLicensePlate::where('user_id', $userId)
            ->where('license_plate_id', $id)
            ->where('favorite', false)
            ->where('seen', false)
            ->delete();

        return response()->json(['message' => 'License plate unfavorited successfully']);
    }

    // Mark a license plate as seen (add to user_lp)
    public function seenLicensePlate($id)
    {
        $userId = Auth::id();

        $userLicensePlate = UserLicensePlate::where('user_id', $userId)
            ->where('license_plate_id', $id)
            ->first();

        if ($userLicensePlate) {
            UserLicensePlate::where('user_id', $userId)
                ->where('license_plate_id', $id)
                ->update(['seen' => true]);
        } else {
            // Create a new record
            UserLicensePlate::create([
                'user_id' => $userId,
                'license_plate_id' => $id,
                'favorite' => false, // Assuming default value for 'favorite'
                'seen' => true,
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        return response()->json(['message' => 'License plate marked as seen']);
    }

    // Remove a license plate from user_lp (unseen)
    public function unseenLicensePlate($id)
    {
        $userId = Auth::id();

        $userLicensePlate = UserLicensePlate::where('user_id', $userId)
            ->where('license_plate_id', $id)
            ->first();

        if ($userLicensePlate) {
            UserLicensePlate::where('user_id', $userId)
                ->where('license_plate_id', $id)
                ->update(['seen' => false]);
        } else {
            return response()->json(['message' => 'License plate not found in user_lp'], 404);
        }

        // If both 'favorite' and 'seen' are false, delete the record
        UserLicensePlate::where('user_id', $userId)
            ->where('license_plate_id', $id)
            ->where('favorite', false)
            ->where('seen', false)
            ->delete();

        return response()->json(['message' => 'License plate removed from user_lp']);
    }
}
