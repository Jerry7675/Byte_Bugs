'use client';
import {
  Briefcase,
  Target,
  TrendingUp,
  Shield,
  Users,
  BarChart3,
  CheckCircle,
  Search,
} from 'lucide-react';
import Link from 'next/link';

export default function ForInvestorsPage() {
  return (
    <div className="space-y-16 my-20">
      {/* Hero Section */}
      <div className="text-center space-y-6 pt-8">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
            <Briefcase className="w-10 h-10 text-blue-700" />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-gray-900">
          Discover Your Next <span className="text-green-600">Big Investment</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Access a curated network of verified startups seeking funding. Make data-driven
          investment decisions and build your portfolio.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Link href="/signup?role=INVESTOR">
            <button className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg">
              Join as Investor
            </button>
          </Link>
          <Link href="/pricing">
            <button className="px-8 py-3 bg-white text-green-700 border-2 border-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors">
              View Pricing
            </button>
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Smart Investment Tools for Modern Investors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card rounded-2xl p-8 border border-gray-200 hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mb-6">
              <Shield className="w-7 h-7 text-blue-700" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Verified Startups</h3>
            <p className="text-gray-600">
              Every startup goes through our rigorous verification process. Invest with confidence
              knowing you're dealing with legitimate businesses.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8 border border-gray-200 hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center mb-6">
              <Target className="w-7 h-7 text-green-700" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Matching</h3>
            <p className="text-gray-600">
              Our algorithm matches you with startups that align with your investment criteria,
              industry preferences, and risk profile.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8 border border-gray-200 hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center mb-6">
              <BarChart3 className="w-7 h-7 text-purple-700" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Detailed Analytics</h3>
            <p className="text-gray-600">
              Access comprehensive data on startups including financials, team backgrounds, market
              potential, and growth metrics.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8 border border-gray-200 hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center mb-6">
              <Search className="w-7 h-7 text-orange-700" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Advanced Filtering</h3>
            <p className="text-gray-600">
              Filter startups by industry, stage, location, funding requirements, and more. Find
              exactly what you're looking for quickly.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8 border border-gray-200 hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center mb-6">
              <Users className="w-7 h-7 text-pink-700" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Direct Communication</h3>
            <p className="text-gray-600">
              Connect directly with founders. Ask questions, request additional information, and
              build relationships before investing.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8 border border-gray-200 hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center mb-6">
              <TrendingUp className="w-7 h-7 text-teal-700" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Portfolio Management</h3>
            <p className="text-gray-600">
              Track all your investments in one place. Monitor progress, manage agreements, and stay
              updated on your portfolio companies.
            </p>
          </div>
        </div>
      </div>

      {/* Investment Process */}
      <div className="glass-card rounded-2xl p-12 max-w-5xl mx-auto border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Your Investment Journey
        </h2>
        <div className="space-y-8">
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
              1
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Create Investor Profile</h3>
              <p className="text-gray-600">
                Set up your profile with investment preferences, sectors of interest, and ticket
                size. Let startups know what you're looking for.
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
              2
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Explore Opportunities</h3>
              <p className="text-gray-600">
                Browse through verified startups, use advanced filters, and get personalized
                recommendations based on your investment criteria.
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
              3
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Due Diligence</h3>
              <p className="text-gray-600">
                Review detailed startup profiles, financials, and pitch decks. Communicate directly
                with founders to get all your questions answered.
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
              4
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Invest & Manage</h3>
              <p className="text-gray-600">
                Finalize terms, complete agreements, and add to your portfolio. Track performance
                and stay connected with your investments.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="glass-card rounded-2xl p-12 max-w-5xl mx-auto border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-2">500+</p>
            <p className="text-gray-600 font-medium">Verified Startups</p>
          </div>
          <div>
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-2">200+</p>
            <p className="text-gray-600 font-medium">Active Investors</p>
          </div>
          <div>
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-2">$10M+</p>
            <p className="text-gray-600 font-medium">Funding Secured</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {/* <div className="glass-card rounded-2xl p-12 max-w-4xl mx-auto border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Start Building Your Portfolio</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Join our community of investors discovering and funding the next generation of
            successful startups.
          </p>
          <Link href="/signup?role=INVESTOR">
            <button className="px-10 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg text-lg">
              Join as Investor
            </button>
          </Link>
          <p className="text-sm text-gray-600">No commitment required • Free to browse</p>
        </div>
      </div> */}
    </div>
  );
}
