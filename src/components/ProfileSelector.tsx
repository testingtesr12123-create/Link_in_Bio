import { useState, useEffect } from 'react';
import { Profile } from '../lib/supabase';
import { profileService } from '../services/profileService';
import { User, Plus, ExternalLink } from 'lucide-react';

interface ProfileSelectorProps {
  onProfileSelect: (profileId: string) => void;
}

export default function ProfileSelector({ onProfileSelect }: ProfileSelectorProps) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    display_name: ''
  });

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      const { data } = await profileService.getAllProfiles();
      setProfiles(data || []);
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.display_name) return;

    try {
      const profile = await profileService.createProfile({
        username: formData.username.toLowerCase(),
        display_name: formData.display_name,
        bio: '',
        profile_image_url: null,
        background_image_url: null,
        theme_id: 1,
        custom_css: null
      });

      onProfileSelect(profile.id);
    } catch (error: any) {
      alert(error.message || 'Error creating profile. Username might already exist.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Link in Bio</h1>
          <p className="text-xl text-gray-600">Create your personalized link hub</p>
        </div>

        {!isCreating && profiles.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Profiles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => onProfileSelect(profile.id)}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow text-left border-2 border-transparent hover:border-blue-500"
                >
                  <div className="flex items-center gap-4">
                    {profile.profile_image_url ? (
                      <img
                        src={profile.profile_image_url}
                        alt={profile.display_name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="w-8 h-8 text-blue-600" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{profile.display_name}</h3>
                      <p className="text-sm text-gray-600">@{profile.username}</p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {!isCreating ? (
          <div className="text-center">
            <button
              onClick={() => setIsCreating(true)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl text-lg font-semibold"
            >
              <Plus className="w-5 h-5" />
              Create New Profile
            </button>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Create Your Profile</h2>
            <form onSubmit={handleCreateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="johndoe"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Your public URL will be: /{formData.username || 'username'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={formData.display_name}
                  onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Create Profile
                </button>
                {profiles.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
