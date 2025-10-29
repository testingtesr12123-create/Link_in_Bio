import { useState, useEffect } from 'react';
import { Profile, Link, Theme } from '../lib/supabase';
import { profileService } from '../services/profileService';
import { linkService } from '../services/linkService';
import { themeService } from '../services/themeService';
import * as Icons from 'lucide-react';

interface PublicProfileProps {
  username: string;
}

export default function PublicProfile({ username }: PublicProfileProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [theme, setTheme] = useState<Theme | null>(null);
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

      const [linksData, themeData] = await Promise.all([
        linkService.getActiveLinksByProfileId(profileData.id),
        themeService.getThemeById(profileData.theme_id)
      ]);

      setProfile(profileData);
      setLinks(linksData);
      setTheme(themeData);
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

  if (notFound || !profile || !theme) {
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

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: theme.background_color,
        backgroundImage: profile.background_image_url ? `url(${profile.background_image_url})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="min-h-screen backdrop-blur-sm bg-black/10">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col items-center text-center mb-8">
              {profile.profile_image_url && (
                <img
                  src={profile.profile_image_url}
                  alt={profile.display_name}
                  className="w-32 h-32 rounded-full object-cover shadow-2xl mb-6 border-4"
                  style={{ borderColor: theme.button_color }}
                />
              )}

              <h1
                className="text-4xl font-bold mb-3"
                style={{
                  color: theme.text_color,
                  fontFamily: theme.font_family
                }}
              >
                {profile.display_name}
              </h1>

              <p
                className="text-lg mb-2"
                style={{
                  color: theme.text_color,
                  opacity: 0.8,
                  fontFamily: theme.font_family
                }}
              >
                @{profile.username}
              </p>

              {profile.bio && (
                <p
                  className="text-base max-w-md leading-relaxed"
                  style={{
                    color: theme.text_color,
                    opacity: 0.9,
                    fontFamily: theme.font_family
                  }}
                >
                  {profile.bio}
                </p>
              )}
            </div>

            <div className="space-y-4">
              {links.length === 0 ? (
                <div
                  className="text-center py-12"
                  style={{
                    color: theme.text_color,
                    opacity: 0.7
                  }}
                >
                  <p>No links available</p>
                </div>
              ) : (
                links.map((link) => {
                  const Icon = getIcon(link.icon);
                  return (
                    <button
                      key={link.id}
                      onClick={() => handleLinkClick(link)}
                      className={`w-full px-6 py-4 flex items-center justify-center gap-3 transition-all duration-200 hover:scale-105 hover:shadow-2xl active:scale-95 ${theme.button_style}`}
                      style={{
                        backgroundColor: theme.button_color,
                        color: theme.button_text_color,
                        fontFamily: theme.font_family
                      }}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-semibold text-lg">{link.title}</span>
                    </button>
                  );
                })
              )}
            </div>

            <div className="text-center mt-12">
              <p
                className="text-sm"
                style={{
                  color: theme.text_color,
                  opacity: 0.6
                }}
              >
                Create your own link in bio
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
