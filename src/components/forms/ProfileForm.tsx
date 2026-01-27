'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ImageUploader from '@/components/common/ImageUploader';

interface ProfileData {
  id: string;
  userId: string;
  [key: string]: any;
}

export default function ProfileForm({ userRole, userId }: { userRole: string; userId: string }) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchProfile();
  }, [userRole, userId]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/profile?role=${userRole}&userId=${userId}`);
      const data = await res.json();
      const myProfile = data && !Array.isArray(data) ? data : null;
      if (myProfile && myProfile.userId === userId) {
        setProfile(myProfile);
        setFormData(myProfile);
      } else {
        setProfile(null);
        setFormData({ userId });
      }
    } catch (err) {
      setProfile(null);
      setFormData({ userId });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (url: string) => {
    setFormData({ ...formData, photo: url });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const payload = { ...formData, role: userRole };
      let res;
      if (profile && profile.id) {
        //Update
        res = await fetch('/api/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: profile.id, ...payload }),
        });
      } else {
        //Create
        res = await fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save profile');
      setMessage({ type: 'success', text: 'Profile saved successfully!' });
      fetchProfile();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save profile' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {userRole === 'INVESTOR' ? 'Investor Profile' : 'Startup Profile'}
      </h2>

      {message && (
        <div
          className={`p-4 mb-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <ImageUploader
          currentImage={formData.photo}
          onUploadSuccess={handleImageUpload}
          label={userRole === 'INVESTOR' ? 'Profile Photo' : 'Startup Logo'}
        />

        {userRole === 'INVESTOR' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  name="bio"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
                  value={formData.bio || ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Firm Name</label>
                <input
                  type="text"
                  name="firmName"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
                  value={formData.firmName || ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Website</label>
                <input
                  type="url"
                  name="website"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
                  value={formData.website || ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Min Ticket ($)</label>
                <input
                  type="number"
                  name="minTicket"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
                  value={formData.minTicket || ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Max Ticket ($)</label>
                <input
                  type="number"
                  name="maxTicket"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
                  value={formData.maxTicket || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
          </>
        )}

        {userRole === 'STARTUP' && (
          <>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Startup Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
                  value={formData.name || ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
                  value={formData.description || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Website</label>
                  <input
                    type="url"
                    name="website"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
                    value={formData.website || ''}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stage</label>
                  <select
                    name="stage"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
                    value={formData.stage || ''}
                    onChange={handleChange}
                  >
                    <option value="">Select Stage</option>
                    <option value="Idea">Idea</option>
                    <option value="MVP">MVP</option>
                    <option value="Early Traction">Early Traction</option>
                    <option value="Seed">Seed</option>
                    <option value="Series A">Series A</option>
                  </select>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
