'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { loginSchema } from './validation/loginValidation';
import { loginUser } from '@/client/api/login-user-payload';
import HomeIcon from '@/components/common/HomeIcon';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [dirty, setDirty] = useState<{ [key: string]: boolean }>({});

  const validateField = async (field: string, value: string) => {
    try {
      await loginSchema.validateAt(field, {
        email,
        password,
        [field]: value,
      });
      setErrors((prev) => ({ ...prev, [field]: '' }));
    } catch (err) {
      if (err instanceof Error && 'message' in (err as object)) {
        setErrors((prev) => ({ ...prev, [field]: (err as Error).message }));
      }
    }
  };

  const handleBlur = (field: string, value: string) => {
    setDirty((prev) => ({ ...prev, [field]: true }));
    validateField(field, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    // Validate all fields before submit
    try {
      await loginSchema.validate({ email, password }, { abortEarly: false });
      setErrors({});
    } catch (err) {
      const fieldErrors: { [key: string]: string } = {};
      if (err && typeof err === 'object' && 'inner' in err && Array.isArray(err as object)) {
        (err as { inner: Array<{ path?: string; message: string }> }).inner.forEach((e) => {
          if (e.path) fieldErrors[e.path] = e.message;
        });
        (err as { inner: Array<{ path?: string; message: string }> }).inner.forEach(
          (e: { path?: string; message: string }) => {
            if (e.path) fieldErrors[e.path] = e.message;
          },
        );
      }
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }
    try {
      const result = await loginUser({ email, password });
      if (result.accessToken) {
        setResult('Login successful!');
        localStorage.setItem('accessToken', result.accessToken);
      } else {
        setResult('Error: ' + (result.error || 'Unknown error'));
      }
    } catch {
      setResult('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center w-full min-h-screen bg-white px-2 md:px-4">
      <div className="absolute top-4 left-4 md:top-8 md:left-8">
        <Link href="/" title="Go to Home" className="flex items-center gap-2 group">
          <HomeIcon className="w-9 h-9 md:w-12 md:h-12 transition-transform group-hover:scale-105" />
          <span className="sr-only">Home</span>
        </Link>
      </div>
      <form
        className="flex w-full flex-col max-w-md md:max-w-lg bg-white shadow-lg rounded-xl p-6 md:p-10 border border-green-100"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl md:text-4xl font-medium text-green-900 text-center">Sign in</h2>
        <p className="mt-2 md:mt-4 text-base text-green-700/90 text-center">
          Please enter email and password to access.
        </p>
        <div className="mt-8 md:mt-10">
          <label className="font-medium text-green-900">Email</label>
          <input
            placeholder="Please enter your email"
            className="mt-2 rounded-md ring ring-green-200 focus:ring-2 focus:ring-green-400 outline-none px-3 py-3 w-full bg-green-50 text-green-900"
            required
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => handleBlur('email', email)}
            disabled={loading}
          />
          {dirty.email && errors.email && (
            <div className="text-red-700 text-sm mt-1">{errors.email}</div>
          )}
        </div>

        <div className="mt-6 relative">
          <label className="font-medium text-green-900">Password</label>
          <div className="relative">
            <input
              placeholder="Please enter your password"
              className="mt-2 rounded-md ring ring-green-200 focus:ring-2 focus:ring-green-400 outline-none px-3 py-3 w-full bg-green-50 text-green-900 pr-10"
              required
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleBlur('password', password)}
              disabled={loading}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-700 focus:outline-none"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {dirty.password && errors.password && (
            <div className="text-red-700 text-sm mt-1">{errors.password}</div>
          )}
        </div>

        <button
          type="submit"
          className="mt-8 py-3 w-full cursor-pointer rounded-md bg-green-500 text-white transition hover:bg-green-600"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="mt-4 text-center">
          <Link href="/forgot-password" className="text-green-600 hover:underline">
            Forgot password? I gotchu
          </Link>
        </div>

        {result &&
          (result.toLowerCase().startsWith('error') ? (
            <div className="mt-4 text-center text-red-700">{result}</div>
          ) : (
            <div className="mt-4 text-center text-green-700">{result}</div>
          ))}

        <p className="text-center py-8 text-gray-500">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="text-green-600 hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </main>
  );
}
