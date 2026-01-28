/**
 * Funding Agreement Request Form
 *
 * Allows verified users to create funding agreement requests
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FundingRequestFormProps {
  counterpartyId: string;
  counterpartyName: string;
  counterpartyRole: 'INVESTOR' | 'STARTUP';
}

const FUNDING_CATEGORIES = [
  { value: 'SEED', label: 'Seed Funding' },
  { value: 'SERIES_A', label: 'Series A' },
  { value: 'SERIES_B', label: 'Series B' },
  { value: 'SERIES_C', label: 'Series C' },
  { value: 'BRIDGE', label: 'Bridge Funding' },
  { value: 'VENTURE_DEBT', label: 'Venture Debt' },
  { value: 'ANGEL', label: 'Angel Investment' },
  { value: 'STRATEGIC', label: 'Strategic Investment' },
  { value: 'OTHER', label: 'Other' },
];

export default function FundingRequestForm({
  counterpartyId,
  counterpartyName,
  counterpartyRole,
}: FundingRequestFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    category: 'SEED',
    fundingAmount: '',
    acceptTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.acceptTerms) {
      setError('You must accept the terms and policies to proceed');
      return;
    }

    if (!formData.fundingAmount || parseFloat(formData.fundingAmount) <= 0) {
      setError('Please enter a valid funding amount');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/funding-agreements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          counterpartyId,
          category: formData.category,
          fundingAmount: parseFloat(formData.fundingAmount),
          acceptTerms: formData.acceptTerms,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create funding agreement');
      }

      // Redirect to agreement details page
      router.push(`/dashboard/funding-agreements/${data.data.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create funding agreement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-xl p-6 md:p-8 border border-gray-100">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
        Create Funding Agreement
      </h2>

      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>With:</strong> {counterpartyName} ({counterpartyRole})
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Funding Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          >
            {FUNDING_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="fundingAmount" className="block text-sm font-medium text-gray-700 mb-2">
            Funding Amount (USD) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-gray-500">$</span>
            <input
              type="number"
              id="fundingAmount"
              name="fundingAmount"
              value={formData.fundingAmount}
              onChange={(e) => setFormData({ ...formData, fundingAmount: e.target.value })}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Platform commission: 5% | Net amount: $
            {formData.fundingAmount
              ? (parseFloat(formData.fundingAmount) * 0.95).toFixed(2)
              : '0.00'}
          </p>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Terms & Policies</h3>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mb-4 max-h-48 overflow-y-auto">
            <p className="text-sm text-gray-700 mb-3">
              <strong>Platform Terms & Conditions (v1.0.0)</strong>
            </p>
            <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
              <li>All funding agreements are legally binding between parties</li>
              <li>A 5% platform commission will be deducted from the funding amount</li>
              <li>Both parties must explicitly accept these terms to finalize the agreement</li>
              <li>Funds are subject to verification and compliance checks</li>
              <li>Cancellation is only allowed before counterparty acceptance</li>
              <li>Successful funding records are immutable and permanent</li>
              <li>Platform is not liable for disputes between parties</li>
              <li>All transactions comply with applicable regulations</li>
            </ul>
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="acceptTerms"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
              className="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              required
            />
            <label htmlFor="acceptTerms" className="text-sm text-gray-700">
              I have read and agree to the platform terms and policies, and understand that this
              agreement is legally binding upon acceptance by both parties.{' '}
              <span className="text-red-500">*</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !formData.acceptTerms}
          >
            {loading ? 'Creating...' : 'Create Agreement'}
          </button>
        </div>
      </form>
    </div>
  );
}
