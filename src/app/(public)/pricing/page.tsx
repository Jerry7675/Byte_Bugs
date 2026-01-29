'use client';
import { Wallet, Coins, Check } from 'lucide-react';
import Link from 'next/link';

const pointsPackages = [
  { points: 200, price: 50, badge: 'Starter', color: 'blue' },
  { points: 400, price: 95, badge: 'Popular', color: 'green' },
  { points: 2000, price: 475, badge: 'Best Value', color: 'purple' },
];

export default function PricingPage() {
  return (
    <div className="space-y-8 my-25">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Simple, Transparent Pricing</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose the perfect points package for your needs. Use points to unlock premium features,
          boost posts, and connect with investors or startups.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {pointsPackages.map((pkg) => (
          <div
            key={pkg.points}
            className={`glass-card rounded-2xl p-8 border-2 hover:-translate-y-1 transition-all duration-300 ${
              pkg.color === 'blue'
                ? 'border-blue-200 hover:border-blue-400'
                : pkg.color === 'green'
                ? 'border-green-300 hover:border-green-500 shadow-lg scale-105'
                : 'border-purple-200 hover:border-purple-400'
            } ${pkg.color === 'green' ? 'relative' : ''}`}
          >
            {pkg.badge && (
              <div className="mb-4">
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${
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

            {/* Icon and Points */}
            <div className="flex items-center gap-4 mb-6">
              <div
                className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                  pkg.color === 'blue'
                    ? 'bg-gradient-to-br from-blue-100 to-blue-200'
                    : pkg.color === 'green'
                    ? 'bg-gradient-to-br from-green-100 to-green-200'
                    : 'bg-gradient-to-br from-purple-100 to-purple-200'
                }`}
              >
                <Coins
                  className={`w-8 h-8 ${
                    pkg.color === 'blue'
                      ? 'text-blue-700'
                      : pkg.color === 'green'
                      ? 'text-green-700'
                      : 'text-purple-700'
                  }`}
                />
              </div>
              <div>
                <p className="text-4xl font-bold text-gray-900">{pkg.points}</p>
                <p className="text-sm text-gray-500 font-medium">Points</p>
              </div>
            </div>

            {/* Price */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-gray-900">NPR {pkg.price}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {(pkg.price / pkg.points).toFixed(2)} NPR per point
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">Boost your posts</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">Connect with investors</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">Unlock premium features</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">Priority support</span>
              </div>
            </div>

            {/* CTA Button */}
            <Link href="/login">
              <button
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  pkg.color === 'green'
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                View in Wallet
              </button>
            </Link>
          </div>
        ))}
      </div>

      {/* Info Section */}
      <div className="glass-card rounded-2xl p-8 max-w-4xl mx-auto border border-gray-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center flex-shrink-0">
            <Wallet className="w-6 h-6 text-green-700" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">How Points Work</h3>
            <p className="text-gray-600 mb-4">
              Points are the medium of service exchange in our platform. Use them to access premium features and grow
              your network. Purchase points securely through your wallet and start connecting today.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="space-y-1">
                <p className="font-semibold text-gray-900">Boost Posts</p>
                <p className="text-sm text-gray-600">Increase visibility and reach</p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-gray-900">Connect Premium</p>
                <p className="text-sm text-gray-600">Message top investors & startups</p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-gray-900">Unlock Features</p>
                <p className="text-sm text-gray-600">Access exclusive tools</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="glass-card rounded-lg p-6 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">How do I purchase points?</h4>
            <p className="text-gray-600 text-sm">
              Navigate to your wallet page after logging in. Select a package and follow the secure
              payment process to add points to your account.
            </p>
          </div>
          <div className="glass-card rounded-lg p-6 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">Do points expire?</h4>
            <p className="text-gray-600 text-sm">
              No, your points never expire. Use them at your own pace to unlock features and boost
              your presence on the platform.
            </p>
          </div>
          <div className="glass-card rounded-lg p-6 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">Can I get a refund?</h4>
            <p className="text-gray-600 text-sm">
              Points are non-refundable once purchased. However, if you experience any issues,
              please contact our support team for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
