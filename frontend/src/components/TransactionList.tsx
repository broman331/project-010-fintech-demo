import type { Transaction } from '../types';

interface Props {
    transactions: Transaction[];
}

const TransactionList = ({ transactions }: Props) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6 h-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Recent Transactions</h2>
            {transactions.length === 0 ? (
                <p className="text-gray-500">No transactions yet.</p>
            ) : (
                <div className="overflow-y-auto max-h-[500px] space-y-3">
                    {transactions.map((tx) => (
                        <div key={tx.id} className="p-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-800">
                                        Transfer
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(tx.created_at).toLocaleString()}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        From: {tx.from_account?.account_number || 'Unknown'} → To: {tx.to_account?.account_number || 'Unknown'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-gray-800">
                                        {parseFloat(tx.amount).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TransactionList;
