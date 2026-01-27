'use client';
import { useState } from 'react';
import { forgotPassword } from '@/client/api/forgot-password-api';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await forgotPassword({ email });
      if (res.message) {
        setResult(res.message);
        setTimeout(() => {
          router.push(`/otp?email=${encodeURIComponent(email)}`);
        }, 800);
      } else {
        setError(res.error || 'Unknown error');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center w-full min-h-screen bg-white px-2 md:px-4">
      <form
        className="w-full flex flex-col max-w-md bg-white shadow-lg rounded-xl p-4 border border-green-100"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-medium text-green-900 text-center">Forgot Password</h2>
        <p className="mt-2 text-base text-green-700/90 text-center">
          Enter your email to receive an OTP.
        </p>
        <div className="mt-8">
          <label className="font-medium text-green-900">Email</label>
          <input
            placeholder="Please enter your email"
            className="mt-2 rounded-md ring ring-green-200 focus:ring-2 focus:ring-green-400 outline-none px-3 py-3 w-full bg-green-50 text-green-900"
            required
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className="mt-8 py-3 w-full cursor-pointer rounded-md bg-green-500 text-white transition hover:bg-green-600"
          disabled={loading}
        >
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </button>
        {result && <div className="mt-4 text-center text-green-700">{result}</div>}
        {error && <div className="mt-4 text-center text-red-700">{error}</div>}
      </form>
    </main>
  );
}
