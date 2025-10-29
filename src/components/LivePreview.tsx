import { Profile, Link, Theme } from '../lib/supabase';
import { ExternalLink } from 'lucide-react';
import * as Icons from 'lucide-react';

interface LivePreviewProps {
  profile: Profile;
  links: Link[];
  themes: Theme[];
}

export default function LivePreview({ profile, links, themes }: LivePreviewProps) {
  const currentTheme = themes.find(t => t.id === profile.theme_id);
  const activeLinks = links.filter(link => link.is_active);

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName] || Icons.Link;
    return IconComponent;
  };

  if (!currentTheme) {
    return <div>Loading preview...</div>;
  }

  return (
    <div className="sticky top-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Live Preview</h3>
          <a
            href={`/${profile.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
          >
            <ExternalLink className="w-3 h-3" />
            Open
          </a>
        </div>

        <div className="aspect-[9/16] relative overflow-hidden">
          <div
            className="absolute inset-0 overflow-y-auto"
            style={{
              backgroundColor: currentTheme.background_color,
              backgroundImage: profile.background_image_url ? `url(${profile.background_image_url})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="min-h-full flex flex-col items-center justify-start py-8 px-4">
              {profile.profile_image_url && (
                <img
                  src={profile.profile_image_url}
                  alt={profile.display_name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg mb-4"
                  style={{ borderColor: currentTheme.button_color }}
                />
              )}

              <h1
                className="text-xl font-bold mb-2 text-center"
                style={{ color: currentTheme.text_color }}
              >
                {profile.display_name}
              </h1>

              {profile.bio && (
                <p
                  className="text-sm text-center mb-6 max-w-xs"
                  style={{ color: currentTheme.text_color, opacity: 0.9 }}
                >
                  {profile.bio}
                </p>
              )}

              <div className="w-full max-w-sm space-y-3">
                {activeLinks.length === 0 ? (
                  <div
                    className="text-center py-8 text-sm"
                    style={{ color: currentTheme.text_color, opacity: 0.7 }}
                  >
                    No active links
                  </div>
                ) : (
                  activeLinks.map((link) => {
                    const Icon = getIcon(link.icon);
                    return (
                      <div
                        key={link.id}
                        className={`w-full px-4 py-3 flex items-center justify-center gap-2 transition-transform hover:scale-105 shadow-md ${currentTheme.button_style}`}
                        style={{
                          backgroundColor: currentTheme.button_color,
                          color: currentTheme.button_text_color
                        }}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="font-medium text-sm">{link.title}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
