<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\TransactionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/login', function (Request $request) {
    $credentials = $request->only('email', 'password');
    if (Illuminate\Support\Facades\Auth::attempt($credentials)) {
        $user = Illuminate\Support\Facades\Auth::user();
        $token = $user->createToken('test-token')->plainTextToken;
        return response()->json(['token' => $token]);
    }
    return response()->json(['error' => 'Unauthorized'], 401);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user/accounts', [AccountController::class, 'index']);
    Route::post('/transfers', [TransactionController::class, 'store']);
    Route::get('/transactions', [TransactionController::class, 'index']);
});
