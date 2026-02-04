import { test, expect } from '@playwright/test';

test('User can view balance and transfer funds', async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:3000');

    // Wait for the Dashboard to load
    await expect(page.getByText('FinTest Dashboard')).toBeVisible();
    await expect(page.getByText('Your Accounts')).toBeVisible();

    const account1Number = 'US1234567890';
    const account2Number = 'EU0987654321';

    // Instead of hardcoding 1000.00, we grab the CURRENT balance 
    // to make the test resilient to shared DB state across workers.
    const acc1Card = page.locator('div.bg-gray-50').filter({ hasText: account1Number });
    const acc2Card = page.locator('div.bg-gray-50').filter({ hasText: account2Number });

    // Wait for any numeric value to appear in the card
    await expect(acc1Card.locator('p.text-2xl')).toContainText(/\d+\.\d+/);

    const acc1InitialText = await acc1Card.locator('p.text-2xl').innerText();
    const acc2InitialText = await acc2Card.locator('p.text-2xl').innerText();

    const acc1InitialBalance = parseFloat(acc1InitialText.replace(/[^\d.-]/g, ''));
    const acc2InitialBalance = parseFloat(acc2InitialText.replace(/[^\d.-]/g, ''));

    const transferAmount = 10.00;

    // Perform Transfer
    await page.locator('select').selectOption('1');
    await page.getByPlaceholder('Enter destination account ID').fill('2');
    await page.getByPlaceholder('0.00').fill(transferAmount.toString());
    await page.getByRole('button', { name: 'Transfer' }).click();

    // Verify Success message
    await expect(page.getByText('Transfer successful!')).toBeVisible();

    // Calculate expected balances
    const expectedAcc1 = (acc1InitialBalance - transferAmount).toFixed(2);
    const expectedAcc2 = (acc2InitialBalance + transferAmount).toFixed(2);

    // Verify updated balances with a timeout for the refetch
    await expect(acc1Card.getByText(expectedAcc1)).toBeVisible({ timeout: 15000 });
    await expect(acc2Card.getByText(expectedAcc2)).toBeVisible({ timeout: 15000 });

    // Verify the transaction appeared in the recent transactions list
    await expect(page.getByText('Transfer').first()).toBeVisible();
    await expect(page.getByText(transferAmount.toFixed(2)).first()).toBeVisible();
});
