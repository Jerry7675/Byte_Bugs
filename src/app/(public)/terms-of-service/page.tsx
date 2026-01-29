'use client';
import { FileText, Scale, AlertTriangle, CheckCircle, XCircle, Shield, Wallet, Award, UserX, CircleDollarSign, Ban, Gavel } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="space-y-12 my-20">
      {/* Hero Section */}
      <div className="text-center space-y-6 pt-8">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
            <Scale className="w-10 h-10 text-blue-700" />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-gray-900">Terms of Service</h1>
        {/* <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Last updated: January 29, 2026
        </p> */}
        <p className="text-gray-600 max-w-3xl mx-auto">
          Please read these Terms of Service carefully before using our platform. By accessing or
          using the service, you agree to be bound by these terms.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Acceptance of Terms */}
        <div className="glass-card rounded-2xl p-8 border border-gray-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-blue-700" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  By creating an account or using our platform, you acknowledge that you have read,
                  understood, and agree to be bound by these Terms of Service and our Privacy Policy.
                </p>
                <p>
                  If you do not agree to these terms, you must not access or use the platform. We
                  reserve the right to modify these terms at any time, and your continued use of the
                  platform constitutes acceptance of any changes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Eligibility */}
        <div className="glass-card rounded-2xl p-8 border border-gray-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-green-700" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">2. Eligibility</h2>
              <div className="space-y-4 text-gray-600">
                <p>To use our platform, you must:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Be at least 18 years of age</li>
                  <li>Have the legal capacity to enter into binding contracts</li>
                  <li>Not be prohibited from using the service under applicable laws</li>
                  <li>Provide accurate and complete registration information</li>
                  <li>Maintain the security of your account credentials</li>
                </ul>
                <p className="pt-2">
                  You are responsible for all activities that occur under your account. If you
                  suspect any unauthorized use, you must notify us immediately.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* User Accounts */}
        <div className="glass-card rounded-2xl p-8 border border-gray-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-purple-700" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">3. User Accounts</h2>
              <div className="space-y-4 text-gray-600">
                <p>When creating an account, you agree to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and promptly update your account information</li>
                  <li>Keep your password secure and confidential</li>
                  <li>Not share your account with others</li>
                  <li>Notify us immediately of any unauthorized access</li>
                </ul>
                <p className="pt-2">
                  We reserve the right to suspend or terminate accounts that violate these terms or
                  engage in fraudulent or illegal activities.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Use */}
        <div className="glass-card rounded-2xl p-8 border border-gray-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-orange-700" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Acceptable Use</h2>
              <div className="space-y-4 text-gray-600">
                <p>You agree to use the platform only for lawful purposes. You must not:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Post false, misleading, or fraudulent information</li>
                  <li>Impersonate any person or entity</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Attempt to gain unauthorized access to the platform</li>
                  <li>Interfere with the proper functioning of the service</li>
                  <li>Use automated systems to access the platform without permission</li>
                  <li>Collect user information without consent</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Content and IP */}
        <div className="glass-card rounded-2xl p-8 border border-gray-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-indigo-700" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Intellectual Property</h2>
              <div className="space-y-4 text-gray-600">
            <p>
              The platform and its original content, features, and functionality are owned by us and
              are protected by international copyright, trademark, patent, trade secret, and other
              intellectual property laws.
            </p>
            <p>
              You retain ownership of any content you post on the platform. By posting content, you
              grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify,
              and display your content in connection with operating the platform.
            </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payments and Points */}
        <div className="glass-card rounded-2xl p-8 border border-gray-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center flex-shrink-0">
              <Wallet className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Payments and Points</h2>
              <div className="space-y-4 text-gray-600">
            <p>Our platform operates on a points-based system:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Points can be purchased through secure payment methods</li>
              <li>All payments are processed through third-party payment providers</li>
              <li>Points are non-refundable once purchased</li>
              <li>Points do not expire</li>
              <li>We reserve the right to modify pricing at any time</li>
              <li>You are responsible for all charges incurred under your account</li>
            </ul>
            <p className="pt-2">
              If you believe there has been a billing error, please contact us within 30 days of the
              charge.
            </p>
              </div>
            </div>
          </div>
        </div>

        {/* Verification */}
        <div className="glass-card rounded-2xl p-8 border border-gray-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-100 to-cyan-200 flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6 text-cyan-700" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Verification Process</h2>
              <div className="space-y-4 text-gray-600">
            <p>
              Startups and investors may apply for verification. The verification process involves:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Submission of required documentation</li>
              <li>Review by our verification team</li>
              <li>Approval or rejection at our sole discretion</li>
            </ul>
            <p className="pt-2">
              Verification does not constitute an endorsement or guarantee. We are not responsible
              for the accuracy of verified user information or the outcome of any interactions.
            </p>
              </div>
            </div>
          </div>
        </div>

        {/* Prohibited Activities */}
        <div className="glass-card rounded-2xl p-8 border border-gray-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center flex-shrink-0">
              <Ban className="w-6 h-6 text-red-700" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">8. Prohibited Activities</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  The following activities are strictly prohibited:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Money laundering or terrorist financing</li>
                  <li>Pyramid schemes or multi-level marketing</li>
                  <li>Securities fraud or investment scams</li>
                  <li>Unauthorized solicitation or spam</li>
                  <li>Distribution of malware or viruses</li>
                </ul>
                <p className="pt-2">
                  Violation of these prohibitions may result in immediate account termination and
                  legal action.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimers */}
        <div className="glass-card rounded-2xl p-8 border border-gray-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-yellow-700" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">9. Disclaimers</h2>
              <div className="space-y-4 text-gray-600">
                <p className="uppercase font-semibold">
                  The platform is provided "as is" and "as available" without warranties of any
                  kind.
                </p>
                <p>We do not guarantee:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>The accuracy, completeness, or reliability of user content</li>
                  <li>That the service will be uninterrupted or error-free</li>
                  <li>The success of any startup or investment</li>
                  <li>The outcome of any interactions between users</li>
                </ul>
                <p className="pt-2">
                  You acknowledge that investment carries risk and you should conduct your own due
                  diligence before making any investment decisions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Limitation of Liability */}
        <div className="glass-card rounded-2xl p-8 border border-gray-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center flex-shrink-0">
              <CircleDollarSign className="w-6 h-6 text-slate-700" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">10. Limitation of Liability</h2>
              <div className="space-y-4 text-gray-600">
            <p>
              To the maximum extent permitted by law, we shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages, or any loss of profits or
              revenues, whether incurred directly or indirectly.
            </p>
            <p>
              Our total liability to you for all claims arising from your use of the platform shall
              not exceed the amount you paid to us in the twelve months preceding the claim.
            </p>
              </div>
            </div>
          </div>
        </div>

        {/* Termination */}
        <div className="glass-card rounded-2xl p-8 border border-gray-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center flex-shrink-0">
              <UserX className="w-6 h-6 text-rose-700" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">11. Termination</h2>
              <div className="space-y-4 text-gray-600">
            <p>
              We may terminate or suspend your account and access to the platform immediately,
              without prior notice or liability, for any reason, including breach of these Terms.
            </p>
            <p>
              Upon termination, your right to use the platform will immediately cease. You may
              terminate your account at any time by contacting us. Upon termination, unused points
              will be forfeited.
            </p>
              </div>
            </div>
          </div>
        </div>

        {/* Governing Law */}
        <div className="glass-card rounded-2xl p-8 border border-gray-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-100 to-violet-200 flex items-center justify-center flex-shrink-0">
              <Gavel className="w-6 h-6 text-violet-700" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">12. Governing Law</h2>
              <div className="space-y-4 text-gray-600">
            <p>
              These Terms shall be governed by and construed in accordance with the laws of Nepal,
              without regard to its conflict of law provisions.
            </p>
            <p>
              Any disputes arising from these Terms or your use of the platform shall be subject to
              the exclusive jurisdiction of the courts of Nepal.
            </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="glass-card rounded-2xl p-8 border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Contact Us</h2>
          <p className="text-gray-700 text-center mb-4">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <div className="text-center">
            <a
              href="mailto:sandeshchhettri5677@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <Scale className="w-5 h-5" />
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
