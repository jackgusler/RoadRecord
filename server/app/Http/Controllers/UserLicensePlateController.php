<?php

namespace App\Http\Controllers;

use App\Models\UserLicensePlate;
use App\Models\LicensePlate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class UserLicensePlateController extends Controller
{
    // Get user license plates based on user
    public function getLicensePlatesByUser()
    {
        $userId = Auth::id();

        $licensePlates = UserLicensePlate::where('user_id', $userId)->get();
        return response()->json($licensePlates);
    }

    // Get user license plates details
    public function getLicensePlatesDetailsByUser()
    {
        $userId = Auth::id();

        $licensePlatesIds = UserLicensePlate::where('user_id', $userId)->pluck('license_plate_id');
        $licensePlates = LicensePlate::whereIn('id', $licensePlatesIds)->orderBy('plate_name', 'asc')->get();

        return response()->json($licensePlates);
    }

    // Get user license plates states
    public function getLicensePlatesStateByUser()
    {
        $userId = Auth::id();

        $licensePlate = UserLicensePlate::where('user_id', $userId)->pluck('license_plate_id');
        $licensePlatesStates = LicensePlate::whereIn('id', $licensePlate)->pluck('state')->unique();

        return response()->json($licensePlatesStates);
    }

    // Get user license plates details by state
    public function getLicensePlatesDetailsByUserAndState($state)
    {
        $userId = Auth::id();

        $licensePlatesIds = UserLicensePlate::where('user_id', $userId)->pluck('license_plate_id');
        $licensePlates = LicensePlate::whereIn('id', $licensePlatesIds)->where('state', $state)->get();

        return response()->json($licensePlates);
    }

    // Get user license plate based on license plate id
    public function getUserLicensePlateById($id)
    {
        $userLicensePlate = UserLicensePlate::findOrFail($id);
        return response()->json($userLicensePlate);
    }

    // Favorite a license plate
    public function favoriteUserLicensePlate($id)
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
    public function unfavoriteUserLicensePlate($id)
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
    public function seenUserLicensePlate($id)
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
    public function unseenUserLicensePlate($id)
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

    // Batch update license plates
    public function batchUpdateUserLicensePlates(Request $request)
    {
        $userSelections = $request->userSelections;
        try {
            foreach ($userSelections as $id => $selection) {
                $selection = json_decode($selection, true);
                $favorite = $selection['favorite'];
                $seen = $selection['seen'];

                if ($favorite) {
                    $this->favoriteUserLicensePlate($id);
                } else {
                    $this->unfavoriteUserLicensePlate($id);
                }

                if ($seen) {
                    $this->seenUserLicensePlate($id);
                } else {
                    $this->unseenUserLicensePlate($id);
                }
            }

            return response()->json(['message' => 'License plates batch updated successfully']);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['message' => 'Error updating license plates'], 500);
        }
    }
}
