import { useState } from 'react';
import { verifyOtp } from '@/client/api/otp-api';
import { useRouter } from 'next/navigation';

export default function OTPForm() {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      if (!otp || otp.length < 4) {
        setError('Please enter a valid OTP');
        setLoading(false);
        return;
      }
      if (!email) {
        setError('Please enter your email');
        setLoading(false);
        return;
      }
      const res = await verifyOtp({ email, otp });
      if (res.token) {
        setResult('OTP verified! Redirecting...');
        localStorage.setItem('passwordResetToken', res.token);
        setTimeout(() => {
          router.push('/reset-password');
        }, 800);
      } else {
        setError(res.error || 'Invalid OTP');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="w-full flex flex-col" onSubmit={handleSubmit}>
      <label className="font-medium text-green-900">Email</label>
      <input
        placeholder="Enter your email"
        className="mt-2 rounded-md ring ring-green-200 focus:ring-2 focus:ring-green-400 outline-none px-3 py-3 w-full bg-green-50 text-green-900"
        required
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />
      <label className="font-medium text-green-900 mt-4">OTP</label>
      <input
        placeholder="Enter OTP"
        className="mt-2 rounded-md ring ring-green-200 focus:ring-2 focus:ring-green-400 outline-none px-3 py-3 w-full bg-green-50 text-green-900"
        required
        type="text"
        name="otp"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        disabled={loading}
      />
      <button
        type="submit"
        className="mt-8 py-3 w-full cursor-pointer rounded-md bg-green-500 text-white transition hover:bg-green-600"
        disabled={loading}
      >
        {loading ? 'Verifying...' : 'Verify OTP'}
      </button>
      {result && <div className="mt-4 text-center text-green-700">{result}</div>}
      {error && <div className="mt-4 text-center text-red-700">{error}</div>}
    </form>
  );
}
