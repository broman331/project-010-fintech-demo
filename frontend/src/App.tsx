import { useEffect, useState, useCallback } from 'react';
import api, { setAuthToken } from './api';
import type { Account, Transaction } from './types';
import BalanceDisplay from './components/BalanceDisplay';
import TransferForm from './components/TransferForm';
import TransactionList from './components/TransactionList';

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Login for demo
  useEffect(() => {
    const login = async () => {
      try {
        // Hardcoded credentials for demo as allowed by plan "small app"
        const res = await api.post('/login', { email: 'test@example.com', password: 'password' });
        setToken(res.data.token);
        setAuthToken(res.data.token);
      } catch (e) {
        console.error("Login failed", e);
      }
    };
    login();
  }, []);

  const fetchData = useCallback(async () => {
    if (!token) return;
    try {
      const accRes = await api.get('/user/accounts');
      setAccounts(accRes.data);
      const transRes = await api.get('/transactions');
      setTransactions(transRes.data);
    } catch (e) {
      console.error(e);
    }
  }, [token]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">FinTest Dashboard</h1>
          <p className="text-gray-600">Welcome, Test User</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <BalanceDisplay accounts={accounts} />
            <TransferForm accounts={accounts} onTransferSuccess={fetchData} />
          </div>
          <div>
            <TransactionList transactions={transactions} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
