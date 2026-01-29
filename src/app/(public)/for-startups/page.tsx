'use client';
import { Rocket, TrendingUp, Users, MessageSquare, Award, Zap, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ForStartupsPage() {
  return (
    <div className="space-y-16 my-20">
      {/* Hero Section */}
      <div className="text-center space-y-6 pt-8">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
            <Rocket className="w-10 h-10 text-green-700" />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-gray-900">
          Launch Your Startup <span className="text-green-600">to New Heights</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Connect with investors who believe in your vision. Showcase your startup, build
          credibility, and secure the funding you need to grow.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Link href="/signup">
            <button className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg">
              Get Started Free
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
          Everything You Need to Succeed
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card rounded-2xl p-8 border border-gray-200 hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mb-6">
              <Users className="w-7 h-7 text-blue-700" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Connect with Investors</h3>
            <p className="text-gray-600">
              Access a curated network of active investors looking for promising startups like
              yours. Build meaningful relationships that go beyond funding.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8 border border-gray-200 hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center mb-6">
              <Award className="w-7 h-7 text-green-700" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Build Credibility</h3>
            <p className="text-gray-600">
              Get verified, showcase your achievements, and establish trust with our comprehensive
              startup verification system.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8 border border-gray-200 hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center mb-6">
              <MessageSquare className="w-7 h-7 text-purple-700" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Direct Messaging</h3>
            <p className="text-gray-600">
              Communicate directly with interested investors. No middlemen, no delays. Just
              straight-to-the-point conversations that matter.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8 border border-gray-200 hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center mb-6">
              <TrendingUp className="w-7 h-7 text-orange-700" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Boost Visibility</h3>
            <p className="text-gray-600">
              Promote your posts and announcements to reach more potential investors. Get noticed in
              a crowded marketplace.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8 border border-gray-200 hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center mb-6">
              <Zap className="w-7 h-7 text-pink-700" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Matching</h3>
            <p className="text-gray-600">
              Our intelligent matching system connects you with investors who are most interested in
              your industry and stage.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8 border border-gray-200 hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center mb-6">
              <CheckCircle className="w-7 h-7 text-teal-700" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Track Progress</h3>
            <p className="text-gray-600">
              Monitor your funding journey with detailed analytics. See who's interested, track
              conversations, and manage agreements.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="glass-card rounded-2xl p-12 max-w-5xl mx-auto border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How It Works</h2>
        <div className="space-y-8">
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-xl">
              1
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Create Your Profile</h3>
              <p className="text-gray-600">
                Sign up and complete your startup profile with all the essential details. Add your
                pitch deck, team information, and business metrics.
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-xl">
              2
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Get Verified</h3>
              <p className="text-gray-600">
                Apply for verification to build trust and credibility. Verified startups get more
                visibility and attract serious investors.
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-xl">
              3
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Connect & Engage</h3>
              <p className="text-gray-600">
                Share updates, boost your posts, and engage with investors. Use our matching system
                to find the perfect funding partners.
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-xl">
              4
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Funding</h3>
              <p className="text-gray-600">
                Negotiate terms, finalize agreements, and secure the capital you need to take your
                startup to the next level.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="glass-card rounded-2xl p-12 max-w-4xl mx-auto border-2 border-green-300 bg-gradient-to-br from-green-50 to-green-100">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Ready to Get Funded?</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Join hundreds of startups already connecting with investors and securing funding on our
            platform.
          </p>
          <Link href="/signup?role=STARTUP">
            <button className="px-10 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg text-lg">
              Start Your Journey Today
            </button>
          </Link>
          <p className="text-sm text-gray-600">No credit card required • Free to get started</p>
        </div>
      </div>
    </div>
  );
}
