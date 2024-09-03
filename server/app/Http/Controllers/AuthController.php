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
            $imagePath = public_path('images/profile/user-circle-duotone.png');
            $image = $manager->read($imagePath);

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

            $centerX = 256;
            $centerY = 256;
            $radius = 208;

            $image->drawCircle($centerX, $centerY, function ($circle) use ($selectedColor, $radius) {
                $circle->radius($radius); // radius of circle in pixels
                $circle->background($selectedColor, 50); // background color
            });

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
