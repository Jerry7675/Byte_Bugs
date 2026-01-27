'use client';

import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '../ui/ThemeToggle';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-green-50/80 backdrop-blur-xl border-b border-green-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-green-400 via-green-200 to-green-500 flex items-center justify-center">
              <span className="text-green-900 font-bold text-lg md:text-xl">IL</span>
            </div>
            <span className="font-display font-bold text-xl md:text-2xl text-green-900">
              Invest<span className="text-green-600">Link</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#"
              className="text-green-700 hover:text-green-900 transition-colors font-medium"
            >
              For Startups
            </Link>
            <Link
              href="#"
              className="text-green-700 hover:text-green-900 transition-colors font-medium"
            >
              For Investors
            </Link>
            <Link
              href="#"
              className="text-green-700 hover:text-green-900 transition-colors font-medium"
            >
              Pricing
            </Link>
            <Link
              href="#"
              className="text-green-700 hover:text-green-900 transition-colors font-medium"
            >
              About
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" size="default" className="text-green-700 hover:bg-green-100">
              Log In
            </Button>
            <Button
              variant="hero"
              size="default"
              className="bg-green-600 text-white hover:bg-green-700"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-green-900" />
              ) : (
                <Menu className="w-6 h-6 text-green-900" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-green-200">
            <nav className="flex flex-col gap-4">
              <Link
                href="#"
                className="text-green-700 hover:text-green-900 transition-colors font-medium py-2"
              >
                For Startups
              </Link>
              <Link
                href="#"
                className="text-green-700 hover:text-green-900 transition-colors font-medium py-2"
              >
                For Investors
              </Link>
              <Link
                href="#"
                className="text-green-700 hover:text-green-900 transition-colors font-medium py-2"
              >
                Pricing
              </Link>
              <Link
                href="#"
                className="text-green-700 hover:text-green-900 transition-colors font-medium py-2"
              >
                About
              </Link>
              <div className="flex flex-col gap-2 pt-4">
                <Button
                  variant="outline"
                  className="w-full text-green-700 border-green-700 hover:bg-green-50"
                >
                  Log In
                </Button>
                <Button
                  variant="hero"
                  className="w-full bg-green-600 text-white hover:bg-green-700"
                >
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
