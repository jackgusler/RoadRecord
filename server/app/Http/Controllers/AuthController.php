<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Auth;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class AuthController extends Controller
{
    // User sign in
    public function signIn(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            $user = Auth::user();

            return response()->json([
                'message' => 'Sign in successful',
                'user' => $user,
            ]);
        }

        return response()->json([
            'message' => 'Invalid credentials',
        ], 401);
    }

    // User sign up
    public function signUp(Request $request)
    {
        $userData = $request->validate([
            'username' => 'required|unique:users|max:255',
            'email' => 'required|unique:users|email',
            'password' => 'required|min:6',
            'first_name' => 'required',
            'last_name' => 'required',
            'profile_img' => 'sometimes|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('profile_img')) {
            $userData['profile_img'] = file_get_contents($request->file('profile_img')->getRealPath());
        } else {
            // Create new manager instance with desired driver
            $manager = ImageManager::gd();

            // Load the default profile image
            $imagePath = public_path('images/user-circle-duotone.png');
            $image = $manager->read($imagePath);

            // Generate a random color for tint
            $red = rand(0, 255);
            $green = rand(0, 255);
            $blue = rand(0, 255);

            $image->colorize($red, $green, $blue);

            // Convert the image to a blob
            $userData['profile_img'] = (string) $image->toPng();
        }

        $userData['password'] = bcrypt($userData['password']);

        $user = User::create($userData);

        return response()->json($user, 201);
    }

    // User sign out
    public function signOut(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Sign out successful',
        ]);
    }

    // Check auth status
    public function status()
    {
        return response()->json([
            'authenticated' => Auth::check(),
            'user' => Auth::user(),
        ]);
    }
}
