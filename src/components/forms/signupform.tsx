'use client';
import { signupUser } from '@/app/api/auth/signup/signup-user-payload';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { signupSchema } from './validation/signupValidation';
import HomeIcon from '@/components/common/HomeIcon';

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [dirty, setDirty] = useState<{ [key: string]: boolean }>({});

  const validateField = async (field: string, value: string) => {
    try {
      if (field === 'confirmPassword') {
        if (value !== password) {
          setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }));
          return;
        } else {
          setErrors((prev) => ({ ...prev, confirmPassword: '' }));
          return;
        }
      }
      await signupSchema.validateAt(field, {
        email,
        password,
        firstName,
        middleName,
        lastName,
        dob,
        phoneNumber,
        [field]: value,
      });
      setErrors((prev) => ({ ...prev, [field]: '' }));
      if (field === 'password' && confirmPassword) {
        // Re-validate confirmPassword if password changes
        if (confirmPassword !== value) {
          setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }));
        } else {
          setErrors((prev) => ({ ...prev, confirmPassword: '' }));
        }
      }
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
    const fieldErrors: { [key: string]: string } = {};
    try {
      await signupSchema.validate(
        { email, password, firstName, middleName, lastName, dob, phoneNumber },
        { abortEarly: false },
      );
      if (password !== confirmPassword) {
        fieldErrors.confirmPassword = 'Passwords do not match';
      }
      setErrors(fieldErrors);
      if (Object.keys(fieldErrors).length > 0) {
        setLoading(false);
        return;
      }
    } catch (err) {
      if (
        err &&
        typeof err === 'object' &&
        'inner' in (err as Record<string, unknown>) &&
        Array.isArray((err as { inner: Array<{ path?: string; message: string }> }).inner)
      ) {
        (err as { inner: Array<{ path?: string; message: string }> }).inner.forEach((e) => {
          if (e.path) fieldErrors[e.path] = e.message;
        });
      }
      if (password !== confirmPassword) {
        fieldErrors.confirmPassword = 'Passwords do not match';
      }
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }
    try {
      const { success, error } = await signupUser({
        email,
        password,
        firstName,
        middleName,
        lastName,
        dob,
        phoneNumber,
      });
      if (success) {
        setResult('Signup successful!');
        setTimeout(() => {
          router.push('/login');
        }, 400);
      } else {
        setResult('Error: ' + error);
      }
    } catch (err) {
      setResult('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="flex items-center justify-center w-full min-h-screen bg-white px-2 md:px-4"
      style={{ overflow: 'hidden' }}
    >
      <div className="absolute top-4 left-4 md:top-8 md:left-8">
        <a href="/" title="Go to Home" className="flex items-center gap-2 group">
          <HomeIcon className="w-9 h-9 md:w-12 md:h-12 transition-transform group-hover:scale-105" />
          <span className="sr-only">Home</span>
        </a>
      </div>
      <form
        className="w-full flex flex-col max-w-lg md:max-w-3xl bg-white shadow-lg rounded-xl p-2 md:p-4 border border-green-100"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl md:text-4xl font-medium text-green-900 text-center">Sign up</h2>
        <p className="mt-2 md:mt-4 text-base text-green-700/90 text-center">
          Please enter your details to create an account.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 md:mt-10">
          <div>
            <label className="font-medium text-green-900">First Name</label>
            <input
              placeholder="First Name"
              className="mt-2 rounded-md ring ring-green-200 focus:ring-2 focus:ring-green-400 outline-none px-3 py-3 w-full bg-green-50 text-green-900"
              required
              type="text"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onBlur={() => handleBlur('firstName', firstName)}
              disabled={loading}
            />
            {dirty.firstName && errors.firstName && (
              <div className="text-red-700 text-sm mt-1">{errors.firstName}</div>
            )}
          </div>
          <div>
            <label className="font-medium text-green-900">Middle Name (Optional)</label>
            <input
              placeholder="Middle Name "
              className="mt-2 rounded-md ring ring-green-200 focus:ring-2 focus:ring-green-400 outline-none px-3 py-3 w-full bg-green-50 text-green-900"
              type="text"
              name="middleName"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              onBlur={() => handleBlur('middleName', middleName)}
              disabled={loading}
            />
            {dirty.middleName && errors.middleName && (
              <div className="text-red-700 text-sm mt-1">{errors.middleName}</div>
            )}
          </div>
          <div>
            <label className="font-medium text-green-900">Last Name</label>
            <input
              placeholder="Last Name"
              className="mt-2 rounded-md ring ring-green-200 focus:ring-2 focus:ring-green-400 outline-none px-3 py-3 w-full bg-green-50 text-green-900"
              required
              type="text"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onBlur={() => handleBlur('lastName', lastName)}
              disabled={loading}
            />
            {dirty.lastName && errors.lastName && (
              <div className="text-red-700 text-sm mt-1">{errors.lastName}</div>
            )}
          </div>
          <div>
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
          <div>
            <label className="font-medium text-green-900">Date of Birth</label>
            <input
              placeholder="YYYY-MM-DD"
              className="mt-2 rounded-md ring ring-green-200 focus:ring-2 focus:ring-green-400 outline-none px-3 py-3 w-full bg-green-50 text-green-900"
              required
              type="date"
              name="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              onBlur={() => handleBlur('dob', dob)}
              disabled={loading}
            />
            {dirty.dob && errors.dob && (
              <div className="text-red-700 text-sm mt-1">{errors.dob}</div>
            )}
          </div>
          <div>
            <label className="font-medium text-green-900">Phone Number</label>
            <input
              placeholder="Phone Number"
              className="mt-2 rounded-md ring ring-green-200 focus:ring-2 focus:ring-green-400 outline-none px-3 py-3 w-full bg-green-50 text-green-900"
              required
              type="tel"
              name="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              onBlur={() => handleBlur('phoneNumber', phoneNumber)}
              disabled={loading}
            />
            {dirty.phoneNumber && errors.phoneNumber && (
              <div className="text-red-700 text-sm mt-1">{errors.phoneNumber}</div>
            )}
          </div>
          <div className="md:col-span-2 relative">
            <label className="font-medium text-green-900">Password</label>
            <div className="relative">
              <input
                placeholder="Please enter your password"
                className="mt-2 rounded-md ring ring-green-200 focus:ring-2 focus:ring-green-400 outline-none px-3 py-3 w-full bg-green-50 text-green-900 pr-10"
                required
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (dirty.confirmPassword) validateField('confirmPassword', confirmPassword);
                }}
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
          <div className="md:col-span-2 relative">
            <label className="font-medium text-green-900">Confirm Password</label>
            <div className="relative">
              <input
                placeholder="Re-enter your password"
                className="mt-2 rounded-md ring ring-green-200 focus:ring-2 focus:ring-green-400 outline-none px-3 py-3 w-full bg-green-50 text-green-900 pr-10"
                required
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => handleBlur('confirmPassword', confirmPassword)}
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-700 focus:outline-none"
                tabIndex={-1}
                onClick={() => setShowConfirmPassword((v) => !v)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {dirty.confirmPassword && errors.confirmPassword && (
              <div className="text-red-700 text-sm mt-1">{errors.confirmPassword}</div>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="mt-8 py-3 w-full cursor-pointer rounded-md bg-green-500 text-white transition hover:bg-green-600"
          disabled={loading}
        >
          {loading ? 'Signing up...' : 'Sign up'}
        </button>
        {result &&
          (result.toLowerCase().startsWith('error') ? (
            <div className="mt-4 text-center text-red-700">{result}</div>
          ) : (
            <div className="mt-4 text-center text-green-700">{result}</div>
          ))}
        <p className="text-center py-8 text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="text-green-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}
