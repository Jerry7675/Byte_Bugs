/**
 * Edit Profile Page
 * Allows users to update their profile information
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';
import { ArrowLeft, Save, Loader } from 'lucide-react';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
}

interface ProfileData {
  user: {
    id: string;
    role: string;
  };
  profile: {
    bio?: string | null;
    description?: string | null;
    website?: string | null;
    photo?: string | null;
    firmName?: string | null;
    minTicket?: number | null;
    maxTicket?: number | null;
    name?: string | null;
    stage?: string | null;
  };
  categories: Category[];
}

export default function EditProfilePage() {
  const router = useRouter();
  const { user } = useAuth();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [bio, setBio] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [photo, setPhoto] = useState('');
  const [firmName, setFirmName] = useState('');
  const [minTicket, setMinTicket] = useState('');
  const [maxTicket, setMaxTicket] = useState('');
  const [startupName, setStartupName] = useState('');
  const [stage, setStage] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch profile and categories in parallel
      const [profileRes, categoriesRes] = await Promise.all([
        fetch('/api/profile/me'),
        fetch('/api/profile/categories'),
      ]);

      const profileData = await profileRes.json();
      const categoriesData = await categoriesRes.json();

      if (profileData.success) {
        const p = profileData.data;
        setProfile(p);
        setBio(p.profile.bio || '');
        setDescription(p.profile.description || '');
        setWebsite(p.profile.website || '');
        setPhoto(p.profile.photo || '');
        setFirmName(p.profile.firmName || '');
        setMinTicket(p.profile.minTicket?.toString() || '');
        setMaxTicket(p.profile.maxTicket?.toString() || '');
        setStartupName(p.profile.name || '');
        setStage(p.profile.stage || '');
        setSelectedCategories(p.categories.map((c: Category) => c.id));
      }

      if (categoriesData.success) {
        setAllCategories(categoriesData.data);
      }
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updateData: any = {
        bio,
        website,
        photo,
        categoryIds: selectedCategories,
      };

      if (profile?.user.role === 'INVESTOR') {
        updateData.firmName = firmName;
        updateData.minTicket = minTicket ? parseInt(minTicket) : undefined;
        updateData.maxTicket = maxTicket ? parseInt(maxTicket) : undefined;
      } else if (profile?.user.role === 'STARTUP') {
        updateData.name = startupName;
        updateData.description = description;
        updateData.stage = stage;
      }

      const res = await fetch('/api/profile/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Profile updated successfully!');
        router.push(`/profile/${user?.id}`);
      } else {
        toast.error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setSaving(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8 px-4 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <p className="text-red-700">Failed to load profile</p>
        </div>
      </div>
    );
  }

  const isInvestor = profile.user.role === 'INVESTOR';
  const isStartup = profile.user.role === 'STARTUP';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Profile</h1>
          <p className="text-gray-600 mb-8">Update your profile information</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio <span className="text-gray-500">(Short introduction)</span>
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                maxLength={200}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                placeholder="Tell people about yourself in a few words..."
              />
              <p className="text-xs text-gray-500 mt-1">{bio.length}/200 characters</p>
            </div>

            {/* Startup Name */}
            {isStartup && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Startup Name *
                </label>
                <input
                  type="text"
                  value={startupName}
                  onChange={(e) => setStartupName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  placeholder="Your startup name"
                />
              </div>
            )}

            {/* Description (Startup only) */}
            {isStartup && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  placeholder="Detailed description of your startup, vision, team, etc."
                />
              </div>
            )}

            {/* Stage (Startup only) */}
            {isStartup && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stage</label>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                >
                  <option value="">Select stage</option>
                  <option value="idea">Idea</option>
                  <option value="mvp">MVP</option>
                  <option value="seed">Seed</option>
                  <option value="series-a">Series A</option>
                  <option value="series-b">Series B</option>
                  <option value="growth">Growth</option>
                </select>
              </div>
            )}

            {/* Firm Name (Investor only) */}
            {isInvestor && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Firm Name</label>
                <input
                  type="text"
                  value={firmName}
                  onChange={(e) => setFirmName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  placeholder="Your firm or investment company"
                />
              </div>
            )}

            {/* Ticket Size (Investor only) */}
            {isInvestor && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Ticket ($)
                  </label>
                  <input
                    type="number"
                    value={minTicket}
                    onChange={(e) => setMinTicket(e.target.value)}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    placeholder="10000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Ticket ($)
                  </label>
                  <input
                    type="number"
                    value={maxTicket}
                    onChange={(e) => setMaxTicket(e.target.value)}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    placeholder="100000"
                  />
                </div>
              </div>
            )}

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                placeholder="https://example.com"
              />
            </div>

            {/* Photo URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Photo URL
              </label>
              <input
                type="url"
                value={photo}
                onChange={(e) => setPhoto(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                placeholder="https://example.com/photo.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload your photo to Supabase or another hosting service and paste the URL here
              </p>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Categories</label>
              <div className="flex flex-wrap gap-2">
                {allCategories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => toggleCategory(category.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedCategories.includes(category.id)
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Select categories that match your interests or expertise
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                disabled={saving}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
