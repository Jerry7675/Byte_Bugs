'use client';
import { Shield, Eye, Lock, FileText, AlertCircle, CheckCircle } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-12 my-20">
      {/* Hero Section */}
      <div className="text-center space-y-6 pt-8">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
            <Shield className="w-10 h-10 text-green-700" />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-gray-900">Privacy Policy</h1>
        {/* <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Last updated: January 29, 2026
        </p> */}
        <p className="text-gray-600 max-w-3xl mx-auto">
          Your privacy is important to us. This Privacy Policy explains how we collect, use,
          disclose, and safeguard your information when you use our platform.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Introduction */}
        <div className="glass-card rounded-2xl p-8 border border-gray-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-blue-700" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Information We Collect</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  We collect information that you provide directly to us, including:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Account information (name, email address, password)</li>
                  <li>Profile information (company details, bio, profile picture)</li>
                  <li>Payment information (processed securely through third-party providers)</li>
                  <li>Communications you send to us</li>
                  <li>Information about your use of the platform</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* How We Use Information */}
        <div className="glass-card rounded-2xl p-8 border border-gray-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center flex-shrink-0">
              <Eye className="w-6 h-6 text-green-700" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">2. How We Use Your Information</h2>
              <div className="space-y-4 text-gray-600">
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send you technical notices, updates, and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Match startups with relevant investors</li>
                  <li>Detect, prevent, and address technical issues and fraud</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Data Security */}
        <div className="glass-card rounded-2xl p-8 border border-gray-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center flex-shrink-0">
              <Lock className="w-6 h-6 text-purple-700" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">3. Data Security</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  We implement appropriate technical and organizational security measures to protect
                  your personal information against unauthorized access, alteration, disclosure, or
                  destruction.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security audits and assessments</li>
                  <li>Secure authentication and access controls</li>
                  <li>Employee training on data protection</li>
                </ul>
                <p className="pt-2">
                  However, no method of transmission over the Internet or electronic storage is 100%
                  secure. While we strive to use commercially acceptable means to protect your
                  information, we cannot guarantee its absolute security.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Information Sharing */}
        <div className="glass-card rounded-2xl p-8 border border-gray-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-orange-700" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Information Sharing</h2>
              <div className="space-y-4 text-gray-600">
                <p>We may share your information in the following circumstances:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>With Other Users:</strong> Your profile information is visible to other
                    users as part of the platform's functionality
                  </li>
                  <li>
                    <strong>Service Providers:</strong> We may share information with third-party
                    vendors who perform services on our behalf
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> We may disclose information if required by
                    law or in response to legal process
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> In connection with any merger, sale of
                    company assets, or acquisition
                  </li>
                </ul>
                <p className="pt-2">
                  We do not sell your personal information to third parties for their marketing
                  purposes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Your Rights */}
        <div className="glass-card rounded-2xl p-8 border border-gray-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-teal-700" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Your Rights and Choices</h2>
              <div className="space-y-4 text-gray-600">
                <p>You have the following rights regarding your personal information:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Access:</strong> Request access to the personal information we hold about
                    you
                  </li>
                  <li>
                    <strong>Correction:</strong> Request correction of inaccurate or incomplete
                    information
                  </li>
                  <li>
                    <strong>Deletion:</strong> Request deletion of your personal information
                  </li>
                  <li>
                    <strong>Data Portability:</strong> Request a copy of your data in a structured,
                    machine-readable format
                  </li>
                  <li>
                    <strong>Opt-Out:</strong> Opt out of marketing communications at any time
                  </li>
                </ul>
                <p className="pt-2">
                  To exercise these rights, please contact us at{' '}
                  <a
                    href="mailto:sandeshchhettri5677@gmail.com"
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    sandeshchhettri5677@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cookies */}
        <div className="glass-card rounded-2xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies and Tracking</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              We use cookies and similar tracking technologies to track activity on our platform and
              hold certain information. Cookies are files with small amounts of data that are sent
              to your browser from a website and stored on your device.
            </p>
            <p>You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
          </div>
        </div>

        {/* Children's Privacy */}
        <div className="glass-card rounded-2xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Children's Privacy</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              Our platform is not intended for individuals under the age of 18. We do not knowingly
              collect personal information from children. If you are a parent or guardian and
              believe your child has provided us with personal information, please contact us.
            </p>
          </div>
        </div>

        {/* Changes to Policy */}
        <div className="glass-card rounded-2xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Changes to This Policy</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes
              by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
            <p>
              You are advised to review this Privacy Policy periodically for any changes. Changes to
              this Privacy Policy are effective when they are posted on this page.
            </p>
          </div>
        </div>

        {/* Contact */}
        {/* <div className="glass-card rounded-2xl p-8 border-2 border-green-300 bg-gradient-to-br from-green-50 to-green-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Contact Us</h2>
          <p className="text-gray-700 text-center mb-4">
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <div className="text-center">
            <a
              href="mailto:sandeshchhettri5677@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              <Shield className="w-5 h-5" />
              Email Us
            </a>
          </div>
        </div> */}
      </div>
    </div>
  );
}
