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
        $I->seeResponseContainsJson([
            'transaction' => ['amount' => 50],
            'from_account_balance' => '950.00',
            'to_account_balance' => '550.00'
        ]);
    }

    public function transferValidationFails(ApiTester $I)
    {
        $I->sendPost('/login', ['email' => 'test@example.com', 'password' => 'password']);
        $token = $I->grabDataFromResponseByJsonPath('$.token')[0];
        $I->amBearerAuthenticated($token);

        // Insufficient funds

        $I->sendPost('/transfers', [
            'from_account_id' => 1,
            'to_account_id' => 2,
            'amount' => 1000000 // Insufficient
        ]);
        $I->seeResponseCodeIs(422);

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
    }
}
