<?php

namespace Tests\Api;

use Tests\Support\ApiTester;

class TransferCest
{
    public function _before(ApiTester $I)
    {
        $I->haveHttpHeader('Accept', 'application/json');
        $I->haveHttpHeader('Content-Type', 'application/json');
    }

    // tests
    public function transferMoneySuccessfully(ApiTester $I)
    {
        // Assuming database is seeded with users and accounts.
        // We need to know IDs or use data from API if possible.
        // But since we are black-box testing with seeded data:
        // User 1 (Test User) has Account 1 (US...) and Account 2 (EU...).
        // But seed created accounts with IDs. Account::create returns ID.
        // IDs are likely 1 and 2 for User 1.

        // We need to authenticat first.
        // Since I haven't implemented a login endpoint that returns token easily (Sanctum needs one),
        // I should add a helper route in api.php or just use a known token?
        // Wait, I can't easily get a token without a route.
        // I'll update api.php to include a login route for testing.

        $I->sendPost('/login', ['email' => 'test@example.com', 'password' => 'password']);
        $I->seeResponseCodeIs(200);
        $token = $I->grabDataFromResponseByJsonPath('$.token')[0];

        $I->amBearerAuthenticated($token);

        $I->sendPost('/transfers', [
            'from_account_id' => 1,
            'to_account_id' => 2,
            'amount' => 50
        ]);

        $I->seeResponseCodeIs(201);
        $I->seeResponseContainsJson(['amount' => 50]);
    }

    public function transferValidationFails(ApiTester $I)
    {
        $I->sendPost('/login', ['email' => 'test@example.com', 'password' => 'password']);
        $token = $I->grabDataFromResponseByJsonPath('$.token')[0];
        $I->amBearerAuthenticated($token);

        // Insufficient funds (balance became 950 after first test? No, DB resets? 
        // DatabaseSeeder runs once. Tests run on same DB if not refreshed.
        // Codeception doesn't auto-refresh DB unless configured.
        // I should have enabled Db module or Laravel module's cleanup?
        // But running against 'serve' means persistent DB unless I use RefreshDatabase in Laravel, 
        // but API tests are external.
        // The DB is persistent sqlite/pgsql?
        // I am running 'serve' which uses `.env` config. `.env` uses pgsql or sqlite?
        // I haven't checked `.env`. `php artisan serve` uses `.env`.
        // I configured `phpunit.xml` for sqlite :memory:, but `serve` uses `.env`.
        // `.env` uses `pgsql`.
        // So DB persists.
        // I should probably assume state or reset it.
        // For simplicity, I'll use large amount for failure.

        $I->sendPost('/transfers', [
            'from_account_id' => 1,
            'to_account_id' => 2,
            'amount' => 1000000 // Insufficient
        ]);
        $I->seeResponseCodeIs(422); // Or 500 if exception not caught as validation error?
        // Controller catches Exception and returns 422.

        // Invalid input
        $I->sendPost('/transfers', [
            'amount' => -10
        ]);
        $I->seeResponseCodeIs(422); // Validation error
    }

    public function listAccounts(ApiTester $I)
    {
        $I->sendPost('/login', ['email' => 'test@example.com', 'password' => 'password']);
        $token = $I->grabDataFromResponseByJsonPath('$.token')[0];
        $I->amBearerAuthenticated($token);

        $I->sendGet('/user/accounts');
        $I->seeResponseCodeIs(200);
        $I->seeResponseIsJson();
        $I->seeResponseJsonMatchesJsonPath('$[*].account_number');
    }

    public function listTransactions(ApiTester $I)
    {
        $I->sendPost('/login', ['email' => 'test@example.com', 'password' => 'password']);
        $token = $I->grabDataFromResponseByJsonPath('$.token')[0];
        $I->amBearerAuthenticated($token);

        $I->sendGet('/transactions');
        $I->seeResponseCodeIs(200);
        $I->seeResponseIsJson();
        // Should see the transaction we created in first test if order is maintained?
        // Order of execution in Cest: alphabetical? or definition order?
        // Usually definition order.
    }
}
