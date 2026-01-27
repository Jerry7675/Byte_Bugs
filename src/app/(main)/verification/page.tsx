'use client';
import { useState } from 'react';

export default function VerificationApplyPage() {
  const [form, setForm] = useState({ companyName: '', domain: '', documents: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    try {
      const res = await fetch('/api/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setMessage('Application submitted!');
      } else {
        setStatus('error');
        setMessage(data.error || 'Error submitting application');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Network error');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Apply for Verification</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Company Name (optional)</label>
          <input
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Domain/Field (optional)</label>
          <input
            name="domain"
            value={form.domain}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Documents/Links (optional)</label>
          <textarea
            name="documents"
            value={form.documents}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Submitting...' : 'Apply'}
        </button>
      </form>
      {message && (
        <div className={`mt-4 ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </div>
      )}
    </div>
  );
}
