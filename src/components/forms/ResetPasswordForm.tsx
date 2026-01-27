'use client';
import { useState } from 'react';
import { resetPassword } from '@/client/api/reset-password-api';
import { validateResetPassword } from './validation/resetPasswordValidation';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Props {
  token: string;
}

export default function ResetPasswordForm({ token: propToken }: Props) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Use token from prop or localStorage (for OTP flow)
  const token =
    propToken ||
    (typeof window !== 'undefined' ? localStorage.getItem('passwordResetToken') || '' : '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const validationError = validateResetPassword(password, confirmPassword);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (!token) {
      setError('Reset token missing. Please restart the reset process.');
      return;
    }
    setLoading(true);
    try {
      const result = await resetPassword({ password, token });
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(result.message || 'Password updated successfully. You can now log in.');
        // Remove token after successful reset
        if (typeof window !== 'undefined') {
          localStorage.removeItem('passwordResetToken');
        }
        setTimeout(() => router.push('/login'), 2000);
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] w-full px-2 md:px-0">
      <form
        className="flex w-full flex-col max-w-md md:max-w-lg bg-white shadow-lg rounded-xl p-6 md:p-10 border border-green-100"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl md:text-3xl font-medium text-green-900 text-center mb-2">
          Reset Password
        </h2>
        <p className="mb-6 text-base text-green-700/90 text-center">
          Enter your new password below.
        </p>
        <div className="mb-4">
          <label className="font-medium text-green-900">New Password</label>
          <input
            placeholder="Enter new password"
            className="mt-2 rounded-md focus:ring-2 focus:ring-green-400 outline-none px-3 py-3 w-full bg-green-50 text-green-900"
            required
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="mb-4">
          <label className="font-medium text-green-900">Confirm New Password</label>
          <input
            placeholder="Confirm new password"
            className="mt-2 rounded-md focus:ring-2 focus:ring-green-400 outline-none px-3 py-3 w-full bg-green-50 text-green-900"
            required
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        {error && <div className="text-red-700 text-sm mt-2 text-center">{error}</div>}
        {success && <div className="text-green-700 text-sm mt-2 text-center">{success}</div>}
        <button
          type="submit"
          className="mt-6 py-3 w-full cursor-pointer rounded-md bg-green-500 text-white transition hover:bg-green-600"
          disabled={loading}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
        <div className="mt-4 text-center">
          <Link href="/login" className="text-green-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
}
