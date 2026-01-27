'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
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
      // Find valid profile via API - we might need to filter by userId or let API handle it via user context if we had it
      // Since API requires role and id (profileId) strictly in current route.ts, filtering by userId is tricky if we don't know profileId.
      // However, current route.ts GET /api/profile?role=... returns ALL profiles or by ID.
      // We actually need an endpoint to get "my profile".
      // For MVP, let's assume we can GET /api/profile?role=...&userId=... if we update API or
      // we filter client side (not secure but okay for MVP) OR we update route.ts to support userId query.
      // Let's assume we update logic to fetch by User ID or we construct it.
      // Wait, let's fetch all and find ours for MVP speed.

      const response = await axios.get(`/api/profile?role=${userRole}`);
      const profiles = response.data;
      if (Array.isArray(profiles)) {
        const myProfile = profiles.find((p: any) => p.userId === userId);
        if (myProfile) {
          setProfile(myProfile);
          setFormData(myProfile);
        } else {
          // No profile yet, initialize empty
          setFormData({ userId });
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      console.error('Error fetching profile');
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

      if (profile?.id) {
        // Update
        await axios.put('/api/profile', { id: profile.id, ...payload });
      } else {
        // Create
        await axios.post('/api/profile', payload);
      }
      setMessage({ type: 'success', text: 'Profile saved successfully!' });
      fetchProfile(); // Refresh
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to save profile' });
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
