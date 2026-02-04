<?php

namespace App\Services;

use App\Models\Account;
use App\Models\Transaction;
use Exception;
use Illuminate\Support\Facades\DB;

class TransactionService
{
    /**
     * Transfer money from one account to another atomically.
     *
     * @throws Exception
     */
    public function transfer(int $fromAccountId, int $toAccountId, float $amount): Transaction
    {
        if ($amount <= 0) {
            throw new Exception('Amount must be positive.');
        }

        if ($fromAccountId === $toAccountId) {
            throw new Exception('Cannot transfer to the same account.');
        }

        return DB::transaction(function () use ($fromAccountId, $toAccountId, $amount) {
            // Lock records for update to prevent race conditions
            $fromAccount = Account::where('id', $fromAccountId)->lockForUpdate()->firstOrFail();
            $toAccount = Account::where('id', $toAccountId)->lockForUpdate()->firstOrFail();

            if ($fromAccount->balance < $amount) {
                throw new Exception('Insufficient funds.');
            }

            // Deduct from sender
            $fromAccount->balance -= $amount;
            $fromAccount->save();

            // Add to receiver
            $toAccount->balance += $amount;
            $toAccount->save();

            // Record transaction
            return Transaction::create([
                'from_account_id' => $fromAccountId,
                'to_account_id' => $toAccountId,
                'amount' => $amount,
            ]);
        });
    }
}
