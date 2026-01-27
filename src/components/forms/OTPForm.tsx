// Accept email as a prop (from parent, e.g. forgot password page)
import { useState } from 'react';
import { verifyOtp } from '@/client/api/otp-api';
import { resendOtp } from '@/client/api/resend-otp-api';
import { useRouter } from 'next/navigation';

export default function OTPForm({ email }: { email: string }) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<number>(0);
  const router = useRouter();

  // Submit OTP
  const handleOtpSubmit = async (e: React.FormEvent) => {
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

  // Resend OTP
  const handleResend = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await resendOtp({ email });
      if (data.error) {
        setError(data.error);
      } else {
        setResult('OTP resent to your email');
        setAttempts(data.attempts ?? attempts + 1);
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="w-full flex flex-col" onSubmit={handleOtpSubmit}>
      <label className="font-medium text-green-900">OTP</label>
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
      <button
        type="button"
        className="mt-2 py-3 w-full cursor-pointer rounded-md bg-green-200 text-green-900 transition hover:bg-green-300"
        disabled={loading || attempts >= 5}
        onClick={handleResend}
      >
        {attempts >= 5 ? 'Resend Disabled (Too many attempts)' : 'Resend OTP'}
      </button>
      {result && <div className="mt-4 text-center text-green-700">{result}</div>}
      {error && <div className="mt-4 text-center text-red-700">{error}</div>}
    </form>
  );
}
