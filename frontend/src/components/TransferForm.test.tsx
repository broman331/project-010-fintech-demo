import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import TransferForm from './TransferForm';
import api from '../api';

vi.mock('../api');

describe('TransferForm', () => {
    const mockAccounts = [
        { id: 1, user_id: 1, account_number: 'ACC1', balance: '100.00', currency: 'USD' },
        { id: 2, user_id: 1, account_number: 'ACC2', balance: '50.00', currency: 'EUR' },
    ];
    const mockOnSuccess = vi.fn();

    it('renders form elements', () => {
        render(<TransferForm accounts={mockAccounts} onTransferSuccess={mockOnSuccess} />);
        expect(screen.getByText('Transfer Funds')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Transfer/i })).toBeInTheDocument();
    });

    it('submits transfer successfully', async () => {
        (api.post as any).mockResolvedValueOnce({ data: { id: 100 } });
        render(<TransferForm accounts={mockAccounts} onTransferSuccess={mockOnSuccess} />);

        // Select from account
        fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } });
        // Enter to account
        fireEvent.change(screen.getByPlaceholderText('Enter destination account ID'), { target: { value: '2' } });
        // Enter amount
        fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '10' } });

        fireEvent.click(screen.getByText('Transfer'));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/transfers', {
                from_account_id: 1,
                to_account_id: 2,
                amount: 10
            });
            expect(screen.getByText('Transfer successful!')).toBeInTheDocument();
            expect(mockOnSuccess).toHaveBeenCalled();
        });
    });
});
