import type { Account } from '../types';

interface Props {
    accounts: Account[];
}

const BalanceDisplay = ({ accounts }: Props) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Your Accounts</h2>
            {accounts.length === 0 ? (
                <p className="text-gray-500">No accounts found.</p>
            ) : (
                <div className="space-y-4">
                    {accounts.map((account) => (
                        <div key={account.id} className="p-4 border border-gray-100 rounded-lg bg-gray-50 flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-500">{account.account_number}</p>
                                <p className="text-xs text-gray-400 font-mono">ID: {account.id}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-gray-800">
                                    {parseFloat(account.balance).toFixed(2)}
                                    <span className="text-sm text-gray-500 ml-1">{account.currency}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BalanceDisplay;
