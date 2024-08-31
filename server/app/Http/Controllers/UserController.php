<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // Get all users
    public function index()
    {
        $users = User::all()->map(function ($user) {
            if ($user->profile_img) {
                $user->profile_img = base64_encode($user->profile_img);
            }
            return $user;
        });
        return response()->json($users);
    }

    // Get a specific user
    public function show($id)
    {
        $user = User::find($id);
        if ($user) {
            if ($user->profile_img) {
                $user->profile_img = base64_encode($user->profile_img);
            }
            return response()->json($user);
        } else {
            return response()->json([
                'message' => 'User not found',
            ], 404);
        }
    }

    // Create a new user
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'username' => 'required|unique:users|max:255',
            'email' => 'required|unique:users|email',
            'password' => 'required|min:6',
            'first_name' => 'required',
            'last_name' => 'required',
            'profile_img' => 'sometimes|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('profile_img')) {
            $validatedData['profile_img'] = file_get_contents($request->file('profile_img')->getRealPath());
        }

        $validatedData['password'] = bcrypt($validatedData['password']);

        $user = User::create($validatedData);

        if ($user->profile_img) {
            $user->profile_img = base64_encode($user->profile_img);
        }

        return response()->json($user, 201);
    }

    // Update a user
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validatedData = $request->validate([
            'username' => 'sometimes|required|unique:users,username,' . $user->id . '|max:255',
            'email' => 'sometimes|required|unique:users,email,' . $user->id . '|email',
            'password' => 'sometimes|required|min:6',
            'first_name' => 'sometimes|required',
            'last_name' => 'sometimes|required',
            'profile_img' => 'sometimes|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('profile_img')) {
            $validatedData['profile_img'] = file_get_contents($request->file('profile_img')->getRealPath());
        }

        if (isset($validatedData['password'])) {
            $validatedData['password'] = bcrypt($validatedData['password']);
        }

        $user->update($validatedData);

        if ($user->profile_img) {
            $user->profile_img = base64_encode($user->profile_img);
        }

        return response()->json($user);
    }

    // Delete a user
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(null, 204);
    }
}