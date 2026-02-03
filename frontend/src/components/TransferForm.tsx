import { useState } from 'react';
import type { Account } from '../types';
import api from '../api';

interface Props {
    accounts: Account[];
    onTransferSuccess: () => void;
}

const TransferForm = ({ accounts, onTransferSuccess }: Props) => {
    const [fromAccount, setFromAccount] = useState<string>('');
    const [toAccountId, setToAccountId] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            await api.post('/transfers', {
                from_account_id: parseInt(fromAccount),
                to_account_id: parseInt(toAccountId),
                amount: parseFloat(amount)
            });
            setSuccess('Transfer successful!');
            setAmount('');
            onTransferSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || err.response?.data?.error || 'Transfer failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Transfer Funds</h2>

            {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
            {success && <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From Account</label>
                    <select
                        value={fromAccount}
                        onChange={(e) => setFromAccount(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                    >
                        <option value="">Select Account</option>
                        {accounts.map(acc => (
                            <option key={acc.id} value={acc.id}>{acc.account_number} ({acc.currency})</option>
                        ))}
                    </select>
                </div>

                <div>
                    {/* For demo simplicity, we manually enter To Account ID, but in real app we might select from beneficiaries or search. 
               Plan says "allows users to view account balances and transfer funds". 
               Inputting ID is easiest for now given we have list of IDs in balance view. */}
                    <label className="block text-sm font-medium text-gray-700 mb-1">To Account ID</label>
                    <input
                        type="number"
                        value={toAccountId}
                        onChange={(e) => setToAccountId(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Enter destination account ID"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <input
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="0.00"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    {loading ? 'Processing...' : 'Transfer'}
                </button>
            </form>
        </div>
    );
};

export default TransferForm;
