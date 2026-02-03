<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $user = \App\Models\User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);

        \App\Models\Account::create([
            'user_id' => $user->id,
            'account_number' => 'US1234567890',
            'balance' => 1000.00,
            'currency' => 'USD'
        ]);

        \App\Models\Account::create([
            'user_id' => $user->id,
            'account_number' => 'EU0987654321',
            'balance' => 500.00,
            'currency' => 'EUR'
        ]);

        // Create a second user for transfer tests
        $user2 = \App\Models\User::factory()->create([
            'name' => 'Second User',
            'email' => 'second@example.com',
            'password' => bcrypt('password'),
        ]);

        \App\Models\Account::create([
            'user_id' => $user2->id,
            'account_number' => 'US0000000002',
            'balance' => 100.00,
            'currency' => 'USD'
        ]);
    }
}
