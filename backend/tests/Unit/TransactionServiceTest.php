<?php

namespace Tests\Unit;

use App\Models\Account;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TransactionServiceTest extends TestCase
{
    /**
     * A basic unit test example.
     */
    use RefreshDatabase;

    protected $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new \App\Services\TransactionService;
    }

    public function test_can_transfer_money_successfully()
    {
        $user = User::factory()->create();
        $account1 = Account::create(['user_id' => $user->id, 'account_number' => 'ACC1', 'balance' => 100, 'currency' => 'USD']);
        $account2 = Account::create(['user_id' => $user->id, 'account_number' => 'ACC2', 'balance' => 50, 'currency' => 'USD']);

        $transaction = $this->service->transfer($account1->id, $account2->id, 30);

        $this->assertEquals(70, $account1->fresh()->balance);
        $this->assertEquals(80, $account2->fresh()->balance);
        $this->assertDatabaseHas('transactions', [
            'from_account_id' => $account1->id,
            'to_account_id' => $account2->id,
            'amount' => 30,
        ]);
    }

    public function test_cannot_transfer_insufficient_funds()
    {
        $user = User::factory()->create();
        $account1 = Account::create(['user_id' => $user->id, 'account_number' => 'ACC1', 'balance' => 10, 'currency' => 'USD']);
        $account2 = Account::create(['user_id' => $user->id, 'account_number' => 'ACC2', 'balance' => 50, 'currency' => 'USD']);

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Insufficient funds');

        $this->service->transfer($account1->id, $account2->id, 30);
    }

    public function test_cannot_transfer_negative_amount()
    {
        $user = User::factory()->create();
        $account1 = Account::create(['user_id' => $user->id, 'account_number' => 'ACC1', 'balance' => 100, 'currency' => 'USD']);
        $account2 = Account::create(['user_id' => $user->id, 'account_number' => 'ACC2', 'balance' => 50, 'currency' => 'USD']);

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Amount must be positive');

        $this->service->transfer($account1->id, $account2->id, -10);
    }
}
