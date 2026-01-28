import Link from 'next/link';
import { Linkedin, Twitter, Facebook, Instagram } from 'lucide-react';
import { LogoWithText } from '../ui/logo';

const Footer = () => {
  return (
    <footer className="bg-green-50 text-green-900 py-16">
      {/* if we want to add top border add: border-t border-border/50 */}
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <LogoWithText />
            </Link>
            <p className="text-green-800/70 mb-6 max-w-sm">
              Connecting ambitious startups with smart investors worldwide. Your journey to success
              starts here.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-green-100 hover:bg-green-200 flex items-center justify-center transition-colors"
              >
                <Twitter className="w-5 h-5 text-green-700" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-green-100 hover:bg-green-200 flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-5 h-5 text-green-700" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-green-100 hover:bg-green-200 flex items-center justify-center transition-colors"
              >
                <Facebook className="w-5 h-5 text-green-700" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-green-100 hover:bg-green-200 flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5 text-green-700" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold text-green-900 mb-4">Platform</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-green-700 hover:text-green-900 transition-colors">
                  For Startups
                </Link>
              </li>
              <li>
                <Link href="#" className="text-green-700 hover:text-green-900 transition-colors">
                  For Investors
                </Link>
              </li>
              <li>
                <Link href="#" className="text-green-700 hover:text-green-900 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-green-700 hover:text-green-900 transition-colors">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-green-900 mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-green-700 hover:text-green-900 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-green-700 hover:text-green-900 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-green-700 hover:text-green-900 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-green-700 hover:text-green-900 transition-colors">
                  Press Kit
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-green-900 mb-4">Support</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-green-700 hover:text-green-900 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-green-700 hover:text-green-900 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-green-700 hover:text-green-900 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-green-700 hover:text-green-900 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-green-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-green-700 text-sm">© 2026 InvestLink. All rights reserved.</p>
          <p className="text-green-700 text-sm">Made By Team Byte Bugs</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
