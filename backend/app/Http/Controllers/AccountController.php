<?php

namespace App\Http\Controllers;

class AccountController extends Controller
{
    public function index()
    {
        // Assuming Sanctum auth or basic auth where user is resolved
        $user = auth()->user();

        // If testing without auth middleware for now, might fail if no user.
        // But plan assumes authenticated.
        // For simplicity in this demo app, we might fallback to user 1 if not set?
        // No, stick to plan.
        return response()->json($user->accounts);
    }
}
