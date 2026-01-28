'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/authContext';
import { Wallet, Coins, TrendingUp, CheckCircle, X, Loader, AlertCircle } from 'lucide-react';

interface PendingPayment {
  transactionId: string;
  amount: number;
  points: number;
  price: number;
}

const pointsPackages = [
  { points: 200, price: 50, badge: 'Starter', color: 'blue' },
  { points: 400, price: 95, badge: 'Popular', color: 'green' },
  { points: 2000, price: 475, badge: 'Best Value', color: 'purple' },
];

export default function WalletPage() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingPayment, setPendingPayment] = useState<PendingPayment | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [adminUserId, setAdminUserId] = useState('');
  const [fetchingTransactions, setFetchingTransactions] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      fetchBalance();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchBalance = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/wallet/balance?user_id=${user.id}`);
      const data = await res.json();
      setBalance(data.balance ?? 0);
    } catch (e) {
      console.error('Failed to fetch balance');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (points: number, price: number) => {
    if (!user?.id) return;
    setProcessingPayment(true);
    try {
      const res = await fetch('/api/wallet/mock-payment/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, amount: points }),
      });
      const data = await res.json();
      if (data.transactionId) {
        setPendingPayment({
          transactionId: data.transactionId,
          amount: points,
          points,
          price,
        });
      }
    } catch (e) {
      console.error('Failed to initiate payment');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!pendingPayment) return;
    setProcessingPayment(true);
    try {
      const res = await fetch('/api/wallet/mock-payment/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId: pendingPayment.transactionId }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setPendingPayment(null);
        fetchBalance();
      }
    } catch (e) {
      console.error('Failed to confirm payment');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleCancelPayment = async () => {
    if (!pendingPayment) return;
    setProcessingPayment(true);
    try {
      await fetch('/api/wallet/mock-payment/fail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId: pendingPayment.transactionId }),
      });
      setPendingPayment(null);
    } catch (e) {
      console.error('Failed to cancel payment');
    } finally {
      setProcessingPayment(false);
    }
  };

  const fetchAdminTransactions = async () => {
    if (!adminUserId) return;
    setFetchingTransactions(true);
    try {
      const res = await fetch(`/api/wallet/transactions?user_id=${adminUserId}`);
      const data = await res.json();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to fetch transactions');
      setTransactions([]);
    } finally {
      setFetchingTransactions(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 text-green-600 animate-spin" />
      </div>
    );
  }

  // Admin View
  if (user.role === 'ADMIN') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Wallet Manager</h1>
          <p className="mt-2 text-gray-600">View user transaction history</p>
        </div>

        <div className="glass-card rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">User Transactions</h2>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter User ID"
              value={adminUserId}
              onChange={(e) => setAdminUserId(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              onClick={fetchAdminTransactions}
              disabled={fetchingTransactions || !adminUserId}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {fetchingTransactions ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <TrendingUp className="w-4 h-4" />
              )}
              Get Transactions
            </button>
          </div>
        </div>

        {transactions.length > 0 && (
          <div className="glass-card rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Transaction History ({transactions.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(tx.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            tx.type === 'purchase'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold">
                        <span className={tx.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                          {tx.amount > 0 ? '+' : ''}
                          {tx.amount}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            tx.status === 'success'
                              ? 'bg-green-100 text-green-800'
                              : tx.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 font-mono text-xs">
                        {tx.reference?.substring(0, 20)}...
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  // User View (Investor/Startup)
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Wallet</h1>
        <p className="mt-2 text-gray-600">Manage your points and purchase packages</p>
      </div>

      {/* Current Balance */}
      <div className="glass-card rounded-lg p-6 bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">Available Balance</p>
            {loading ? (
              <Loader className="w-6 h-6 text-green-600 animate-spin" />
            ) : (
              <p className="text-4xl font-bold text-gray-900">{balance}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">Points</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
            <Wallet className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* Purchase Packages */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Purchase Points</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pointsPackages.map((pkg) => (
            <div
              key={pkg.points}
              className={`glass-card rounded-lg p-6 border-2 hover:-translate-y-1 transition-all duration-300 cursor-pointer ${
                pkg.color === 'blue'
                  ? 'border-blue-200 hover:border-blue-400'
                  : pkg.color === 'green'
                  ? 'border-green-200 hover:border-green-400'
                  : 'border-purple-200 hover:border-purple-400'
              }`}
              onClick={() => !processingPayment && handlePurchase(pkg.points, pkg.price)}
            >
              {pkg.badge && (
                <div className="mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      pkg.color === 'blue'
                        ? 'bg-blue-100 text-blue-700'
                        : pkg.color === 'green'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}
                  >
                    {pkg.badge}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    pkg.color === 'blue'
                      ? 'bg-gradient-to-br from-blue-100 to-blue-200'
                      : pkg.color === 'green'
                      ? 'bg-gradient-to-br from-green-100 to-green-200'
                      : 'bg-gradient-to-br from-purple-100 to-purple-200'
                  }`}
                >
                  <Coins
                    className={`w-6 h-6 ${
                      pkg.color === 'blue'
                        ? 'text-blue-700'
                        : pkg.color === 'green'
                        ? 'text-green-700'
                        : 'text-purple-700'
                    }`}
                  />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">{pkg.points}</p>
                  <p className="text-sm text-gray-500">Points</p>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <p className="text-2xl font-bold text-gray-900 mb-1">NPR {pkg.price}</p>
                <p className="text-xs text-gray-500">
                  {(pkg.price / pkg.points).toFixed(2)} NPR per point
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      {pendingPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-2xl p-8 max-w-md w-full border border-gray-200 shadow-2xl">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Confirm Payment
            </h3>
            <p className="text-gray-600 text-center mb-6">
              You are about to purchase {pendingPayment.points} points for NPR{' '}
              {pendingPayment.price}
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Points:</span>
                <span className="font-semibold text-gray-900">{pendingPayment.points}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Price:</span>
                <span className="font-semibold text-gray-900">NPR {pendingPayment.price}</span>
              </div>
              <div className="flex justify-between text-xs pt-2 border-t border-gray-200">
                <span className="text-gray-500">Transaction ID:</span>
                <span className="font-mono text-gray-600">
                  {pendingPayment.transactionId.substring(0, 12)}...
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCancelPayment}
                disabled={processingPayment}
                className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
              <button
                onClick={handleConfirmPayment}
                disabled={processingPayment}
                className="flex-1 px-4 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processingPayment ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <CheckCircle className="w-5 h-5" />
                )}
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
