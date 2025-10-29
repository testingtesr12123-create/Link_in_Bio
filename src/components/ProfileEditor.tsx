import { useState } from 'react';
import { Profile } from '../lib/supabase';
import { User, AtSign, FileText } from 'lucide-react';

interface ProfileEditorProps {
  profile: Profile;
  onUpdate: (updates: Partial<Profile>) => void;
}

export default function ProfileEditor({ profile, onUpdate }: ProfileEditorProps) {
  const [formData, setFormData] = useState({
    username: profile.username,
    display_name: profile.display_name,
    bio: profile.bio,
    profile_image_url: profile.profile_image_url || '',
    background_image_url: profile.background_image_url || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  const hasChanges = JSON.stringify(formData) !== JSON.stringify({
    username: profile.username,
    display_name: profile.display_name,
    bio: profile.bio,
    profile_image_url: profile.profile_image_url || '',
    background_image_url: profile.background_image_url || ''
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Profile Settings</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            <AtSign className="w-4 h-4" />
            Username
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="johndoe"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Your public URL: /{formData.username}
          </p>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            <User className="w-4 h-4" />
            Display Name
          </label>
          <input
            type="text"
            value={formData.display_name}
            onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            <FileText className="w-4 h-4" />
            Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Tell the world about yourself..."
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Profile Image URL
          </label>
          <input
            type="url"
            value={formData.profile_image_url}
            onChange={(e) => setFormData({ ...formData, profile_image_url: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com/profile.jpg"
          />
          {formData.profile_image_url && (
            <div className="mt-2">
              <img
                src={formData.profile_image_url}
                alt="Profile preview"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Background Image URL
          </label>
          <input
            type="url"
            value={formData.background_image_url}
            onChange={(e) => setFormData({ ...formData, background_image_url: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com/background.jpg"
          />
          {formData.background_image_url && (
            <div className="mt-2">
              <img
                src={formData.background_image_url}
                alt="Background preview"
                className="w-full h-32 rounded-lg object-cover border-2 border-gray-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!hasChanges}
          className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
            hasChanges
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
