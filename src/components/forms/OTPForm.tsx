import { useState } from 'react';

export default function OTPForm({ onSubmit }: { onSubmit?: (otp: string) => void }) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // TODO: Replace with actual OTP verification logic
    try {
      if (!otp || otp.length < 4) {
        setError('Please enter a valid OTP');
        setLoading(false);
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 800));
      if (onSubmit) onSubmit(otp);
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="w-full flex flex-col" onSubmit={handleSubmit}>
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
      {error && <div className="mt-4 text-center text-red-700">{error}</div>}
    </form>
  );
}
