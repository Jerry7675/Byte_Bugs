'use client';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { loginSchema } from './validation/loginValidation';

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
      if (err instanceof Error && 'message' in err) {
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
      if (err && typeof err === 'object' && 'inner' in err && Array.isArray((err as any).inner)) {
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
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      const accessToken = res.headers.get('Authorization')?.replace('Bearer ', '');
      if (res.ok) {
        setResult('Login successful!');
        // Store token in localStorage
        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
        }
      } else {
        setResult('Error: ' + (data.error?.error || 'Unknown error'));
      }
    } catch {
      setResult('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center w-full px-4 bg-white min-h-screen">
      <form
        className="flex w-full flex-col max-w-96 bg-white shadow-lg rounded-xl p-8 border border-green-100"
        onSubmit={handleSubmit}
      >
        <a href="https://prebuiltui.com" className="mb-8" title="Go to PrebuiltUI">
          <svg
            className="size-10"
            width="30"
            height="33"
            viewBox="0 0 30 33"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m8 4.55 6.75 3.884 6.75-3.885M8 27.83v-7.755L1.25 16.19m27 0-6.75 3.885v7.754M1.655 8.658l13.095 7.546 13.095-7.546M14.75 31.25V16.189m13.5 5.976V10.212a2.98 2.98 0 0 0-1.5-2.585L16.25 1.65a3.01 3.01 0 0 0-3 0L2.75 7.627a3 3 0 0 0-1.5 2.585v11.953a2.98 2.98 0 0 0 1.5 2.585l10.5 5.977a3.01 3.01 0 0 0 3 0l10.5-5.977a3 3 0 0 0 1.5-2.585"
              stroke="#27ae60"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>

        <h2 className="text-4xl font-medium text-green-900">Sign in</h2>

        <p className="mt-4 text-base text-green-700/90">
          Please enter email and password to access.
        </p>

        <div className="mt-10">
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
