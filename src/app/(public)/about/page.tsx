'use client';
import { Heart, Target, Users, Zap, Globe, Shield, Mail } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="space-y-16 my-20">
      {/* Hero Section */}
      <div className="text-center space-y-6 pt-8">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
            <Heart className="w-10 h-10 text-green-700" />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-gray-900">
          Connecting <span className="text-green-600">Dreams</span> with{' '}
          <span className="text-blue-600">Capital</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We're on a mission to make startup funding accessible, transparent, and efficient for
          entrepreneurs and investors alike.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card rounded-2xl p-10 border border-gray-200">
          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center mb-6">
            <Target className="w-7 h-7 text-green-700" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            To democratize startup funding by creating a platform where ambitious entrepreneurs can
            connect with the right investors, build meaningful relationships, and secure the capital
            they need to turn their visions into reality.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-10 border border-gray-200">
          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mb-6">
            <Zap className="w-7 h-7 text-blue-700" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
          <p className="text-gray-600 leading-relaxed">
            To become the world's most trusted platform for startup-investor connections, fostering
            innovation and economic growth by making quality investment opportunities accessible to
            all.
          </p>
        </div>
      </div>

      {/* Our Story */}
      <div className="glass-card rounded-2xl p-12 max-w-5xl mx-auto border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Story</h2>
        <div className="space-y-6 text-gray-600 leading-relaxed">
          <p>
            Founded in 2025, our platform was born out of a simple observation: fundraising is
            broken. Startups struggle to find the right investors, and investors miss out on great
            opportunities due to information asymmetry and limited access.
          </p>
          <p>
            We set out to change that. By leveraging technology and building a community of verified
            participants, we've created a space where startups and investors can connect directly,
            transparently, and efficiently.
          </p>
          <p>
            Today, we're proud to have facilitated over $10M in funding across hundreds of startups,
            from early-stage ventures to growth-stage companies. But we're just getting started.
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card rounded-2xl p-8 border border-gray-200 text-center hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                <Shield className="w-7 h-7 text-green-700" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Trust & Transparency</h3>
            <p className="text-gray-600">
              We verify every participant and maintain transparency in all transactions. Trust is
              the foundation of every successful investment.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8 border border-gray-200 text-center hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <Users className="w-7 h-7 text-blue-700" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Community First</h3>
            <p className="text-gray-600">
              We're building more than a platform—we're creating a community where entrepreneurs and
              investors support each other's success.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8 border border-gray-200 text-center hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                <Globe className="w-7 h-7 text-purple-700" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Innovation</h3>
            <p className="text-gray-600">
              We continuously evolve our platform with cutting-edge features to make fundraising
              easier, faster, and more effective.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="glass-card rounded-2xl p-12 max-w-4xl mx-auto border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Meet the Team</h2>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          We're a passionate team of entrepreneurs, investors, and technologists committed to
          transforming how startups get funded.
        </p>
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Our diverse team brings together decades of experience in:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium text-sm">
              Startup Operations
            </span>
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium text-sm">
              Venture Capital
            </span>
            <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-medium text-sm">
              Technology
            </span>
            <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full font-medium text-sm">
              Product Design
            </span>
            <span className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full font-medium text-sm">
              Financial Services
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="glass-card rounded-2xl p-12 max-w-5xl mx-auto border border-gray-200 bg-gradient-to-br from-green-50 to-green-100">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <p className="text-5xl font-bold text-green-600 mb-2">500+</p>
            <p className="text-gray-700 font-medium">Startups</p>
          </div>
          <div className="text-center">
            <p className="text-5xl font-bold text-blue-600 mb-2">200+</p>
            <p className="text-gray-700 font-medium">Investors</p>
          </div>
          <div className="text-center">
            <p className="text-5xl font-bold text-purple-600 mb-2">$10M+</p>
            <p className="text-gray-700 font-medium">Funded</p>
          </div>
          <div className="text-center">
            <p className="text-5xl font-bold text-orange-600 mb-2">50+</p>
            <p className="text-gray-700 font-medium">Countries</p>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="glass-card rounded-2xl p-12 max-w-4xl mx-auto border-2 border-green-300 bg-gradient-to-br from-green-50 to-green-100">
        <div className="text-center space-y-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Get in Touch</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Have questions? Want to partner with us? We'd love to hear from you.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup">
              <button className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg">
                Join Our Platform
              </button>
            </Link>
            <a href="mailto:sandeshchhettri5677@gmail.com">
              <button className="px-8 py-3 bg-white text-green-700 border-2 border-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors">
                Contact Us
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
