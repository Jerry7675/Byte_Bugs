'use client';
import { useState } from 'react';

export default function WalletTestPage() {
  const [userId, setUserId] = useState('');
  const [amount, setAmount] = useState('');
  const [txnId, setTxnId] = useState('');
  const [reference, setReference] = useState('');
  const [result, setResult] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [balance, setBalance] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleApi = async (url: string, method: string, body?: any) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ error: 'Request failed' });
    } finally {
      setLoading(false);
    }
  };

  const fetchBalance = async () => {
    setLoading(true);
    setBalance(null);
    try {
      const res = await fetch(`/api/wallet/balance?user_id=${userId}`);
      const data = await res.json();
      setBalance(data);
    } catch (e) {
      setBalance({ error: 'Failed to fetch' });
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    setTransactions([]);
    try {
      const res = await fetch(`/api/wallet/transactions?user_id=${userId}`);
      const data = await res.json();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (e) {
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Wallet Test Page</h1>
      <div className="space-y-2">
        <input
          className="border p-2 w-full"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="Transaction ID (for confirm/fail)"
          value={txnId}
          onChange={(e) => setTxnId(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="Reference (optional)"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() =>
            handleApi('/api/wallet/mock-payment/init', 'POST', { userId, amount: Number(amount) })
          }
          disabled={loading}
        >
          Mock Payment Init
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={() =>
            handleApi('/api/wallet/mock-payment/confirm', 'POST', {
              transactionId: txnId,
              reference,
            })
          }
          disabled={loading}
        >
          Mock Payment Confirm
        </button>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded"
          onClick={() =>
            handleApi('/api/wallet/mock-payment/fail', 'POST', { transactionId: txnId, reference })
          }
          disabled={loading}
        >
          Mock Payment Fail
        </button>
        <button
          className="bg-yellow-600 text-white px-4 py-2 rounded"
          onClick={() =>
            handleApi('/api/wallet/use-points', 'POST', { userId, amount: Number(amount) })
          }
          disabled={loading}
        >
          Use Points (Debit)
        </button>
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded"
          onClick={fetchBalance}
          disabled={loading}
        >
          Get Balance
        </button>
        <button
          className="bg-gray-800 text-white px-4 py-2 rounded"
          onClick={fetchTransactions}
          disabled={loading}
        >
          Get Transactions
        </button>
      </div>
      {loading && <div>Loading...</div>}
      {result && (
        <div className="bg-gray-100 p-4 rounded mt-4">
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
      {balance && (
        <div className="bg-green-50 p-4 rounded mt-4">
          <strong>Balance:</strong> {balance.balance ?? JSON.stringify(balance)}
        </div>
      )}
      {transactions.length > 0 && (
        <div className="bg-blue-50 p-4 rounded mt-4">
          <strong>Transactions:</strong>
          <pre className="text-xs">{JSON.stringify(transactions, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
