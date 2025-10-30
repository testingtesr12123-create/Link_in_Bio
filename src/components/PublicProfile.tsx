import { useState, useEffect } from 'react';
import { Profile, Link } from '../lib/supabase';
import { profileService } from '../services/profileService';
import { linkService } from '../services/linkService';
import * as Icons from 'lucide-react';

interface PublicProfileProps {
  username: string;
}

export default function PublicProfile({ username }: PublicProfileProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [username]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profileData = await profileService.getProfileByUsername(username);

      if (!profileData) {
        setNotFound(true);
        return;
      }

      const linksData = await linkService.getActiveLinksByProfileId(profileData.id);

      setProfile(profileData);
      setLinks(linksData);
    } catch (error) {
      console.error('Error loading profile:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkClick = async (link: Link) => {
    try {
      await linkService.trackClick(link.id);
      window.open(link.url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error tracking click:', error);
      window.open(link.url, '_blank', 'noopener,noreferrer');
    }
  };

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName] || Icons.Link;
    return IconComponent;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
          <p className="text-xl text-gray-600">Profile not found</p>
          <p className="text-gray-500 mt-2">The user @{username} does not exist</p>
        </div>
      </div>
    );
  }

  const colors = profile.custom_colors;
  const templateName = profile.template_name || 'simple';

  const renderSimpleLayout = () => (
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-col items-center text-center mb-8">
        {profile.profile_image_url && (
          <img
            src={profile.profile_image_url}
            alt={profile.display_name}
            className="w-24 h-24 rounded-full object-cover shadow-lg mb-4 border-4"
            style={{ borderColor: colors.primary }}
          />
        )}

        <h1 className="text-3xl font-bold mb-2" style={{ color: colors.text }}>
          {profile.display_name}
        </h1>

        <p className="text-sm mb-4" style={{ color: colors.text, opacity: 0.7 }}>
          @{profile.username}
        </p>

        {profile.bio && (
          <p className="text-base max-w-md mb-6" style={{ color: colors.text, opacity: 0.85 }}>
            {profile.bio}
          </p>
        )}

        <div className="flex gap-3 mb-8">
          {links.slice(0, 6).map((link) => {
            const Icon = getIcon(link.icon);
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link)}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-md"
                style={{ backgroundColor: colors.secondary, color: colors.text }}
                title={link.title}
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        {links.map((link) => {
          const Icon = getIcon(link.icon);
          return (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link)}
              className="w-full px-6 py-3 flex items-center justify-center gap-3 rounded-full transition-all hover:scale-105 shadow-md hover:shadow-xl"
              style={{ backgroundColor: colors.secondary, color: colors.text }}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{link.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderClassicLayout = () => (
    <div className="max-w-xl mx-auto">
      <div className="flex flex-col items-center text-center mb-10">
        {profile.profile_image_url && (
          <img
            src={profile.profile_image_url}
            alt={profile.display_name}
            className="w-32 h-32 rounded-full object-cover shadow-2xl mb-6 border-4"
            style={{ borderColor: colors.primary }}
          />
        )}

        <h1 className="text-4xl font-bold mb-3" style={{ color: colors.text }}>
          {profile.display_name}
        </h1>

        {profile.bio && (
          <p className="text-lg max-w-md leading-relaxed" style={{ color: colors.text, opacity: 0.85 }}>
            {profile.bio}
          </p>
        )}
      </div>

      <div className="space-y-4">
        {links.map((link) => {
          const Icon = getIcon(link.icon);
          return (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link)}
              className="w-full px-8 py-4 flex items-center justify-center gap-3 rounded-lg transition-all hover:scale-105 shadow-lg hover:shadow-2xl"
              style={{ backgroundColor: colors.primary, color: colors.secondary }}
            >
              <Icon className="w-6 h-6" />
              <span className="font-semibold text-lg">{link.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderCardLayout = () => (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col items-center text-center mb-8">
        {profile.profile_image_url && (
          <img
            src={profile.profile_image_url}
            alt={profile.display_name}
            className="w-28 h-28 rounded-full object-cover shadow-xl mb-4 border-4"
            style={{ borderColor: colors.accent }}
          />
        )}

        <h1 className="text-3xl font-bold mb-2" style={{ color: colors.text }}>
          {profile.display_name}
        </h1>

        {profile.bio && (
          <p className="text-base max-w-lg" style={{ color: colors.text, opacity: 0.8 }}>
            {profile.bio}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {links.map((link) => {
          const Icon = getIcon(link.icon);
          return (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link)}
              className="p-6 rounded-xl transition-all hover:scale-105 shadow-lg hover:shadow-2xl"
              style={{ backgroundColor: colors.secondary }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: colors.accent }}
                >
                  <Icon className="w-6 h-6" style={{ color: colors.text }} />
                </div>
                <span className="font-semibold text-lg" style={{ color: colors.text }}>
                  {link.title}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderMinimalLayout = () => (
    <div className="max-w-lg mx-auto">
      <div className="mb-12">
        {profile.profile_image_url && (
          <img
            src={profile.profile_image_url}
            alt={profile.display_name}
            className="w-20 h-20 rounded-full object-cover shadow-md mb-6"
          />
        )}

        <h1 className="text-5xl font-bold mb-3" style={{ color: colors.text }}>
          {profile.display_name}
        </h1>

        {profile.bio && (
          <p className="text-lg" style={{ color: colors.text, opacity: 0.7 }}>
            {profile.bio}
          </p>
        )}
      </div>

      <div className="space-y-2">
        {links.map((link) => {
          const Icon = getIcon(link.icon);
          return (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link)}
              className="w-full px-6 py-3 flex items-center gap-3 rounded transition-all hover:translate-x-2"
              style={{ backgroundColor: colors.accent, color: colors.text }}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-lg">{link.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderLayout = () => {
    switch (templateName) {
      case 'classic':
        return renderClassicLayout();
      case 'card':
        return renderCardLayout();
      case 'minimal':
        return renderMinimalLayout();
      default:
        return renderSimpleLayout();
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: colors.background,
        backgroundImage: profile.background_image_url ? `url(${profile.background_image_url})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="min-h-screen backdrop-blur-sm bg-black/5">
        <div className="container mx-auto px-4 py-12">
          {links.length === 0 ? (
            <div className="max-w-2xl mx-auto text-center">
              <div className="flex flex-col items-center mb-8">
                {profile.profile_image_url && (
                  <img
                    src={profile.profile_image_url}
                    alt={profile.display_name}
                    className="w-24 h-24 rounded-full object-cover shadow-lg mb-4"
                  />
                )}
                <h1 className="text-3xl font-bold mb-2" style={{ color: colors.text }}>
                  {profile.display_name}
                </h1>
                {profile.bio && (
                  <p className="text-base" style={{ color: colors.text, opacity: 0.7 }}>
                    {profile.bio}
                  </p>
                )}
              </div>
              <p style={{ color: colors.text, opacity: 0.6 }}>No links available</p>
            </div>
          ) : (
            renderLayout()
          )}

          <div className="text-center mt-12">
            <p className="text-sm" style={{ color: colors.text, opacity: 0.5 }}>
              Create your own link in bio
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
