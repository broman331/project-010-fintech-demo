<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TransactionController extends Controller
{
    protected $transactionService;

    public function __construct(\App\Services\TransactionService $transactionService)
    {
        $this->transactionService = $transactionService;
    }

    public function index()
    {
        $userId = auth()->id();
        $transactions = \App\Models\Transaction::whereHas('fromAccount', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })->orWhereHas('toAccount', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })->with(['fromAccount', 'toAccount'])->latest()->get();

        return response()->json($transactions);
    }

    public function store(\Illuminate\Http\Request $request)
    {
        $validated = $request->validate([
            'from_account_id' => 'required|exists:accounts,id',
            'to_account_id' => 'required|exists:accounts,id',
            'amount' => 'required|numeric|min:0.01'
        ]);

        try {
            $transaction = $this->transactionService->transfer(
                $validated['from_account_id'],
                $validated['to_account_id'],
                $validated['amount']
            );

            return response()->json([
                'transaction' => $transaction,
                'from_account_balance' => $transaction->fromAccount->balance,
                'to_account_balance' => $transaction->toAccount->balance,
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }
}
