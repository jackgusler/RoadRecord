<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;
use Intervention\Image\ImageManager;

class AuthController extends Controller
{
    // User sign in
    public function signIn(Request $request)
    {
        $credentials = $request->only('email', 'password');
        if (!$token = JWTAuth::attempt($credentials)) {
            $user = User::where('email', $credentials['email'])->first();
            $error = $user ? 'Incorrect password' : 'User not found';
            return response()->json(['error' => 'Invalid credentials'], 401);
        }
        return response()->json(['token' => $token]);
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

            // Define a set of nature-inspired colors
            $natureColors = [
                ['red' => 34, 'green' => 139, 'blue' => 34],   // ForestGreen
                ['red' => 60, 'green' => 179, 'blue' => 113],  // MediumSeaGreen
                ['red' => 32, 'green' => 178, 'blue' => 170],  // LightSeaGreen
                ['red' => 107, 'green' => 142, 'blue' => 35],  // OliveDrab
                ['red' => 46, 'green' => 139, 'blue' => 87],   // SeaGreen
                ['red' => 0, 'green' => 128, 'blue' => 128],   // Teal
                ['red' => 85, 'green' => 107, 'blue' => 47],   // DarkOliveGreen
            ];

            // Randomly select a color from the set
            $selectedColor = $natureColors[array_rand($natureColors)];

            // Apply the selected color to the image
            $image->colorize($selectedColor['red'], $selectedColor['green'], $selectedColor['blue']);

            // Convert the image to a blob
            $userData['profile_img'] = (string) $image->toPng();
        }

        $userData['password'] = bcrypt($userData['password']);

        $user = User::create($userData);

        $token = JWTAuth::fromUser($user);

        return response()->json(['user' => $user, 'token' => $token], 201);
    }

    // User sign out
    public function signOut(Request $request)
    {
        JWTAuth::invalidate(JWTAuth::getToken());

        return response()->json(['message' => 'Sign out successful']);
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
