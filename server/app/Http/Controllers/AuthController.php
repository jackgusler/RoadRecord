<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Intervention\Image\ImageManager;

class AuthController extends Controller
{
    // User sign in
    public function signIn(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!Auth::attempt($credentials)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        // Fetch the user using the credentials
        $user = User::where('email', $request->email)->first();

        // Now create the token for this user
        $token = $user->createToken('Personal Access Token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
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
            $imagePath = public_path('images/profile/user-circle-duotone-2.png');

            // Define a set of nature-inspired colors
            $natureColors = [
                'rgba(172, 162, 83, 0.5)',
                'rgba(109, 128, 65, 0.5)',
                'rgba(187, 186, 166, 0.5)',
                'rgba(199, 170, 52, 0.5)',
                'rgba(130, 149, 86, 0.5)',
                'rgba(90, 96, 44, 0.5)',
                'rgba(140, 145, 111, 0.5)',
                'rgba(137, 165, 110, 0.5)',
                'rgba(176, 177, 140, 0.5)',
                'rgba(160, 145, 70, 0.5)',
                'rgba(133, 147, 90, 0.5)',
                'rgba(102, 160, 72, 0.5)',
                'rgba(184, 207, 218, 0.5)',
                'rgba(103, 139, 159, 0.5)',
                'rgba(191, 219, 232, 0.5)',
                'rgba(160, 194, 205, 0.5)',
                'rgba(79, 96, 106, 0.5)',
                'rgba(112, 139, 146, 0.5)',
                'rgba(169, 173, 176, 0.5)',
                'rgba(101, 125, 131, 0.5)',
                'rgba(158, 135, 104, 0.5)',
                'rgba(211, 185, 162, 0.5)',
                'rgba(182, 147, 123, 0.5)',
                'rgba(126, 103, 77, 0.5)',
                'rgba(212, 212, 212, 0.5)',
                'rgba(74, 78, 68, 0.5)',
                'rgba(114, 103, 87, 0.5)',
                'rgba(207, 191, 178, 0.5)',
                'rgba(186, 139, 121, 0.5)',
                'rgba(125, 118, 105, 0.5)'
            ];

            // Randomly select a color from the set
            $selectedColor = $natureColors[array_rand($natureColors)];

            $background = $manager->create(512, 512)->drawCircle(256, 256, function ($circle) use ($selectedColor) {
                $circle->radius(257);
                $circle->background($selectedColor);
            });

            // Load the profile image
            $profileImage = $manager->read($imagePath)->resize(512, 512);

            // Overlay the profile image on top of the background
            $background->place($profileImage, 'center', 0, 0, 50);

            // Convert the image to a blob
            $image = $background->toPng();

            // Save the image to the user data
            $userData['profile_img'] = (string) $image;
        }

        $userData['password'] = Hash::make($userData['password']);

        $user = User::create($userData);

        $token = $user->createToken('Personal Access Token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }

    // User sign out
    public function signOut(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

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
