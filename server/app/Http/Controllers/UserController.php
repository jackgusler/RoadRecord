<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    // Get all users
    public function index()
    {
        $users = User::all()->map(function ($user) {
            return $user;
        });
        return response()->json($users);
    }

    // Get a specific user
    public function show($id)
    {
        $user = User::find($id);
        if ($user) {
            return response()->json($user);
        } else {
            return response()->json([
                'message' => 'User not found',
            ], 404);
        }
    }

    // Update a user
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Validate the incoming request data
        $validatedData = $request->validate([
            'username' => 'sometimes|string|max:255|unique:users,username,' . $id,
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $id,
            'password' => 'sometimes|string|min:8|confirmed',
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'profile_img' => 'sometimes|file|mimes:jpeg,png,jpg,gif,svg|max:5120',
            'location' => 'sometimes|string|max:255',
            'timezone' => 'sometimes|string|max:255',
        ]);

        // Hash the password if it is present in the request
        if ($request->has('password')) {
            $validatedData['password'] = bcrypt($request->password);
        }

        // Handle the profile image file upload
        if ($request->hasFile('profile_img')) {
            $file = $request->file('profile_img');
            $validatedData['profile_img'] = file_get_contents($file->getRealPath()); // Convert the file to a BLOB
        }

        // Update the user with the validated data
        $user->update($validatedData);

        // Return the updated user as a JSON response
        return response()->json($user);
    }

    // Delete a user
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(null, 204);
    }

    // Get the current user
    public function current()
    {
        return response()->json([
            'user' => Auth::user(),
        ]);
    }
}
